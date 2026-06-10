#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEPLOY_ROOT="$ROOT_DIR/deploy"
DEPLOY_DIR="$DEPLOY_ROOT/godaddy-node"
ARCHIVE_PATH="$DEPLOY_ROOT/jos-travel-godaddy-node.zip"

cd "$ROOT_DIR"

NEXT_OUTPUT_STANDALONE=1 npm run build

rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR/.next" "$DEPLOY_ROOT"

cp -R .next/standalone/. "$DEPLOY_DIR/"
cp -R .next/static "$DEPLOY_DIR/.next/static"
cp -R public "$DEPLOY_DIR/public"
cp .env.example "$DEPLOY_DIR/.env.example"
cp GODADDY_DEPLOYMENT.md "$DEPLOY_DIR/README-GODADDY.md"

rm -f "$ARCHIVE_PATH"
cd "$DEPLOY_DIR"
zip -qr "$ARCHIVE_PATH" .

printf "Package GoDaddy prêt : %s\n" "$ARCHIVE_PATH"
