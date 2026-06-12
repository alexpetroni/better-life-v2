# Launch Checklist

**DO NOT EXECUTE — manual, human-owned, production-credential steps.**

Work through each section top-to-bottom before opening the site to traffic.

---

## 1. Vercel project setup

- [ ] Create a new Vercel project linked to the repository
- [ ] Set all environment variables (production values):
  - `DATABASE_URL` — Neon connection string (pooled)
  - `TOKEN_SECRET` — strong random 32+ char secret
  - `CRON_SECRET` — strong random secret (also set in Vercel Dashboard → Cron)
  - `RESEND_API_KEY` — live Resend API key
  - `STRIPE_SECRET_KEY` — live Stripe secret key (`sk_live_...`)
  - `STRIPE_WEBHOOK_SECRET` — from Stripe webhook endpoint (see §4)
  - `PUBLIC_SITE_URL` — `https://viatamaibuna.ro` (no trailing slash)
  - **Do NOT set** `EMAIL_DRYRUN` in production (leave unset to enable real sends)
- [ ] Verify `BLOB_READ_WRITE_TOKEN` is set if using Vercel Blob for digital files

## 2. Neon database

- [ ] Create a Neon project in the EU (Frankfurt) region
- [ ] Copy the pooled connection string to `DATABASE_URL`
- [ ] Run migrations: `pnpm db:migrate` (from local with prod `DATABASE_URL`)
- [ ] Run seed: `pnpm db:seed` (inserts 4 products)
- [ ] Verify tables exist via Neon console or `pnpm db:studio`

## 3. Resend email

- [ ] Add and verify your sending domain in Resend dashboard
- [ ] Configure SPF, DKIM, and DMARC DNS records as instructed by Resend
- [ ] Wait for DNS propagation and green status in Resend
- [ ] Send a test email from Resend dashboard to confirm delivery
- [ ] Verify `FROM_EMAIL` in `src/lib/server/email/send.ts` matches your verified domain
- [ ] Do NOT send any campaign or drip to real users until SPF/DKIM/DMARC are verified

## 4. Stripe configuration

- [ ] Switch to live mode in Stripe dashboard
- [ ] Copy live secret key to `STRIPE_SECRET_KEY`
- [ ] Create a webhook endpoint in Stripe: `https://viatamaibuna.ro/api/webhooks/stripe`
  - Event: `checkout.session.completed`
- [ ] Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`
- [ ] Enable Stripe Tax:
  - Set your business origin address in Tax Settings
  - Add Romania VAT registration number
  - Verify `automatic_tax: { enabled: true }` sessions succeed in test mode first
- [ ] Optionally run `stripe-sync` script to populate `stripe_product_id`/`stripe_price_id` for dashboard reporting (not required for checkout — we use inline `price_data`)
- [ ] Test a real checkout end-to-end with a live card in test mode before switching to live keys

## 5. Digital product files

- [ ] Upload actual PDF/digital files to Vercel Blob storage
- [ ] Update `digital_file_key` in the `products` table (via `pnpm db:seed` or direct SQL) to match blob keys
- [ ] Test a download link end-to-end after purchase

## 6. Content and assets

- [ ] Replace placeholder product images (`/images/products/*.jpg`) with final photography
- [ ] Replace Open Graph images (`/og/*.png`) with final branded designs (1200×630)
- [ ] Update placeholder email address `salut@viatamaibuna.example` → real address in:
  - `src/routes/privacy/+page.svelte`
  - `src/routes/termeni/+page.svelte`
  - `src/lib/server/email/send.ts` (FROM_EMAIL)
- [ ] Review all `example.com` domains in email templates and replace with real domain

## 7. Legal review

- [ ] Get `src/routes/privacy/+page.svelte` reviewed by a GDPR-aware lawyer
- [ ] Get `src/routes/termeni/+page.svelte` reviewed (right of withdrawal, VAT, etc.)
- [ ] Remove the "Draft" warning banners from both pages after legal sign-off

## 8. Bot protection (before paid traffic)

- [ ] Wire Cloudflare Turnstile (or equivalent CAPTCHA) into the quiz email-capture form
  (`src/lib/components/EmailCaptureForm.svelte`) **before sending paid social traffic**
  — the honeypot + send-cap alone are not enough at scale
- [ ] Consider rate limiting `/api/quiz/submit` at the Vercel edge

## 9. Vercel cron jobs

- [ ] Verify crons appear in Vercel Dashboard → Settings → Cron Jobs after deploy:
  - `/api/cron/drip` — daily 07:00 UTC
  - `/api/cron/campaigns` — Tuesdays 08:00 UTC
- [ ] Manually trigger each cron once via `curl -H "Authorization: Bearer $CRON_SECRET"` to confirm 200 response
- [ ] Check Vercel Cron logs after first automatic run

## 10. Pre-launch smoke test

```bash
for p in / /blog /shop /quiz/somn /quiz/obiceiuri /topics/somn /privacy /termeni /robots.txt /sitemap.xml; do
  code=$(curl -s -o /dev/null -w "%{http_code}" https://viatamaibuna.ro$p)
  echo "$p $code"
done
# all should be 200
```

- [ ] All pages return 200
- [ ] Sitemap contains blog posts, products, quizzes
- [ ] robots.txt disallows /api/, /download/, /cart

## 11. Go live

- [ ] Point `viatamaibuna.ro` DNS to Vercel (add domain in Vercel project settings)
- [ ] Verify SSL certificate is issued
- [ ] Remove any `noindex` meta tags or staging-only redirects
- [ ] Announce!
