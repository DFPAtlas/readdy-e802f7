# DFP AI Security Platform Foundation

This branch turns the AI Security Testing architecture into a defensive, authorised control-plane foundation.

## What is implemented

- Admin-only security engagement records
- Explicit included/excluded scope assets
- Written-authorisation state
- Testing windows and request-rate ceilings
- Approval gates for scope, active testing, elevated testing, critical escalation and retest
- Security job queue records
- Findings and evidence records
- Audit logging
- Database-enforced job queue validation
- Emergency stop that prevents new work and blocks/cancels outstanding work
- Security Command dashboard under `/admin/command-centre/security`

## Safety contract

Workers, n8n workflows, HAL, TRON and any future cloud executor must **not** insert directly into `security_jobs`.

New work must be created through:

`public.queue_security_job(...)`

That RPC checks:

1. authenticated active administrator
2. engagement status
3. recorded written authorisation
4. emergency-stop state
5. approved testing window
6. allowed test category
7. included scope asset
8. explicit exclusions
9. risk-class approval gate

Executors must treat `security_jobs.status = 'blocked'` or an engagement emergency stop as a hard stop signal.

## Initial safe categories

The migration defaults new engagements to low-risk external posture categories only:

- DNS
- TLS
- email security posture
- public asset discovery
- technology fingerprinting
- known-vulnerability correlation

More intrusive categories are not enabled by default.

## Deployment order

1. Review the migration.
2. Apply `20260927223000_ai_security_platform_foundation.sql` to the intended Supabase project.
3. Confirm an authorised admin can read Security Command and anon users cannot read any security tables.
4. Create a test engagement with non-production/example assets.
5. Record written authorisation and a scope approval.
6. Verify `queue_security_job` accepts an included low-risk target.
7. Verify it rejects excluded targets, disallowed categories, expired windows and stopped engagements.
8. Verify emergency stop cancels queued/assigned jobs and blocks running jobs.
9. Only after those checks, connect a worker/orchestrator.

## Next backend phase

The next implementation should be a **passive Recon worker only**. It can consume approved queued jobs for DNS/TLS/public asset inventory and return structured evidence. It should not perform exploitation, credential attacks, persistence, destructive actions or out-of-scope discovery.

The worker contract should use a service identity, re-read engagement stop state before execution, enforce the stored rate ceiling, write evidence/results, and fail closed when scope cannot be confirmed.

## Important

The public marketing route remains descriptive. Live assessment state belongs in the authenticated Security Command interface. Do not replace illustrative public metrics with production/customer data.
