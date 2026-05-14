#!/usr/bin/env bash
# Compile all JSX source files to plain JS.
# Run after editing any .jsx file: bash build.sh
set -e
for src in \
  project/i18n.jsx \
  project/data.jsx \
  project/components.jsx \
  project/screens/home.jsx \
  project/screens/menu.jsx \
  project/screens/rewards.jsx \
  project/screens/dashboard.jsx \
  project/screens/branch/branch-orders.jsx \
  project/tweaks-panel.jsx \
  project/app.jsx; do
  out="${src%.jsx}.js"
  ./node_modules/.bin/babel "$src" -o "$out" && echo "✓ $out"
done
echo "Build complete."
