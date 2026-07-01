#!/usr/bin/env bash
# Encode hero-clips/*.mp4 to WebM for Chrome/Firefox.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CLIPS_DIR="$ROOT/public/hero-clips"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg is required. Install with: brew install ffmpeg"
  exit 1
fi

encode_webm() {
  local src="$1"
  local dest="${src%.mp4}.webm"
  if [[ ! -f "$src" ]]; then
    echo "[encode-clips] Skip missing: $src"
    return 0
  fi
  echo "[encode-clips] WebM: $(basename "$dest")"
  ffmpeg -y -i "$src" \
    -an \
    -c:v libvpx-vp9 \
    -crf 32 \
    -b:v 0 \
    -row-mt 1 \
    -pix_fmt yuv420p \
    "$dest"
}

for mp4 in "$CLIPS_DIR"/hero*.mp4; do
  [[ -f "$mp4" ]] || continue
  encode_webm "$mp4"
done

echo "[encode-clips] Done:"
ls -lh "$CLIPS_DIR"/*.webm 2>/dev/null || true
