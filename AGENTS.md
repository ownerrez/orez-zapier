# AGENTS.md

Guidance for AI coding agents working in this repository.

## Overview

Zapier Platform CLI integration (`zapier-platform-core`, CommonJS, no build step) for the OwnerRez v2 REST API. `index.js` is the app definition Zapier loads; `package.json` `version` is the published Zapier app version.

## Commands

```powershell
zapier test --skip-validate          # full suite via Zapier CLI (preferred)
npm test                             # mocha --recursive -t 10000
npx mocha --recursive -g "tag_add"   # subset by describe/it name
zapier validate                      # schema/app validation
```

Tests read env vars from `.env` (never commit; not deployed to Zapier), loaded via `zapier.tools.env.inject()`:

```
AUTH_USERNAME=your@user.name
AUTH_PASSWORD=pt_yourpersonaltoken
API_ROOT=https://api.dev.ownerrez.com
APP_ROOT=https://app.dev.ownerrez.com
NODE_TLS_REJECT_UNAUTHORIZED=0
```

`API_ROOT` must be set even for unit tests — nock mocks are registered against it.

## Architecture

- `index.js` — registers every trigger/create/search by its `key`. A new operation file does nothing until it is added here.
- `orez.js` — shared HTTP layer and schemas:
  - `BuildRequest` prefixes `process.env.API_ROOT`, sets JSON headers, and authenticates with the OAuth bearer token from `bundle.authData.access_token`, falling back to Basic auth from `AUTH_USERNAME`/`AUTH_PASSWORD` (used by local/integration tests).
  - `GetItems` / `PostItem` / `PatchItem` / `DeleteItem` wrap `z.request` + `throwForStatus`. `GetItems` always returns an array: list responses' `items`, or a single object wrapped in `[ ]`.
  - `CleanId` strips non-digits so users can enter prefixed IDs (e.g. `ORB1234`, `ORG1234`).
  - `Types.{Booking,Guest,Property}.{Sample,Fields}` are the shared `sample`/`outputFields` for operations.
  - `MockList` builds a paged list response for nock replies.
- `orez_helpers.js` — dynamic input fields and webhook plumbing:
  - `GetEntityIdInputByType` / `GetEntityIdInput` build an entity-ID dropdown by fetching recent records (last 180 days) for the chosen `entity_type`. Inputs that depend on another field's value set `altersDynamicFields: true` on that field.
  - `GetFieldDefinitionEntityInputs` derives entity inputs from a custom field definition's type.
  - `BuildPerformSubscribe({type, action})` / `PerformUnsubscribe` manage `v2/webhooksubscriptions`; `GetWebhookCategoriesInput` adds the optional `category_type` filter sent with the subscription.
- `authentication.js` — OAuth2 against `APP_ROOT`; `CLIENT_ID`/`CLIENT_SECRET` come from Zapier env, not the repo.
- `triggers/` — REST hook triggers (`type: 'hook'`). `perform` re-fetches the entity using `bundle.cleanedRequest.entity_id` from the webhook payload; `performList` fetches recent records for Zapier's sample/test step. `field_definition_lookup` is a hidden polling trigger that only feeds the custom-field dropdowns (`dynamic: "field_definition_lookup.id..."`) in `creates/custom_field_*`.
- `creates/` — actions. Tag and custom-field actions are idempotent: they GET existing values first and only POST/DELETE when needed.
- `searches/` — lookups by ID.
- OwnerRez "contact" maps to API entity type `guest`.

## Tests

`test/` mirrors the source tree (one file per operation). Pattern: build a `bundle`, mock the API with `nock(process.env.API_ROOT)`, run the operation through `zapier.createAppTester(App)`, and assert with `should`. Use the operation's own `sample` (e.g. `App.triggers['booking_created'].operation.sample`) or `orez.MockList([...])` as reply bodies. Integration tests that hit a real API must be guarded with `if (process.env.AUTH_USERNAME)`.

A bug fix adds a test that fails on the pre-fix code. An outcome-changing branch covers both outcomes.

## Non-negotiables

- This is a public repository. Never commit credentials, tokens, customer data, or internal OwnerRez details (internal hostnames, staff tooling, private issue content).
- Operation `key`s, input field `key`s, and output field `key`s are an external contract: live Zaps reference them by name. Renaming or removing one breaks existing Zaps; add a new key and hide the old operation (`display.hidden: true`) instead.
- Prefer the smallest diff that completes the task well. Small improvements to touched code are welcome and named in the PR; restructures get their own issue.
- No rule covers the case → do the smallest thing consistent with the surrounding file and say so in the PR body. Never invent a convention silently.
- A claim that a change works names its evidence: test name, or the Zap step tested in the Zapier editor. No evidence → say what is unverified.
- Before changing code to fix a bug, identify the failing mechanism and the evidence for it.

## Git

- Default branch is `main`. Branch `<issue>-<short-desc>`: lowercase, hyphenated, ≤6 words.
- Commit subjects end with the issue number: `Handle new field #12345`.
- A release bumps `version` in `package.json` (and `package-lock.json`) before `zapier push`.

## Code Style

- Match the surrounding file: naming, quoting, `var`/`const`, promise chains vs `await`.
- New API calls go through `orez.GetItems`/`PostItem`/`PatchItem`/`DeleteItem`, not raw `z.request`, unless the call needs the raw response (e.g. reading `next_page_url` for `z.cursor` paging in `triggers/field_definition_lookup.js`).
- User-entered IDs pass through `orez.CleanId` at every API call site; partial normalization produces IDs a later lookup cannot match.
- Paging advances from the `next_page_url` the current response returns.
- Commented-out code is deleted, not committed.

## Code Comments

Default = no comment. A comment that exists states a fact the code can't: business rule, external API contract, non-obvious algorithm or constraint. One line is the norm, two the ceiling.

Never: restate the code; issue/PR numbers in any comment; transitional process notes; filler ("note that", "this ensures", "robust", "simply", "for clarity", "to be safe") — delete the whole comment, not just the phrase.

User-facing strings (`label`, `helpText`, `display.description`) are customer documentation in the Zapier editor and are exempt from the length limit. Single-clause help text has no trailing period; two or more sentences each end with one.

## Writing Style

Applies to comments, commits, PRs, issues, and docs.

- Cut every word whose removal changes nothing. Plain verbs (`is` / `has` / `does` / `uses`).
- Facts over adjectives: no number or behavior → cut the adjective.
- No empty hedging ("might", "generally", "should help") — verify or cut. Genuine uncertainty states what is known, what is unknown, and the check that would resolve it.
- No metaphors for mechanisms: describe what is checked, stored, or sent.
- Banned: "worth noting", "load-bearing", "belt and suspenders", "not just X, but Y", rule-of-three lists, closing restatements.
- A PR description or issue body names its reader, defines terms that reader would look up, and leaves out approaches tried and discarded unless the reader needs them.
- Read the current date; never infer it (`Get-Date -Format "yyyy-MM-dd"`).

## Reviewing

A finding carries its evidence and asks for a specific action. Correctness: the input or state, the producer that supplies it, and the wrong outcome. Do not report defects that predate the change, inputs no producer supplies, or departures from guidance that cause no specific defect. Zero findings is a valid result.
