# AI Security Control Plane — Foundation

This branch turns the public `/services/ai-security-testing` architecture into a reviewable control-plane foundation without enabling autonomous intrusive testing.

## Implemented

- Security engagements linked to existing DFP clients
- Explicit permitted/prohibited scope assets
- Written-authorisation state and testing windows
- Five approval gates matching the public architecture
- Emergency-stop state
- Agent jobs with passive / active / elevated risk classes
- Structured findings and human-validation state
- Evidence records with optional hashes/storage references
- Append-oriented audit events
- Internal-only RLS by default
- A security-invoker runnable-job guard
- Security engagement overview view
- Shared TypeScript agent/risk/gating definitions

## Deliberate safety boundary

This foundation does **not**:
- execute scanners or exploitation tools;
- provide an anonymous/public job trigger;
- grant customers direct access to internal evidence;
- allow an AI agent to approve its own elevated work;
- bypass written authorisation, testing windows, scope, or emergency stop.

## Runtime contract

The future n8n Security Orchestrator should receive a job ID, then check `security_job_is_runnable(job_id)` immediately before dispatch. Runtime workers (cloud/HAL/TRON) must treat a false result as a hard deny.

Recommended dispatch sequence:

1. Load engagement + job.
2. Verify written authorisation and time window.
3. Verify target is permitted and not explicitly prohibited.
4. Verify required human approval gate.
5. Check emergency stop.
6. Dispatch only the named agent/job type.
7. Write an audit event.
8. Store structured evidence/results.
9. Require human validation for material findings.

## Next safe implementation stage

Start with the Recon Agent using low-risk public metadata only: DNS, TLS/certificate metadata, explicitly authorised public service inventory, and technology metadata. Do not introduce active or elevated testing until the approval path is live and verified.
