<div align="center">

# Naga Apparel — Online Store

**Technical streetwear from Hamburg. Shipping worldwide.**

[![Live](https://img.shields.io/badge/Live-www.nagaclub.de-000000?style=for-the-badge&logo=vercel)](https://www.nagaclub.de/)
[![License](https://img.shields.io/badge/License-Proprietary-B3242B?style=for-the-badge)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js_15-000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com)

</div>

---

> [!IMPORTANT]
> **This is proprietary production source code — not a template, starter or tutorial.**
> It runs a live commercial storefront processing real orders and payments.
> Copying, redistributing or deploying it, in whole or in part, is not permitted.
> See [LICENSE](./LICENSE).

---

## What this is

The production e-commerce platform behind **[www.nagaclub.de](https://www.nagaclub.de/)** — the
Naga Apparel storefront. A full commercial system rather than a demo: live Stripe
payments, real inventory, order fulfilment and an internal admin surface.

Part of the Naga ecosystem, alongside **[Naga Codex](https://nagacodex.cloud)** (AI agents,
web development) and **[Naga Films](https://nagafilms-studio.vercel.app/)** (generative cinema).

---

## Capabilities

**Storefront**
- Product catalogue with collections, variants and per-tier retail pricing
- Cart and checkout with shipping-inclusive price handling
- Digital products served alongside physical apparel
- Ambient audio streaming over signed, expiring media URLs
- Editorial pages — about, contact, podcast, terms, privacy

**Commerce**
- Stripe payments with webhook-driven order state
- Inventory tracking with sold-out handling
- Shipping address capture and rate handling
- Transactional email via Resend for confirmations and receipts

**Accounts & admin**
- Email/password auth plus optional GitHub and Google OAuth (Better Auth)
- Admin order management restricted to an allow-listed set of addresses
- Server-side validation and security layer

**Platform**
- Next.js 15 App Router on React 19 server components
- Neon serverless PostgreSQL via Drizzle ORM with generated migrations
- Structured SEO metadata layer
- GSAP-driven motion and pre-encoded hero video

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Neon serverless PostgreSQL |
| ORM | Drizzle ORM + Drizzle Kit |
| Payments | Stripe (Checkout + webhooks) |
| Auth | Better Auth (credentials + OAuth) |
| Email | Resend |
| State | Zustand |
| Validation | Zod |
| Motion | GSAP |
| Hosting | Vercel |

---

## Running locally

> Restricted to authorised maintainers. Valid Neon, Stripe and Resend
> credentials are required — the store will not run without them.

```bash
npm install
cp .env.example .env.local   # fill in real values
npm run db:migrate
npm run dev
```

Runs on `http://localhost:3000`.

### Required environment

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Session signing secret |
| `BETTER_AUTH_URL` | Auth callback base URL |
| `NEXT_PUBLIC_SITE_URL` | Public site origin (`https://www.nagaclub.de`) |
| `STRIPE_SECRET_KEY` | Stripe API key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signature secret |
| `RESEND_API_KEY` | Transactional email |
| `RESEND_FROM_EMAIL` | Sender address |
| `ADMIN_EMAILS` | Comma-separated admin allow-list |
| `AMBIENT_MEDIA_SECRET` | Signs ambient stream URLs (falls back to the auth secret) |

OAuth (`GITHUB_*`, `GOOGLE_*`) is optional.

**Never commit a real `.env`.** `.gitignore` excludes `.env*` apart from the
example — keep it that way.

---

## Operational scripts

Catalogue and media tooling lives in `scripts/`, exposed through npm:

```bash
npm run db:generate      # generate migrations from schema changes
npm run db:migrate       # apply migrations
npm run db:studio        # inspect the database
npm run db:seed          # seed the catalogue
npm run lint             # lint
npm run build            # production build
```

Product-specific tasks — adding a drop, adjusting pricing tiers, pruning the
catalogue, regenerating imagery — each have a dedicated `db:*` or `generate:*`
script. See `package.json`.

---

## License

**© 2026 Naga Apparel / Maurice Holda. All rights reserved.**

Proprietary source, published for reference and portfolio purposes only.
This is **not** open source.

You may **not**:
- Copy, clone or reuse this code, in whole or in part
- Redistribute, sublicense or resell it
- Deploy it, modified or unmodified, as your own store
- Reuse the Naga Apparel brand, product imagery, copy or design

Brand assets, product photography and written copy are protected independently
of the code.

Licensing and commercial enquiries: **chosenfewrecords@hotmail.de**

Full terms in [LICENSE](./LICENSE).

---

<div align="center">

**Built in Hamburg** · [www.nagaclub.de](https://www.nagaclub.de/) · Part of the Naga ecosystem

</div>
