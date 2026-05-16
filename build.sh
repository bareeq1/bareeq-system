#!/usr/bin/env bash
# Compile all JSX source files to plain JS.
# Run after editing any .jsx file: bash build.sh
set -e
for src in \
  project/i18n.jsx \
  project/data.jsx \
  project/components.jsx \
  project/pos-hub.jsx \
  project/screens/kds-board.jsx \
  project/screens/new-order.jsx \
  project/screens/home.jsx \
  project/screens/menu.jsx \
  project/screens/rewards.jsx \
  project/screens/dashboard.jsx \
  project/screens/admin/dashboard.jsx \
  project/screens/admin/payment-review.jsx \
  project/screens/admin/admin-dashboard.jsx \
  project/tweaks-panel.jsx \
  project/app.jsx; do
  out="${src%.jsx}.js"
  ./node_modules/.bin/babel "$src" -o "$out" && echo "✓ $out"
done
echo "Build complete."
