# Better Life

Romanian self-improvement platform with quiz funnels, a blog, and a shop.

## Stack

- **Framework**: SvelteKit 2 + Svelte 5 (runes only)
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite`
- **i18n**: Paraglide JS, base locale `ro`
- **DB**: PostgreSQL via Drizzle ORM + `postgres` driver
- **Payments**: Stripe Checkout + webhooks + Stripe Tax
- **Email**: Resend (behind idempotent send wrapper with dry-run mode)
- **Blog**: mdsvex markdown files
- **Deploy**: Vercel + Vercel Cron
- **Package manager**: pnpm

## Local dev quickstart

### Prerequisites

- Node.js 20+, pnpm 9+
- Docker (for local Postgres)

### 1. Clone and install

```bash
git clone <repo>
cd viata-mai-buna
pnpm install
```

### 2. Start the database

```bash
docker compose up -d db
```

### 3. Configure environment

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Postgres connection string (e.g. `postgres://postgres:postgres@localhost:5432/betterlife`) |
| `TOKEN_SECRET` | 32+ char random string for HMAC tokens |
| `CRON_SECRET` | Secret for Vercel cron auth header |
| `RESEND_API_KEY` | Resend API key (set `EMAIL_DRYRUN=true` for local) |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_...` for dev) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `PUBLIC_SITE_URL` | Full site URL (e.g. `http://localhost:5173`) |
| `EMAIL_DRYRUN` | Set to `true` to skip actual email sends |

### 4. Run migrations and seed

```bash
pnpm db:migrate
pnpm db:seed
```

### 5. Start dev server

```bash
pnpm dev
```

## Scripts reference

| Script | Description |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build |
| `pnpm check` | Svelte type checking |
| `pnpm test` | Run Vitest unit tests |
| `pnpm db:migrate` | Run Drizzle migrations |
| `pnpm db:seed` | Seed products |
| `pnpm db:studio` | Open Drizzle Studio |

## Architecture

### Quizzes

Users complete a quiz, enter their email, and receive results. The quiz engine
computes a profile via weighted dimension scoring. After double-opt-in
confirmation, subscribers receive a drip email sequence (5 steps over ~14 days)
then ongoing campaign emails at their chosen cadence (weekly/monthly/none).

### Email system

All emails go through `src/lib/server/email/send.ts` which enforces idempotency
via a `(recipient_email, email_key)` unique constraint — duplicate sends are
silently dropped. Set `EMAIL_DRYRUN=true` to log emails without sending.

### Shop

Stripe Checkout sessions with Stripe Tax (automatic). Physical products trigger
shipping address collection. Digital products generate expiring download tokens
after payment webhook confirmation.

### Cron jobs

- `/api/cron/drip` — daily at 07:00 UTC; sends next due drip email to each subscriber
- `/api/cron/campaigns` — Tuesdays at 08:00 UTC; sends campaign emails respecting cadence and drip window

## Deployment

See `LAUNCH-CHECKLIST.md` for manual production cutover steps.
