import { config } from "dotenv";
import { cpSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import sharp from "sharp";
import { db } from "../src/lib/db";
import { productImages, products, insertProductImageSchema } from "../src/lib/db/schema";
import { eq } from "drizzle-orm";
import { NAGA_GREEN_SHOTS, type LogoPlacement } from "../src/lib/brand/product-prompts";
import { resolveChestLogoPath, CANONICAL_LOGO_URL } from "../src/lib/brand/logo";

config({ path: ".env.local" });

const API_URL = "https://api.openai.com/v1/images/generations";
const PRODUCT_NAME = "Naga Green Set";
const OUTPUT_DIR = join(process.cwd(), "public", "uploads", "naga", "products");

type ImageKind = "square" | "portrait";

function parseArgs() {
  const args = process.argv.slice(2);
  const product = args.find((a) => a.startsWith("--product="))?.split("=")[1] ?? "naga-green";
  const shotArg = args.find((a) => a.startsWith("--shot="))?.split("=")[1];
  const skipGenerate = args.includes("--composite-only");
  const attachDb = !args.includes("--no-db");
  return { product, shotArg, skipGenerate, attachDb };
}

function apiSize(kind: ImageKind): string {
  return kind === "portrait" ? "1024x1536" : "1024x1024";
}

async function generateBaseImage(apiKey: string, prompt: string, kind: ImageKind): Promise<Buffer> {
  const models = ["gpt-image-1", "dall-e-2"] as const;

  for (const model of models) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          prompt,
          n: 1,
          size: apiSize(kind),
        }),
      });

      if (!response.ok) {
        throw new Error(String(response.status) + " " + (await response.text()).slice(0, 200));
      }

      const json = (await response.json()) as {
        data?: Array<{ b64_json?: string; url?: string }>;
      };
      const item = json.data?.[0];
      if (item?.b64_json) return Buffer.from(item.b64_json, "base64");
      if (item?.url) {
        const imgRes = await fetch(item.url);
        if (!imgRes.ok) throw new Error("Download failed");
        return Buffer.from(await imgRes.arrayBuffer());
      }
      throw new Error("No image in response");
    } catch (e) {
      console.warn("[generate-product] model failed:", e instanceof Error ? e.message : e);
    }
  }

  throw new Error("All image models failed");
}

async function compositeLogo(
  baseBuffer: Buffer,
  logoPath: string,
  placement: LogoPlacement,
): Promise<Buffer> {
  const base = sharp(baseBuffer);
  const meta = await base.metadata();
  const width = meta.width ?? 1024;
  const height = meta.height ?? 1024;

  const logoWidth = Math.round(width * placement.widthRatio);
  const logoBuffer = await sharp(logoPath).resize(logoWidth).png().toBuffer();
  const logoMeta = await sharp(logoBuffer).metadata();
  const lw = logoMeta.width ?? logoWidth;
  const lh = logoMeta.height ?? logoWidth;

  const left = Math.round(width * placement.centerX - lw / 2);
  const top = Math.round(height * placement.centerY - lh / 2);

  return base
    .composite([
      {
        input: logoBuffer,
        left: Math.max(0, Math.min(left, width - lw)),
        top: Math.max(0, Math.min(top, height - lh)),
      },
    ])
    .jpeg({ quality: 92 })
    .toBuffer();
}

function ensureCanonicalLogo(sourceLogo: string): string {
  const destAbs = join(process.cwd(), "public", CANONICAL_LOGO_URL.replace(/^\//, ""));
  mkdirSync(join(process.cwd(), "public", "uploads", "naga", "brand"), { recursive: true });
  if (!existsSync(destAbs) || sourceLogo !== destAbs) {
    cpSync(sourceLogo, destAbs);
    console.log("[generate-product] Saved canonical logo →", CANONICAL_LOGO_URL);
  }
  return destAbs;
}

async function attachToProduct(urls: string[]) {
  const [product] = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.name, PRODUCT_NAME))
    .limit(1);

  if (!product) {
    console.warn(`[generate-product] Product "${PRODUCT_NAME}" not found — images saved to disk only`);
    return;
  }

  const existing = await db
    .select({ url: productImages.url })
    .from(productImages)
    .where(eq(productImages.productId, product.id));

  const existingUrls = new Set(existing.map((r) => r.url));
  let sortOrder = existing.length;

  for (const url of urls) {
    if (existingUrls.has(url)) {
      console.log("[generate-product] Skipping duplicate DB entry:", url);
      continue;
    }
    const row = insertProductImageSchema.parse({
      productId: product.id,
      url,
      sortOrder,
      isPrimary: sortOrder === 0 && existing.length === 0,
    });
    await db.insert(productImages).values(row);
    sortOrder += 1;
    console.log("[generate-product] Attached to product:", url);
  }
}

async function main() {
  const { product, shotArg, skipGenerate, attachDb } = parseArgs();

  if (product !== "naga-green") {
    console.error("Only --product=naga-green is supported right now");
    process.exit(1);
  }

  const logoSource = resolveChestLogoPath();
  if (!logoSource) {
    console.error(
      "Chest logo not found. Add your PNG to:\n  public/naga-t-shirt/png.png\n  or public/naga-t-shirt/naga.png",
    );
    process.exit(1);
  }

  const logoPath = ensureCanonicalLogo(logoSource);
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const shots = shotArg
    ? NAGA_GREEN_SHOTS.filter((s) => s.id === shotArg)
    : NAGA_GREEN_SHOTS;

  if (!shots.length) {
    console.error("Unknown shot id:", shotArg);
    process.exit(1);
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!skipGenerate && !apiKey) {
    console.error("OPENAI_API_KEY required unless using --composite-only");
    process.exit(1);
  }

  const savedUrls: string[] = [];

  for (const shot of shots) {
    const rawPath = join(OUTPUT_DIR, `naga-green-${shot.id}-raw.png`);
    const outPath = join(OUTPUT_DIR, `naga-green-${shot.id}.jpg`);
    const publicUrl = `/uploads/naga/products/naga-green-${shot.id}.jpg`;

    console.log(`[generate-product] ${shot.label} (${shot.id})...`);

    let baseBuffer: Buffer;
    if (skipGenerate && existsSync(rawPath)) {
      baseBuffer = await sharp(rawPath).toBuffer();
      console.log("[generate-product] Using existing raw:", rawPath);
    } else if (skipGenerate) {
      console.warn("[generate-product] Raw missing, skipping:", rawPath);
      continue;
    } else {
      baseBuffer = await generateBaseImage(apiKey!, shot.prompt, shot.kind);
      writeFileSync(rawPath, baseBuffer);
      console.log("[generate-product] Saved raw:", rawPath);
    }

    const finalBuffer = await compositeLogo(baseBuffer, logoPath, shot.placement);
    writeFileSync(outPath, finalBuffer);
    savedUrls.push(publicUrl);
    console.log("[generate-product] Saved:", outPath);
  }

  if (attachDb && savedUrls.length) {
    await attachToProduct(savedUrls);
  }

  console.log(`[generate-product] Done — ${savedUrls.length} image(s) with real Naga logo composited.`);
}

main().catch((e) => {
  console.error("[generate-product:error]", e);
  process.exit(1);
});
