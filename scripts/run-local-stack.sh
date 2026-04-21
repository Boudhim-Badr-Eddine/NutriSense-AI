#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
LOG_DIR="$ROOT_DIR/.logs"
BACKEND_LOG="$LOG_DIR/backend.dev.log"
FRONTEND_LOG="$LOG_DIR/frontend.dev.log"

BACKEND_HEALTH_URL="${BACKEND_HEALTH_URL:-http://localhost:5000/api/health}"
FRONTEND_HEALTH_URL="${FRONTEND_HEALTH_URL:-http://localhost:3000}"
HEALTH_TIMEOUT_SECONDS="${HEALTH_TIMEOUT_SECONDS:-90}"
RUN_SMOKE_TEST="${RUN_SMOKE_TEST:-1}"

mkdir -p "$LOG_DIR"

require_command() {
  local cmd="$1"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Missing required command: $cmd"
    exit 1
  fi
}

show_recent_logs() {
  local log_file="$1"
  local title="$2"
  if [[ -f "$log_file" ]]; then
    echo "----- $title (last 80 lines) -----"
    tail -n 80 "$log_file" || true
    echo "----------------------------------"
  fi
}

probe_url() {
  local url="$1"

  if command -v curl >/dev/null 2>&1; then
    curl -fsS "$url" >/dev/null 2>&1
    return $?
  fi

  if command -v wget >/dev/null 2>&1; then
    wget -q --spider "$url" >/dev/null 2>&1
    return $?
  fi

  if command -v node >/dev/null 2>&1; then
    node -e "fetch(process.argv[1]).then((res)=>process.exit(res.ok?0:1)).catch(()=>process.exit(1))" "$url" >/dev/null 2>&1
    return $?
  fi

  echo "No HTTP probe tool found. Install curl, wget, or node."
  return 1
}

wait_for_service() {
  local label="$1"
  local url="$2"
  local pid="$3"
  local timeout="$4"
  local log_file="$5"
  local elapsed=0

  echo "Waiting for $label at $url ..."
  while (( elapsed < timeout )); do
    if probe_url "$url"; then
      echo "$label is healthy."
      return 0
    fi

    if ! kill -0 "$pid" 2>/dev/null; then
      echo "$label process exited before becoming healthy."
      show_recent_logs "$log_file" "$label log"
      return 1
    fi

    sleep 1
    elapsed=$((elapsed + 1))
  done

  echo "$label health check timed out after ${timeout}s."
  show_recent_logs "$log_file" "$label log"
  return 1
}

cleanup() {
  if [[ -n "${BACKEND_PID:-}" ]] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
  if [[ -n "${FRONTEND_PID:-}" ]] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

require_command npm

if [[ ! -d "$BACKEND_DIR" ]]; then
  echo "Backend directory not found: $BACKEND_DIR"
  exit 1
fi

if [[ ! -d "$FRONTEND_DIR" ]]; then
  echo "Frontend directory not found: $FRONTEND_DIR"
  exit 1
fi

echo "Starting backend..."
(cd "$BACKEND_DIR" && npm run dev > "$BACKEND_LOG" 2>&1) &
BACKEND_PID=$!

echo "Starting frontend..."
(cd "$FRONTEND_DIR" && npm run dev > "$FRONTEND_LOG" 2>&1) &
FRONTEND_PID=$!

wait_for_service "Backend" "$BACKEND_HEALTH_URL" "$BACKEND_PID" "$HEALTH_TIMEOUT_SECONDS" "$BACKEND_LOG"

wait_for_service "Frontend" "$FRONTEND_HEALTH_URL" "$FRONTEND_PID" "$HEALTH_TIMEOUT_SECONDS" "$FRONTEND_LOG"

if [[ "$RUN_SMOKE_TEST" == "1" ]]; then
  echo "Running backend smoke test..."
  (cd "$BACKEND_DIR" && npm run test:smoke)
else
  echo "Skipping backend smoke test (RUN_SMOKE_TEST=$RUN_SMOKE_TEST)."
fi

echo "All services are up."
echo "Backend:  $BACKEND_HEALTH_URL"
echo "Frontend: $FRONTEND_HEALTH_URL"
echo "Logs:"
echo "  $BACKEND_LOG"
echo "  $FRONTEND_LOG"
echo "Press Ctrl+C to stop both servers."

wait
