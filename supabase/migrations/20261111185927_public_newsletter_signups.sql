create table public.newsletter_signups (
  email text primary key,
  token_hash bytea not null unique,
  requested_at timestamptz not null default now(),
  expires_at timestamptz not null,
  confirmed_at timestamptz,
  completed_at timestamptz
);

alter table public.newsletter_signups enable row level security;
revoke all on public.newsletter_signups from public, anon, authenticated;
grant select, insert, update, delete on public.newsletter_signups to service_role;

create function public.issue_newsletter_confirmation(p_email text)
returns text
language sql
security invoker
set search_path = ''
as $$
  with new_token as materialized (
    select replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '') as token
  ), issued as (
    insert into public.newsletter_signups as previous (email, token_hash, expires_at)
    select p_email, sha256(convert_to(token, 'UTF8')), now() + interval '24 hours' from new_token
    on conflict (email) do update set token_hash = excluded.token_hash, requested_at = now(),
      expires_at = excluded.expires_at
    where previous.completed_at is null and previous.requested_at <= now() - interval '5 minutes'
    returning email
  )
  select t.token from new_token t cross join issued;
$$;

create function public.confirm_newsletter_signup(p_token text)
returns table (email text, confirmed_at timestamptz, completed_at timestamptz)
language sql
security invoker
set search_path = ''
as $$
  update public.newsletter_signups s
  set confirmed_at = coalesce(s.confirmed_at, now())
  where s.token_hash = sha256(convert_to(p_token, 'UTF8')) and s.expires_at > now()
  returning s.email, s.confirmed_at, s.completed_at;
$$;

revoke all on function public.issue_newsletter_confirmation(text) from public, anon, authenticated;
revoke all on function public.confirm_newsletter_signup(text) from public, anon, authenticated;
grant execute on function public.issue_newsletter_confirmation(text) to service_role;
grant execute on function public.confirm_newsletter_signup(text) to service_role;
