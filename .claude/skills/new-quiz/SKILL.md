---
name: new-quiz
description: Scaffold a new topic quiz for Better Life — quiz definition, drip sequence, registry entry, and tests, with all spec invariants enforced. Use when the user asks to add/create a new quiz (e.g. "add a nutrition quiz", "creează un test despre stres").
---

# New quiz

Adds a complete quiz vertical to the site. The authoritative contracts live in
`specs/00-overview.md` §5 (`QuizDefinition`) and `specs/02-core-funnel.md` /
`specs/03-drip-emails.md` — re-read them if anything below seems ambiguous.
If the app code does not exist yet (specs-only repo), stop and say the quiz
should instead be added to the specs (phase 06 pattern).

## Inputs to gather (ask if not given)

- Topic + quiz slug (kebab-case Romanian, e.g. `stres`)
- 2 scoring dimensions (e.g. `['reactivitate', 'recuperare']`)
- 3–4 target profiles (personas) the quiz should distinguish
- 2 product slugs to recommend (must exist in `scripts/seed.ts`)

## Steps

1. **Quiz definition** — create `src/lib/content/quizzes/<slug>.ts`:
   `export const <slug>Quiz = {...} satisfies QuizDefinition` (types from
   `src/lib/quiz/types.ts`). Invariants (all are tested — violating them fails CI):
   - `locale: 'ro'`, `version: 1`, natural conversational Romanian WITH
     diacritics (ă â î ș ț); 8 questions, 3–4 options each
   - every option has `weights` covering only the declared `dimensions`
   - `profiles` is ORDERED, first-match-wins; the LAST profile must be the
     catch-all `match: {}`
   - calibrate `match` min/max against the actual attainable dimension score
     range — every profile must be reachable by some concrete answer set
   - each profile: Romanian `name`, 1–2 sentence `teaser`, `fullAdvice` of 4–6
     substantial paragraphs, `recommendedProductSlugs` (verify against seed),
     `sequenceKey: '<slug>-v1'`, `defaultCadence: 'weekly'`
2. **Register** it in `src/lib/content/quizzes/index.ts`.
3. **Drip sequence** — add `'<slug>-v1'` to `src/lib/server/email/sequences.ts`:
   5 steps, `dayOffset` `[1, 3, 6, 10, 14]`, Romanian subjects + 3–5 paragraph
   bodies that build on each other, rendered through `emailLayout`.
4. **Topic** — if the topic is new, add it to `src/lib/content/topics.ts`
   (with `quizSlug`) and create `static/og/<slug>.png` (1200×630 PNG — not SVG).
5. **Tests** — extend `src/lib/server/quiz/score.test.ts`: reachability of every
   new profile + the generic invariants (catch-all last, sequenceKey exists,
   product slugs exist).
6. **Content sanity** — questions must not be leading ("Cât de prost dormi?");
   advice must be genuinely useful, no filler.

## Verify

```bash
pnpm check && pnpm vitest run && pnpm build
pnpm dev &  sleep 5
curl -s http://localhost:5173/quiz/<slug> | grep -qi "<title fragment>"
# full funnel: POST /api/quiz/submit with a complete answer set → 200,
# subscriber + quiz_results + results email_sends row created (EMAIL_DRYRUN=1)
kill %1
```

Run the svelte MCP `svelte-autofixer` on any new/edited `.svelte` component.
