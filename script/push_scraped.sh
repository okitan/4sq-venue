#!/bin/bash

set -eu

target=$1
dir="venues/$target"

if [ -z "$target" ] || [ ! -d "$dir" ]; then
  echo "specify correct venue name"
  exit 1
fi

branch="scrape-$target"
set -x
if [[ -n "$(git status --porcelain "$dir")" ]]; then
  git config user.name okitan
  git config user.email okitakunio@gmail.com

  git add -A "$dir"
  git commit -m ":innocent: scraped venue of $1"

  git push origin "$branch"
fi
