import "server-only";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/actions";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

function parseAdminEmails(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export async function isAdminUser(userId: string, email: string): Promise<boolean> {
  const adminEmails = parseAdminEmails();
  if (adminEmails.has(email.toLowerCase())) {
    return true;
  }

  const [row] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return row?.role === "admin";
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in?next=/admin/orders");
  }

  const allowed = await isAdminUser(user.id, user.email);
  if (!allowed) {
    redirect("/");
  }

  return user;
}
