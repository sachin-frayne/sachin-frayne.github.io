#!/usr/bin/env bash

image_dir="images"

for image in *.jpg; do
  if [ -f "$image" ]; then
    magick $image -resize 30% tiny/$image
  fi
done
