#!/usr/bin/env bash

# Show commands that are being run
set -x

# Prerequisites:
# `imagemagick` 7.1.1.23 (https://imagemagick.org/index.php)

ICONS_INPUT_DIR="icons"
ICONS_OUTPUT_DIR="icons/dist"
MAIN_INPUT_SVG="$ICONS_INPUT_DIR/main.svg"
MAIN_OUTPUT_ICO="$ICONS_OUTPUT_DIR/main.ico"
MAIN_OUTPUT_PNG_PREFIX="$ICONS_OUTPUT_DIR/main_"
MAIN_OUTPUT_PNG_SUFFIX=".png"
MAIN_PNG_SIZES=( 128 144 256 512 )

# Additional arguments to make generated images reproducible
CONVERT_ARGS_REPRODUCIBLE=-define png:exclude-chunks=date,time

convert --version

# Create output directory
mkdir -p "$ICONS_OUTPUT_DIR"

# Create `ico` image file
# https://iconhandbook.co.uk/reference/chart/windows/
# Windows needs: 16x16, 24x24, 32x32, 48x48, 64x64, 128x128
convert -background none "$MAIN_INPUT_SVG" -define icon:auto-resize=128,64,48,32,16 "$MAIN_OUTPUT_ICO"

# Create `png` image files
for PNG_SIZE in "${MAIN_PNG_SIZES[@]}"
do
    convert -background none $CONVERT_ARGS_REPRODUCIBLE -size "${PNG_SIZE}x${PNG_SIZE}" "$MAIN_INPUT_SVG" "$MAIN_OUTPUT_PNG_PREFIX$PNG_SIZE$MAIN_OUTPUT_PNG_SUFFIX"
done
