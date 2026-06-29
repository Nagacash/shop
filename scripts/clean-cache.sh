#!/usr/bin/env bash
# Safe Next.js cache reset for external volumes (e.g. /Volumes/MPC_CODE).
# Stale .next + AppleDouble ._ files cause ENOENT build-manifest errors.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "[clean-cache] Removing .next and node_modules/.cache..."
rm -rf .next node_modules/.cache

echo "[clean-cache] Removing macOS AppleDouble files (._*)..."
find . -name '._*' -not -path './node_modules/*' -delete 2>/dev/null || true

echo "[clean-cache] Done. Start dev with: npm run dev:clean"
