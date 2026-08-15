#!/usr/bin/env bash
# Deploy the Sparoah Elle site to Azure Static Web Apps.
# Requires: npm install -g @azure/static-web-apps-cli
# Requires: SWA_DEPLOYMENT_TOKEN set in .env (never commit that file)

set -euo pipefail
cd "$(dirname "$0")"

[ -f .env ] && set -a && . ./.env && set +a

if [ -z "${SWA_DEPLOYMENT_TOKEN:-}" ]; then
  echo "SWA_DEPLOYMENT_TOKEN is not set. Add it to .env or export it." >&2
  exit 1
fi

echo "Pre-flight checks..."

# Fail if an external network origin sneaks into the markup (CSP is self-only).
if grep -nE '(src|href)="https?://' -- *.html | grep -v 'sparoahelle.com' | grep -v 'schema.org'; then
  echo "External origin found in markup. The CSP blocks these. Aborting." >&2
  exit 1
fi

# Fail on inline styles, which the CSP also blocks.
if grep -n 'style="' -- *.html; then
  echo "Inline style attribute found. Move it to styles.css. Aborting." >&2
  exit 1
fi

# Everything published to the web root, listed explicitly. Anything absent from
# this list stays private. Deploying the folder wholesale would publish CLAUDE.md,
# README.md, and docs/specs/adult-intake.md at their own URLs.
PUBLIC_FILES=(
  index.html
  privacy.html
  404.html
  styles.css
  script.js
  favicon.svg
  favicon.ico
  apple-touch-icon.png
  icon-512.png
  og-image.png
  robots.txt
  sitemap.xml
  staticwebapp.config.json
)

STAGE_ROOT="$(mktemp -d)"
trap 'rm -rf "$STAGE_ROOT"' EXIT
mkdir -p "$STAGE_ROOT/site"

for f in "${PUBLIC_FILES[@]}"; do
  if [ ! -f "$f" ]; then
    echo "Required file is missing: $f. Aborting." >&2
    exit 1
  fi
  cp "$f" "$STAGE_ROOT/site/"
done

echo "Checks passed. Staged ${#PUBLIC_FILES[@]} files. Deploying..."

# StaticSitesClient refuses to run when the shell's working directory is the
# artifact folder itself — it fails with "Current directory cannot be identical
# to or contained within artifact folders", surfaced only under --verbose.
# So deploy from the staging parent and name the folder.
cd "$STAGE_ROOT"
swa deploy ./site --deployment-token "$SWA_DEPLOYMENT_TOKEN" --env production
