#!/bin/bash
set -euo pipefail

# This script installs development dependencies for Observable Framework.
# It verifies Node.js >=18 and ensures Yarn is available via Corepack.

if ! command -v node >/dev/null; then
  echo "Error: Node.js is not installed. Please install Node.js 18 or later." >&2
  exit 1
fi

NODE_MAJOR=$(node --version | sed -E 's/v([0-9]+).*/\1/')
if [ "$NODE_MAJOR" -lt 18 ]; then
  echo "Error: Node.js 18 or later is required. Found $(node --version)." >&2
  exit 1
fi

# Ensure yarn is available
if ! command -v yarn >/dev/null; then
  echo "Yarn not found; enabling via corepack." >&2
  corepack enable
fi

echo "Installing dependencies via Yarn..."
yarn install

echo "Setup complete." 
