import Stripe from "stripe";
import * as dotenv from "dotenv";
import { join } from "path";

dotenv.config({ path: join(process.cwd(), ".env.local") });

function getStripeSecretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add your test secret key to .env.local — get it from https://dashboard.stripe.com/test/apikeys",
    );
  }
  return key;
}

function createStripeClient(): Stripe {
  return new Stripe(getStripeSecretKey(), { typescript: true });
}

let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!stripeClient) {
    stripeClient = createStripeClient();
  }
  return stripeClient;
}

export function dollarsToCents(amount: number): number {
  return Math.round(amount * 100);
}

export function centsToDollars(cents: number): number {
  return cents / 100;
}
