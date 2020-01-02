#!/bin/bash

set -eu

target=$1
dir="venues/$target"

if [ -z "$target" ] || [ ! -d "$dir" ]; then
  echo "specify correct venue name"
  exit 1
fi

branch="link-$target"
set -x
if [[ -n "$(git status --porcelain "$dir")" ]]; then
  git config user.name okitan
  git config user.email okitakunio@gmail.com

  # TODO: when just adding scraped venues to nolinked, do commit to master directly
  git add -A "$dir"
  git commit -m ":innocent: linked venue of $1"

  git remote set-url origin "https://okitan:$GITHUB_TOKEN@github.com/okitan/4sq-venue.git"

  git push origin "$branch"
fi
