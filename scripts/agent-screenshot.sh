#!/usr/bin/env bash
set -euo pipefail

ROUTES="${1:-/}"

# shellcheck disable=SC1091
source "$(dirname "${BASH_SOURCE[0]}")/agent-server.sh"

echo "==> Taking screenshots for: $ROUTES"
SCREENSHOT_ROUTES="$ROUTES" BASE_URL="http://localhost:$AGENT_PORT" \
  pnpm exec playwright test e2e/screenshot.spec.ts --reporter=list

echo "==> Screenshots saved to e2e/screenshots/"
ls -1 e2e/screenshots/*.png 2>/dev/null
