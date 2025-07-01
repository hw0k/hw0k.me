#!/bin/bash

set -euo pipefail
IFS=$'\n\t'

aws s3 sync s3://hw0k-blog-obsidian-vault ./src/contents/ --exclude "templates/*" --exclude "archives/*" --delete
