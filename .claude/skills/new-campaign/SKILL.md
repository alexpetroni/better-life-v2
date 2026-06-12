---
name: new-campaign
description: Add a periodic email campaign for Better Life subscribers — audience targeting, Romanian content, and a local cron verification. Use when the user asks to create/send a newsletter, campaign, or periodic email to subscribers.
---

# New campaign

The authoritative design lives in `specs/06-campaigns.md` (campaign shape,
cadence/drip-window predicates) and `specs/00-overview.md` §5 (send ledger).
If the campaigns infrastructure does not exist yet (specs-only repo), stop and
say so.

## How campaigns work (don't fight this)

- Campaigns are repo config in `src/lib/server/email/campaigns.ts`; the weekly
  cron (`/api/cron/campaigns`) sends each campaign **at most once per
  subscriber, ever** (ledger key `campaign:<id>`), to confirmed subscribers
  whose profile matches the audience, whose cadence is due, and who are past
  their drip window. A campaign is not a broadcast button — it's a dated piece
  of content that each eligible subscriber receives once.

## Inputs to gather (ask if not given)

- Audience: specific profile keys (check `quizzes/*.ts`) or `'all'`
- Subject + content brief (tips, featured products, article digest…)
- `activeFrom` date (default: today)

## Steps

1. Add an entry to the `campaigns` array in
   `src/lib/server/email/campaigns.ts`:
   - `id`: `'<topic>-<YYYY>-<MM>'` style, unique forever (it is the ledger key —
     NEVER reuse or rename a shipped id; that would resend or block sends)
   - `audience`: `{ profileKeys: [...] }` — verify every key exists in a quiz
     definition — or `'all'`
   - `activeFrom`: `'YYYY-MM-DD'` (compared lexicographically, no Date parsing)
   - `subject` + `bodyHtml` in Romanian with diacritics, rendered through
     `emailLayout`; all links absolute via `PUBLIC_SITE_URL`; product/article
     references must point at real slugs. Marketing headers and footer
     (unsubscribe/preferences) come from the cron + layout — do not hand-add.
2. If the content references blog posts or products, verify those slugs exist.
3. Extend `src/lib/server/email/campaigns.test.ts` if you changed any predicate
   logic (normally you only add data, not logic).

## Verify (locally, EMAIL_DRYRUN=1)

```bash
pnpm check && pnpm vitest run
docker compose up -d db && pnpm dev &  sleep 5
# seed one eligible subscriber (confirmed > drip window, matching profile, no recent campaign)
pnpm db:query "insert into subscribers (email,status,cadence,primary_profile_key,primary_quiz_slug,confirmed_at)
  values ('camp-test@example.com','confirmed','weekly','<profile-key>','<quiz-slug>', now() - interval '30 days')"
curl -s -H "Authorization: Bearer $CRON_SECRET" http://localhost:5173/api/cron/campaigns
pnpm db:query "select recipient_email,email_key,status from email_sends where email_key='campaign:<id>'"
# → one 'sent' row; a second cron run must add nothing
pnpm db:query "delete from subscribers where email='camp-test@example.com'"  # clean up (cascade or delete sends first)
kill %1
```

Read the dry-run log output and proof-read the rendered subject/body before
considering the campaign done.
