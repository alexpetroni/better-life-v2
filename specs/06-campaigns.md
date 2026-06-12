# Phase 06 — Periodic campaigns, second quiz, polish & launch readiness

**Goal:** the ongoing email loop (periodic profile-matched campaigns honoring
subscriber cadence), the second quiz (obiceiuri) proving the engine is generic,
funnel analytics, and a production cutover checklist. After this phase the
product is feature-complete per v1 scope.

## File-by-file changes

### Campaigns

| File | Content |
|---|---|
| `src/lib/server/email/campaigns.ts` | `export interface Campaign { id: string; audience: { profileKeys: string[] } \| 'all'; subject: string; bodyHtml: (ctx) => string; activeFrom: string /* 'YYYY-MM-DD', compared lexicographically against new Date().toISOString().slice(0,10) — no Date parsing */ }` and `export const campaigns: Campaign[]` with **2 seed campaigns** in Romanian: `somn-2026-06` (audience: all somn profile keys; tips + featured products masca-somn/ghid) and `general-2026-06` (audience `'all'`; "cele mai citite articole" digest linking 3 blog posts). Bodies through `emailLayout`, product/article links absolute via `PUBLIC_SITE_URL`. |
| `src/routes/api/cron/campaigns/+server.ts` | GET, `requireCronAuth`. For each campaign with `activeFrom <= today`: select subscribers `status='confirmed'` AND audience match (`primary_profile_key` in profileKeys, or all) AND `cadence != 'none'` AND **cadence due** AND **out of drip window**. Cadence due: no `email_sends` row with `email_key like 'campaign:%'` and `sent_at > now() - interval '6 days'` (weekly) / `'27 days'` (monthly) for that recipient. Drip window: `confirmed_at + maxOffsetDays(sequenceKey) + 1 day < now()`. Send with `emailKey='campaign:<campaignId>'` + marketing headers. **At most one campaign email per subscriber per run** (process campaigns in order, skip subscribers already sent this run). Return `{ sent, skipped, failed }` per campaign. |
| `src/lib/server/email/campaigns.test.ts` | Unit-test the cadence-due/drip-window predicates (extract them as pure functions taking dates — don't test through the HTTP layer). |
| `vercel.json` (edit) | Add the campaigns cron alongside the existing drip entry: `{ "path": "/api/cron/campaigns", "schedule": "0 8 * * 2" }`. |

### Second quiz — obiceiuri

| File | Content |
|---|---|
| `src/lib/content/quizzes/obiceiuri.ts` | `satisfies QuizDefinition`, slug `obiceiuri`, version 1, dimensions `['consecventa','mediu']`, 8 Romanian questions about habit formation, 4 profiles ending in a catch-all (e.g. `incepator-entuziast`, `perfectionist-blocat`, `constructor-constant`, catch-all `explorator`), each with fullAdvice, `recommendedProductSlugs: ['jurnal-obiceiuri','curs-obiceiuri-mici']`, `sequenceKey: 'obiceiuri-v1'`. Register in `quizzes/index.ts`. |
| `src/lib/server/email/sequences.ts` (edit) | Add sequence `'obiceiuri-v1'`: 5 steps, same offsets, habit-formation advice arc. |
| `src/lib/server/quiz/score.test.ts` (edit) | Add reachability tests for the 4 obiceiuri profiles. Add a generic invariant test over `allQuizzes`: last profile is catch-all, every `sequenceKey` exists in `sequences`, every `recommendedProductSlug` exists in the seed slugs list. |

No other quiz code should change — if the engine needs edits to support the
second quiz, that's a phase-02 bug; fix minimally and note it in PROGRESS.md.

### Polish & launch readiness

| File | Content |
|---|---|
| Analytics | `npm i @vercel/analytics`; inject in `+layout.svelte` (`dev` guard). Cookieless — no consent banner needed. Fire custom events (`quiz_started`, `quiz_completed`, `email_submitted`, `checkout_started`) via `track()` at the corresponding funnel points. |
| `src/routes/privacy/+page.svelte` (edit) + `terms/+page.svelte` (new) | **Expand** the minimal phase-02 privacy page into a full plain-Romanian policy (what is collected: email, quiz answers, orders; legal basis; retention; unsubscribe; contact) and add minimal terms. Prerendered; linked from footer and the quiz consent line. **Keep the visible "draft — needs legal review" note.** |
| `README.md` | Project overview, local dev quickstart (compose, seed, env), script reference, deployment steps. |
| `LAUNCH-CHECKLIST.md` | Manual cutover steps (NOT executable by the agent): Vercel project + env vars (live values for all of overview §7, `EMAIL_DRYRUN` unset); Neon database + `db:migrate` + `seed`; Resend domain verification (SPF/DKIM/DMARC) before any real sending; Stripe live keys + webhook endpoint `https://<domain>/api/webhooks/stripe` (event `checkout.session.completed`) + Stripe Tax: configure origin address and RO VAT registration in the dashboard, verify `automatic_tax` sessions succeed; optionally run `stripe-sync` for dashboard reporting; **wire Cloudflare Turnstile (or equivalent CAPTCHA) into the quiz email-capture form before sending paid social traffic — the honeypot + send-cap alone are not enough at scale**; upload real digital files to Vercel Blob; verify crons fire in Vercel dashboard; replace placeholder product images and OG PNGs; legal review of privacy/terms. |

## Acceptance criteria

```bash
pnpm check && pnpm vitest run && pnpm build
docker compose up -d db && pnpm dev &  sleep 5

# second quiz end-to-end (same checks as phase 02, new slug)
curl -s http://localhost:5173/quiz/obiceiuri | grep -qi "obiceiuri"
# POST /api/quiz/submit with a full obiceiuri answer set → 200, results email row created

# campaigns: reset, seed two confirmed subscribers — one past drip window, one inside it
pnpm db:query "delete from email_sends"; pnpm db:query "delete from quiz_results"; pnpm db:query "delete from subscribers"
pnpm db:query "insert into subscribers (email,status,cadence,primary_profile_key,primary_quiz_slug,confirmed_at) values
  ('vechi@example.com','confirmed','weekly','bufnita-dezorganizata','somn', now() - interval '30 days'),
  ('nou@example.com','confirmed','weekly','bufnita-dezorganizata','somn', now() - interval '2 days')"
curl -s -H "Authorization: Bearer $CRON_SECRET" http://localhost:5173/api/cron/campaigns
pnpm db:query "select recipient_email,email_key from email_sends where email_key like 'campaign:%'"
# → exactly ONE row, for vechi@example.com (nou@ is inside the drip window)

# idempotency + cadence: immediate second run sends nothing
curl -s -H "Authorization: Bearer $CRON_SECRET" http://localhost:5173/api/cron/campaigns
pnpm db:query "select count(*) from email_sends where email_key like 'campaign:%'"   # still 1

# cadence 'none' is honored
pnpm db:query "update subscribers set cadence='none'"
# wipe campaign sends, re-run cron → 0 sent

# drip anchor on sequence switch (the phase-03 anchor rule, now testable with 2 quizzes):
# confirmed 30 days ago but retook the obiceiuri quiz 2 days ago → ONLY step 1 of
# obiceiuri-v1 is due (anchor = quiz_result.created_at, not confirmed_at)
pnpm db:query "delete from email_sends"; pnpm db:query "delete from quiz_results"; pnpm db:query "delete from subscribers"
pnpm db:query "insert into subscribers (email,status,cadence,primary_profile_key,primary_quiz_slug,confirmed_at)
  values ('switch@example.com','confirmed','weekly','incepator-entuziast','obiceiuri', now() - interval '30 days')"
pnpm db:query "insert into quiz_results (subscriber_id,quiz_slug,quiz_version,profile_key,answers,scores,created_at)
  select id,'obiceiuri',1,'incepator-entuziast','{}'::jsonb,'{}'::jsonb, now() - interval '2 days' from subscribers where email='switch@example.com'"
curl -s -H "Authorization: Bearer $CRON_SECRET" http://localhost:5173/api/cron/drip
pnpm db:query "select email_key from email_sends"
# → exactly one row: seq:obiceiuri-v1:1 (NOT five rows)

# final whole-site smoke
for p in / /blog /shop /quiz/somn /quiz/obiceiuri /topics/somn /privacy /robots.txt /sitemap.xml; do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173$p); echo "$p $code"; done
# all 200
kill %1
```

Then run the **whole-run definition of done** from `START.md` §5 (clean
install → migrate → seed → check → test → build).

Commit: `phase-06: campaigns and launch polish`.

## Do NOT touch in this phase

- Drip cron logic from phase 03 (the anchor rule is final); `vercel.json` may
  ONLY gain the campaigns cron entry.
- Stripe/checkout/webhook code from phase 04.
- `send.ts` ledger semantics; `email_key` formats; token formats.
- Do not execute anything in `LAUNCH-CHECKLIST.md` — those are manual,
  human-owned, production-credential steps.
- Do not unset `EMAIL_DRYRUN` or add real API keys to any file.
