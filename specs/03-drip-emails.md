# Phase 03 — Welcome drip sequence

**Goal:** confirmed subscribers automatically receive a profile-tailored
sequence of 5 advice emails over 14 days, driven by a daily cron endpoint that
is idempotent and safe to re-run or overlap. Vercel Cron configuration ships in
this phase.

## Design recap (from overview)

The `email_sends` ledger IS the state machine: a drip step is "done" when a row
with `email_key = 'seq:<sequenceKey>:<step>'` exists for that recipient. The
cron computes due steps from an **anchor date** and attempts each; the unique
constraint silently absorbs duplicates. No cursor columns, no locks.

**Anchor date** = `GREATEST(confirmed_at, latest quiz_results.created_at for
that subscriber)`, NOT plain `confirmed_at`. Rationale: when a long-confirmed
subscriber retakes a different quiz, their profile (and thus `sequenceKey`)
switches; anchored to `confirmed_at` alone, ALL steps of the new sequence would
be instantly "due" and the subscriber would get 5 emails in one run. Anchoring
to the latest quiz result restarts the new sequence cleanly from the switch
date. (Re-taking the SAME quiz only delays remaining steps slightly; the ledger
keeps already-sent ones sent.)

## File-by-file changes

| File | Content |
|---|---|
| `src/lib/server/email/sequences.ts` | `export interface SequenceStep { step: number; dayOffset: number; subject: string; bodyHtml: (ctx: SequenceCtx) => string }` where `SequenceCtx = { profile: QuizProfile; prefsUrl: string; unsubUrl: string }`. `export const sequences: Record<string, SequenceStep[]>` with one sequence `'somn-v1'` of **5 steps**, dayOffsets `[1, 3, 6, 10, 14]` (days after confirmation). Each step: Romanian subject + 3–5 paragraph body of genuinely useful sleep advice that builds on the previous email (1: ritual de seară; 2: lumină și ecrane; 3: cofeină și alimentație; 4: dormitorul ideal; 5: recapitulare + ce urmează). Bodies render through `emailLayout`. Also export `maxOffsetDays(sequenceKey)` → largest `dayOffset` in the sequence, **0 for an unknown key**. |
| `src/lib/server/cron.ts` | `requireCronAuth(request)` per overview §5. |
| `src/routes/api/cron/drip/+server.ts` | GET (Vercel Cron sends GET). Steps: (1) `requireCronAuth`; (2) select subscribers where `status='confirmed'` and `confirmed_at is not null` and `primary_profile_key is not null`, joined with each one's latest `quiz_results.created_at`; (3) for each, resolve their quiz def + profile (by `primary_quiz_slug`/`primary_profile_key`) → `sequenceKey`; skip if the profile or sequence is not defined; (4) anchor = `GREATEST(confirmed_at, latest result created_at)` (no results row → `confirmed_at`); due steps = those with `anchor + dayOffset days <= now()`; (5) for each due step call `sendEmail` with `emailKey='seq:<sequenceKey>:<step.step>'`, `marketingHeaders(unsubUrl)` and footer links; (6) respond `{ processed, sent, skipped, failed }`. Subscribers who unsubscribe mid-sequence are excluded by the status filter — that's the whole suppression mechanism. Process sequentially or in small batches; this is a cron, not a hot path. |
| `vercel.json` | `{ "crons": [ { "path": "/api/cron/drip", "schedule": "0 7 * * *" } ] }` — drip only; phase 06 EDITS this file to add the campaigns cron when that endpoint exists. |
| `src/lib/server/email/sequences.test.ts` | Unit: sequence `'somn-v1'` has 5 steps, strictly increasing dayOffsets, unique step numbers; every step's bodyHtml renders non-empty HTML containing the unsub URL. |

`.env.example`: no new variables (CRON_SECRET exists since phase 01).

## Acceptance criteria

```bash
pnpm check && pnpm vitest run && pnpm build
docker compose up -d db && pnpm dev &  sleep 5

# seed one confirmed subscriber, backdated 7 days (steps 1,2,3 due; 4,5 not)
# (no quiz_results row is seeded, so the anchor falls back to confirmed_at;
#  the sequence-switch anchor case is tested in phase 06)
pnpm db:query "delete from email_sends"; pnpm db:query "delete from quiz_results"; pnpm db:query "delete from subscribers"
pnpm db:query "insert into subscribers (email,status,cadence,primary_profile_key,primary_quiz_slug,confirmed_at)
  values ('drip@example.com','confirmed','weekly','bufnita-dezorganizata','somn', now() - interval '7 days')"

# unauthorized → 401
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/api/cron/drip   # 401

# first run sends exactly the due steps
curl -s -H "Authorization: Bearer $CRON_SECRET" http://localhost:5173/api/cron/drip
# → {"processed":1,"sent":3,"skipped":0,"failed":0}
pnpm db:query "select email_key from email_sends order by email_key"
# → seq:somn-v1:1, seq:somn-v1:2, seq:somn-v1:3

# IDEMPOTENCY: second run sends nothing new
curl -s -H "Authorization: Bearer $CRON_SECRET" http://localhost:5173/api/cron/drip
# → {"processed":1,"sent":0,"skipped":3,"failed":0}
pnpm db:query "select count(*) from email_sends"    # still 3

# unsubscribed subscribers receive nothing
pnpm db:query "update subscribers set status='unsubscribed' where email='drip@example.com'"
curl -s -H "Authorization: Bearer $CRON_SECRET" http://localhost:5173/api/cron/drip
# → {"processed":0,...}; count(*) still 3

# pending (unconfirmed) subscribers receive nothing — re-check with status='pending'
kill %1
```

Also re-run the phase-02 smoke checks (quiz submit + confirm) to prove nothing
regressed.

Commit: `phase-03: drip emails`.

## Do NOT touch in this phase

- `src/lib/server/email/send.ts` — extend only if strictly needed for headers;
  do not change its ledger semantics or signature shape.
- No schema changes — the ledger design exists precisely so drip needs none.
- Quiz pages/content from phase 02 (except adding `messages/ro.json` strings).
- `api/cron/campaigns` endpoint and its `vercel.json` entry — phase 06 owns both.
