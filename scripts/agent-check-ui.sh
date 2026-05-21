#!/usr/bin/env bash
set -euo pipefail

# shellcheck disable=SC1091
source "$(dirname "${BASH_SOURCE[0]}")/agent-server.sh"

echo "==> Running Playwright smoke tests..."
if BASE_URL="http://localhost:$AGENT_PORT" pnpm exec playwright test e2e/smoke.spec.ts --reporter=list; then
  echo "==> All smoke tests passed"
  exit 0
else
  echo "==> Smoke tests FAILED"
  exit 1
fi
