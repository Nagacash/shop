/**
 * Orders + admin role migration.
 * Run: npx tsx scripts/migrate-orders-admin.ts
 */
import * as dotenv from "dotenv";
import { join } from "path";
import { neon } from "@neondatabase/serverless";

dotenv.config({ path: join(process.cwd(), ".env.local") });

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  await sql`DO $$ BEGIN
    CREATE TYPE "user_role" AS ENUM('customer', 'admin');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$`;

  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS role "user_role" NOT NULL DEFAULT 'customer'`;

  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal_amount numeric(10, 2)`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_amount numeric(10, 2)`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS tax_amount numeric(10, 2)`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email text`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS confirmation_email_sent_at timestamp`;

  console.log("Migration applied: user role + order amount/email columns");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
