# Phase 02 — Core funnel: quiz → email capture → results email → opt-in

**Goal:** the business-critical path works end-to-end: a visitor lands on
`/quiz/somn`, answers the questions client-side, leaves their email, the server
re-scores, stores the result, sends the results email (dry-run), and the
subscriber can confirm (double opt-in), manage preferences, and unsubscribe via
tokenized links. This is the most important phase — quality over speed.

## File-by-file changes

### Types, content, scoring

| File | Content |
|---|---|
| `src/lib/quiz/types.ts` | Exactly the contracts in overview §5 (`Cadence`, `QuizOption`, `QuizQuestion`, `QuizProfile`, `QuizDefinition`). Client-safe: no server imports. |
| `src/lib/content/quizzes/somn.ts` | `export const somnQuiz = {...} satisfies QuizDefinition`. Romanian sleep quiz: slug `somn`, version 1, topic `somn`, dimensions `['cronotip','igiena']`. **8 questions**, 3–4 options each, natural conversational Romanian (e.g. "La ce oră adormi de obicei în timpul săptămânii?"). Weights: cronotip questions score higher = night owl; igiena questions score higher = better sleep hygiene. **4 profiles**, in order: `bufnita-dezorganizata` (cronotip min high, igiena max low), `bufnita-disciplinata` (cronotip high, igiena high), `matinal-suprasolicitat` (cronotip low, igiena low), catch-all `dormitor-echilibrat` (`match: {}`). Each profile: Romanian name ("Bufnița dezorganizată", …), 1–2 sentence teaser, `fullAdvice` of 4–6 substantial paragraphs, `recommendedProductSlugs` `['masca-somn','ghid-seara-linistita']` (products exist from phase 04 — render gracefully when missing), `sequenceKey` `'somn-v1'`, `defaultCadence: 'weekly'`. Calibrate match thresholds against the actual max attainable dimension scores — write a test proving every profile is reachable. |
| `src/lib/content/quizzes/index.ts` | `export const quizzes: Record<string, QuizDefinition>`; `getQuiz(slug)` → def or undefined; `export const allQuizzes`. |
| `src/lib/server/quiz/score.ts` | `scoreQuiz(quiz, answers: Record<questionId, optionId>)` → `{ scores, profile }` per overview §5. Throw a descriptive error on unknown question/option ids or missing answers (endpoint maps it to 400). |
| `src/lib/server/quiz/score.test.ts` | Unit tests: (1) each of the 4 somn profiles is reachable by some concrete answer set; (2) catch-all fires when nothing else matches; (3) invalid option id throws; (4) first-match-wins ordering respected. |

### Tokens

| File | Content |
|---|---|
| `src/lib/server/tokens.ts` | `signToken({sub,p,exp})`, `verifyToken(token, purpose)` per overview §5. Helpers: `confirmUrl(subscriberId)`, `prefsUrl(subscriberId)`, `unsubUrl(subscriberId)`, `resultUrl(resultId)` building absolute URLs from `PUBLIC_SITE_URL`. |
| `src/lib/server/tokens.test.ts` | round-trip valid; tampered payload rejected; wrong purpose rejected; expired rejected. |

### Email

| File | Content |
|---|---|
| `src/lib/server/email/send.ts` | `sendEmail(...)` exactly per overview §5 (insert-first ledger, dry-run branch, Resend call via `fetch` to `https://api.resend.com/emails` — no SDK needed). |
| `src/lib/server/email/templates/layout.ts` | `emailLayout({ title, bodyHtml, footerLinks: { prefs, unsub } })` → full HTML doc: 600px table, brand-green header with site name, body slot, footer in Romanian ("Primești acest email pentru că ai completat un test pe Viață Mai Bună.") with Preferințe / Dezabonare links. |
| `src/lib/server/email/templates/results.ts` | `resultsEmail({ quiz, profile, confirmUrl, prefsUrl, unsubUrl })` → `{ subject, html }`. Subject: `Rezultatul tău: <profile.name>`. Body: greeting, profile name + teaser, ALL `fullAdvice` paragraphs, then a prominent CTA box: "Vrei planul tău gratuit de 2 săptămâni? Confirmă adresa de email" → button to `confirmUrl`. This single email doubles as results delivery + opt-in request. |

### API endpoint

`src/routes/api/quiz/submit/+server.ts` — POST only. Body
`{ quizSlug, answers, email, website }`. Steps:

1. **Honeypot:** `website` is a hidden form field real users never fill. If
   non-empty → respond 200 `{ resultToken: null }` with NO side effects
   (no subscriber, no result, no email).
2. Validate: known quiz; email matches `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/` and
   length ≤ 254 (lowercase + trim before validating and before any DB use);
   answers shape. 400 with `{ error }` otherwise.
3. `scoreQuiz` (server-side re-score).
4. Upsert subscriber by lowercased email (`onConflictDoUpdate` on `email`):
   new → `status='pending'`; existing keeps its status (never resurrect an
   `unsubscribed` subscriber to pending). Always update `primary_profile_key`,
   `primary_quiz_slug`, and — only when the subscriber has not customised —
   set `cadence` to the profile's `defaultCadence`.
5. Insert `quiz_results` row (answers + scores jsonb).
6. **Send cap (abuse guard):** count `email_sends` rows for this recipient with
   `email_key like 'results:%'` and `created_at > now() - interval '1 day'`.
   If ≥ 3 → store the result but skip the send. Likewise skip the send for
   `unsubscribed` subscribers. Otherwise
   `sendEmail({ emailKey: 'results:<resultId>', ... })` with the results template.
7. Return `{ resultToken }` (purpose `result`, sub = resultId, 7-day expiry).

### Quiz pages

| File | Content |
|---|---|
| `src/routes/quiz/[slug]/+page.server.ts|.svelte` | Landing. `entries` from `allQuizzes` + `prerender = true`. 404 unknown slug. Conversion-focused: quiz title, description, question count, ~time ("2 minute"), social-proof line, big CTA → `play`. Use `Seo.svelte` with quiz title/description. **This is the social-media entry point — keep it fast and minimal.** |
| `src/routes/quiz/[slug]/play/+page.ts|.svelte` | `csr = true, prerender = false`; load returns the quiz def (it's public data). Runes state: `let current = $state(0)`, `let answers = $state<Record<string,string>>({})`, `$derived` progress %. One question per screen, progress bar, back button. After last question → email capture screen: explanation ("Îți trimitem rezultatul complet și sfaturi personalizate pe email"), email input, GDPR consent line with link to privacy page, submit → POST `/api/quiz/submit` → on success `goto(\`/quiz/${slug}/results?t=${resultToken}\`)`. Handle 400/500 with an inline Romanian error message. |
| `src/routes/quiz/[slug]/results/+page.server.ts|.svelte` | Verifies `t` (purpose `result`); loads the quiz_result row; resolves profile from the quiz def **by stored `quiz_version`/`profile_key`** (if version unknown, fall back to current def). Renders: profile name + teaser, "Rezultatul complet și planul tău sunt pe drum — verifică-ți inboxul", recommended products (graceful empty state until phase 04), share-back CTA linking to the landing page. Invalid/expired token → friendly message + link to retake the quiz. |
| `src/lib/components/QuizQuestion.svelte`, `ProgressBar.svelte`, `EmailCaptureForm.svelte` | Extracted presentation components used by play page. `EmailCaptureForm` includes the hidden honeypot input `website` (visually hidden via CSS, `tabindex="-1"`, `autocomplete="off"`); when submit returns `resultToken: null` the form shows the same "Verifică-ți inboxul" confirmation state instead of redirecting. |
| `src/routes/privacy/+page.svelte` | Minimal Romanian privacy page (prerendered): what is collected (email, quiz answers, orders), why, how to unsubscribe, contact. Marked "draft — needs legal review". Linked from the quiz consent line AND the footer (replace the phase-01 placeholder link). Expanded in phase 06. |

### Token-link pages (no login account management)

| File | Content |
|---|---|
| `src/routes/email/confirm/[token]/+page.server.ts|.svelte` | Verify (purpose `confirm`). Valid → set `status='confirmed'`, `confirmed_at=now()` **only if currently `pending`** (already-confirmed stays untouched so the drip clock never resets; `unsubscribed` is NOT resurrected — show "ești dezabonat" message instead). Page: "Mulțumim! Adresa ta este confirmată — primul email din plan sosește în curând." |
| `src/routes/email/preferences/[token]/+page.server.ts|.svelte` | Verify (purpose `prefs`). Form (SvelteKit form action, same token in action URL): radio cadence — Săptămânal / Lunar / Deloc (`weekly|monthly|none`) — current value preselected; save → update subscriber, show confirmation. |
| `src/routes/email/unsubscribe/[token]/+page.server.ts|+server.ts|.svelte` | GET (page load) verifies and immediately sets `status='unsubscribed'`, `unsubscribed_at=now()` — one-click, no extra confirm step. Also accept POST on the same URL (RFC 8058 one-click for the `List-Unsubscribe-Post` header). Page: "Te-ai dezabonat. Ne pare rău să te vedem plecând." + re-subscribe hint (retake a quiz). |

Add any new UI strings to `messages/ro.json`.

## Acceptance criteria

```bash
pnpm check && pnpm vitest run && pnpm build        # all green
pnpm dev &  sleep 5

# landing prerenders & renders
curl -s http://localhost:5173/quiz/somn | grep -qi "somn"

# privacy page exists and is linked from the capture form's consent line
curl -s http://localhost:5173/privacy | grep -qi "date"

# submit happy path (use a valid full answer set for the somn quiz)
curl -s -X POST http://localhost:5173/api/quiz/submit \
  -H 'content-type: application/json' \
  -d '{"quizSlug":"somn","email":"Test@Example.com","answers":{...all 8...}}'
# → 200 with {"resultToken":"..."}

pnpm db:query "select email,status,cadence,primary_profile_key from subscribers"
# → 1 row, email lowercased 'test@example.com', status 'pending', cadence 'weekly', profile key set

pnpm db:query "select email_key,status,resend_id from email_sends"
# → 1 row 'results:<id>', status 'sent', resend_id 'dry-run'

# idempotency: identical resubmit creates a SECOND quiz_result but subscriber count stays 1
pnpm db:query "select count(*) from subscribers"     # 1
pnpm db:query "select count(*) from quiz_results"    # 2 after resubmit

# send cap: submit twice more (4 total) → 4 results, but only 3 results emails
pnpm db:query "select count(*) from quiz_results"                                  # 4
pnpm db:query "select count(*) from email_sends where email_key like 'results:%'"  # 3

# honeypot: filled "website" field → 200 but NO new subscriber/result/send
curl -s -X POST http://localhost:5173/api/quiz/submit \
  -H 'content-type: application/json' \
  -d '{"quizSlug":"somn","email":"bot@example.com","website":"http://spam","answers":{...}}'
pnpm db:query "select count(*) from subscribers"     # still 1

# bad input
curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:5173/api/quiz/submit \
  -H 'content-type: application/json' -d '{"quizSlug":"somn","email":"not-an-email","answers":{}}'  # 400

# confirm flow: print a confirm URL from the dev console or generate via a one-off
# `pnpm tsx -e` snippet using signToken, then:
curl -s "http://localhost:5173/email/confirm/<token>" | grep -qi "confirmat"
pnpm db:query "select status,confirmed_at from subscribers"   # 'confirmed', timestamp set
# second visit: status unchanged, confirmed_at NOT updated

# unsubscribe (GET page)
curl -s "http://localhost:5173/email/unsubscribe/<token>" | grep -qi "dezabonat"
pnpm db:query "select status from subscribers"                # 'unsubscribed'

# RFC 8058 one-click unsubscribe (POST path used by email clients)
# reset status to 'confirmed' first, then:
curl -s -o /dev/null -w "%{http_code}" -X POST "http://localhost:5173/email/unsubscribe/<token>" \
  -H 'content-type: application/x-www-form-urlencoded' --data 'List-Unsubscribe=One-Click'   # 200
pnpm db:query "select status from subscribers"                # 'unsubscribed' again

# tampered token → no state change, friendly page
curl -s -o /dev/null -w "%{http_code}" "http://localhost:5173/email/confirm/AAAA.BBBB"  # 200 page or 4xx, but DB untouched
kill %1
```

**[resend-live]** If `RESEND_API_KEY` is set and `EMAIL_DRYRUN` unset: run one
real submit to your own test address and verify delivery + working footer links.

Commit: `phase-02: core funnel`.

## Do NOT touch in this phase

- `src/lib/server/email/sequences.ts` / cron endpoints — phase 03.
- Commerce schema/pages — phase 04. (Results page renders product slugs
  gracefully without the products table.)
- mdsvex/blog — phase 05.
- The phase-01 migration files; this phase should need **no** schema change.
- `src/lib/quiz/types.ts` is frozen (additive-only) after this phase.
