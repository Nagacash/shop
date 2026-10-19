import { closeSync, createReadStream, existsSync, openSync, readSync, statSync } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { PRODUCER_PACK_FILENAME } from "@/lib/digital/pack";

const DIGITAL_DIR = path.join(process.cwd(), "private", "digital");
const LOCAL_FILE_HEADER = 0x04034b50;
const CENTRAL_DIRECTORY_HEADER = 0x02014b50;
const END_OF_CENTRAL_DIRECTORY = 0x06054b50;

export type PackFileStatus =
  | { ok: true; absolutePath: string; size: number }
  | { ok: false; message: string };

function packPath(): string {
  const absolutePath = path.join(DIGITAL_DIR, PRODUCER_PACK_FILENAME);
  if (!absolutePath.startsWith(DIGITAL_DIR + path.sep)) {
    throw new Error("Refusing to resolve a path outside private/digital.");
  }
  return absolutePath;
}

/** Filenames stored in a zip local-file headers. Ignores truncated or non-zip bytes. */
export function zipEntryNames(buffer: Buffer): string[] {
  const names: string[] = [];
  let offset = 0;

  while (offset + 30 <= buffer.length) {
    if (buffer.readUInt32LE(offset) !== LOCAL_FILE_HEADER) break;

    const flags = buffer.readUInt16LE(offset + 6);
    const compressedSize = buffer.readUInt32LE(offset + 18);
    const nameLength = buffer.readUInt16LE(offset + 26);
    const extraLength = buffer.readUInt16LE(offset + 28);
    const nameStart = offset + 30;
    const nameEnd = nameStart + nameLength;
    if (nameEnd > buffer.length) break;

    names.push(buffer.subarray(nameStart, nameEnd).toString("utf8"));

    if (flags & 0x8) break;

    const next = nameEnd + extraLength + compressedSize;
    if (next <= offset) break;
    offset = next;
  }

  return names;
}

export function entryIsBlockedInstaller(name: string): boolean {
  const base = name.split(/[/\\]/).pop()?.toLowerCase() ?? "";
  return base.endsWith(".dmg");
}

export function zipDistributesBlockedInstaller(buffer: Buffer): boolean {
  return zipEntryNames(buffer).some(entryIsBlockedInstaller);
}

function centralDirectoryNames(absolutePath: string): string[] | null {
  const size = statSync(absolutePath).size;
  const tailSize = Math.min(size, 22 + 65535);
  const fd = openSync(absolutePath, "r");

  try {
    const tail = Buffer.alloc(tailSize);
    readSync(fd, tail, 0, tailSize, size - tailSize);

    let eocd = -1;
    for (let index = tail.length - 22; index >= 0; index -= 1) {
      if (tail.readUInt32LE(index) === END_OF_CENTRAL_DIRECTORY) {
        eocd = index;
        break;
      }
    }
    if (eocd < 0) return null;

    const cdSize = tail.readUInt32LE(eocd + 12);
    const cdOffset = tail.readUInt32LE(eocd + 16);
    if (cdOffset === 0xffffffff || cdSize === 0xffffffff) return null;
    if (cdOffset + cdSize > size) return null;

    const directory = Buffer.alloc(cdSize);
    readSync(fd, directory, 0, cdSize, cdOffset);

    const names: string[] = [];
    let offset = 0;
    while (offset + 46 <= directory.length) {
      if (directory.readUInt32LE(offset) !== CENTRAL_DIRECTORY_HEADER) break;
      const nameLength = directory.readUInt16LE(offset + 28);
      const extraLength = directory.readUInt16LE(offset + 30);
      const commentLength = directory.readUInt16LE(offset + 32);
      const nameStart = offset + 46;
      const nameEnd = nameStart + nameLength;
      if (nameEnd > directory.length) break;
      names.push(directory.subarray(nameStart, nameEnd).toString("utf8"));
      const next = nameEnd + extraLength + commentLength;
      if (next <= offset) break;
      offset = next;
    }

    return names;
  } finally {
    closeSync(fd);
  }
}

export function readProducerPackFile(): PackFileStatus {
  const absolutePath = packPath();
  if (!existsSync(absolutePath)) {
    return {
      ok: false,
      message:
        "Naga Producer Pack Volume1 is not for sale yet. The owner still needs to add the zip.",
    };
  }

  const names = centralDirectoryNames(absolutePath);
  if (!names) {
    return {
      ok: false,
      message: "The pack zip could not be checked, so it cannot be sold.",
    };
  }

  if (names.some(entryIsBlockedInstaller)) {
    return {
      ok: false,
      message:
        "This pack cannot be sold. The zip contains a .dmg, and Google's player is not included with this product.",
    };
  }

  return { ok: true, absolutePath, size: statSync(absolutePath).size };
}

export function openPackStream(absolutePath: string) {
  return Readable.toWeb(createReadStream(absolutePath)) as ReadableStream<Uint8Array>;
}
