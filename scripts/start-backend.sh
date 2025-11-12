#!/bin/zsh
# ==================================================
# 🚀 Kollabor8 Keystone Startup Script (Mac)
# Author: Anthony Xavier | Kollabor8 Web Collectives
# ==================================================

echo "🧩 Starting Kollabor8 Keystone backend..."

# --- Step 1: Set environment ----------------------
export NODE_ENV=development
export PORT=8000
export MONGO_URI="mongodb://localhost:27017/k8_keystone"
export FRONTEND_URL="http://localhost:5173"

# Optional: Load local .env.dev if it exists
if [ -f "./server/.env.dev" ]; then
  echo "📦 Loading environment variables from server/.env.dev"
  export $(grep -v '^#' ./server/.env.dev | xargs)
fi

# --- Step 2: Start MongoDB ------------------------
if ! pgrep -x "mongod" >/dev/null; then
  echo "🍃 Starting MongoDB..."
  brew services start mongodb-community@7.0
else
  echo "🍃 MongoDB already running."
fi

# --- Step 3: Clean and prepare --------------------
echo "🧹 Cleaning old build cache..."
rm -rf server/dist node_modules/.cache 2>/dev/null

# --- Step 4: Build and Type-check -----------------
echo "🔍 Running TypeScript checks..."
pnpm tsc -p server/tsconfig.json --noEmit

if [ $? -ne 0 ]; then
  echo "❌ TypeScript errors detected. Fix them before starting the server."
  exit 1
fi

# --- Step 5: Start backend ------------------------
echo "⚙️ Launching backend server..."
pnpm ts-node --esm server/src/app.ts &
BACKEND_PID=$!

# --- Step 6: Start additional services ------------
# You can later add queues, workers, or report generators here
echo "🔧 (Placeholder) Launching services..."
# pnpm ts-node --esm server/src/services/worker.ts &

# --- Step 7: Start frontend (optional) ------------
if [ -d "client" ]; then
  echo "🎨 Starting frontend (Vite)..."
  cd client && pnpm run dev &
  cd ..
fi

# --- Step 8: Watchdog -----------------------------
echo "✅ Kollabor8 Keystone is live!"
echo "🌐 Backend: http://localhost:${PORT}"
echo "🧠 Health Check: curl http://localhost:${PORT}/health"

wait $BACKEND_PID
