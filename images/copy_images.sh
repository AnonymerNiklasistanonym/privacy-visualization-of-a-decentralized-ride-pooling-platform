#!/usr/bin/env bash

# Show commands that are being run
set -x

INPUT_DIR_ICONS="icons"
OUTPUT_DIR_ICONS="../visualization/public/en/icons"
OUTPUT_DIR_ICONS_FAVICON="../visualization/src/app"
mkdir -p "$OUTPUT_DIR_ICONS"
find . -regex '.*icons\/.*\.\(ico\|png\|svg\)' -exec cp {} "$OUTPUT_DIR_ICONS" \;
# https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons#favicon
cp "$INPUT_DIR_ICONS/main.svg" "$OUTPUT_DIR_ICONS_FAVICON/icon.svg"
