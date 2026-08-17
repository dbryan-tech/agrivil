import fs from 'node:fs'
import path from 'node:path'

const brainDir = 'C:\\Users\\HP\\.gemini\\antigravity-ide\\brain\\dda80f12-f138-459c-8e33-206a33affb4a'
const targetDir = path.resolve('public/golden-acres/corners')

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true })
}

const files = fs.readdirSync(brainDir)

const mapping = {
  corner_fruits_top_left: 'corner-fruits-top-left.png',
  corner_fruits_top_right: 'corner-fruits-top-right.png',
  corner_crops_bottom_left: 'corner-crops-bottom-left.png',
  corner_crops_bottom_right: 'corner-crops-bottom-right.png',
  corner_citrus_top_left: 'corner-citrus-top-left.png',
  corner_greens_top_right: 'corner-greens-top-right.png',
  corner_tubers_bottom_left: 'corner-tubers-bottom-left.png',
  corner_peppers_bottom_right: 'corner-peppers-bottom-right.png',
}

for (const [prefix, destName] of Object.entries(mapping)) {
  const match = files.find((f) => f.startsWith(prefix) && (f.endsWith('.jpg') || f.endsWith('.png')))
  if (match) {
    const src = path.join(brainDir, match)
    const dst = path.join(targetDir, destName)
    fs.copyFileSync(src, dst)
    console.log(`Copied ${match} -> ${destName}`)
  } else {
    console.warn(`No match found for ${prefix}`)
  }
}
