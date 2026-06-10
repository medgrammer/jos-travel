#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEPLOY_ROOT="$ROOT_DIR/deploy"
STAGE_DIR="$DEPLOY_ROOT/godaddy-upload"
ARCHIVE_PATH="$DEPLOY_ROOT/jos-travel-godaddy-upload.zip"

cd "$ROOT_DIR"

rm -rf "$STAGE_DIR"
mkdir -p "$STAGE_DIR" "$DEPLOY_ROOT"

copy_path() {
  if [ -e "$1" ]; then
    cp -R "$1" "$STAGE_DIR/"
  fi
}

copy_path app
copy_path components
copy_path lib
copy_path public
copy_path scripts
copy_path supabase
copy_path .env.example
copy_path .gitignore
copy_path eslint.config.mjs
copy_path GODADDY_DEPLOYMENT.md
copy_path next-env.d.ts
copy_path next.config.ts
copy_path package-lock.json
copy_path package.json
copy_path postcss.config.js
copy_path proxy.ts
copy_path tailwind.config.ts
copy_path tsconfig.json

find "$STAGE_DIR" -name ".DS_Store" -delete
rm -rf "$STAGE_DIR/supabase/.temp"

rm -f "$ARCHIVE_PATH"
cd "$STAGE_DIR"
zip -X -qr "$ARCHIVE_PATH" .
unzip -t "$ARCHIVE_PATH" >/dev/null

printf "ZIP source GoDaddy prêt : %s\n" "$ARCHIVE_PATH"
