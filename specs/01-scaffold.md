# Phase 01 — Scaffold

**Goal:** a deployable SvelteKit 2 + Svelte 5 + Tailwind v4 skeleton with
Paraglide (`ro`), Drizzle wired to Postgres, the first migration applied, a
Romanian home page, and the dev tooling (docker-compose, db:query helper)
that every later phase's acceptance criteria rely on.

## Steps & file-by-file changes

### 1. Git + project init

- `git init`, create `.gitignore` (node_modules, .svelte-kit, build, .env*,
  !.env.example, .vercel, .DS_Store).
- Scaffold SvelteKit non-interactively:
  `pnpm dlx sv create --template minimal --types ts --no-add-ons --install pnpm .`
  If the CLI refuses flags/non-empty dir, scaffold in a temp dir and move files
  in (`specs/`, `.claude/`, and `.mcp.json` must remain untouched), or write
  the config files manually.
- Install: `@sveltejs/adapter-vercel`, `tailwindcss @tailwindcss/vite`,
  `drizzle-orm postgres`, `drizzle-kit` (dev), `tsx` (dev), `vitest` (dev).
  (Paraglide is installed by its `sv add` integration — see §3.)

### 2. Build configuration

| File | Content |
|---|---|
| `svelte.config.js` | `adapter-vercel`; `vitePreprocess()`. (mdsvex is added in phase 05 — leave `extensions` default for now.) |
| `vite.config.ts` | plugins **in order**: the Paraglide vite plugin (exactly as wired by `sv add paraglide` — do not hand-write its import), `tailwindcss()`, `sveltekit()`. |
| `src/app.css` | `@import "tailwindcss";` + `@theme` block defining brand tokens: `--color-brand-*` (a calm green ramp 50–900), `--color-accent-*` (warm amber ramp), `--font-sans: 'Inter', ui-sans-serif, system-ui`. |
| `package.json` scripts | `dev`, `build`, `preview`, `check`, `db:generate` (`drizzle-kit generate`), `db:migrate` (`drizzle-kit migrate`), `db:query` (`tsx scripts/db.ts`), `test` (`vitest run`). |

### 3. i18n (Paraglide)

Set up via the **official integration**: `pnpm dlx sv add paraglide` (answer/flag:
demo `no`). This installs the right package version and wires the vite plugin
correctly — do not hand-wire it from memory; the plugin API has changed between
major versions. Then adjust:

| File | Content |
|---|---|
| `project.inlang/settings.json` | ensure `baseLocale: "ro"`, `locales: ["ro"]`. |
| `messages/ro.json` | Initial UI strings (all Romanian): `site_name` ("Viață Mai Bună"), `nav_home`, `nav_blog`, `nav_shop`, `nav_quizzes`, `footer_tagline`, `cta_start_quiz` ("Începe testul"), `email_placeholder`, `submit`, `loading`. Grow this file in later phases as UI needs strings. |
| `src/lib/paraglide/` | generated at dev/build by the vite plugin — add it to `.gitignore`. |

### 4. Database

| File | Content |
|---|---|
| `docker-compose.yml` | service `db`: `postgres:16-alpine`, `POSTGRES_PASSWORD=postgres`, `POSTGRES_DB=betterlife`, port **`5433:5432`** (host 5433 — 5432 is occupied by another project's Postgres on this machine), healthcheck `pg_isready`, named volume. If a container named `betterlife-db` is already running on host port 5433 (pre-started before the first run), reuse it instead of starting the compose service. |
| `drizzle.config.ts` | dialect postgresql, schema `./src/lib/server/db/schema.ts`, out `./drizzle`, url from `process.env.DATABASE_URL`. **First line: `process.loadEnvFile()`** (Node 22 built-in) — drizzle-kit does NOT load `.env` by itself. The same applies to every script in `scripts/` run via `tsx`. |
| `src/lib/server/db/schema.ts` | Tables `subscribers`, `quiz_results`, `email_sends` exactly per overview §4 (the commerce tables come in phase 04). Export inferred types (`Subscriber`, `NewSubscriber`, …). |
| `src/lib/server/db/client.ts` | postgres-js client (`max: 5`, `prepare: false`) + `export const db = drizzle(client, { schema })`. Read `DATABASE_URL` from `$env/dynamic/private` with a clear startup error if missing. |
| `scripts/db.ts` | CLI: `pnpm db:query "select 1"` → executes the SQL with the `postgres` package. Strict I/O contract (the acceptance greps depend on it): **JSON rows to stdout only** (`JSON.stringify(rows, null, 2)`), error messages to **stderr**, exit 0 on success (even for empty result sets), exit 1 on any error. Loads `.env` via `process.loadEnvFile()`. |
| `.env.example` + `.env` | Per overview §7. |

Then: `docker compose up -d db`, `pnpm db:generate`, `pnpm db:migrate`.

### 5. Shell pages (Romanian copy)

| File | Content |
|---|---|
| `src/lib/content/topics.ts` | `export interface Topic { slug; name; emoji; tagline; quizSlug?: string }` and `export const topics: Topic[]` with two entries: `somn` ("Somn mai bun", quizSlug `somn`), `obiceiuri` ("Obiceiuri mai bune", quizSlug `obiceiuri`). Plus `getTopic(slug)`. |
| `src/routes/+layout.svelte` | imports `app.css`; header with site name + nav (Acasă, Blog, Magazin, Teste) using Paraglide messages; footer with tagline + placeholder links (Confidențialitate, Termeni). |
| `src/routes/+page.svelte` | home: hero ("Trăiește mai bine, pas cu pas" or similar), card per topic from `topics.ts` linking to `/quiz/<quizSlug>` with `cta_start_quiz`, short "cum funcționează" section (3 steps: test → profil → sfaturi pe email). `export const prerender = true` in a `+page.ts`. |
| `src/routes/topics/[topic]/+page.server.ts|.svelte` | loads topic from registry (404 unknown); renders name/tagline + quiz CTA. (Posts and products are wired in phases 04/05.) |
| `src/routes/+error.svelte` | friendly Romanian error page: 404 → "Pagina nu există" + link home; other statuses → "A apărut o eroare". |
| `src/lib/components/Seo.svelte` | props: title, description, ogImage?, url?; renders `<svelte:head>` title/meta/OG/Twitter tags. Use on home + topic pages. |
| `src/app.html` | `lang="ro"`. |

### 6. Vitest

- `vitest` config inside `vite.config.ts`:
  `test: { include: ['src/**/*.test.ts'], setupFiles: ['./vitest.setup.ts'] }`.
- `vitest.setup.ts`: `process.loadEnvFile()` — server modules read env via
  `$env/dynamic/private`, which resolves from `process.env` under vitest;
  without this, any test importing a server module fails on missing env vars.
- Add a trivial `src/lib/content/topics.test.ts` (registry returns topics,
  `getTopic('somn')` works) so the test pipeline is proven.

## Acceptance criteria

```bash
docker compose up -d db && sleep 3
pnpm db:migrate                            # exits 0
pnpm db:query "select table_name from information_schema.tables where table_schema='public'"
                                           # contains subscribers, quiz_results, email_sends
pnpm db:query "select count(*) from subscribers"   # → [{"count":"0"}] (or 0)
pnpm check                                 # 0 errors, 0 warnings tolerated only if from generated code
pnpm vitest run                            # passes
pnpm build                                 # succeeds (adapter-vercel output)
pnpm dev &  sleep 5
curl -s http://localhost:5173/ | grep -q "Viață Mai Bună"          # home renders
curl -s http://localhost:5173/topics/somn | grep -q "Somn"         # topic hub renders
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/topics/nope | grep -q 404
kill %1
```

Commit: `phase-01: scaffold`.

## Do NOT touch in this phase

- No quiz, email, shop, or blog code — later phases own those files.
- No `vercel.json` yet (phase 03 creates it with the drip cron; phase 06 adds the campaigns cron).
- Do not add the commerce tables to the schema yet (phase 04 owns that migration).
- `specs/**` (except PROGRESS.md), per global rules.
