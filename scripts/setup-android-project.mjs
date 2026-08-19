// NOTE: This script previously copied a pre-built Android project from a
// separate KNUST Bazaar checkout. That is what originally injected the wrong
// (Bazaar) app icons, splash screens and Java package names into AgriVil.
//
// The AgriVil Android project now lives directly under mobile/android and is
// already rebranded (com.agrivil.* packages, AgriVil green assets). This setup
// step is therefore a no-op — we only validate that the local project exists.
// If you ever need to bootstrap from scratch, build the native shell with
// `npx cap add android` inside mobile/ instead of copying from another repo.

import fs from 'node:fs'
import path from 'node:path'

const destDir = path.resolve('mobile/android')

if (fs.existsSync(destDir)) {
  console.log(`AgriVil Android project already present at ${destDir} — nothing to copy.`)
} else {
  console.warn('mobile/android not found. Run `npx cap add android` inside mobile/ to bootstrap it.')
}
