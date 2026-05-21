#!/usr/bin/env bash
set -euo pipefail

SPEC_FILE="${1:?Usage: agent-playwright.sh <spec-file>}"

if [ ! -f "$SPEC_FILE" ]; then
  echo "ERROR: File not found: $SPEC_FILE"
  exit 1
fi

# shellcheck disable=SC1091
source "$(dirname "${BASH_SOURCE[0]}")/agent-server.sh"

echo "==> Running Playwright script: $SPEC_FILE"
BASE_URL="http://localhost:$AGENT_PORT" pnpm exec playwright test "$SPEC_FILE" --reporter=list
