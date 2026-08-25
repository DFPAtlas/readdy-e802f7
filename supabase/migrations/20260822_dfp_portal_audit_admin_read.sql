-- DFP Client Portal — audit history read access for admins
-- Additive. Lets authorised administrators read portal audit events
-- written by the invite-client-portal-user edge function.

CREATE POLICY admin_select_operational_audit_events
ON operational_audit_events
FOR SELECT
TO authenticated
USING (app_private.is_admin());