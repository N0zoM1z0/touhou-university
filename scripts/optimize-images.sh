#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 || $# -gt 3 ]]; then
  echo "Usage: scripts/optimize-images.sh INPUT OUTPUT.webp [MAX_GEOMETRY]"
  exit 1
fi

input_path=$1
output_path=$2
max_geometry=${3:-1600x1200}
image_quality=${IMAGE_QUALITY:-82}
image_encoder=${IMAGE_ENCODER:-imagemagick}

if [[ ! -f "$input_path" ]]; then
  echo "Input does not exist: $input_path"
  exit 1
fi

mkdir -p "$(dirname "$output_path")"
if [[ "$image_encoder" == "ffmpeg" ]] && command -v ffmpeg >/dev/null 2>&1; then
  max_width=${max_geometry%x*}
  max_height=${max_geometry#*x}
  ffmpeg -loglevel error -y -i "$input_path" \
    -vf "scale=${max_width}:${max_height}:force_original_aspect_ratio=decrease" \
    -c:v libwebp -q:v "$image_quality" -compression_level 6 \
    "$output_path"
else
  convert "$input_path" \
    -auto-orient \
    -resize "${max_geometry}>" \
    -strip \
    -quality "$image_quality" \
    "$output_path"
fi

identify -format '%f %wx%h %b\n' "$output_path"
