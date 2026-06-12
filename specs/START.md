# START — Autonomous execution guide

You are an autonomous Claude Code agent executing the "Better Life" build inside
a Docker container, without human approval between steps. This file is your
contract. Follow it exactly.

## 0. Quick start (for the human launching the run)

```bash
# from the repository root
docker run --rm -it \
  -v "$PWD":/work -w /work \
  -e ANTHROPIC_API_KEY \
  -e HOME=/tmp/home \
  -u node \
  --network host \
  node:22-bookworm bash -c '
    mkdir -p "$HOME/.npm-global" &&
    npm config set prefix "$HOME/.npm-global" &&
    export PATH="$HOME/.npm-global/bin:$PATH" &&
    npm i -g pnpm @anthropic-ai/claude-code &&
    git config --global user.name "Claude (autonomous run)" &&
    git config --global user.email "claude-agent@noreply.local" &&
    git config --global --add safe.directory /work &&
    claude --dangerously-skip-permissions \
      -p "Read specs/START.md and execute the spec suite from the current phase onward."'
```

Notes on this command: it runs as the non-root `node` user because Claude Code
refuses `--dangerously-skip-permissions` as root; `HOME` and the npm prefix
point at a writable location for that user; the git identity is required for
the per-phase commits; `--network host` lets the container reach the
docker-compose Postgres on `localhost:5433`.

Auth alternatives: instead of `-e ANTHROPIC_API_KEY` (API credits), pass
`-e CLAUDE_CODE_OAUTH_TOKEN` (subscription billing — generate once on the host
with `claude setup-token`). On subscription plans the run may stop when a
usage window is exhausted: re-run the identical command and the agent resumes
from `specs/PROGRESS.md`. To reduce cost/quota, add `--model sonnet` to the
`claude` invocation, or scope the prompt to one phase at a time
("…execute phase 01 only, then stop").

Postgres must be reachable first: `docker compose up -d db` (the compose file is
created in phase 01; for the very first run the agent creates it, starts the
service itself if a Docker socket is available, or uses whatever `DATABASE_URL`
is provided). No other credentials are required — email runs in dry-run mode and
Stripe steps self-skip when `STRIPE_SECRET_KEY` is empty.

### Network requirements (egress contract)

A fully air-gapped container cannot run this: Claude Code needs the Anthropic
API, and the build needs the npm registry. If you restrict egress, use this
allowlist:

| Tier | Domains | What it buys |
|---|---|---|
| **Required** | `api.anthropic.com`, `registry.npmjs.org` | Claude Code runs at all; `npm i -g` and `pnpm install` work |
| Recommended | `mcp.svelte.dev` | The svelte MCP server (docs lookup + `svelte-autofixer`) from `.mcp.json` |
| Live checks only | `api.stripe.com`, `api.resend.com` | The optional **[stripe-live]** / **[resend-live]** criteria; everything else is dry-run by design |

Behavior when the recommended/live tiers are blocked: MCP servers fail to
connect at session start and Claude Code continues without them — no
acceptance criterion depends on an MCP tool, so the run still completes
(without the autofixer safety net on Svelte components). The stripe MCP is
also inert whenever `STRIPE_SECRET_KEY` is empty.

Everything else is deliberately offline-safe: Postgres is local (compose),
email is dry-run via `EMAIL_DRYRUN=1`, Stripe code paths self-skip, and all
assets are local. Corollary for the agent: do NOT introduce CDN dependencies
(Google Fonts, external scripts, remote images) — the specs use the system
font stack and local assets on purpose.

To shrink the required tier further, pre-bake the image: install
`@anthropic-ai/claude-code` and warm the pnpm store at image build time,
leaving `api.anthropic.com` as the only runtime egress. That is the floor —
it cannot go lower.

## 1. Execution order

1. Read `specs/00-overview.md` **fully**. It defines the schema, types,
   conventions, and global rules every phase depends on.
2. Read or create `specs/PROGRESS.md` (format below) to find the current phase.
3. Execute phases strictly in order, one at a time:
   `01-scaffold.md` → `02-core-funnel.md` → `03-drip-emails.md` →
   `04-shop-stripe.md` → `05-blog-seo.md` → `06-campaigns.md`.
4. For each phase: read the whole phase spec → implement → run ALL its
   acceptance criteria → run the global criteria (overview §8) → commit →
   update `PROGRESS.md` → next phase.

## 2. Rules of engagement

- **Never modify `specs/`** except `specs/PROGRESS.md`.
- **One commit per phase**, message `phase-NN: <phase title>` (plus the
  initial `chore: scaffold` commits allowed inside phase 01). Commit only when
  every acceptance criterion passes.
- **Verify, don't assume.** Acceptance criteria are commands with expected
  outcomes. Run them. Paste their real output into `PROGRESS.md`.
- If an acceptance criterion fails: fix and retry. After **3 distinct failed
  attempts** on the same criterion, write a `BLOCKED` entry in `PROGRESS.md`
  describing the failure, the attempts, and your best hypothesis — then STOP the
  run. Do not skip a criterion to keep going.
- **Idempotent restart:** if the run is interrupted, a fresh agent must be able
  to resume from `PROGRESS.md` + `git log`. Keep both truthful at all times.
- Criteria marked **[stripe-live]** require `STRIPE_SECRET_KEY`; when it is
  empty, skip them and record `SKIPPED (no Stripe key)` in `PROGRESS.md`.
  Same for **[resend-live]** and `RESEND_API_KEY`. Everything else is offline-safe.
- Do not install packages beyond those the specs name, except trivial
  transitive/type packages needed to make `pnpm check` pass. Record any extra
  install and its reason in `PROGRESS.md`.
- Do not start long-running foreground processes; run the dev server in the
  background (`pnpm dev &` or equivalent), curl against it, then kill it.
- Respect the global DO-NOT-TOUCH list (overview §9) and each phase's local one.

## 3. Environment

Copy `.env.example` → `.env` in phase 01 and keep dev-safe defaults:

- `DATABASE_URL` — defaults to the docker-compose Postgres
  (`postgres://postgres:postgres@localhost:5433/betterlife` — host port 5433,
  because 5432 is occupied by another project's Postgres on this machine). If
  the env var is already set when the run starts, use it as-is.
- `EMAIL_DRYRUN=1` — emails are logged, not sent, but the `email_sends` ledger
  is still written, so every email acceptance check works offline.
- `CRON_SECRET`, `EMAIL_TOKEN_SECRET` — any non-empty dev string.
- `STRIPE_SECRET_KEY`, `RESEND_API_KEY`, `BLOB_READ_WRITE_TOKEN` — leave empty
  unless provided; the code paths degrade gracefully (overview §7).

Useful helpers (exist after phase 01):

- `pnpm db:query "select ..."` → runs SQL via `scripts/db.ts`, prints JSON rows.
  Use it for every DB assertion in the acceptance criteria.
- `docker compose up -d db` / `docker compose down` for the database.

The repo ships a project `.mcp.json`: the **svelte** MCP server (official docs +
`svelte-autofixer` — run the autofixer on non-trivial new `.svelte` components
before committing) and the **stripe** MCP server (test-mode inspection; only
functional when `STRIPE_SECRET_KEY` is set — ignore it otherwise). `.claude/skills/`
contains content-authoring skills (`new-quiz`, `new-blog-post`, `new-campaign`)
for use AFTER the build — phases 02/05/06 define their own content inline; do
not invoke the skills during the spec run.

## 4. PROGRESS.md format

Create `specs/PROGRESS.md` on first run:

```markdown
# Progress

## Phase 01 — Scaffold
- status: done | in-progress | blocked
- commit: <sha>
- checks:
  - [x] pnpm check → 0 errors
  - [x] GET / → 200, contains "Viață Mai Bună"
  - [ ] ...
- notes: <deviations, extra packages, skipped [stripe-live] items>
```

One section per phase, updated as you go. This file is the single source of
truth for resumption.

## 5. Definition of done (whole run)

All six phases committed, `PROGRESS.md` shows every non-skipped check green, and
from a clean checkout:

```bash
docker compose up -d db
pnpm install && pnpm db:migrate && pnpm tsx scripts/seed.ts
pnpm check && pnpm vitest run && pnpm build
```

completes without errors, and the phase-06 smoke script (its final acceptance
block) passes against `pnpm dev`.
