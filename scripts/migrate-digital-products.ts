/**
 * Digital product flag for no-shipping checkout.
 * Run: npm run db:migrate-digital
 */
import * as dotenv from "dotenv";
import { join } from "path";
import { neon } from "@neondatabase/serverless";

dotenv.config({ path: join(process.cwd(), ".env.local") });

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS is_digital boolean NOT NULL DEFAULT false`;
  console.log("Migration applied: products.is_digital");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
