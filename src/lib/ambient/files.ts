import { createReadStream, existsSync, statSync } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import {
  AMBIENT_TRACK_CATALOG,
  isAmbientTrackId,
  type AmbientTrackId,
} from "@/lib/ambient/catalog";

const AMBIENT_DIR = path.join(process.cwd(), "private", "ambient");

export function resolveAmbientFile(id: AmbientTrackId): {
  absolutePath: string;
  size: number;
} | null {
  const track = AMBIENT_TRACK_CATALOG[id];
  if (!track) return null;

  // Reject path traversal — only catalog filenames
  const absolutePath = path.join(AMBIENT_DIR, track.file);
  if (!absolutePath.startsWith(AMBIENT_DIR + path.sep)) return null;
  if (!existsSync(absolutePath)) return null;

  const size = statSync(absolutePath).size;
  return { absolutePath, size };
}

export function openAmbientStream(absolutePath: string, start?: number, end?: number) {
  const stream =
    start !== undefined && end !== undefined
      ? createReadStream(absolutePath, { start, end })
      : createReadStream(absolutePath);

  return Readable.toWeb(stream) as ReadableStream<Uint8Array>;
}

export { isAmbientTrackId };
