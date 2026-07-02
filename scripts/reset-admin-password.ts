/**
 * Reset email/password login for an existing user (e.g. admin).
 *
 * Usage:
 *   NEW_PASSWORD='your-new-password' npm run db:reset-admin-password -- chosenfewrecords@hotmail.de
 *
 * Uses DATABASE_URL from .env.local (must match Vercel production Neon URL).
 */
import { hashPassword } from "better-auth/crypto";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { accounts, users } from "@/lib/db/schema";

const CREDENTIAL_PROVIDERS = new Set(["credential", "email"]);

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  const newPassword = process.env.NEW_PASSWORD?.trim();

  if (!email) {
    throw new Error("Usage: NEW_PASSWORD='...' npm run db:reset-admin-password -- <email>");
  }
  if (!newPassword || newPassword.length < 8) {
    throw new Error("Set NEW_PASSWORD (min 8 characters) in the environment.");
  }

  const dbHost = (() => {
    try {
      return new URL(process.env.DATABASE_URL!.replace(/^postgresql:\/\//, "http://")).hostname;
    } catch {
      return "unknown";
    }
  })();
  console.log(`[reset-admin-password] Database host: ${dbHost}`);

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user) {
    throw new Error(`No user found for ${email}. Sign up at /sign-up first.`);
  }

  const hashed = await hashPassword(newPassword);
  const existingAccounts = await db
    .select()
    .from(accounts)
    .where(eq(accounts.userId, user.id));

  const credential = existingAccounts.find(
    (a) => CREDENTIAL_PROVIDERS.has(a.providerId) || Boolean(a.password),
  );

  if (credential) {
    await db
      .update(accounts)
      .set({ password: hashed, updatedAt: new Date() })
      .where(eq(accounts.id, credential.id));
  } else {
    await db.insert(accounts).values({
      userId: user.id,
      accountId: user.id,
      providerId: "credential",
      password: hashed,
    });
  }

  // Also update any other credential rows (edge-case duplicates).
  for (const row of existingAccounts) {
    if (row.id === credential?.id) continue;
    if (CREDENTIAL_PROVIDERS.has(row.providerId) || row.password) {
      await db
        .update(accounts)
        .set({ password: hashed, updatedAt: new Date() })
        .where(eq(accounts.id, row.id));
    }
  }

  try {
    await auth.api.signInEmail({ body: { email, password: newPassword } });
    console.log("[reset-admin-password] Verified: signInEmail OK");
  } catch (e) {
    throw new Error(
      `Password hash saved but signInEmail failed: ${e instanceof Error ? e.message : e}`,
    );
  }

  console.log(`[reset-admin-password] Password updated for ${email}`);
  console.log("[reset-admin-password] Use /sign-in (not /sign-up) with this password.");
}

main().catch((e) => {
  console.error("[reset-admin-password:error]", e instanceof Error ? e.message : e);
  process.exitCode = 1;
});
