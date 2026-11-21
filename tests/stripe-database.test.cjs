const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { PGlite } = require('@electric-sql/pglite');
let db;
before(async () => {
  db = new PGlite();
  await db.exec(`
    create role anon; create role authenticated; create role service_role;
    create schema app_private;
    create function app_private.is_admin() returns boolean language sql as 'select false';
    create table clients(id uuid primary key);
    create table milestones(id uuid primary key,amount numeric,payment_status text,paid_at timestamptz,stripe_payment_id text,stripe_checkout_session_id text);
    create table staff_profiles(id uuid primary key, role text, active boolean, full_name text);
    create table dfp_checkout_orders(id uuid primary key default gen_random_uuid(), project_reference text unique,
      starting_payment_minor bigint, currency text, payment_status text default 'pending', project_status text default 'new',
      stripe_payment_intent_id text, stripe_checkout_session_id text, updated_at timestamptz);
    create table stripe_webhook_events(event_id text primary key,event_type text,status text,object_id text,
      connected_account_id text,processed_at timestamptz,error_message text);
    create table invoices(id uuid primary key, client_id uuid, amount numeric, total numeric, amount_paid numeric default 0,
      amount_outstanding numeric, currency text default 'GBP', status text default 'issued', paid_at timestamptz,
      stripe_payment_intent_id text, stripe_checkout_session_id text, updated_at timestamptz);
    create table payments(id uuid primary key default gen_random_uuid(),invoice_id uuid not null references invoices(id),
      client_id uuid, amount numeric, currency text,payment_date timestamptz,method text,status text,provider text,
      provider_payment_id text, provider_event_id text, idempotency_key text unique,reconciliation_state text,
      confirmed_at timestamptz,confirmation_reason text, updated_at timestamptz);
    create unique index payments_stripe_intent on payments(provider_payment_id) where provider='stripe' and status<>'failed';
    create table refunds(id uuid primary key default gen_random_uuid(),payment_id uuid references payments(id),invoice_id uuid not null references invoices(id),
      amount numeric,currency text,reason text,status text,provider_refund_id text unique,processed_at timestamptz,notes text);
  `);
  await db.exec(readFileSync(require('node:path').join(__dirname, '../supabase/migrations/20261121005544_repair_stripe_atomicity_and_staff_roles.sql'), 'utf8'));
});
after(async () => { await db?.close(); });

test('website receipt and paid state commit together, with logical-payment deduplication and refunds', async () => {
  await db.exec(`insert into dfp_checkout_orders(project_reference,starting_payment_minor,currency,stripe_checkout_session_id)
    values ('DFP-2026-TESTAA',74750,'gbp','cs_test_one');`);
  const pay = (event = 'evt_1', amount = 74750) => db.query(`select record_stripe_website_payment('DFP-2026-TESTAA',$1,'gbp','pi_one',$2,'cs_test_one',now()) as result`, [amount, event]);
  await assert.rejects(pay('evt_bad', 1), /amount mismatch/);
  assert.equal((await db.query('select count(*)::int as n from dfp_website_payment_receipts')).rows[0].n, 0);
  assert.equal((await db.query('select payment_status from dfp_checkout_orders')).rows[0].payment_status, 'pending');
  assert.equal((await pay()).rows[0].result.duplicate, false);
  assert.equal((await pay('evt_other')).rows[0].result.duplicate, true);
  const refund = () => db.query(`select record_stripe_website_refund('pi_one','re_one','evt_refund',10000,'gbp',now()) as result`);
  await refund(); await refund();
  assert.equal((await db.query('select refunded_minor::int as n from dfp_website_payment_receipts')).rows[0].n, 10000);
  await pay('evt_late_success');
  assert.equal((await db.query('select payment_status from dfp_checkout_orders')).rows[0].payment_status, 'partially_refunded');
  await assert.rejects(db.query(`select record_stripe_website_refund('pi_one','re_excess','evt_refund',74750,'gbp',now())`), /Invalid website refund/);
});

test('an insert failure rolls back the website paid-state transition', async () => {
  await db.exec(`insert into dfp_checkout_orders(project_reference,starting_payment_minor,currency) values('DFP-2026-TESTBB',74750,'gbp');`);
  await assert.rejects(db.query(`select record_stripe_website_payment('DFP-2026-TESTBB',74750,'gbp','pi_one','evt_conflict','cs_test_conflict',now())`));
  assert.equal((await db.query(`select payment_status from dfp_checkout_orders where project_reference='DFP-2026-TESTBB'`)).rows[0].payment_status, 'pending');
});

test('invoice completed + async-succeeded events record one payment, including replay after refund', async () => {
  await db.exec(`insert into invoices(id,amount,total,amount_outstanding) values('00000000-0000-4000-8000-000000000001',100,100,100)`);
  const pay = event => db.query(`select record_stripe_invoice_payment('00000000-0000-4000-8000-000000000001',10000,'gbp','pi_invoice',$1,'cs_invoice',now()) as result`, [event]);
  await pay('evt_invoice_completed'); await pay('evt_invoice_async');
  assert.equal((await db.query('select count(*)::int as n from payments')).rows[0].n, 1);
  const refund = () => db.query(`select record_stripe_refund('pi_invoice','evt_invoice_refund','re_invoice',2500,'gbp','requested_by_customer',now())`);
  await refund(); await refund(); await pay('evt_replayed_success');
  assert.equal(Number((await db.query('select amount_outstanding from invoices')).rows[0].amount_outstanding), 25);
});

test('webhook claims exclude concurrent work and recover an expired lease', async () => {
  const claim = token => db.query(`select claim_stripe_webhook('evt_claim','test',null,null,$1) as result`, [token]);
  const token = '00000000-0000-4000-8000-000000000010';
  assert.equal((await claim(token)).rows[0].result, 'claimed');
  assert.equal((await claim(token)).rows[0].result, 'busy');
  await db.exec(`update stripe_webhook_events set lease_expires_at=now()-interval '1 second' where event_id='evt_claim'`);
  assert.equal((await claim('00000000-0000-4000-8000-000000000011')).rows[0].result, 'claimed');
  await db.exec(`update stripe_webhook_events set status='processed' where event_id='evt_claim'`);
  assert.equal((await claim(token)).rows[0].result, 'processed');
});

test('public roles cannot execute payment RPCs or read website receipts', async () => {
  await db.exec('set role authenticated');
  try {
    await assert.rejects(db.query(`select claim_stripe_webhook('evt_forged','test',null,null,gen_random_uuid())`), /permission denied/);
    await assert.rejects(db.query('select * from dfp_website_payment_receipts'), /permission denied/);
  } finally { await db.exec('reset role'); }
});

test('staff may update a name but cannot promote or reactivate their own account', async () => {
  await db.exec(`grant usage on schema app_private to authenticated; grant execute on function app_private.is_admin() to authenticated;
    grant select,update on staff_profiles to authenticated;
    insert into staff_profiles values('00000000-0000-4000-8000-000000000050','staff',true,'Before'); set role authenticated;`);
  try {
    await db.exec(`update staff_profiles set full_name='After'`);
    await assert.rejects(db.exec(`update staff_profiles set role='admin'`), /Only an administrator/);
    await assert.rejects(db.exec(`update staff_profiles set active=false`), /Only an administrator/);
  } finally { await db.exec('reset role'); }
});

test('milestone refund snapshots cannot regress or be undone by a late success event', async () => {
  await db.exec(`insert into milestones(id,amount,payment_status) values('00000000-0000-4000-8000-000000000070',100,'unpaid')`);
  const pay = () => db.query(`select record_stripe_milestone_payment('00000000-0000-4000-8000-000000000070',10000,'gbp','pi_milestone','cs_milestone',now())`);
  await pay();
  const refund = amount => db.query(`select record_stripe_milestone_refund('00000000-0000-4000-8000-000000000070','pi_milestone',$1,'gbp')`,[amount]);
  await refund(2500); await refund(1000); await pay();
  const row=(await db.query(`select payment_status,stripe_refunded_minor::int as refunded from milestones`)).rows[0];
  assert.equal(row.payment_status,'partially_refunded');assert.equal(row.refunded,2500);
});
