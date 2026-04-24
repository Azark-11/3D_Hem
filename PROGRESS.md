# Build Progress

## Done (v1)

- Prisma schema (Product + Order) with öre pricing; initial migration baselined
- Seed data (3 products: Luffy Wanted Poster, LED-lampa Varm Vit, Skrivbordsorganiserare)
- Auth.js v5 credentials provider with bcrypt hashes
- Swedish-first routes: `/`, `/butik`, `/produkter` (→ redirect), `/produkter/[slug]`, `/tack`, `/om-oss`, `/kontakt`, `/integritetspolicy`, `/kopvillkor`
- Customer UI: Navbar, Footer, ProductCard, ProductGallery, CartDrawer, AddToCartButton, CookieBanner
- Admin UI (English): dashboard, product list, new/edit forms, orders list, order detail, AdminStockToggle
- API: checkout (Stripe Checkout hosted, direct methods before Klarna), webhook (paid/expired/refunded handlers with idempotent stock decrement), admin CRUD
- i18n: next-intl with `sv` (default) and `en`, 13 message sections each
- GDPR: CookieBanner + placeholder privacy policy + placeholder terms with 14-day ångerrätt
- Design system: matte black / cream / orange, Space Grotesk + Inter, sharp corners

## Intentionally deferred (out of scope for v1)

- Customer accounts — guest checkout via Stripe only
- Product reviews / ratings
- Multi-currency — SEK only
- Discount code admin UI (Stripe supports codes; UI can come later)
- Transactional email beyond Stripe's default receipt
- Analytics
- Full English product descriptions (UI works; admin can leave `descriptionEn` empty)

## Known gotchas

- Stripe `apiVersion` is not explicitly pinned — SDK uses its default to avoid future-dated API version issues
- `proxy.ts` uses Next 16's convention; verified that `export async function proxy` is the correct signature
- Payment method order hardcoded as card → swish → klarna in `app/api/checkout/route.ts` — required by Swedish law (direct methods before BNPL, effective 2020-07-01). Do not reorder.
- Admin UI is English (intentional exception to Swedish-first)
- Cart state denormalizes product data for performance; checkout route revalidates against DB before creating Stripe session (never trust client prices)
- `turbopack.root` pinned in `next.config.ts` to prevent Next from walking up to parent lockfiles
- Prisma CLI reads `.env`, Next.js runtime reads `.env.local`. Both files needed in dev. Only `.env.local` holds secrets.
- Node 22.11.0 installed; `eslint-visitor-keys` wants ≥22.13.0 — harmless warning, upgrade Node when convenient
- Prisma 7 will remove `package.json#prisma` config — migrate to `prisma.config.ts` before upgrading Prisma
- `@next/font` dependency removed in Phase B5 — use `next/font` (built into Next 16) going forward

## To do before going live

- Fill in real content in `/integritetspolicy`, `/kopvillkor`, `/om-oss`, `/kontakt` (replace all `[Datum]`, `[Företagsnamn]`, `[ORG-NR]`, `[info@dittforetag.se]` placeholders)
- Replace Stripe test keys with live keys in production env
- Confirm Swish + Klarna are approved on live Stripe account (1-2 business days after request)
- Change `prisma/schema.prisma` provider from `sqlite` to `postgresql`; regenerate migrations
- Set `DATABASE_URL` in Vercel to Postgres/Neon connection string
- Set `NEXT_PUBLIC_SITE_URL` to production domain
- Add production webhook endpoint in Stripe Dashboard; copy signing secret to Vercel env
- Run `npx prisma migrate deploy` on first production deploy
- Re-run `npm run db:seed` against production DB (or add real products via `/admin`)
- Test one real low-value purchase with each payment method (card, Swish, Klarna)
- Verify production webhook events appear in Stripe Dashboard → Events
- Set a short business name in Stripe Dashboard → Business settings → Public details (appears in Swish app message field — Stripe is merchant of record)
