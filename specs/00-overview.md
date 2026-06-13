# 00 — Overview: "Better Life"

Read this file completely before starting any phase. Every phase spec assumes the
context, schema, types, and conventions defined here. When a phase spec and this
file disagree, **this file wins** — note the conflict in `specs/PROGRESS.md`.

## 1. Product

A Romanian-language self-improvement site with topic verticals (somn/sleep,
obiceiuri/habits, …) and three pillars:

1. **Quizzes** — the main funnel. Social-media traffic lands on a quiz landing
   page. Completing a quiz computes a **profile**. At the end, the visitor enters
   their email to receive results + advice. The profile drives which emails they
   get, at what cadence, and which products are recommended.
2. **Blog** — markdown posts per topic; every post funnels readers to a quiz and
   shows related products.
3. **Shop** — Stripe Checkout, guest only. Physical products (shipped in Romania)
   and digital products (delivered via expiring download links).

**No login anywhere.** A subscriber is an email address + quiz profile +
email preferences, managed exclusively via signed token links in emails.

Email lifecycle: instant results email → (after double-opt-in confirm) welcome
drip of ~5 profile-tailored emails over 2 weeks → ongoing periodic campaign
emails (tips + product recommendations) at the subscriber's cadence.

**Market:** Romania at launch; architecture must keep later EU expansion a
translation/config task, not a refactor.

## 2. Stack (fixed — do not substitute)

| Concern | Choice |
|---|---|
| Framework | SvelteKit 2 + Svelte 5 (runes only — no legacy `$:`/`export let`) |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` (no `tailwind.config.js`) |
| i18n | Paraglide JS (`@inlang/paraglide-js`), base locale `ro`, only locale at launch, no URL prefix |
| DB | Postgres. Drizzle ORM + `drizzle-kit` migrations. Driver: `drizzle-orm/postgres-js` with the `postgres` package (works identically against local Docker Postgres and Neon in production) |
| Payments | Stripe Checkout Sessions + webhooks, Stripe Tax enabled |
| Email | Resend, behind a single idempotent send wrapper with a dry-run mode |
| Blog | mdsvex, markdown files in repo |
| Deploy target | Vercel (`@sveltejs/adapter-vercel`), Vercel Cron |
| Package manager | pnpm |
| Tests | Vitest (pure-function unit tests); end-to-end checks via curl + `scripts/db.ts` |

## 3. Repository layout (authoritative paths)

```
src/
├── routes/
│   ├── +layout.svelte                       # nav, footer, imports app.css
│   ├── +page.svelte                         # home: topic verticals, quiz CTAs
│   ├── topics/[topic]/+page.server.ts|.svelte
│   ├── blog/+page.ts|.svelte                # listing (prerendered)
│   ├── blog/[slug]/+page.ts|.svelte         # post (mdsvex, prerendered)
│   ├── quiz/[slug]/+page.server.ts|.svelte  # LANDING — prerendered, OG-tagged
│   ├── quiz/[slug]/play/+page.ts|.svelte    # client-side question flow
│   ├── quiz/[slug]/results/+page.server.ts|.svelte
│   ├── shop/+page.server.ts|.svelte
│   ├── shop/[slug]/+page.server.ts|.svelte
│   ├── cart/+page.svelte
│   ├── checkout/success/+page.server.ts|.svelte
│   ├── checkout/cancel/+page.svelte
│   ├── email/confirm/[token]/+page.server.ts|.svelte
│   ├── email/preferences/[token]/+page.server.ts|.svelte
│   ├── email/unsubscribe/[token]/+page.server.ts|.svelte
│   ├── download/[token]/+server.ts
│   ├── api/quiz/submit/+server.ts
│   ├── api/checkout/+server.ts
│   ├── api/webhooks/stripe/+server.ts
│   ├── api/cron/drip/+server.ts
│   ├── api/cron/campaigns/+server.ts
│   ├── sitemap.xml/+server.ts
│   └── robots.txt/+server.ts
├── lib/
│   ├── server/
│   │   ├── db/client.ts                     # drizzle + postgres-js singleton
│   │   ├── db/schema.ts                     # ALL tables live here
│   │   ├── stripe.ts
│   │   ├── tokens.ts                        # HMAC sign/verify
│   │   ├── cron.ts                          # requireCronAuth(request)
│   │   ├── quiz/score.ts
│   │   └── email/
│   │       ├── send.ts                      # sole path to Resend
│   │       ├── sequences.ts                 # drip definitions
│   │       ├── campaigns.ts                 # periodic campaign definitions
│   │       └── templates/                   # layout.ts, results.ts, welcome.ts,
│   │                                        # order-confirm.ts, delivery.ts, campaign.ts
│   ├── content/
│   │   ├── quizzes/index.ts                 # registry: getQuiz(slug), allQuizzes
│   │   ├── quizzes/somn.ts                  # first quiz (phase 02)
│   │   ├── quizzes/obiceiuri.ts             # second quiz (phase 06)
│   │   ├── topics.ts                        # topic registry
│   │   └── shipping.ts                      # flat-rate RO shipping tiers
│   ├── quiz/types.ts                        # QuizDefinition etc. (client-safe)
│   ├── cart.svelte.ts                       # runes cart + localStorage
│   └── components/                          # Seo.svelte, QuizQuestion.svelte, ...
├── content/blog/ro/<topic>/<slug>.md        # blog posts (locale-first dirs)
├── app.css                                  # @import "tailwindcss" + @theme
└── app.html
messages/ro.json                             # Paraglide UI strings
project.inlang/settings.json
scripts/db.ts                                # SQL runner for acceptance checks
scripts/seed.ts                              # product seed
scripts/stripe-sync.ts                       # DB → Stripe mirror (skippable)
drizzle/                                     # generated migrations — never hand-edit
drizzle.config.ts
docker-compose.yml                           # local postgres service
vercel.json                                  # crons (from phase 03)
.env.example
```

## 4. Database schema (complete — implement in `src/lib/server/db/schema.ts`)

All `id` columns: `uuid primary key default gen_random_uuid()`. All timestamps
`timestamptz`. Emails stored lowercased + trimmed, always.

```
subscribers
  id, email text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending',       -- 'pending' | 'confirmed' | 'unsubscribed'
  cadence text NOT NULL DEFAULT 'weekly',       -- 'weekly' | 'monthly' | 'none'
  locale text NOT NULL DEFAULT 'ro',
  primary_profile_key text, primary_quiz_slug text,
  created_at NOT NULL DEFAULT now(), confirmed_at, unsubscribed_at

quiz_results
  id, subscriber_id uuid NOT NULL REFERENCES subscribers(id),
  quiz_slug text NOT NULL, quiz_version integer NOT NULL,
  profile_key text NOT NULL, answers jsonb NOT NULL, scores jsonb NOT NULL,
  created_at NOT NULL DEFAULT now()

email_sends                                     -- idempotency ledger + drip state machine
  id, subscriber_id uuid NULL REFERENCES subscribers(id),   -- null for order emails
  recipient_email text NOT NULL,
  email_key text NOT NULL,
  status text NOT NULL DEFAULT 'pending',       -- 'pending' | 'sent' | 'failed'
  resend_id text, error text, sent_at, created_at NOT NULL DEFAULT now(),
  UNIQUE (recipient_email, email_key)           -- THE idempotency guarantee

products                                        -- phase 04
  id, slug text NOT NULL UNIQUE, name text NOT NULL, description text NOT NULL,
  type text NOT NULL,                           -- 'physical' | 'digital'
  price_cents integer NOT NULL, currency text NOT NULL DEFAULT 'ron',
  image_url text, topic text NOT NULL,
  digital_file_key text,                        -- only for type='digital'
  stripe_product_id text, stripe_price_id text,
  active boolean NOT NULL DEFAULT true, created_at NOT NULL DEFAULT now()

orders                                          -- phase 04
  id, email text NOT NULL,
  stripe_session_id text NOT NULL UNIQUE,       -- webhook idempotency
  stripe_payment_intent text,
  status text NOT NULL DEFAULT 'paid',          -- 'paid' | 'fulfilled' | 'refunded'
  amount_total integer NOT NULL, currency text NOT NULL,
  shipping_address jsonb, created_at NOT NULL DEFAULT now()

order_items                                     -- phase 04
  id, order_id uuid NOT NULL REFERENCES orders(id),
  product_id uuid NOT NULL REFERENCES products(id),
  quantity integer NOT NULL, unit_amount integer NOT NULL

download_tokens                                 -- phase 04
  token text PRIMARY KEY,                       -- 32 random bytes, base64url
  order_item_id uuid NOT NULL REFERENCES order_items(id),
  expires_at NOT NULL, download_count integer NOT NULL DEFAULT 0,
  max_downloads integer NOT NULL DEFAULT 5, created_at NOT NULL DEFAULT now()
```

Deliberately **no** tables for quizzes/profiles/sequences/campaigns (repo config),
carts (client-side localStorage), or users/sessions (no login).

### email_key conventions (exact formats)

| Email | key |
|---|---|
| Quiz results | `results:<quizResultId>` |
| Drip step | `seq:<sequenceKey>:<step>` |
| Campaign | `campaign:<campaignId>` |
| Order confirmation | `order:<orderId>` |
| Digital delivery | `delivery:<orderId>` |

## 5. Shared type contracts (implement once in phase 02, never change shape after)

`src/lib/quiz/types.ts` (client-safe, no server imports):

```ts
export type Cadence = 'weekly' | 'monthly' | 'none';
export interface QuizOption { id: string; label: string; weights: Record<string, number>; }
export interface QuizQuestion { id: string; text: string; options: QuizOption[]; }
export interface QuizProfile {
  key: string;
  match: Partial<Record<string, { min?: number; max?: number }>>; // {} matches anything
  name: string;            // e.g. 'Bufnița dezorganizată'
  teaser: string;          // shown on results page
  fullAdvice: string[];    // paragraphs for the results email
  recommendedProductSlugs: string[];
  sequenceKey: string;     // key into sequences.ts
  defaultCadence: Cadence;
}
export interface QuizDefinition {
  slug: string; version: number; topic: string; locale: 'ro';
  title: string; description: string;   // landing-page copy
  dimensions: string[];
  questions: QuizQuestion[];
  profiles: QuizProfile[];  // ORDERED, first match wins; LAST entry must have match: {}
}
```

Scoring (`src/lib/server/quiz/score.ts`): sum option weights per dimension over
the submitted answers → `scores: Record<dimension, number>`; walk `profiles` in
order, return the first whose every `match` constraint is satisfied
(`min <= score <= max`, missing bound = unbounded). The catch-all guarantees a
result. **The server always re-scores from raw answers; never trust a
client-computed profile.**

### Tokens (`src/lib/server/tokens.ts`)

Stateless HMAC, no DB table:

```
token   = base64url(JSON{ sub: subjectId, p: purpose, exp: unixSeconds }) + '.' + base64url(hmacSha256(payload, EMAIL_TOKEN_SECRET))
purpose = 'confirm' | 'prefs' | 'unsub' | 'result'
```

`sub` is the **subject id** and its meaning depends on the purpose: the
subscriberId for `confirm`/`prefs`/`unsub`, the quizResultId for `result`.

`signToken(payload)` / `verifyToken(token, expectedPurpose)` → payload or null
(invalid sig, wrong purpose, expired). Use `node:crypto` `timingSafeEqual` for
comparison. Expiry: confirm 30 days, prefs/unsub 365 days, result 7 days.

### Idempotent email send (`src/lib/server/email/send.ts`)

The ONLY function that talks to Resend:

```ts
sendEmail({ emailKey, to, subscriberId?, subject, html, headers? }): Promise<'sent'|'skipped'|'failed'>
```

1. `INSERT INTO email_sends (recipient_email, email_key, subscriber_id, status='pending')`
   — on unique violation, return `'skipped'` (already sent or in flight).
2. If `EMAIL_DRYRUN === '1'` **or** `RESEND_API_KEY` is unset: log
   `[email dry-run] <emailKey> → <to>: <subject>` and update the row to
   `status='sent', resend_id='dry-run', sent_at=now()`. Return `'sent'`.
3. Otherwise call Resend; on success update `status='sent', resend_id, sent_at`;
   on failure update `status='failed', error` and return `'failed'`.

`send.ts` also exports a helper used by every marketing send (drip + campaigns
— NOT by transactional results/order/delivery emails):

```ts
export const marketingHeaders = (unsubUrl: string) => ({
  'List-Unsubscribe': `<mailto:unsubscribe@viatamaibuna.example>, <${unsubUrl}>`,
  'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
});
```

Every email footer: unsubscribe link + preferences link (tokenized).

### Cron auth (`src/lib/server/cron.ts`)

`requireCronAuth(request)`: if `Authorization` header ≠ `Bearer ${CRON_SECRET}`,
throw a 401 `error()`. Both cron endpoints call it first and must be safe to run
twice in a row (the email ledger guarantees this — return JSON
`{ sent, skipped, failed }` counts).

## 6. Conventions

- **Brand & section names (English, untranslated in every locale):** the site
  is **"Better Life"** and the topic/section display names are **"Better Sleep"**
  and **"Better Habits"** — never translate these to Romanian, even on the `ro`
  site. They are proper nouns. Topic *slugs* stay `somn`/`obiceiuri` (URLs,
  email_keys, content dirs all key off them — do not rename). All other copy is
  Romanian per the next rule.
- **Language:** all user-facing copy (pages, quiz content, emails, blog posts) in
  Romanian, with diacritics (ă â î ș ț). Code, comments, commit messages in English.
- **UI strings** (nav labels, buttons, form labels, validation messages) go in
  `messages/ro.json` and are used via Paraglide `m.<key>()`. Long-form content
  (quiz questions, blog posts, email bodies) stays in its content files — do NOT
  push paragraphs of content through Paraglide.
- **Money:** integer bani (cents) in DB; format with
  `new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' })`.
- **Dates:** `Intl.DateTimeFormat('ro-RO')`.
- **Svelte 5 only:** `$state`, `$derived`, `$effect`, `$props()`, `onclick`
  (not `on:click`). Snippets over slots.
- **Email HTML:** plain TS template functions returning strings; table-based
  layout, inline styles, max-width 600px, via shared `layout.ts` wrapper.
  No Svelte rendering in emails.
- **Validation:** every API endpoint validates its body shape and returns 400
  with `{ error: string }` on bad input. Email regex check + lowercase/trim.
- **Prerender** blog, topic hubs, quiz landings, home. Never prerender quiz
  play/results, shop, cart, checkout, email/*, api/*.

## 7. Environment variables (`.env.example` must list all of these)

```
DATABASE_URL=postgres://postgres:postgres@localhost:5433/betterlife
PUBLIC_SITE_URL=http://localhost:5173
EMAIL_TOKEN_SECRET=dev-secret-change-me-32-bytes-min
CRON_SECRET=dev-cron-secret
EMAIL_DRYRUN=1
EMAIL_FROM="Better Life <salut@viatamaibuna.example>"
RESEND_API_KEY=            # optional in dev; dry-run when empty
STRIPE_SECRET_KEY=         # optional in dev; Stripe steps skip when empty
STRIPE_WEBHOOK_SECRET=     # from `stripe listen` in dev
BLOB_READ_WRITE_TOKEN=     # optional; local fallback serves from static/digital/
```

Access via `$env/dynamic/private` for optional vars (so missing values don't
fail the build) and `$env/dynamic/public` for `PUBLIC_SITE_URL`.

## 8. Global acceptance criteria (every phase, before every commit)

1. `pnpm check` — zero errors.
2. `pnpm build` — succeeds.
3. `pnpm vitest run` — all tests pass (once tests exist, phase 02+).
4. All acceptance criteria of **previous** phases still pass (smoke level:
   the curl checks listed at the end of each phase spec).
5. No secrets committed; `.env` is gitignored; `.env.example` updated when a
   new variable is introduced.

## 9. Global DO-NOT-TOUCH list

- `specs/**` — read-only, except `specs/PROGRESS.md`.
- `drizzle/**` — generated by `drizzle-kit generate` only; never hand-edit or
  delete migrations once committed.
- `.env` — never create, read into logs, or commit. Only `.env.example` is touched.
- Schema columns/constraints from earlier phases — later phases may ADD tables
  via new migrations, never alter/drop existing columns.
- The `email_sends` unique constraint and email_key formats — every email
  feature builds on these; changing them breaks idempotency.
- `src/lib/quiz/types.ts` after phase 02 — additive changes only.
- Anything outside the repository root.
