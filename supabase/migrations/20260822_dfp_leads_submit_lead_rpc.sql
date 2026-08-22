-- DFP FIX — public lead submission "permission denied for table leads"
-- Root cause: the `leads` table grants anon INSERT but not SELECT. The public
-- forms perform an INSERT ... RETURNING id (via PostgREST `insert().select('id')`),
-- which requires SELECT privilege the anon role does not hold. Result: 42501.
--
-- Fix: a security-definer RPC that inserts a lead from a validated jsonb payload
-- and returns the new row id. It runs as the function owner (bypassing GRANT + RLS),
-- only writes a whitelisted set of columns (no admin-only fields like assigned_to,
-- converted_to_client, status escalation), and re-validates name/email/message.

create or replace function public.submit_lead(p_payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_name text := nullif(trim(p_payload->>'name'), '');
  v_email text := nullif(trim(p_payload->>'email'), '');
begin
  if v_name is null or char_length(v_name) < 2 or char_length(v_name) > 120 then
    raise exception 'invalid_name';
  end if;

  if v_email is null
     or char_length(v_email) < 5
     or char_length(v_email) > 254
     or v_email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' then
    raise exception 'invalid_email';
  end if;

  if coalesce(char_length(p_payload->>'message'), 0) > 5000 then
    raise exception 'message_too_long';
  end if;

  insert into public.leads (
    name, email, phone, company_name, contact_role, service_interest, message,
    source, status, stage, priority,
    consent_contact, consent_marketing, do_not_contact,
    enquiry_type, enquiry_data, idempotency_key
  ) values (
    v_name,
    v_email,
    nullif(trim(p_payload->>'phone'), ''),
    nullif(trim(p_payload->>'company_name'), ''),
    nullif(trim(p_payload->>'contact_role'), ''),
    nullif(trim(p_payload->>'service_interest'), ''),
    nullif(p_payload->>'message', ''),
    coalesce(nullif(trim(p_payload->>'source'), ''), 'website'),
    coalesce(nullif(trim(p_payload->>'status'), ''), 'new'),
    coalesce(nullif(trim(p_payload->>'stage'), ''), 'new'),
    coalesce(nullif(trim(p_payload->>'priority'), ''), 'medium'),
    nullif(p_payload->>'consent_contact', '')::boolean,
    nullif(p_payload->>'consent_marketing', '')::boolean,
    nullif(p_payload->>'do_not_contact', '')::boolean,
    nullif(trim(p_payload->>'enquiry_type'), ''),
    case when jsonb_typeof(p_payload->'enquiry_data') = 'object'
         then p_payload->'enquiry_data'
         else null
    end,
    nullif(trim(p_payload->>'idempotency_key'), '')
  )
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.submit_lead(jsonb) to anon, authenticated;