#!/usr/bin/env bash
# Update the live website on the VPS to the latest code on GitHub (main branch).
# Run on the VPS from the website folder:   bash deploy/update.sh
set -euo pipefail
cd "$(dirname "$0")/.."

echo "→ Fetching latest code"
git fetch --quiet origin main
git reset --hard origin/main

echo "→ Installing packages"
npm ci --omit=dev --no-audit --no-fund

echo "→ Restarting website"
pm2 reload bcat-website --update-env || pm2 start deploy/ecosystem.config.cjs
pm2 save >/dev/null

echo "✓ Live: $(git log -1 --format='%h %s')"
