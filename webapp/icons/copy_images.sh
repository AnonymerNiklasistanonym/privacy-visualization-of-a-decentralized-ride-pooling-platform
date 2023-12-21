#!/usr/bin/env bash

# Show commands that are being run
set -x

find . -regex '.*\.\(ico\|png\|svg\)' -exec cp {} ../vis_ride_pool_concept/public \;
cp main.svg ../vis_ride_pool_concept/src/app/icon.svg
