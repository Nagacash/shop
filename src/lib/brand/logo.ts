import { existsSync } from "fs";
import { join } from "path";

/** User-provided chest graphic candidates (first match wins). */
const LOGO_CANDIDATES = [
  "public/naga-t-shirt/png.png",
  "public/naga-t-shirt/naga.png",
  "public/uploads/naga/brand/naga-chest-logo.png",
] as const;

const CANONICAL_LOGO_URL = "/uploads/naga/brand/naga-chest-logo.png";

export function resolveChestLogoPath(root = process.cwd()): string | null {
  for (const rel of LOGO_CANDIDATES) {
    const abs = join(root, rel);
    if (existsSync(abs)) return abs;
  }
  return null;
}

export function getChestLogoUrl(): string | null {
  if (existsSync(join(process.cwd(), "public", CANONICAL_LOGO_URL.replace(/^\//, "")))) {
    return CANONICAL_LOGO_URL;
  }
  const resolved = resolveChestLogoPath();
  if (!resolved) return null;
  if (resolved.includes("naga-t-shirt")) {
    const name = resolved.split("/").pop() ?? "naga.png";
    return `/naga-t-shirt/${name}`;
  }
  return CANONICAL_LOGO_URL;
}

export { CANONICAL_LOGO_URL };
