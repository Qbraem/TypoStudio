#!/bin/sh
# Xcode Cloud: draait na het klonen van de repo, vóór het bouwen.
# Installeert Node + de Capacitor-pakketten en kopieert de web-app (public/) naar het iOS-project.
set -e

echo "▸ Node installeren…"
export HOMEBREW_NO_INSTALL_CLEANUP=TRUE
export HOMEBREW_NO_AUTO_UPDATE=1
brew install node

cd "$CI_PRIMARY_REPOSITORY_PATH"

echo "▸ npm-pakketten installeren…"
# npm install (niet npm ci): zo komen nieuwe plugins uit package.json altijd mee, ook als package-lock.json achterloopt
npm install --legacy-peer-deps --no-audit --no-fund

echo "▸ Web-app naar iOS kopiëren (cap sync)…"
npx cap sync ios

echo "✓ Klaar voor de build"
