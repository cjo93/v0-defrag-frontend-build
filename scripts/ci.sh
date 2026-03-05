#!/bin/bash
set -e

echo "[DEFRAG_CI] Starting CI pipeline..."

echo "[DEFRAG_CI] Installing dependencies..."
pnpm install --frozen-lockfile

echo "[DEFRAG_CI] Running typecheck..."
pnpm typecheck

echo "[DEFRAG_CI] Running lint..."
pnpm lint

echo "[DEFRAG_CI] Running build..."
pnpm build

echo "[DEFRAG_CI] CI pipeline complete ✓"
