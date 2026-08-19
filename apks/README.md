# AgriVil Android & iOS Application Packages

This directory houses the built mobile application packages for AgriVil.

## Built Artifacts

| App Package | Type | Target Route | Purpose |
|---|---|---|---|
| **`AgriVil-Consumer.apk`** | Android APK | `/m` | Customer marketplace, produce ordering, MoMo checkout |
| **`AgriVil-Farmer.apk`** | Android APK | `/m/farmer` | Farmer cockpit, product listings, harvest & order management |
| **`AgriVil-iOS.xcworkspace`** | iOS Xcode Project | `/m` | Native iOS workspace for Xcode / TestFlight / App Store |

---

## 1. Native Android Source & Builds (`mobile/android`)

The Android native project is fully configured in [`mobile/android/`](../mobile/android/).

### To Build Locally (Android Studio / Gradle):
```bash
cd mobile/android

# Build Consumer Marketplace APK
./gradlew :consumer:assembleDebug

# Build Farmer Cockpit APK
./gradlew :admin:assembleDebug
```

Output APK Paths:
- `mobile/android/consumer/build/outputs/apk/debug/consumer-debug.apk`
- `mobile/android/admin/build/outputs/apk/debug/admin-debug.apk`

---

## 2. Native iOS Source & Builds (`mobile/ios`)

The native iOS Xcode workspace is scaffolded at [`mobile/ios/App/App.xcworkspace`](../mobile/ios/App/App.xcworkspace).

- Open in Xcode on macOS.
- Build / Archive for simulator or physical iOS device.

---

## 3. Instant iOS & Android Web Installation (PWA)

The deployed production URL [`https://agrivil1.vercel.app/m`](https://agrivil1.vercel.app/m) is fully PWA-enabled:
- **iPhone / iOS**: Open in Safari $\rightarrow$ Tap **Share** $\rightarrow$ **Add to Home Screen**.
- **Android**: Open in Chrome $\rightarrow$ Tap **Install App**.
