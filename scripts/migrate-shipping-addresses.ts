/**
 * One-off migration for guest shipping addresses.
 * Run: npx tsx scripts/migrate-shipping-addresses.ts
 */
import * as dotenv from "dotenv";
import { join } from "path";
import { neon } from "@neondatabase/serverless";

dotenv.config({ path: join(process.cwd(), ".env.local") });

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  await sql`ALTER TABLE addresses ALTER COLUMN user_id DROP NOT NULL`;
  await sql`ALTER TABLE addresses ADD COLUMN IF NOT EXISTS recipient_name text`;
  console.log("Migration applied: addresses.user_id nullable, recipient_name added");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
