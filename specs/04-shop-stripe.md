# Phase 04 — Shop: catalog, cart, Stripe Checkout, fulfillment

**Goal:** a working shop in RON for the Romanian market: product catalog in
Postgres (mirrored to Stripe by a script), localStorage cart, Stripe Checkout
with shipping for physical goods and Stripe Tax, webhook-driven order creation,
order-confirmation email, and digital delivery via expiring download links.
Everything except the live Stripe redirect must be verifiable offline.

## File-by-file changes

### Schema + seed (new migration)

| File | Content |
|---|---|
| `src/lib/server/db/schema.ts` | ADD tables `products`, `orders`, `order_items`, `download_tokens` exactly per overview §4. Do not alter existing tables. `pnpm db:generate && pnpm db:migrate`. |
| `scripts/seed.ts` | Idempotent upsert (by slug) of 4 Romanian products: `masca-somn` (physical, "Mască de somn premium", 8900 bani, topic somn), `ghid-seara-linistita` (digital, "Ghid: Seara liniștită — rutina de somn în 14 zile", 4900, `digital_file_key: 'ghid-seara-linistita.pdf'`), `jurnal-obiceiuri` (physical, "Jurnalul obiceiurilor — 90 de zile", 7500, topic obiceiuri), `curs-obiceiuri-mici` (digital, 9900, topic obiceiuri). Real descriptions (2–3 sentences each), `image_url` pointing to `/images/products/<slug>.jpg` (generate simple SVG/placeholder images into `static/images/products/`). |
| `static/digital/ghid-seara-linistita.pdf` (+ one for the curs) | Placeholder PDFs (a one-page generated PDF or even a text file renamed; content irrelevant) so local digital delivery works without Vercel Blob. |
| `src/lib/content/shipping.ts` | `export interface ShippingTier { label: string; priceCents: number }`; `export const standardShipping: ShippingTier` ("Curier standard (24–48h)", 1500); `export const FREE_SHIPPING_THRESHOLD_CENTS = 20000`. The checkout endpoint maps tiers to Stripe `shipping_rate_data` objects (`type:'fixed_amount'`, `fixed_amount:{amount,currency:'ron'}`, `display_name`) and offers a 0-cost "Livrare gratuită" option **instead of** the paid tier when the cart total ≥ threshold. |

### Stripe server pieces

| File | Content |
|---|---|
| `src/lib/server/stripe.ts` | Lazy-initialized Stripe client (`npm i stripe`); export `isStripeConfigured()` (key non-empty). API version pinned. |
| `scripts/stripe-sync.ts` | **[stripe-live], OPTIONAL** dashboard mirror only — checkout does NOT depend on it. For each active product: create/update Stripe Product (and a reference Price), write back `stripe_product_id`/`stripe_price_id` for reporting. Exits with a clear message and code 0 when `!isStripeConfigured()`. |
| `src/routes/api/checkout/+server.ts` | POST `{ items: [{ productId, quantity }] }`. Validate: non-empty, **≤ 8 distinct products** (400 otherwise — keeps `metadata.items` under Stripe's 500-char value limit), quantities 1–10, all products exist + active. 503 `{error}` when `!isStripeConfigured()`. Build Checkout Session — **single pricing path, always inline `price_data` from DB** (never `stripe_price_id`, no top-level `currency` param): `mode:'payment'`, `locale:'ro'`, per item `price_data: { currency:'ron', unit_amount: product.price_cents, tax_behavior:'inclusive', product_data:{ name } }`, `automatic_tax:{enabled:true}`, `customer_creation:'if_required'`; if any item physical → `shipping_address_collection:{allowed_countries:['RO']}` + shipping options built from `shipping.ts` (free tier when total ≥ threshold, see above); `metadata.items = "<productId>:<qty>,<productId>:<qty>,…"` (compact format); success `PUBLIC_SITE_URL/checkout/success?session_id={CHECKOUT_SESSION_ID}`, cancel `/checkout/cancel`. Return `{ url }`. |
| `src/lib/server/orders.ts` | `parseItemsMetadata(s)` → `{productId,quantity}[]` or `null` on any malformation (exported for tests). `fulfillCheckoutSession(session)` — the webhook's logic, extracted for testability: (1) insert order with `onConflictDoNothing` on `stripe_session_id` (email from `session.customer_details?.email`); if nothing inserted → return `'duplicate'`; (2) parse `metadata.items`; **malformed/missing → log the error, keep the order row (idempotency holds), create no items, return `'invalid'`** — never throw; (3) insert order_items, re-reading `unit_amount` and `type` **from the products table by productId** (metadata carries no prices — DB is the source of truth); (4) for each digital item create a `download_tokens` row (32 random bytes base64url, `expires_at = now()+7 days`, max 5 downloads) and send `delivery:<orderId>` email with the link(s); (5) send `order:<orderId>` confirmation email. Returns `'fulfilled'`. |
| `src/routes/api/webhooks/stripe/+server.ts` | POST. Verify signature with `stripe.webhooks.constructEvent(await request.text(), sig, STRIPE_WEBHOOK_SECRET)` → 400 on failure. On `checkout.session.completed` → `fulfillCheckoutSession`. Always 200 fast on fulfilled/duplicate/invalid; other event types → 200 ignored. |
| `src/lib/server/orders.test.ts` | Build a minimal fake session — `{ id: 'cs_test_' + crypto.randomUUID(), customer_details: { email: 'order@example.com' }, amount_total, currency: 'ron', payment_intent: 'pi_x', metadata: { items: '<physicalId>:1,<digitalId>:1' }, shipping_details: { address: { country: 'RO' } } } as unknown as Stripe.Checkout.Session` (the random id makes test runs repeatable against a persistent dev DB). Assert: creates 1 order + 2 items + 1 download token + `order:`/`delivery:` email_sends rows; calling AGAIN with the same id returns `'duplicate'` with no count changes; a session with `metadata.items: 'garbage'` returns `'invalid'`, creates the order row but zero items. Tests delete their own rows in `afterAll`. |

### Email templates

| File | Content |
|---|---|
| `src/lib/server/email/templates/order-confirm.ts` | Romanian: "Mulțumim pentru comandă!", item table (name × qty, RON via Intl), total, shipping address when present. Transactional — no marketing footer required, but include site link. |
| `src/lib/server/email/templates/delivery.ts` | "Descarcă-ți produsele digitale" — one button per download link, expiry note ("linkul expiră în 7 zile, maximum 5 descărcări"). |

### Download endpoint

`src/routes/download/[token]/+server.ts` — GET. Claim the download with a
single **atomic** statement (no read-then-write — concurrent requests must not
exceed the quota):

```sql
UPDATE download_tokens
SET download_count = download_count + 1
WHERE token = $1 AND expires_at > now() AND download_count < max_downloads
RETURNING order_item_id
```

No row returned → 410 with a short Romanian message. Otherwise resolve the
product's `digital_file_key`: if `BLOB_READ_WRITE_TOKEN` set → 302 to a Vercel
Blob signed URL; else stream the file from `static/digital/<key>` with
`Content-Disposition: attachment`.

### Cart + pages (Svelte 5)

| File | Content |
|---|---|
| `src/lib/cart.svelte.ts` | Runes class/module: `items = $state<CartItem[]>([])` (`{productId, slug, name, priceCents, type, quantity}`), `totalCents` `$derived`, `add/remove/setQuantity/clear`, persisted to `localStorage('bl-cart')` via `$effect` (guard `browser`). |
| `src/routes/shop/+page.server.ts|.svelte` | Active products grid (`ProductCard`), filter chips by topic. |
| `src/routes/shop/[slug]/+page.server.ts|.svelte` | Product detail: image, description, price (Intl ro-RO), physical/digital badge ("livrare prin curier" / "descărcare instantă"), "Adaugă în coș". 404 unknown/inactive. |
| `src/routes/cart/+page.svelte` | Cart list, quantity steppers, total, shipping hint ("Livrare gratuită peste 200 lei"), "Finalizează comanda" → POST `/api/checkout` → redirect to `url`. Stripe unconfigured (503) → inline "Plățile nu sunt încă activate." Empty state → link to shop. |
| `src/routes/checkout/success/+page.server.ts|.svelte` | If session_id present and Stripe configured, retrieve session for a summary (display only — **webhook is authoritative**); else generic "Mulțumim! Vei primi un email de confirmare." Clear the cart client-side on mount. |
| `src/routes/checkout/cancel/+page.svelte` | "Comanda a fost anulată" + back-to-cart link. |
| `src/lib/components/ProductCard.svelte` | Used by shop grid, topic hubs, and quiz results. |
| `src/routes/quiz/[slug]/results/…` (edit) | Now that products exist: load `recommendedProductSlugs` from DB and render real `ProductCard`s under "Recomandate pentru profilul tău". |
| `src/routes/topics/[topic]/…` (edit) | Add the topic's products section. |

New `messages/ro.json` strings: cart/checkout labels.

## Acceptance criteria

```bash
pnpm db:migrate && pnpm tsx scripts/seed.ts
pnpm tsx scripts/seed.ts                      # re-run: still 4 products (idempotent)
pnpm db:query "select count(*) from products" # 4
pnpm check && pnpm vitest run && pnpm build   # orders.test.ts green ⇒ webhook idempotency proven
pnpm dev &  sleep 5

curl -s http://localhost:5173/shop | grep -q "Mască de somn premium"
curl -s http://localhost:5173/shop/ghid-seara-linistita | grep -qi "descărcare"
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/shop/nu-exista   # 404

# checkout endpoint validates + degrades without Stripe
curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:5173/api/checkout \
  -H 'content-type: application/json' -d '{"items":[]}'                       # 400
# with empty STRIPE_SECRET_KEY: valid body → 503

# download flow (orders.test.ts cleans up after itself — seed an order, item and
# token manually via pnpm db:query for this check):
curl -s -o /tmp/dl.pdf -w "%{http_code}" http://localhost:5173/download/<token>   # 200, file non-empty
pnpm db:query "select download_count from download_tokens"                        # incremented
# expire it → 410
pnpm db:query "update download_tokens set expires_at = now() - interval '1 day'"
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/download/<token>     # 410
kill %1
```

**[stripe-live]** with `STRIPE_SECRET_KEY` (test mode) +
`stripe listen --forward-to localhost:5173/api/webhooks/stripe`:
a checkout with one physical item collects an RO address and flat-rate
shipping; card `4242…` completes; webhook creates exactly one order;
`stripe trigger` replay creates no duplicate; digital purchase emails a
working download link (dry-run log). Optionally run
`pnpm tsx scripts/stripe-sync.ts` and verify it back-fills stripe ids
(checkout does not depend on it). If session creation fails because Stripe Tax
has no origin address configured in the test account, record it in
PROGRESS.md and retry with `automatic_tax` disabled — enabling Tax is a
launch-checklist step.

Commit: `phase-04: shop and stripe`.

## Do NOT touch in this phase

- Existing tables/columns — additive migration only.
- `send.ts` ledger semantics; quiz engine; drip cron; token formats.
- Do not implement inventory/stock, coupons, refund handling, or COD — out of
  scope v1 (refunds remain a manual Stripe-dashboard operation; `orders.status`
  merely allows recording it later).
- `vercel.json` (phase 03's file is final until phase 06).
