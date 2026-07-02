# Memory — Stripe Go-Live for Naga Commerce

Last updated: 2026-07-02

## What was built

Nothing code-related this session. Reviewed existing Stripe integration and documented what is needed to accept live payments on the deployed site.

## Decisions made

- Site is already deployed at **https://www.nagaclub.de** (Vercel).
- Stripe is already integrated in code — no app changes required to go live.
- Checkout uses **EUR**, **Stripe Tax (automatic)**, flat **€4.99 shipping** (free over **€75**), and ships to: DE, AT, CH, NL, BE, FR, IT, PL, CZ, DK, SE, LU, IE, ES, PT, GB.
- Orders are created via webhook (`/api/stripe`) and/or success page fallback (`/checkout/success`).

## Key files (for reference)

- `src/lib/actions/checkout.ts` — creates Stripe Checkout Session
- `src/app/api/stripe/route.ts` — webhook handler (`checkout.session.completed`)
- `src/app/(root)/checkout/success/page.tsx` — order confirmation page
- `src/lib/stripe/client.ts` — requires `STRIPE_SECRET_KEY`
- `src/lib/utils/currency.ts` — EUR, shipping rates, tax codes

## Current state

- **Deployed:** https://www.nagaclub.de
- **Stripe in code:** Complete (Checkout Sessions, webhooks, order creation, optional Resend emails)
- **Not confirmed:** Whether Vercel env vars are set for **live** Stripe keys and production webhook
- **Blocker for public launch:** Stripe account verification + live keys + live webhook + Stripe Tax setup in dashboard

## Next session starts with

Complete the Stripe go-live checklist in order:

### 1. Stripe Dashboard (Live mode)
- [ ] Finish business verification (identity, bank, business details)
- [ ] Toggle **Test mode OFF**
- [ ] **Settings → Tax** — enable Stripe Tax, add business address (Germany), register for tax in shipping countries

### 2. Vercel env vars (Production)
- [ ] `STRIPE_SECRET_KEY` = `sk_live_...` (Stripe → Developers → API keys)
- [ ] `STRIPE_WEBHOOK_SECRET` = `whsec_...` (from live webhook below)
- [ ] `BETTER_AUTH_URL` = `https://www.nagaclub.de`
- [ ] (Optional) `RESEND_API_KEY` + `RESEND_FROM_EMAIL` for order confirmation emails

### 3. Live webhook in Stripe
- [ ] Endpoint URL: `https://www.nagaclub.de/api/stripe`
- [ ] Events: `checkout.session.completed` (+ optional `payment_intent.payment_failed`)
- [ ] Copy signing secret → Vercel as `STRIPE_WEBHOOK_SECRET`

### 4. Redeploy Vercel
- [ ] Redeploy after all env vars are saved

### 5. Test one real purchase
- [ ] Add item to cart on live site → checkout with real card
- [ ] Verify: payment in Stripe (Live), order on success page, webhook shows "Succeeded"
- [ ] Refund test order in Stripe if desired

## Open questions

- Are current Vercel env vars still using **test** Stripe keys (`sk_test_...`)?
- Is Resend configured for order confirmation emails?
- Has Stripe Tax been set up in the live Stripe dashboard?

## How to resume

Run `/remember restore` at the start of the next session, or say: "continue Stripe go-live setup".
