#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
LOG_DIR="$ROOT_DIR/.logs"

mkdir -p "$LOG_DIR"

cleanup() {
  if [[ -n "${BACKEND_PID:-}" ]] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
  if [[ -n "${FRONTEND_PID:-}" ]] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

echo "Starting backend..."
(cd "$BACKEND_DIR" && npm run dev > "$LOG_DIR/backend.dev.log" 2>&1) &
BACKEND_PID=$!

echo "Starting frontend..."
(cd "$FRONTEND_DIR" && npm run dev > "$LOG_DIR/frontend.dev.log" 2>&1) &
FRONTEND_PID=$!

echo "Waiting for backend health check..."
for _ in {1..60}; do
  if curl -fsS "http://localhost:5000/api/health" >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

echo "Waiting for frontend home page..."
for _ in {1..60}; do
  if curl -fsS "http://localhost:3000" >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

echo "Running backend smoke test..."
(cd "$BACKEND_DIR" && npm run test:smoke)

echo "All services are up."
echo "Backend:  http://localhost:5000/api/health"
echo "Frontend: http://localhost:3000"
echo "Logs:"
echo "  $LOG_DIR/backend.dev.log"
echo "  $LOG_DIR/frontend.dev.log"
echo "Press Ctrl+C to stop both servers."

wait
