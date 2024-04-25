#!/usr/bin/env bash

# Show commands that are being run
set -x

INPUT_DIR_ICONS="icons"
OUTPUT_DIR_PUBLIC="../visualization/public/en"
OUTPUT_DIR_ICONS="$OUTPUT_DIR_PUBLIC/icons"
mkdir -p "$OUTPUT_DIR_ICONS"
find . -regex '.*icons\/.*\.\(ico\|png\|svg\)' -exec cp {} "$OUTPUT_DIR_ICONS" \;
cp "$INPUT_DIR_ICONS/dist/main.ico" "$OUTPUT_DIR_PUBLIC/favicon.ico"
