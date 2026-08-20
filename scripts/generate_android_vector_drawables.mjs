import fs from 'node:fs'
import path from 'node:path'

// Concept 01 colors
const C_DARK_GREEN = '#0B3B25'
const C_SUN_ORANGE = '#DF8821'
const C_CREAM      = '#FAF7F2'
const C_WHITE      = '#FFFFFF'

// Generate Android Vector XML for Concept 01 Emblem
function generateEmblemVectorXml(isWhiteOnly = false) {
  // Center is 54, 54 on a 108x108 viewport
  // Sun arch: cx=54, cy=54, r_out=22, r_in=12
  // Rays: outer radius 32, inner radius 24
  // Farmland: bottom semicircle radius 22

  const sunColor = isWhiteOnly ? C_WHITE : C_SUN_ORANGE
  const fieldColor = isWhiteOnly ? C_WHITE : C_DARK_GREEN

  return `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">

    <!-- 1. Semicircular Rising Sun Arch -->
    <path
        android:fillColor="${sunColor}"
        android:pathData="M32,54 A22,22 0 0,1 76,54 H66 A12,12 0 0,0 42,54 Z" />

    <!-- 2. Radial Sun Rays (9 Rays: 2 Baseline + 7 Upper) -->
    <!-- Baseline Left -->
    <path
        android:strokeColor="${sunColor}"
        android:strokeWidth="2.8"
        android:strokeLineCap="round"
        android:pathData="M20,54 L27,54" />
    <!-- Baseline Right -->
    <path
        android:strokeColor="${sunColor}"
        android:strokeWidth="2.8"
        android:strokeLineCap="round"
        android:pathData="M81,54 L88,54" />

    <!-- Ray 1 (~160 deg) -->
    <path
        android:strokeColor="${sunColor}"
        android:strokeWidth="2.8"
        android:strokeLineCap="round"
        android:pathData="M23.9,43.1 L30.5,45.8" />
    <!-- Ray 2 (~137 deg) -->
    <path
        android:strokeColor="${sunColor}"
        android:strokeWidth="2.8"
        android:strokeLineCap="round"
        android:pathData="M30.6,32.2 L36.4,37.6" />
    <!-- Ray 3 (~114 deg) -->
    <path
        android:strokeColor="${sunColor}"
        android:strokeWidth="2.8"
        android:strokeLineCap="round"
        android:pathData="M41.0,24.7 L44.2,32.1" />
    <!-- Ray 4 (~90 deg Top) -->
    <path
        android:strokeColor="${sunColor}"
        android:strokeWidth="2.8"
        android:strokeLineCap="round"
        android:pathData="M54.0,22.0 L54.0,30.0" />
    <!-- Ray 5 (~66 deg) -->
    <path
        android:strokeColor="${sunColor}"
        android:strokeWidth="2.8"
        android:strokeLineCap="round"
        android:pathData="M67.0,24.7 L63.8,32.1" />
    <!-- Ray 6 (~43 deg) -->
    <path
        android:strokeColor="${sunColor}"
        android:strokeWidth="2.8"
        android:strokeLineCap="round"
        android:pathData="M77.4,32.2 L71.6,37.6" />
    <!-- Ray 7 (~20 deg) -->
    <path
        android:strokeColor="${sunColor}"
        android:strokeWidth="2.8"
        android:strokeLineCap="round"
        android:pathData="M84.1,43.1 L77.5,45.8" />

    <!-- 3. Contoured Farmland Soil -->
    <path
        android:fillColor="${fieldColor}"
        android:pathData="M32,54 A22,22 0 0,0 76,54 Z" />

    <!-- 4. Negative Space Furrow Lines -->
    <!-- Left Hill Furrows -->
    <path
        android:strokeColor="${isWhiteOnly ? C_DARK_GREEN : C_CREAM}"
        android:strokeWidth="1.6"
        android:strokeLineCap="round"
        android:pathData="M35,60 C40,58 48,59 52,63" />
    <path
        android:strokeColor="${isWhiteOnly ? C_DARK_GREEN : C_CREAM}"
        android:strokeWidth="1.6"
        android:strokeLineCap="round"
        android:pathData="M40,67 C44,65 48,66 51,69" />

    <!-- Right Hill Sweeping Furrows -->
    <path
        android:strokeColor="${isWhiteOnly ? C_DARK_GREEN : C_CREAM}"
        android:strokeWidth="1.6"
        android:strokeLineCap="round"
        android:pathData="M56,63 C60,59 68,58 73,60" />
    <path
        android:strokeColor="${isWhiteOnly ? C_DARK_GREEN : C_CREAM}"
        android:strokeWidth="1.6"
        android:strokeLineCap="round"
        android:pathData="M53,69 C58,66 64,65 68,67" />
</vector>`
}

function generateBackgroundXml() {
  return `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="${C_CREAM}"
        android:pathData="M0,0h108v108h-108z" />
</vector>`
}

const targets = [
  path.resolve('mobile/android/consumer/src/main/res/drawable'),
  path.resolve('mobile/android/admin/src/main/res/drawable'),
]

for (const dir of targets) {
  if (!fs.existsSync(dir)) continue
  console.log(`Writing vector drawables to ${dir}`)
  
  // 1. Splash Precision Icon (Android 12+ Splash)
  fs.writeFileSync(path.join(dir, 'splash_precision_icon.xml'), generateEmblemVectorXml(true))
  
  // 2. Adaptive Icon Foreground (Color Emblem)
  fs.writeFileSync(path.join(dir, 'ic_launcher_foreground.xml'), generateEmblemVectorXml(false))
  
  // 3. Adaptive Icon Monochrome (For Android 13+ Themed Icons)
  fs.writeFileSync(path.join(dir, 'ic_launcher_monochrome.xml'), generateEmblemVectorXml(true))
  
  // 4. Adaptive Icon Background
  fs.writeFileSync(path.join(dir, 'ic_launcher_background.xml'), generateBackgroundXml())

  // 5. Update values/ic_launcher_background.xml
  const valuesDir = path.join(path.dirname(dir), 'values')
  if (fs.existsSync(valuesDir)) {
    fs.writeFileSync(
      path.join(valuesDir, 'ic_launcher_background.xml'),
      `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">${C_CREAM}</color>\n</resources>\n`
    )
  }
}

console.log('Android vector drawables successfully generated!')

