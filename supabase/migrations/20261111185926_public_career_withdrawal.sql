create table public.career_withdrawal_tokens (
  application_id uuid primary key references public.career_applications(id) on delete cascade,
  token_hash bytea not null unique,
  expires_at timestamptz not null
);

alter table public.career_withdrawal_tokens enable row level security;
revoke all on public.career_withdrawal_tokens from public, anon, authenticated;
grant select, insert, update, delete on public.career_withdrawal_tokens to service_role;

create function public.issue_career_withdrawal_links(p_email text)
returns table (token text, vacancy_title text, submitted_at timestamptz)
language sql
security invoker
set search_path = ''
as $$
  with eligible as materialized (
    select a.id, a.submitted_at, v.title,
      replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '') as token
    from public.career_applications a
    left join public.careers_vacancies v on v.id = a.vacancy_id
    where lower(trim(a.candidate_email)) = p_email
      and a.withdrawn_at is null and a.archived_at is null
      and lower(a.application_status) not in ('withdrawn', 'archived', 'hired', 'not progressing')
    order by a.submitted_at desc
    limit 20
  ), issued as (
    insert into public.career_withdrawal_tokens as old_token (application_id, token_hash, expires_at)
    select id, sha256(convert_to(token, 'UTF8')), now() + interval '30 minutes'
    from eligible
    on conflict (application_id) do update
    set token_hash = excluded.token_hash, expires_at = excluded.expires_at
    where old_token.expires_at <= now() + interval '25 minutes'
    returning application_id
  )
  select e.token, e.title, e.submitted_at
  from eligible e join issued i on i.application_id = e.id;
$$;

create function public.redeem_career_withdrawal_link(p_token text)
returns boolean
language sql
security invoker
set search_path = ''
as $$
  with redeemed as (
    delete from public.career_withdrawal_tokens
    where token_hash = sha256(convert_to(p_token, 'UTF8')) and expires_at > now()
    returning application_id
  ), withdrawn as (
    update public.career_applications a
    set application_status = 'Withdrawn', withdrawn_at = now(), updated_at = now()
    from redeemed r where a.id = r.application_id
      and a.withdrawn_at is null and a.archived_at is null
      and lower(a.application_status) not in ('withdrawn', 'archived', 'hired', 'not progressing')
    returning a.id
  )
  select exists (select 1 from withdrawn);
$$;

revoke all on function public.issue_career_withdrawal_links(text) from public, anon, authenticated;
revoke all on function public.redeem_career_withdrawal_link(text) from public, anon, authenticated;
grant execute on function public.issue_career_withdrawal_links(text) to service_role;
grant execute on function public.redeem_career_withdrawal_link(text) to service_role;
