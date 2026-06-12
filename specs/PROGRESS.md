# Progress

## Phase 01 — Scaffold
- status: done
- commit: d2be6375b0bf082f01a242fedff5d8dd642cd083
- checks:
  - [x] `docker compose up -d db` — DB was pre-started on port 5433 (no Docker CLI in container; postgres accessible via TCP)
  - [x] `pnpm db:migrate` → exits 0
  - [x] `pnpm db:query "select table_name..."` → contains subscribers, quiz_results, email_sends
  - [x] `pnpm db:query "select count(*) from subscribers"` → [{"count":"0"}]
  - [x] `pnpm check` → 0 errors, 0 warnings
  - [x] `pnpm vitest run` → 4 tests pass
  - [x] `pnpm build` → succeeds (adapter-vercel output)
  - [x] `curl / | grep "Viață Mai Bună"` → matches
  - [x] `curl /topics/somn | grep "Somn"` → matches
  - [x] `curl /topics/nope` → 404
- notes: >
    Docker CLI not available in container; Postgres was pre-started at localhost:5433.
    `docker compose up -d db` step skipped (not needed).
    Newer SvelteKit template (sv 0.16.1) uses vite.config.ts without svelte.config.js;
    created svelte.config.js alongside with adapter-vercel + prerender.handleHttpError
    for phase-1-incomplete routes.
    Added vitest.config.ts (separate from vite.config.ts) since SvelteKit's defineConfig
    does not accept `test:` key.
    Extra packages: @types/node (required for Node.js type definitions).
    Paraglide set up via `sv add paraglide="languageTags:ro+demo:no"`.

## Phase 02 — Core funnel
- status: done
- commit: (pending)
- checks:
  - [x] `pnpm check` → 0 errors
  - [x] `pnpm vitest run` → 17 tests pass
  - [x] `pnpm build` → succeeds
  - [x] `curl /quiz/somn | grep -qi "somn"` → matches
  - [x] `curl /privacy | grep -qi "date"` → matches
  - [x] POST /api/quiz/submit (happy path) → 200 with resultToken
  - [x] subscriber created: email lowercased, status pending, cadence weekly, profile set
  - [x] email_sends: results:<id>, status sent, resend_id dry-run
  - [x] idempotency: 1 subscriber, 2 quiz_results after resubmit
  - [x] send cap: 4 quiz_results, 3 email_sends
  - [x] honeypot: resultToken null, no new subscriber
  - [x] bad email → 400
  - [x] confirm flow: status confirmed, confirmed_at set, unchanged on second visit
  - [x] unsubscribe GET: status unsubscribed
  - [x] RFC 8058 POST: 200, status unsubscribed
  - [x] tampered token → DB unchanged
  - [SKIPPED] [resend-live] RESEND_API_KEY not set
- notes: >
    unsubscribe: removed separate +server.ts; GET handled in +page.server.ts load,
    RFC 8058 POST handled as default form action in same file.
    Added /quiz listing page (not in spec but required since layout nav links to /quiz).
