ALTER TABLE "addresses" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "addresses" ADD COLUMN IF NOT EXISTS "recipient_name" text;
