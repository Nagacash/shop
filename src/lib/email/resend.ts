import { Resend } from "resend";

let client: Resend | null = null;

export function getResendClient(): Resend | null {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  if (!client) {
    client = new Resend(key);
  }
  return client;
}

export function getResendFromAddress(): string {
  return (
    process.env.RESEND_FROM_EMAIL?.trim() ??
    "Naga Apparel <onboarding@resend.dev>"
  );
}
