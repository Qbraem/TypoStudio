#!/bin/bash
# Studio Typo – maakt het Xcode-project aan en zet alles juist (enkel op een Mac).
# Gebruik:  npm run ios:setup
set -e
cd "$(dirname "$0")/.."

echo "▸ Pakketten installeren…"
npm install

if [ ! -d ios ]; then
  echo "▸ iOS-project aanmaken…"
  npx cap add ios
fi
echo "▸ Web-app en plugins naar iOS kopiëren…"
npx cap sync ios

PL="ios/App/App/Info.plist"
PB=/usr/libexec/PlistBuddy
setv(){ $PB -c "Set :$1 $3" "$PL" 2>/dev/null || $PB -c "Add :$1 $2 $3" "$PL"; }

echo "▸ Info.plist instellen…"
setv CFBundleDisplayName string "Studio Typo"
setv NSPhotoLibraryAddUsageDescription string "Studio Typo saves your designs as transparent PNG images to your photo library."
setv NSPhotoLibraryUsageDescription string "Studio Typo saves your designs to your photo library and lets you pick a photo to preview them on."
setv NSLocationWhenInUseUsageDescription string "Studio Typo uses your approximate location only to show your city and today's weather in Live designs. Your location is never stored."
setv ITSAppUsesNonExemptEncryption bool false
setv UIViewControllerBasedStatusBarAppearance bool true
setv UIRequiresFullScreen bool false
$PB -c "Delete :UISupportedInterfaceOrientations" "$PL" 2>/dev/null || true
$PB -c "Add :UISupportedInterfaceOrientations array" "$PL"
for o in Portrait LandscapeLeft LandscapeRight; do $PB -c "Add :UISupportedInterfaceOrientations: string UIInterfaceOrientation$o" "$PL"; done
$PB -c "Delete :UISupportedInterfaceOrientations~ipad" "$PL" 2>/dev/null || true
$PB -c "Add :UISupportedInterfaceOrientations~ipad array" "$PL"
for o in Portrait PortraitUpsideDown LandscapeLeft LandscapeRight; do $PB -c "Add :UISupportedInterfaceOrientations~ipad: string UIInterfaceOrientation$o" "$PL"; done

echo "▸ App-icoon en splashscreen…"
cp resources/ios/AppIcon-512@2x.png ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png
for f in splash-2732x2732.png splash-2732x2732-1.png splash-2732x2732-2.png; do
  cp resources/ios/splash.png "ios/App/App/Assets.xcassets/Splash.imageset/$f"
done

echo ""
echo "✓ Klaar. Open het project met:  npm run ios:open"
