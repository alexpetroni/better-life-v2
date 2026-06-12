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
- commit: 1949cee050d2d6ebe58db88a7c06e94eaa539bcd
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

## Phase 03 — Drip emails
- status: done
- commit: a21f090
- checks:
  - [x] `pnpm check` → 0 errors
  - [x] `pnpm vitest run` → 23 tests pass
  - [x] `pnpm build` → succeeds
  - [x] GET /api/cron/drip without auth → 401
  - [x] first run with backdated subscriber → `{"processed":1,"sent":3,"skipped":0,"failed":0}`
  - [x] email_keys: seq:somn-v1:1, seq:somn-v1:2, seq:somn-v1:3
  - [x] idempotency: `{"processed":1,"sent":0,"skipped":3,"failed":0}`
  - [x] count still 3 after second run
  - [x] unsubscribed → `{"processed":0,...}`

## Phase 04 — Shop and Stripe
- status: done
- commit: (pending)
- checks:
  - [x] `pnpm db:migrate && pnpm tsx scripts/seed.ts` → 4 products
  - [x] `pnpm tsx scripts/seed.ts` re-run → idempotent, still 4
  - [x] `pnpm db:query "select count(*) from products"` → 4
  - [x] `pnpm check && pnpm vitest run && pnpm build` → all green (30 tests)
  - [x] `/shop | grep "Mască de somn premium"` → matches
  - [x] `/shop/ghid-seara-linistita | grep -qi "descărcare"` → matches
  - [x] `/shop/nu-exista` → 404
  - [x] POST /api/checkout empty items → 400
  - [x] POST /api/checkout valid body, no Stripe key → 503
  - [x] download valid token → 200, file non-empty
  - [x] download_count incremented → 1
  - [x] expired token → 410
  - [SKIPPED] stripe-live: STRIPE_SECRET_KEY not set
