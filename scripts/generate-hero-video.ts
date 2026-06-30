import { config } from "dotenv";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import sharp from "sharp";

config({ path: ".env.local" });

const SOURCE_IMAGE = join(process.cwd(), "public", "website-images", "website-naga.jpeg");
const OUTPUT_DIR = join(process.cwd(), "public", "website-images");
const FRAME_PATH = join(OUTPUT_DIR, "hero-bg-frame.jpg");
const SOURCE_MP4 = join(OUTPUT_DIR, "hero-bg-source.mp4");

const MODEL = "sora-2";
const SIZE = "1280x720";
const SECONDS = "8";

const PROMPT = [
  "Slow cinematic push-in on a black streetwear hoodie flat lay on dark concrete.",
  "Subtle warm gold rim light sweeps across the fabric.",
  "Micro fabric texture movement only.",
  "Locked product layout — no new objects, no faces, no readable text changes.",
  "Luxury editorial mood, ultra high contrast black and gold.",
  "Seamless loop feel.",
].join(" ");

const POLL_INTERVAL_MS = 15_000;
const MAX_POLL_ATTEMPTS = 60;

async function prepareReferenceFrame(): Promise<Buffer> {
  const [width, height] = SIZE.split("x").map(Number);

  return sharp(SOURCE_IMAGE)
    .resize(width, height, { fit: "cover", position: "centre" })
    .jpeg({ quality: 92 })
    .toBuffer();
}

async function createVideoJob(apiKey: string, frame: Buffer): Promise<string> {
  const form = new FormData();
  form.append("model", MODEL);
  form.append("prompt", PROMPT);
  form.append("size", SIZE);
  form.append("seconds", SECONDS);
  form.append(
    "input_reference",
    new Blob([new Uint8Array(frame)], { type: "image/jpeg" }),
    "hero-bg-frame.jpg",
  );

  const response = await fetch("https://api.openai.com/v1/videos", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: form,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Video create failed (${response.status}): ${errText.slice(0, 500)}`);
  }

  const json = (await response.json()) as { id?: string; status?: string };
  if (!json.id) {
    throw new Error("Video create response missing id");
  }

  console.log(`[hero-video] Job started: ${json.id} (status=${json.status ?? "unknown"})`);
  return json.id;
}

async function pollVideoJob(apiKey: string, videoId: string): Promise<void> {
  for (let attempt = 1; attempt <= MAX_POLL_ATTEMPTS; attempt++) {
    const response = await fetch(`https://api.openai.com/v1/videos/${videoId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Poll failed (${response.status}): ${errText.slice(0, 300)}`);
    }

    const json = (await response.json()) as {
      status?: string;
      progress?: number;
      error?: { message?: string };
    };

    const progress =
      typeof json.progress === "number" ? ` ${json.progress}%` : "";
    console.log(
      `[hero-video] Poll ${attempt}/${MAX_POLL_ATTEMPTS}: ${json.status ?? "unknown"}${progress}`,
    );

    if (json.status === "completed") {
      return;
    }

    if (json.status === "failed") {
      throw new Error(json.error?.message ?? "Video generation failed");
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  throw new Error("Video generation timed out");
}

async function downloadVideo(apiKey: string, videoId: string): Promise<Buffer> {
  const response = await fetch(`https://api.openai.com/v1/videos/${videoId}/content`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Download failed (${response.status}): ${errText.slice(0, 300)}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

async function main() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    console.error(
      "OPENAI_API_KEY is not set. Add it to .env.local:\n  OPENAI_API_KEY=sk-...",
    );
    process.exit(1);
  }

  mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log("[hero-video] Preparing 1280x720 reference frame...");
  const frame = await prepareReferenceFrame();
  writeFileSync(FRAME_PATH, frame);
  console.log(`[hero-video] Frame saved: ${FRAME_PATH}`);

  const videoId = await createVideoJob(apiKey, frame);
  await pollVideoJob(apiKey, videoId);

  console.log("[hero-video] Downloading MP4...");
  const mp4 = await downloadVideo(apiKey, videoId);
  writeFileSync(SOURCE_MP4, mp4);
  console.log(`[hero-video] Saved: ${SOURCE_MP4} (${(mp4.length / 1024 / 1024).toFixed(2)} MB)`);
  console.log("[hero-video] Next: npm run encode:hero-video");
}

main().catch((error) => {
  console.error("[hero-video] Error:", error instanceof Error ? error.message : error);
  process.exit(1);
});
