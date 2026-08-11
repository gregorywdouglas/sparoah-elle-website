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

echo "Checks passed. Deploying..."
swa deploy ./ --deployment-token "$SWA_DEPLOYMENT_TOKEN" --env production
