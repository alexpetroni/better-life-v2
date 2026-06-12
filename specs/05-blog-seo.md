# Phase 05 — Blog (mdsvex) + SEO

**Goal:** a markdown blog in Romanian wired into the funnel — every post links
to a quiz and shows related products — plus sitewide SEO plumbing (prerender,
sitemap, robots, OG tags). After this phase the site is content-complete for a
soft launch.

## File-by-file changes

### mdsvex setup

| File | Content |
|---|---|
| `svelte.config.js` (edit) | `extensions: ['.svelte', '.md']`; `preprocess: [vitePreprocess(), mdsvex({ extensions: ['.md'] })]` (`npm i -D mdsvex`). No global layout — posts are rendered through the blog route's own layout component, keeping `.md` files pure content. |

### Content model

Posts live at `src/content/blog/ro/<topic>/<slug>.md`. Frontmatter contract:

```yaml
title: string            # required
description: string      # required, ≤160 chars, used for meta description
topic: somn | obiceiuri  # required, must exist in topics.ts
date: YYYY-MM-DD         # required
updated: YYYY-MM-DD      # optional
relatedProducts: [slug]  # optional, product slugs
quizCta: somn            # optional, quiz slug for the CTA banner
draft: false             # optional; true ⇒ excluded everywhere
```

| File | Content |
|---|---|
| `src/lib/blog.ts` | `import.meta.glob('/src/content/blog/ro/**/*.md')` twice: eager metadata-only glob for listings (`getAllPosts()` → sorted by date desc, drafts filtered; slug derived from filename) and lazy glob for `getPost(slug)` → `{ metadata, component }`. Validate frontmatter at load time — a post with missing required fields must fail the build with a clear error, not render broken. |
| `src/content/blog/ro/somn/*.md` — 3 posts | Genuine, useful Romanian articles ~600–900 words each, e.g.: `de-ce-te-trezesti-la-3-dimineata.md`, `cofeina-si-somnul-ghid-practic.md`, `rutina-de-seara-in-7-pasi.md` (the last with `relatedProducts: [masca-somn, ghid-seara-linistita]`, all with `quizCta: somn`). Proper headings, short paragraphs, no filler. |
| `src/content/blog/ro/obiceiuri/*.md` — 2 posts | e.g. `regula-celor-2-minute.md`, `de-ce-renunti-dupa-o-saptamana.md`, with `quizCta: obiceiuri` (quiz arrives in phase 06 — the CTA banner must render fine for a not-yet-existing quiz by hiding itself; guard in the component). |

### Routes & components

| File | Content |
|---|---|
| `src/routes/blog/+page.ts|.svelte` | `prerender = true`. Lists all posts (PostCard: title, description, topic chip, date ro-RO), newest first, optional topic filter via query/static sections. |
| `src/routes/blog/[slug]/+page.ts|.svelte` | `prerender = true`, `entries` from `getAllPosts()`. Renders the mdsvex component inside a `PostLayout` wrapper. Typography: install `@tailwindcss/typography` (dev dep), enable with `@plugin "@tailwindcss/typography";` in `app.css` (Tailwind v4 syntax — no config file), wrap the article in `prose` classes. Shows date, topic link; below content: related `ProductCard`s (loaded by slug) and `QuizCtaBanner`. `Seo.svelte` with article meta + OG. 404 unknown slug. |
| `src/lib/components/PostCard.svelte`, `QuizCtaBanner.svelte` | Banner: "Vrei un plan personalizat? Fă testul de <topic> →" linking to `/quiz/<slug>`; renders nothing if quiz slug not in registry. |
| `src/routes/topics/[topic]/…` (edit) | Add the topic's latest posts (from `getAllPosts`). The topic hub is now complete: tagline + quiz CTA + posts + products. |
| `src/routes/sitemap.xml/+server.ts` | **Served at runtime — do NOT prerender** (prerendering would require DB access during the Vercel build, which is not guaranteed). Enumerate: static pages (`/`, `/blog`, `/shop`), all topics, all quiz landings, all posts (from the glob), all active products (DB query at request time). Absolute URLs from `PUBLIC_SITE_URL`; set a `cache-control: max-age=3600` header. |
| `src/routes/robots.txt/+server.ts` | `prerender = true`. Allow all; `Sitemap: <PUBLIC_SITE_URL>/sitemap.xml`; `Disallow: /api/`, `/email/`, `/download/`, `/cart`, `/checkout`. |
| OG images | Static per-quiz/per-topic OG images in `static/og/`, **PNG or JPG only, 1200×630** — social platforms do not render SVG `og:image` (generate simple branded PNGs, e.g. solid brand color + title text via a small script or ImageMagick if available; a single shared default PNG is an acceptable fallback). Wire into `Seo.svelte` defaults. Dynamic OG generation is explicitly out of scope. |

## Acceptance criteria

```bash
pnpm check && pnpm vitest run && pnpm build
# prerender proof: build output contains the post pages
ls .svelte-kit/output/prerendered/pages | grep -i blog   # or inspect .vercel/output
pnpm dev &  sleep 5

curl -s http://localhost:5173/blog | grep -q "trezesti"             # listing shows post
curl -s http://localhost:5173/blog/rutina-de-seara-in-7-pasi | grep -q "Mască de somn"   # related product rendered
curl -s http://localhost:5173/blog/rutina-de-seara-in-7-pasi | grep -qi "testul"          # quiz CTA banner
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/blog/nu-exista              # 404
curl -s http://localhost:5173/sitemap.xml | grep -q "rutina-de-seara-in-7-pasi"
curl -s http://localhost:5173/sitemap.xml | grep -q "/quiz/somn"
curl -s http://localhost:5173/robots.txt | grep -q "Sitemap:"
curl -s http://localhost:5173/quiz/somn | grep -q 'og:image'        # OG tags on the funnel entry
curl -s http://localhost:5173/topics/somn | grep -qi "blog\|articol"  # posts on topic hub
kill %1
```

Draft check: set `draft: true` on one post temporarily → it disappears from
listing + sitemap (then revert).

Commit: `phase-05: blog and seo`.

## Do NOT touch in this phase

- No schema changes, no email changes, no quiz-engine changes.
- `src/content/blog/ro/` is the only content location — do not create a
  non-locale path; EU expansion later adds sibling locale dirs.
- Do not add a CMS, comments, RSS, or search — out of scope v1.
- Keep quiz landing pages lean — the funnel entry must stay fast; do not add
  heavy components to them while wiring SEO.
