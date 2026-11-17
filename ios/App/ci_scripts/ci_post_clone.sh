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

echo "▸ Swift-pakketten opnieuw oplossen (Package.resolved bijwerken voor nieuwe plugins)…"
# Xcode Cloud zet automatisch oplossen standaard uit; even toestaan zodat de lijst opnieuw gemaakt kan worden
defaults delete com.apple.dt.Xcode IDEPackageOnlyUseVersionsFromResolvedFile 2>/dev/null || true
defaults delete com.apple.dt.Xcode IDEDisableAutomaticPackageResolution 2>/dev/null || true
defaults write com.apple.dt.Xcode IDEPackageOnlyUseVersionsFromResolvedFile -bool NO
defaults write com.apple.dt.Xcode IDEDisableAutomaticPackageResolution -bool NO
rm -f ios/App/App.xcodeproj/project.xcworkspace/xcshareddata/swiftpm/Package.resolved
xcodebuild -resolvePackageDependencies -project ios/App/App.xcodeproj -scheme App -disableAutomaticPackageResolution=NO 2>/dev/null \
  || xcodebuild -resolvePackageDependencies -project ios/App/App.xcodeproj -scheme App
ls -la ios/App/App.xcodeproj/project.xcworkspace/xcshareddata/swiftpm/ || true

echo "✓ Klaar voor de build"
