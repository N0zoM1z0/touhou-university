#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 || $# -gt 3 ]]; then
  echo "Usage: scripts/optimize-images.sh INPUT OUTPUT.webp [MAX_GEOMETRY]"
  exit 1
fi

input_path=$1
output_path=$2
max_geometry=${3:-1600x1200}

if [[ ! -f "$input_path" ]]; then
  echo "Input does not exist: $input_path"
  exit 1
fi

mkdir -p "$(dirname "$output_path")"
convert "$input_path" \
  -auto-orient \
  -resize "${max_geometry}>" \
  -strip \
  -quality 82 \
  "$output_path"

identify -format '%f %wx%h %b\n' "$output_path"
