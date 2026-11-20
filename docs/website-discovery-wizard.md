# Website discovery wizard

The primary **Plan Your Website** buttons on `/services/websites-saas` open
`/services/websites-saas/plan-your-website`. A direct contact link remains in the
closing section.

The 26 questions are configured in `lib/website-discovery.ts`, grouped into the
six supplied parts. All discovery questions are optional; at least one answer
is needed to submit. Suggested choices supplement free text. Single selections
can be cleared by clicking them again. The final screen reviews every question,
offers editing links, and collects name, email, optional business name and a
required contact/privacy acknowledgement.

## Data flow

- Reuses `submitEnquiry('project_submissions', payload, true)` and the existing
  `submit_project_submission(jsonb)` RPC.
- `initial_message` records the origin, business name and contact acknowledgement.
- `additional_notes` holds the versioned, complete question-and-answer brief in
  plain text, including explicit `Not answered` entries for skipped questions.
- **Admin → Submissions** displays the complete brief. Converting a submission
  to a project carries its additional notes into the project description.
  Discovery projects use a zero budget until a quote is agreed, rather than
  applying the legacy £5,000 fallback to an enquiry with no agreed price.
- The existing `send-lead-notification` invocation is requested after receipt;
  its email template already includes additional notes. Email delivery remains
  dependent on that deployed function and its email-provider configuration.
- A success reference requires a record ID returned by the database. Errors
  keep the answers and contact fields in the open page; concurrent clicks are
  blocked. The existing RPC does not provide server-side retry deduplication.

No schema migration, new database permission or Edge Function deployment is
needed. Publish the frontend after the PR is merged and pulled into Readdy.

## Drafts

Answers and the current part are saved under `dfp-website-discovery-v1` in browser
local storage. Drafts expire logically after 14 days and are replaced on the next
visit; successful submissions remove the draft. Contact fields and the contact
acknowledgement are not stored in the draft. Invalid/version-mismatched drafts
are ignored, and restored values are limited to known questions and choices.
Storage failures show a notice and leave the in-memory wizard usable. Asset
questions collect descriptions only: no file upload or private sharing link is
required.

## Validation

Run `npm run test:website-discovery`, `npm run typecheck`, `npm run lint`,
`npm run build`, then `npm run test:smoke`. The build-certification workflow runs
the new unit tests and the discovery browser tests automatically. Browser tests
intercept Supabase traffic and email requests; they never create live enquiries.

The existing RPC contract was inspected on 20 November 2026. An anonymous-role
submission with all 26 full-length answers (over 39,000 characters) was accepted
and checked inside a rolled-back transaction. A separate read confirmed zero
remaining verification rows. No email was sent by that database test.
