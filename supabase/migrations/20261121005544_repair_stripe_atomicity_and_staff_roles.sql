-- Additive repair: no existing rows, prices or invoice constraints are removed.
-- Apply before deploying the matching stripe-webhook function.
begin;

-- These fields are used by Checkout but were missing from the linked schema.
alter table public.clients add column if not exists stripe_customer_id text;
create unique index if not exists clients_stripe_customer_id_uidx on public.clients(stripe_customer_id) where stripe_customer_id is not null;
alter table public.milestones add column if not exists stripe_checkout_session_id text;
create unique index if not exists payments_stripe_payment_intent_uidx
  on public.payments(provider_payment_id)
  where provider = 'stripe' and provider_payment_id is not null and status <> 'failed';
create unique index if not exists refunds_provider_refund_id_uidx
  on public.refunds(provider_refund_id) where provider_refund_id is not null;

-- Staff may edit their own profile but must not grant themselves roles/access.
create or replace function app_private.protect_staff_authorisation()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  if current_user not in ('postgres', 'service_role') and not app_private.is_admin()
    and (new.id is distinct from old.id or new.role is distinct from old.role
      or new.active is distinct from old.active) then
    raise exception 'Only an administrator may change staff authorisation' using errcode = '42501';
  end if;
  return new;
end;
$$;
create trigger protect_staff_authorisation before update on public.staff_profiles
  for each row execute function app_private.protect_staff_authorisation();

-- A website deposit has no invoice. Keep invoice_id NOT NULL on payments;
-- use an explicitly scoped receipt ledger instead of inserting invalid rows.
create table public.dfp_website_payment_receipts (
  payment_intent_id text primary key,
  order_id uuid not null unique references public.dfp_checkout_orders(id) on delete restrict,
  checkout_session_id text not null unique,
  event_id text not null,
  amount_minor bigint not null check (amount_minor > 0),
  currency text not null,
  refunded_minor bigint not null default 0 check (refunded_minor >= 0 and refunded_minor <= amount_minor),
  paid_at timestamptz not null,
  created_at timestamptz not null default now()
);
create table public.dfp_website_payment_refunds (
  refund_id text primary key,
  payment_intent_id text not null references public.dfp_website_payment_receipts(payment_intent_id) on delete restrict,
  event_id text not null,
  amount_minor bigint not null check (amount_minor > 0),
  refunded_at timestamptz not null
);
create index dfp_website_payment_refunds_intent_idx on public.dfp_website_payment_refunds(payment_intent_id);
alter table public.dfp_website_payment_receipts enable row level security;
alter table public.dfp_website_payment_refunds enable row level security;
revoke all on public.dfp_website_payment_receipts, public.dfp_website_payment_refunds from public, anon, authenticated;
grant all on public.dfp_website_payment_receipts, public.dfp_website_payment_refunds to service_role;

create or replace function public.record_stripe_website_payment(
  p_project_reference text, p_amount_minor bigint, p_currency text,
  p_payment_intent_id text, p_event_id text, p_checkout_session_id text, p_paid_at timestamptz
) returns jsonb language plpgsql security invoker set search_path = public, pg_temp as $$
declare v_order public.dfp_checkout_orders%rowtype; v_receipt public.dfp_website_payment_receipts%rowtype;
begin
  if current_user not in ('service_role', 'postgres') then raise exception 'Service role required'; end if;
  select * into strict v_order from public.dfp_checkout_orders where project_reference = p_project_reference for update;
  if p_amount_minor is null or p_amount_minor <> v_order.starting_payment_minor or lower(p_currency) is distinct from lower(v_order.currency)
    or coalesce(p_payment_intent_id, '') = '' or coalesce(p_checkout_session_id, '') = '' or coalesce(p_event_id, '') = '' then
    raise exception 'Website payment identity or amount mismatch';
  end if;
  if v_order.stripe_checkout_session_id is not null and v_order.stripe_checkout_session_id <> p_checkout_session_id then
    raise exception 'Website checkout session mismatch';
  end if;
  select * into v_receipt from public.dfp_website_payment_receipts where order_id = v_order.id;
  if found then
    if v_receipt.payment_intent_id <> p_payment_intent_id then raise exception 'Order already has a different payment'; end if;
    return jsonb_build_object('duplicate', true);
  end if;
  insert into public.dfp_website_payment_receipts
    (payment_intent_id, order_id, checkout_session_id, event_id, amount_minor, currency, paid_at)
  values (p_payment_intent_id, v_order.id, p_checkout_session_id, p_event_id, p_amount_minor, lower(p_currency), coalesce(p_paid_at, now()));
  update public.dfp_checkout_orders set payment_status = 'paid', project_status = 'confirmed',
    stripe_payment_intent_id = p_payment_intent_id, stripe_checkout_session_id = p_checkout_session_id, updated_at = now()
    where id = v_order.id;
  return jsonb_build_object('duplicate', false);
end;
$$;

create or replace function public.record_stripe_website_refund(
  p_payment_intent_id text, p_refund_id text, p_event_id text, p_amount_minor bigint, p_currency text, p_refunded_at timestamptz
) returns jsonb language plpgsql security invoker set search_path = public, pg_temp as $$
declare v_receipt public.dfp_website_payment_receipts%rowtype; v_refunded bigint;
begin
  if current_user not in ('service_role', 'postgres') then raise exception 'Service role required'; end if;
  select * into strict v_receipt from public.dfp_website_payment_receipts where payment_intent_id = p_payment_intent_id for update;
  if exists (select 1 from public.dfp_website_payment_refunds where refund_id = p_refund_id) then
    return jsonb_build_object('duplicate', true);
  end if;
  if p_amount_minor is null or p_amount_minor <= 0 or lower(p_currency) is distinct from v_receipt.currency
    or v_receipt.refunded_minor + p_amount_minor > v_receipt.amount_minor then raise exception 'Invalid website refund'; end if;
  insert into public.dfp_website_payment_refunds (refund_id, payment_intent_id, event_id, amount_minor, refunded_at)
    values (p_refund_id, p_payment_intent_id, p_event_id, p_amount_minor, coalesce(p_refunded_at, now()));
  v_refunded := v_receipt.refunded_minor + p_amount_minor;
  update public.dfp_website_payment_receipts set refunded_minor = v_refunded where payment_intent_id = p_payment_intent_id;
  update public.dfp_checkout_orders set payment_status = case when v_refunded = v_receipt.amount_minor then 'refunded' else 'partially_refunded' end,
    updated_at = now() where id = v_receipt.order_id;
  return jsonb_build_object('duplicate', false);
end;
$$;

-- Milestone refunds use Stripe's cumulative refunded amount, so snapshots are
-- monotonic even when delivery order differs or an event is repeated.
alter table public.milestones add column stripe_refunded_minor bigint not null default 0 check (stripe_refunded_minor >= 0);
create or replace function public.record_stripe_milestone_payment(
  p_milestone_id uuid, p_amount_minor bigint, p_currency text, p_payment_intent_id text, p_checkout_session_id text, p_paid_at timestamptz
) returns void language plpgsql security invoker set search_path = public, pg_temp as $$
declare v_milestone public.milestones%rowtype;
begin
  if current_user not in ('service_role','postgres') then raise exception 'Service role required'; end if;
  select * into strict v_milestone from public.milestones where id = p_milestone_id for update;
  if p_amount_minor is null or p_amount_minor <= 0 or p_amount_minor <> round(v_milestone.amount * 100)
    or lower(p_currency) is distinct from 'gbp' or coalesce(p_payment_intent_id,'') = '' then raise exception 'Milestone payment mismatch'; end if;
  if v_milestone.stripe_payment_id is not null then
    if v_milestone.stripe_payment_id <> p_payment_intent_id then raise exception 'Milestone already has another payment'; end if;
    return;
  end if;
  if v_milestone.stripe_checkout_session_id is not null and v_milestone.stripe_checkout_session_id <> p_checkout_session_id then
    raise exception 'Milestone checkout mismatch';
  end if;
  update public.milestones set payment_status='paid', paid_at=coalesce(p_paid_at,now()),
    stripe_payment_id=p_payment_intent_id, stripe_checkout_session_id=p_checkout_session_id where id=p_milestone_id;
end;
$$;
create or replace function public.record_stripe_milestone_refund(
  p_milestone_id uuid, p_payment_intent_id text, p_refunded_minor bigint, p_currency text
) returns void language plpgsql security invoker set search_path = public, pg_temp as $$
declare v_milestone public.milestones%rowtype;
begin
  if current_user not in ('service_role','postgres') then raise exception 'Service role required'; end if;
  select * into strict v_milestone from public.milestones where id=p_milestone_id for update;
  if v_milestone.stripe_payment_id is distinct from p_payment_intent_id or p_refunded_minor is null or p_refunded_minor <= 0
    or p_refunded_minor > round(v_milestone.amount * 100) or lower(p_currency) is distinct from 'gbp' then raise exception 'Milestone refund mismatch'; end if;
  update public.milestones set stripe_refunded_minor=greatest(stripe_refunded_minor,p_refunded_minor),
    payment_status=case when greatest(stripe_refunded_minor,p_refunded_minor)=round(amount*100) then 'refunded' else 'partially_refunded' end
    where id=p_milestone_id;
end;
$$;
revoke all on function public.record_stripe_milestone_payment(uuid,bigint,text,text,text,timestamptz) from public,anon,authenticated;
revoke all on function public.record_stripe_milestone_refund(uuid,text,bigint,text) from public,anon,authenticated;
grant execute on function public.record_stripe_milestone_payment(uuid,bigint,text,text,text,timestamptz) to service_role;
grant execute on function public.record_stripe_milestone_refund(uuid,text,bigint,text) to service_role;

-- Claims recover after a crashed invocation, with a token to prevent a stale
-- invocation from completing or failing another invocation's lease.
alter table public.stripe_webhook_events add column processing_token uuid, add column lease_expires_at timestamptz;
create or replace function public.claim_stripe_webhook(
  p_event_id text, p_event_type text, p_object_id text, p_connected_account_id text, p_token uuid
) returns text language plpgsql security invoker set search_path = public, pg_temp as $$
declare v_event public.stripe_webhook_events%rowtype;
begin
  if current_user not in ('service_role', 'postgres') then raise exception 'Service role required'; end if;
  insert into public.stripe_webhook_events(event_id, event_type, status, object_id, connected_account_id)
    values(p_event_id, p_event_type, 'processing', p_object_id, p_connected_account_id) on conflict(event_id) do nothing;
  select * into strict v_event from public.stripe_webhook_events where event_id = p_event_id for update;
  if v_event.status = 'processed' then return 'processed'; end if;
  if v_event.status = 'processing' and v_event.lease_expires_at > now() then return 'busy'; end if;
  update public.stripe_webhook_events set status = 'processing', processing_token = p_token,
    lease_expires_at = now() + interval '5 minutes', processed_at = null, error_message = null where event_id = p_event_id;
  return 'claimed';
end;
$$;

create or replace function public.record_stripe_invoice_payment(
  p_invoice_id uuid,
  p_amount_minor bigint,
  p_currency text,
  p_payment_intent_id text,
  p_event_id text,
  p_checkout_session_id text,
  p_paid_at timestamp with time zone
)
returns jsonb
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_invoice public.invoices%rowtype;
  v_amount numeric(18, 2);
  v_total numeric(18, 2);
  v_previous_paid numeric(18, 2);
  v_new_paid numeric(18, 2);
  v_outstanding numeric(18, 2);
  v_payment_id uuid;
begin
  if current_user not in ('service_role', 'postgres') then raise exception 'Service role required'; end if;
  if p_amount_minor is null or p_amount_minor <= 0 then
    raise exception 'Stripe payment amount must be positive';
  end if;
  if coalesce(p_payment_intent_id, '') = '' or coalesce(p_event_id, '') = '' then
    raise exception 'Stripe payment identifiers are required';
  end if;

  if exists (
    select 1 from public.payments
    where idempotency_key = 'stripe-event:' || p_event_id
  ) then
    return jsonb_build_object('duplicate', true);
  end if;

  select *
  into v_invoice
  from public.invoices
  where id = p_invoice_id
  for update;

  if not found then
    raise exception 'Invoice % was not found', p_invoice_id;
  end if;
  if lower(coalesce(v_invoice.currency, 'GBP')) <> lower(coalesce(p_currency, '')) then
    raise exception 'Stripe payment currency does not match invoice currency';
  end if;

  -- Check the logical payment after locking, including a second event ID for
  -- the same PaymentIntent and retries after an intervening refund.
  if exists (select 1 from public.payments
    where provider = 'stripe' and provider_payment_id = p_payment_intent_id and status <> 'failed') then
    if not exists (select 1 from public.payments where provider = 'stripe'
      and provider_payment_id = p_payment_intent_id and invoice_id = p_invoice_id
      and amount = p_amount_minor::numeric / 100 and lower(currency) = lower(p_currency)
      and status <> 'failed') then raise exception 'Payment identity mismatch'; end if;
    return jsonb_build_object('duplicate', true);
  end if;
  v_amount := round((p_amount_minor::numeric / 100), 2);
  v_total := round(coalesce(v_invoice.total, v_invoice.amount), 2);
  v_previous_paid := round(coalesce(v_invoice.amount_paid, 0), 2);
  v_outstanding := round(
    coalesce(v_invoice.amount_outstanding, greatest(0, v_total - v_previous_paid)),
    2
  );

  if v_amount <> v_outstanding then
    raise exception 'Stripe payment amount does not match outstanding invoice balance';
  end if;

  insert into public.payments (
    invoice_id,
    client_id,
    amount,
    currency,
    payment_date,
    method,
    status,
    provider,
    provider_payment_id,
    provider_event_id,
    idempotency_key,
    reconciliation_state,
    confirmed_at,
    confirmation_reason
  )
  values (
    v_invoice.id,
    v_invoice.client_id,
    v_amount,
    upper(p_currency),
    coalesce(p_paid_at, now()),
    'stripe',
    'succeeded',
    'stripe',
    p_payment_intent_id,
    p_event_id,
    'stripe-event:' || p_event_id,
    'matched',
    now(),
    'Verified Stripe webhook'
  )
  returning id into v_payment_id;

  v_new_paid := least(v_total, v_previous_paid + v_amount);
  update public.invoices
  set
    amount_paid = v_new_paid,
    amount_outstanding = greatest(0, v_total - v_new_paid),
    status = case when v_new_paid >= v_total then 'paid' else 'partially_paid' end,
    paid_at = case when v_new_paid >= v_total then coalesce(p_paid_at, now()) else paid_at end,
    stripe_payment_intent_id = p_payment_intent_id,
    stripe_checkout_session_id = p_checkout_session_id,
    updated_at = now()
  where id = v_invoice.id;

  return jsonb_build_object(
    'duplicate', false,
    'payment_id', v_payment_id,
    'invoice_id', v_invoice.id,
    'amount', v_amount
  );
end;
$$;


create or replace function public.record_stripe_refund(
  p_payment_intent_id text,
  p_event_id text,
  p_refund_id text,
  p_amount_minor bigint,
  p_currency text,
  p_reason text,
  p_refunded_at timestamp with time zone
)
returns jsonb
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_payment public.payments%rowtype;
  v_invoice public.invoices%rowtype;
  v_amount numeric(18, 2);
  v_refund_id uuid;
  v_total_refunded numeric(18, 2);
  v_invoice_total numeric(18, 2);
  v_new_paid numeric(18, 2);
begin
  if current_user not in ('service_role', 'postgres') then raise exception 'Service role required'; end if;
  if p_amount_minor is null or p_amount_minor <= 0 then
    raise exception 'Stripe refund amount must be positive';
  end if;
  if coalesce(p_payment_intent_id, '') = '' or coalesce(p_refund_id, '') = '' then
    raise exception 'Stripe refund identifiers are required';
  end if;

  if exists (
    select 1 from public.refunds where provider_refund_id = p_refund_id
  ) then
    return jsonb_build_object('duplicate', true);
  end if;

  select *
  into v_payment
  from public.payments
  where provider = 'stripe'
    and provider_payment_id = p_payment_intent_id
    and status <> 'failed'
  for update;

  if not found then
    raise exception 'Stripe payment % was not found', p_payment_intent_id;
  end if;

  select *
  into v_invoice
  from public.invoices
  where id = v_payment.invoice_id
  for update;

  if not found then
    raise exception 'Invoice for Stripe payment was not found';
  end if;
  if lower(v_payment.currency) <> lower(coalesce(p_currency, '')) then
    raise exception 'Stripe refund currency does not match payment currency';
  end if;

  -- Repeat deduplication under the payment row lock for concurrent deliveries.
  if exists (select 1 from public.refunds where provider_refund_id = p_refund_id) then
    return jsonb_build_object('duplicate', true);
  end if;
  select coalesce(sum(amount), 0) into v_total_refunded from public.refunds
    where payment_id = v_payment.id and status = 'completed';
  if v_total_refunded + p_amount_minor::numeric / 100 > v_payment.amount then
    raise exception 'Refund exceeds original payment';
  end if;
  v_amount := round((p_amount_minor::numeric / 100), 2);
  insert into public.refunds (
    payment_id,
    invoice_id,
    amount,
    currency,
    reason,
    status,
    provider_refund_id,
    processed_at,
    notes
  )
  values (
    v_payment.id,
    v_payment.invoice_id,
    v_amount,
    upper(p_currency),
    p_reason,
    'completed',
    p_refund_id,
    coalesce(p_refunded_at, now()),
    'Verified Stripe webhook event ' || p_event_id
  )
  returning id into v_refund_id;

  select coalesce(sum(amount), 0)
  into v_total_refunded
  from public.refunds
  where payment_id = v_payment.id and status = 'completed';

  update public.payments
  set
    status = case
      when v_total_refunded >= amount then 'refunded'
      else 'partially_refunded'
    end,
    updated_at = now()
  where id = v_payment.id;

  v_invoice_total := round(coalesce(v_invoice.total, v_invoice.amount), 2);
  v_new_paid := greatest(0, round(coalesce(v_invoice.amount_paid, 0) - v_amount, 2));
  update public.invoices
  set
    amount_paid = v_new_paid,
    amount_outstanding = greatest(0, v_invoice_total - v_new_paid),
    status = case when v_new_paid > 0 then 'partially_paid' else 'issued' end,
    paid_at = case when v_new_paid < v_invoice_total then null else paid_at end,
    updated_at = now()
  where id = v_invoice.id;

  return jsonb_build_object(
    'duplicate', false,
    'refund_id', v_refund_id,
    'invoice_id', v_invoice.id,
    'amount', v_amount
  );
end;
$$;


-- Only verified backend calls may mutate payment state via these RPCs.
revoke all on function public.record_stripe_invoice_payment(uuid,bigint,text,text,text,text,timestamptz) from public, anon, authenticated;
revoke all on function public.record_stripe_refund(text,text,text,bigint,text,text,timestamptz) from public, anon, authenticated;
revoke all on function public.record_stripe_website_payment(text,bigint,text,text,text,text,timestamptz) from public, anon, authenticated;
revoke all on function public.record_stripe_website_refund(text,text,text,bigint,text,timestamptz) from public, anon, authenticated;
revoke all on function public.claim_stripe_webhook(text,text,text,text,uuid) from public, anon, authenticated;
grant execute on function public.record_stripe_invoice_payment(uuid,bigint,text,text,text,text,timestamptz) to service_role;
grant execute on function public.record_stripe_refund(text,text,text,bigint,text,text,timestamptz) to service_role;
grant execute on function public.record_stripe_website_payment(text,bigint,text,text,text,text,timestamptz) to service_role;
grant execute on function public.record_stripe_website_refund(text,text,text,bigint,text,timestamptz) to service_role;
grant execute on function public.claim_stripe_webhook(text,text,text,text,uuid) to service_role;
commit;
