#!/bin/bash

cat classic-mahjong/pony-atlas.png | base64 -w 0 | xclip -selection clipboard

echo "Copied"