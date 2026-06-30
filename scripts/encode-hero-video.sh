#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SOURCE="$ROOT/public/website-images/hero-bg-source.mp4"
WEBM="$ROOT/public/website-images/hero-bg.webm"
MP4="$ROOT/public/website-images/hero-bg.mp4"

if [[ ! -f "$SOURCE" ]]; then
  echo "Missing source video: $SOURCE"
  echo "Run: npm run generate:hero-video"
  exit 1
fi

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg is required. Install with: brew install ffmpeg"
  exit 1
fi

echo "[encode] WebM (VP9)..."
ffmpeg -y -i "$SOURCE" \
  -an \
  -c:v libvpx-vp9 \
  -crf 32 \
  -b:v 0 \
  -row-mt 1 \
  -pix_fmt yuv420p \
  "$WEBM"

echo "[encode] MP4 (H.264)..."
ffmpeg -y -i "$SOURCE" \
  -an \
  -c:v libx264 \
  -crf 28 \
  -preset slow \
  -pix_fmt yuv420p \
  -movflags +faststart \
  "$MP4"

echo "[encode] Done:"
ls -lh "$WEBM" "$MP4"
