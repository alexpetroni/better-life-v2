# Progress

## Phase 01 — Scaffold
- status: done
- commit: (pending)
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
