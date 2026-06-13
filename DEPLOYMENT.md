# Deployment — Vercel + Neon

Step-by-step runbook to take this site from the GitHub repo to a live production
deployment. `LAUNCH-CHECKLIST.md` is the condensed tick-list; this is the
detailed "how". Work top-to-bottom — the order matters (DB before deploy,
deploy before Stripe webhook).

Prerequisites: the repo is on GitHub (`alexpetroni/better-life-v2`), and you can
run `pnpm` locally with the project installed (for the one-off migrate + seed).

---

## 1. Create the Neon database

1. Easiest path is through Vercel so the connection vars are injected for you —
   but you can also create it standalone at neon.tech. Either way:
2. Create a Neon **project in the Frankfurt (`eu-central-1`) region** — same
   region the app functions run in (`fra1`), and the right data-residency
   choice for a Romanian audience.
3. From the Neon dashboard, grab **two** connection strings (Neon shows both):
   - **Pooled** (host contains `-pooler`) → this becomes `DATABASE_URL`.
   - **Direct** (no `-pooler`) → this becomes `DIRECT_DATABASE_URL`.

Why two: the app runs in serverless functions and must use the pooled
(transaction-mode) endpoint; `prepare: false` is already set for it in
`src/lib/server/db/client.ts`. Migrations need a real session, which the pooler
can't give, so `drizzle-kit` uses the direct endpoint.

## 2. Migrate and seed the production database (one-off, from local)

Run these once against the new Neon DB. Inline env vars take precedence over
your local `.env`, so this targets prod without editing any file:

```bash
# apply schema migrations (uses the DIRECT endpoint)
DIRECT_DATABASE_URL='<neon-direct-url>' pnpm db:migrate

# seed the 4 products (uses the POOLED endpoint, like the app does)
DATABASE_URL='<neon-pooled-url>' pnpm tsx scripts/seed.ts

# sanity check
DATABASE_URL='<neon-pooled-url>' pnpm db:query "select slug from products order by slug"
# → curs-obiceiuri-mici, ghid-seara-linistita, jurnal-obiceiuri, masca-somn
```

## 3. Create the Vercel project

1. Vercel → **Add New… → Project** → import `alexpetroni/better-life-v2`.
2. Framework preset: **SvelteKit** (auto-detected). Build command, output, and
   install command are auto-detected from `pnpm-lock.yaml` + adapter — leave
   defaults.
3. **Functions region: Frankfurt (`fra1`)** — the adapter already pins this in
   `svelte.config.js`; if the project setting differs, set it to Frankfurt too.
4. Node version: **22.x** (Project → Settings → Node.js Version).
5. **Don't deploy yet** — set env vars first (next step), or the first build
   will deploy without them. (If it auto-deploys, that's fine; just redeploy
   after step 4.)

## 4. Environment variables (Production)

Project → Settings → Environment Variables. Set for the **Production**
environment (and Preview if you use preview deploys):

| Variable | Value | Notes |
|---|---|---|
| `DATABASE_URL` | Neon **pooled** string | app queries |
| `DIRECT_DATABASE_URL` | Neon **direct** string | migrations only |
| `PUBLIC_SITE_URL` | `https://<your-domain>` | no trailing slash; used in email links, OG tags, Stripe redirects |
| `EMAIL_TOKEN_SECRET` | 32+ random bytes | `openssl rand -base64 32` |
| `CRON_SECRET` | strong random string | Vercel auto-sends this as the cron `Authorization` header |
| `EMAIL_FROM` | `Better Life <hello@yourdomain>` | must be on the Resend-verified domain (§6) |
| `RESEND_API_KEY` | live Resend key | §6 |
| `STRIPE_SECRET_KEY` | `sk_live_…` | §7 |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` | from the webhook you create in §7 — added after first deploy |
| `BLOB_READ_WRITE_TOKEN` | from Vercel Blob | §5 |

**Do NOT set `EMAIL_DRYRUN`** in production — leaving it unset enables real
sends. (If set to `1`, emails are only logged.)

## 5. Vercel Blob for digital product files

1. Project → **Storage → Create → Blob**. This adds `BLOB_READ_WRITE_TOKEN`.
2. Upload the real digital goods, keyed by the `digital_file_key` values in
   `scripts/seed.ts` (e.g. `ghid-seara-linistita.pdf`, `curs-obiceiuri-mici.pdf`).
   The download route serves from Blob when the token is set, and falls back to
   `static/digital/` only in local dev.

## 6. First deploy

1. Trigger a deploy (push to `main`, or the Deploy button). With the DB migrated
   and env vars set, the site comes up healthy.
2. Smoke-check the deployment URL: `/`, `/blog`, `/shop`, `/quiz/somn` should
   all render; take the somn quiz through to the email step.

## 7. Resend (required before any real email)

1. Resend → add and **verify your sending domain** (SPF, DKIM, and a DMARC
   record). Email will not deliver reliably until this is green.
2. Set `EMAIL_FROM` to an address on that domain and `RESEND_API_KEY` to a live
   key; redeploy if you changed them.
3. Test: complete a quiz with your own address → you should receive the results
   email; click the confirm link and verify the footer unsubscribe/preferences
   links work.

## 8. Stripe (live mode)

1. Stripe → enable **Stripe Tax** and set the origin/registration for Romanian
   VAT (the checkout uses `automatic_tax`).
2. Stripe → Developers → **Webhooks → Add endpoint**:
   - URL: `https://<your-domain>/api/webhooks/stripe`
   - Event: `checkout.session.completed`
3. Copy the endpoint's **signing secret** into `STRIPE_WEBHOOK_SECRET`, set
   `STRIPE_SECRET_KEY` to the live key, and **redeploy** (env changes need a new
   deploy to take effect).
4. Test with a real card (or a live-mode test): buy one physical + one digital
   product → confirm an order row is created, the confirmation email sends, and
   the digital download link works and expires.

## 9. Domain

1. Project → **Domains** → add your domain, follow the DNS instructions.
2. Make sure `PUBLIC_SITE_URL` matches the final domain exactly (it is baked into
   email links, canonical/OG tags, and the sitemap), then redeploy.

## 10. Verify the cron jobs

`vercel.json` declares two crons: `/api/cron/drip` (daily 07:00 UTC) and
`/api/cron/campaigns` (Tuesdays 08:00 UTC). After deploy:

1. Project → **Cron Jobs** — both should be listed.
2. Trigger `drip` once from the dashboard and confirm a 200 (it returns
   `{ processed, sent, skipped, failed }`). With no due subscribers it's a
   no-op, which is correct.

> **Plan note:** Vercel **Hobby** runs cron jobs at most once per day with
> imprecise timing and caps you at 2 jobs. The schedules above fit, but for
> reliable timing in production use the **Pro** plan.

## 11. Post-launch follow-ups (don't block launch, but do them)

- Replace the OG share images in `static/og/*.png` — they were generated during
  the build and may still show the old brand text; they must read **Better Life**.
- Replace placeholder product images in `static/images/products/`.
- Have the `/privacy` and `/termeni` pages reviewed legally (still marked draft).
- Before paid social traffic, wire a CAPTCHA (e.g. Cloudflare Turnstile) into the
  quiz email-capture form — the honeypot + per-address send cap are not enough at
  scale.
- (Optional) enable a Neon database branch per Vercel preview deployment.

---

## Redeploy reminders

- Environment-variable changes only take effect on the **next deploy** —
  redeploy after editing any var.
- Schema changes: generate a migration locally (`pnpm db:generate`), commit it,
  then run `DIRECT_DATABASE_URL='<neon-direct>' pnpm db:migrate` against prod
  before (or as part of) the deploy that needs it.
