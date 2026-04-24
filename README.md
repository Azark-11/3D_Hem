# 3D Hem

Swedish-first e-commerce storefront for custom 3D prints. Built on Next.js 16 with Stripe Checkout, next-intl (Swedish default, English fallback), and Prisma/SQLite in dev (PostgreSQL in prod). A small admin UI manages products and orders.

## Tech stack

- **Next.js 16** (App Router, Turbopack, `proxy.ts` middleware)
- **React 19** + **Tailwind CSS v4**
- **next-intl** for i18n (`sv` default, `en` fallback; `localePrefix: "as-needed"`)
- **Auth.js v5 (NextAuth)** with credentials provider + bcrypt
- **Prisma 6** ORM (SQLite for dev, PostgreSQL for prod)
- **Stripe** (Checkout, webhooks, Swish + Klarna + card for SEK)
- **Zustand** for cart state, **Zod** for validation, **react-hook-form** for admin forms
- **Radix UI** primitives for the admin UI

## Prerequisites

- Node.js 20.19+ or 22.13+ (Windows/macOS/Linux)
- npm 10+
- A Stripe account (test mode is enough for local dev)

## First-time setup

```bash
git clone https://github.com/Azark-11/3D_Hem.git
cd 3D_Hem
npm install
```

### Environment files

This project uses **two env files** because Prisma and Next.js load from different sources:

- `.env` — read by the **Prisma CLI**. Keep only `DATABASE_URL` here.
- `.env.local` — read by the **Next.js runtime** (dev server, build). All secrets live here.

Both are gitignored. Create them from the templates:

```bash
cp .env.example .env.local
echo 'DATABASE_URL="file:./dev.db"' > .env
```

Fill in `.env.local`:

```bash
# Generate NextAuth secret
openssl rand -base64 32

# Generate admin password hash
npm run hash-password -- "yourPassword"
```

Paste the outputs into `NEXTAUTH_SECRET` and `ADMIN_PASSWORD_HASH` respectively.

## Database

```bash
npx prisma migrate dev       # apply migrations (creates prisma/dev.db)
npm run db:seed              # load 3 starter products
```

If you ever need to wipe the dev DB:

```bash
npx prisma migrate reset --force
```

## Running locally

```bash
npm run dev
```

Open http://localhost:3000 — Swedish homepage with `localePrefix: "as-needed"` (`/` serves `sv`, `/en` serves English).

## Adding products

1. Visit http://localhost:3000/admin/login
2. Sign in with `ADMIN_EMAIL` + the password you hashed above
3. Click **New Product**, fill in Swedish copy (English is optional)
4. All prices are in **öre**: `24900` = 249 kr
5. `images` is a newline-separated list of paths under `/public/products/` or absolute URLs

Stock can be toggled/edited from the product list without opening the full edit form.

## Stripe setup

### Create the account

1. Sign up at https://dashboard.stripe.com; activate the **SE** region
2. Dashboard → **Settings → Payment methods**; enable **Card**, **Swish**, and **Klarna** for **SEK**
3. Swish and Klarna require Stripe approval — typically **1–2 business days**; card is instant

### Merchant-of-record note (important for Swish)

Stripe is merchant of record when customers pay via Swish. The business name shown to customers in the Swish app comes from **Dashboard → Business settings → Public details → Statement descriptor / public business name**. Set a short, recognizable name (≤22 characters) before taking Swish payments in production.

### Local webhook testing

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the `whsec_...` secret it prints into `STRIPE_WEBHOOK_SECRET` in `.env.local`, then restart `npm run dev`. Trigger a test payment and verify `/api/webhooks/stripe` fires (check server logs).

## Swedish legal compliance

- **Payment method order.** Swedish law (effective 2020-07-01) requires direct payment methods (card, Swish) to appear **before** BNPL methods (Klarna) in any ordered list of options. The checkout route in `app/api/checkout/route.ts` hardcodes the correct order — **do not reorder**.
- **"Beställ och betala" button.** Stripe Checkout renders this in Swedish automatically when locale is `sv`; no action needed.
- **VAT (moms).** Registration becomes mandatory at **120 000 kr** annual turnover (raised from 80 000 kr in 2025). Until then you can operate without VAT registration, but all product prices in this app are entered in öre before tax.
- **Ångerrätt.** The mandatory 14-day right of withdrawal is referenced in `/kopvillkor`. The page currently contains placeholder copy — **replace it with real legal text before launch**.
- **Cookie consent.** `components/CookieBanner.tsx` handles first-visit consent. It stores the acknowledgement in `localStorage`; no third-party cookies are set until consent is given.

## Project structure

```
3D_hem/
├── app/
│   ├── [locale]/              # localized customer routes (sv default, en fallback)
│   │   ├── (shop)/            # route group for shop pages + shared layout
│   │   │   ├── butik/         # canonical shop page
│   │   │   ├── shop/          # redirects to /butik
│   │   │   ├── produkter/     # / → redirects; /[slug] → product detail
│   │   │   ├── om-oss/, kontakt/, integritetspolicy/, kopvillkor/, tack/
│   ├── admin/                 # English admin UI (login, dashboard, products, orders)
│   └── api/
│       ├── admin/products/    # CRUD routes for admin
│       ├── auth/[...nextauth]/
│       ├── checkout/          # creates Stripe Checkout sessions
│       └── webhooks/stripe/   # handles paid / expired / refunded
├── components/                # customer + admin + Radix ui/ primitives
├── i18n/                      # next-intl routing + request config
├── lib/                       # auth, db, stripe, cart-store, validations, utils
├── messages/                  # sv.json, en.json
├── prisma/                    # schema, migrations, seed
├── public/products/           # product image assets
├── scripts/hash-password.ts   # helper for ADMIN_PASSWORD_HASH
├── proxy.ts                   # Next 16 middleware (auth gating + locale routing)
└── next.config.ts             # Turbopack root pinned; Cloudinary remote pattern
```

## Deploying to Vercel

1. Push the repo to GitHub (already done)
2. Import the project at https://vercel.com/new
3. Environment variables: copy every key from `.env.local` into Vercel's Project Settings → Environment Variables. Use **production** Stripe keys; leave `DATABASE_URL` empty for now
4. **Switch Prisma from SQLite to Postgres:**
   - Open `prisma/schema.prisma` and change `provider = "sqlite"` to `provider = "postgresql"`
   - SQLite data does **not** transfer; the dev migration is not reusable against Postgres. Delete `prisma/migrations/` locally and regenerate against your Postgres instance: `DATABASE_URL=<postgres-url> npx prisma migrate dev --name init_postgres`
   - Commit the new migration folder
   - In Vercel env vars, set `DATABASE_URL` to your Vercel Postgres or Neon connection string
5. On first deploy, Vercel's build command runs `npm run build`; Prisma migrations must be applied separately. Either add `prisma migrate deploy && next build` to your build command, or run `npx prisma migrate deploy` from a deploy hook / Vercel CLI against the production DB
6. In Stripe Dashboard, add a production webhook endpoint pointing at `https://your-domain.com/api/webhooks/stripe`. Copy the new `whsec_...` into Vercel's `STRIPE_WEBHOOK_SECRET`
7. Optionally run `npm run db:seed` against production (or add real products via `/admin`)

## Go-live checklist

- [ ] Replace Stripe test keys with live keys in Vercel env
- [ ] Confirm Swish + Klarna are approved on the live Stripe account (1-2 business days)
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the production domain
- [ ] Set Stripe Dashboard → Business settings → Public details → short business name (Swish app message field)
- [ ] Fill in real content on `/integritetspolicy`, `/kopvillkor`, `/om-oss`, `/kontakt` (replace all `[Datum]`, `[Företagsnamn]`, `[ORG-NR]`, `[info@dittforetag.se]` placeholders)
- [ ] Add production webhook endpoint + signing secret
- [ ] Run one real low-value purchase with each method (card, Swish, Klarna) end-to-end
- [ ] Verify each purchase appears in Stripe Dashboard → Events with a 2xx response from the webhook
- [ ] Verify order rows land in the production DB and appear under `/admin/orders`

## Known limitations / out of scope for v1

- No customer accounts — guest checkout via Stripe only
- No product reviews or ratings
- SEK only; no multi-currency
- No discount-code admin UI (Stripe supports promo codes; a UI can come later)
- No transactional email beyond Stripe's default receipt
- No analytics instrumentation
- English product descriptions are optional per product (`descriptionEn` can be empty)
