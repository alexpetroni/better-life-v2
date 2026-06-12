---
name: new-blog-post
description: Write and wire a new Romanian blog post for Better Life with the exact frontmatter contract, funnel CTAs, and verification. Use when the user asks to add/write a blog post or article (e.g. "scrie un articol despre cafea și somn").
---

# New blog post

The authoritative content model lives in `specs/05-blog-seo.md`. If the blog
infrastructure does not exist yet (specs-only repo), stop and say so.

## Inputs to gather (ask if not given)

- Topic (must exist in `src/lib/content/topics.ts`) and working title
- Angle/key takeaways, target length (default 600–900 words)
- Related product slugs and/or quiz CTA (defaults: the topic's quiz)

## Steps

1. Create `src/content/blog/ro/<topic>/<slug>.md` — slug is kebab-case
   Romanian, derived from the title (it becomes the URL: `/blog/<slug>`).
2. Frontmatter — exact contract, all required fields:

   ```yaml
   title: ...                 # required
   description: ...           # required, ≤160 chars (meta description)
   topic: somn                # required, must exist in topics.ts
   date: YYYY-MM-DD           # required, today
   relatedProducts: [slug]    # optional, must exist in scripts/seed.ts
   quizCta: somn              # optional, must exist in quizzes/index.ts
   draft: false
   ```

   Invalid/missing required frontmatter fails the build by design — do not
   weaken the validation in `src/lib/blog.ts` to make a post pass.
3. Body — Romanian with diacritics, conversational but substantive:
   proper `##` headings, short paragraphs, concrete actionable advice, no
   filler intros ("În lumea agitată de azi…") and no AI-isms. Every post is a
   funnel asset: it should naturally lead into the quiz CTA.
4. Set `draft: true` while iterating; flip to `false` when done.

## Verify

```bash
pnpm check && pnpm build        # frontmatter validation runs at build time
pnpm dev &  sleep 5
curl -s http://localhost:5173/blog | grep -q "<title fragment>"          # listing
curl -s http://localhost:5173/blog/<slug> | grep -qi "testul"            # quiz CTA banner
curl -s http://localhost:5173/sitemap.xml | grep -q "/blog/<slug>"
kill %1
```

If `relatedProducts` was set, also confirm the product cards render on the
post page (grep for the product name).
