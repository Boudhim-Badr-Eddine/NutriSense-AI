#!/usr/bin/env bash
set -euo pipefail

pkill -f "ts-node src/server.ts|nodemon --exec ts-node src/server.ts|next dev" || true

echo "Stopped backend/frontend local dev processes (if any were running)."
