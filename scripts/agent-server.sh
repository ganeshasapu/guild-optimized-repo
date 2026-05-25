#!/usr/bin/env bash
# Shared helper for agent scripts: builds, finds a free port, starts the server.
# Source this file — do not execute directly.
#
# After sourcing, these are set:
#   AGENT_PORT     — the port the server is listening on
#   AGENT_PID_FILE — path to the PID file (cleaned up on EXIT)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[1]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

_agent_find_free_port() {
  local port="${1:-3000}"
  while lsof -ti :"$port" > /dev/null 2>&1; do
    port=$((port + 1))
  done
  echo "$port"
}

AGENT_PORT=$(_agent_find_free_port 3000)
AGENT_PID_FILE="$ROOT_DIR/.agent-server-$AGENT_PORT.pid"

_agent_cleanup() {
  if [ -f "$AGENT_PID_FILE" ]; then
    local pid
    pid=$(cat "$AGENT_PID_FILE")
    if kill -0 "$pid" 2>/dev/null; then
      kill "$pid" 2>/dev/null || true
      wait "$pid" 2>/dev/null || true
    fi
    rm -f "$AGENT_PID_FILE"
  fi
}

trap _agent_cleanup EXIT INT TERM

if [ -f "$ROOT_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT_DIR/.env"
  set +a
fi

if [ -d "$ROOT_DIR/apps/web/.next" ]; then
  echo "==> Build output exists, skipping build"
else
  echo "==> Building Next.js app..."
  pnpm --filter=@guild-optimized/web build
fi

echo "==> Starting Next.js server on port $AGENT_PORT..."
PORT="$AGENT_PORT" pnpm --filter=@guild-optimized/web exec next start -p "$AGENT_PORT" &
echo $! > "$AGENT_PID_FILE"

echo "==> Waiting for server to be ready..."
for i in $(seq 1 30); do
  if curl -sf "http://localhost:$AGENT_PORT" > /dev/null 2>&1; then
    echo "    Server ready on port $AGENT_PORT after ${i}s"
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "ERROR: Server failed to start within 30 seconds"
    exit 1
  fi
  sleep 1
done

export AGENT_PORT
export AGENT_PID_FILE
