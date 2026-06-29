import { config } from "dotenv";
import { mkdirSync, writeFileSync, existsSync, readFileSync } from "fs";
import { join } from "path";
import {
  COLLECTION_PROMPTS,
  HERO_PROMPT,
  HERO_GLAMOUR_PROMPT,
  PAGE_HERO_PROMPTS,
} from "../src/lib/brand/prompts";

config({ path: ".env.local" });

const BRAND_ROOT = join(process.cwd(), "public", "uploads", "naga", "brand");
const COLLECTIONS_DIR = join(BRAND_ROOT, "collections");
const PAGES_DIR = join(BRAND_ROOT, "pages");
const MANIFEST_PATH = join(BRAND_ROOT, "manifest.json");
const API_URL = "https://api.openai.com/v1/images/generations";

type BrandManifest = {
  hero: string;
  heroGlamour?: string;
  pages?: Record<string, string>;
  collections: Record<string, string>;
  generatedAt: string;
};

type CliOptions = {
  onlyHero: boolean;
  onlyHeroGlamour: boolean;
  onlyCollections: boolean;
  onlyPages: boolean;
  slug?: string;
};

type ImageKind = "hero" | "square" | "portrait";

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const slugArg = args.find((a) => a.startsWith("--slug="))?.split("=")[1];
  return {
    onlyHero: args.some((a) => a === "--only=hero"),
    onlyHeroGlamour: args.some((a) => a === "--only=hero-glamour"),
    onlyCollections: args.some((a) => a === "--only=collections"),
    onlyPages: args.some((a) => a === "--only=pages"),
    slug: slugArg,
  };
}

function loadManifest(): BrandManifest {
  if (!existsSync(MANIFEST_PATH)) {
    return { hero: "", collections: {}, generatedAt: new Date().toISOString() };
  }
  try {
    return JSON.parse(readFileSync(MANIFEST_PATH, "utf8")) as BrandManifest;
  } catch {
    return { hero: "", collections: {}, generatedAt: new Date().toISOString() };
  }
}

function apiSize(model: "gpt-image-1" | "dall-e-2", kind: ImageKind): string {
  if (model === "gpt-image-1") {
    if (kind === "hero") return "1536x1024";
    if (kind === "portrait") return "1024x1536";
    return "1024x1024";
  }
  if (kind === "portrait") return "1024x1792";
  return kind === "hero" ? "1792x1024" : "1024x1024";
}

async function generateImage(
  apiKey: string,
  prompt: string,
  kind: ImageKind,
): Promise<Buffer> {
  const models = ["gpt-image-1", "dall-e-2"] as const;

  for (const model of models) {
    try {
      const size = apiSize(model, kind);
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
          size,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(String(response.status) + " " + errText.slice(0, 200));
      }

      const json = (await response.json()) as {
        data?: Array<{ b64_json?: string; url?: string }>;
      };

      const item = json.data?.[0];
      if (item?.b64_json) {
        console.log("[generate] OK model=" + model + " size=" + size);
        return Buffer.from(item.b64_json, "base64");
      }

      if (item?.url) {
        const imgRes = await fetch(item.url);
        if (!imgRes.ok) throw new Error("Download failed: " + imgRes.status);
        console.log("[generate] OK model=" + model + " size=" + size + " (url)");
        return Buffer.from(await imgRes.arrayBuffer());
      }

      throw new Error("No image data in response");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn("[generate] model " + model + " failed: " + msg);
    }
  }

  throw new Error("All image models failed. Check API key, billing, and model access.");
}

async function main() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    console.error(
      "OPENAI_API_KEY is not set. Add it to .env.local:\n  OPENAI_API_KEY=sk-...",
    );
    process.exit(1);
  }

  const opts = parseArgs();
  mkdirSync(BRAND_ROOT, { recursive: true });
  mkdirSync(COLLECTIONS_DIR, { recursive: true });
  mkdirSync(PAGES_DIR, { recursive: true });

  const manifest = loadManifest();
  if (!manifest.pages) manifest.pages = {};
  manifest.generatedAt = new Date().toISOString();

  let imageCount = 0;
  const onlyBrand =
    opts.onlyHero ||
    opts.onlyHeroGlamour ||
    opts.onlyCollections ||
    opts.onlyPages;
  const runHero = opts.onlyHero || (!onlyBrand);
  const runHeroGlamour =
    opts.onlyHeroGlamour || opts.onlyHero || (!onlyBrand && !opts.onlyCollections && !opts.onlyPages);
  const runCollections = opts.onlyCollections || (!onlyBrand);
  const runPages = opts.onlyPages || (!onlyBrand && !opts.onlyHero && !opts.onlyHeroGlamour);

  if (runHero) {
    console.log("[generate] Hero background (dual energy wide)...");
    const buffer = await generateImage(apiKey, HERO_PROMPT, "hero");
    writeFileSync(join(BRAND_ROOT, "hero.png"), buffer);
    manifest.hero = "/uploads/naga/brand/hero.png";
    imageCount += 1;
    console.log("[generate] Saved hero.png");
  }

  if (runHeroGlamour) {
    console.log("[generate] Hero glamour panel (portrait)...");
    const buffer = await generateImage(apiKey, HERO_GLAMOUR_PROMPT, "portrait");
    writeFileSync(join(BRAND_ROOT, "hero-glamour.png"), buffer);
    manifest.heroGlamour = "/uploads/naga/brand/hero-glamour.png";
    imageCount += 1;
    console.log("[generate] Saved hero-glamour.png");
  }

  if (runCollections && !opts.onlyHero && !opts.onlyHeroGlamour && !opts.onlyPages) {
    const targets = opts.slug
      ? COLLECTION_PROMPTS.filter((c) => c.slug === opts.slug)
      : COLLECTION_PROMPTS;

    if (opts.slug && targets.length === 0) {
      console.error("Unknown collection slug: " + opts.slug);
      process.exit(1);
    }

    for (const col of targets) {
      console.log("[generate] Collection: " + col.name + " (" + col.slug + ")...");
      const buffer = await generateImage(apiKey, col.prompt, "square");
      const fileName = col.slug + ".png";
      writeFileSync(join(COLLECTIONS_DIR, fileName), buffer);
      manifest.collections[col.slug] = "/uploads/naga/brand/collections/" + col.slug + ".png";
      imageCount += 1;
      console.log("[generate] Saved collections/" + col.slug + ".png");
    }
  }

  if (runPages) {
    for (const entry of PAGE_HERO_PROMPTS) {
      console.log("[generate] Page hero: " + entry.page + "...");
      const buffer = await generateImage(apiKey, entry.prompt, "hero");
      const fileName = entry.page + ".png";
      writeFileSync(join(PAGES_DIR, fileName), buffer);
      manifest.pages![entry.page] = "/uploads/naga/brand/pages/" + entry.page + ".png";
      imageCount += 1;
      console.log("[generate] Saved pages/" + fileName);
    }
  }

  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log("[generate] Done — " + imageCount + " image(s). Manifest updated.");
  console.log("[generate] Restart npm run dev and refresh the site.");
}

main().catch((e) => {
  console.error("[generate:error]", e);
  process.exit(1);
});
