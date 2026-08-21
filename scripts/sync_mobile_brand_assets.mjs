import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const BRAND_ROOT = path.resolve('docs/brand-assets')
const APP_ICON_LIGHT = path.join(BRAND_ROOT, '01_LOGO_SYSTEM/agrivil_app_icon.png')
const APP_ICON_DARK = path.join(BRAND_ROOT, '01_LOGO_SYSTEM/agrivil_app_icon_dark.png')
const MARK_COLOR = path.join(BRAND_ROOT, '01_LOGO_SYSTEM/agrivil_mark_color.png')
const MARK_WHITE = path.join(BRAND_ROOT, '01_LOGO_SYSTEM/agrivil_mark_white.png')
const STACKED_WHITE_SVG = path.join(BRAND_ROOT, '01_LOGO_SYSTEM/agrivil_logo_stacked.svg')

// Colors
const C_DARK_GREEN = '#0B3B25'
const C_CREAM      = '#FAF7F2'

async function generateMobileAssets() {
  console.log('Syncing Android & iOS mobile app assets...')

  // 1. Android Dimensions
  const mipmapSizes = {
    'mipmap-mdpi': { icon: 48, fg: 108 },
    'mipmap-hdpi': { icon: 72, fg: 162 },
    'mipmap-xhdpi': { icon: 96, fg: 216 },
    'mipmap-xxhdpi': { icon: 144, fg: 324 },
    'mipmap-xxxhdpi': { icon: 192, fg: 432 },
  }

  const splashPortSizes = {
    'drawable': { w: 1080, h: 1920 },
    'drawable-port-mdpi': { w: 320, h: 480 },
    'drawable-port-hdpi': { w: 480, h: 800 },
    'drawable-port-xhdpi': { w: 720, h: 1280 },
    'drawable-port-xxhdpi': { w: 960, h: 1600 },
    'drawable-port-xxxhdpi': { w: 1280, h: 1920 },
  }

  const splashLandSizes = {
    'drawable-land-mdpi': { w: 480, h: 320 },
    'drawable-land-hdpi': { w: 800, h: 480 },
    'drawable-land-xhdpi': { w: 1280, h: 720 },
    'drawable-land-xxhdpi': { w: 1600, h: 960 },
    'drawable-land-xxxhdpi': { w: 1920, h: 1280 },
  }

  // Create Splash Screen SVG
  function createSplashSvg(width, height) {
    const markSize = Math.min(width, height) * 0.38
    const markX = (width - markSize) / 2
    const markY = (height - markSize) / 2 - markSize * 0.12
    const wordmarkY = markY + markSize + markSize * 0.18
    const taglineY = wordmarkY + 36
    const tagline2Y = taglineY + 28
    const fontSize = Math.max(28, Math.round(markSize * 0.22))
    const subFontSize = Math.max(14, Math.round(markSize * 0.08))

    return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${C_DARK_GREEN}"/>
      <!-- Radial ambient glow -->
      <circle cx="${width / 2}" cy="${height / 2}" r="${Math.min(width, height) * 0.6}" fill="#DF8821" opacity="0.08"/>
      
      <!-- Mark -->
      <image href="${path.resolve(MARK_COLOR)}" x="${markX}" y="${markY}" width="${markSize}" height="${markSize}"/>
      
      <!-- Wordmark -->
      <text x="${width / 2}" y="${wordmarkY}" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif" font-size="${fontSize}" font-weight="800" fill="#FFFFFF" letter-spacing="0.22em">
        AGRIVIL
      </text>
      <!-- Taglines -->
      <text x="${width / 2}" y="${taglineY}" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif" font-size="${subFontSize}" font-weight="600" fill="#FAF7F2" opacity="0.95">
        Farm Fresh. Market Smart.
      </text>
      <text x="${width / 2}" y="${tagline2Y}" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif" font-size="${subFontSize * 0.88}" font-weight="500" fill="#FAF7F2" opacity="0.75">
        Delivered with care.
      </text>
    </svg>`
  }

  const androidTargets = [
    path.resolve('mobile/android/consumer/src/main/res'),
    path.resolve('mobile/android/admin/src/main/res'),
  ]

  for (const resDir of androidTargets) {
    if (!fs.existsSync(resDir)) continue
    console.log(`Processing Android res: ${resDir}`)

    // 1. Mipmaps
    for (const [folder, sizes] of Object.entries(mipmapSizes)) {
      const dir = path.join(resDir, folder)
      fs.mkdirSync(dir, { recursive: true })

      // ic_launcher.png (Square/Squircle)
      await sharp(path.resolve('public/apple-icon.png'))
        .resize(sizes.icon, sizes.icon)
        .png()
        .toFile(path.join(dir, 'ic_launcher.png'))

      // ic_launcher_round.png
      await sharp(path.resolve('public/apple-icon.png'))
        .resize(sizes.icon, sizes.icon)
        .png()
        .toFile(path.join(dir, 'ic_launcher_round.png'))

      // ic_launcher_background.png (Solid cream canvas)
      await sharp({
        create: {
          width: sizes.fg,
          height: sizes.fg,
          channels: 4,
          background: { r: 250, g: 247, b: 242, alpha: 1 },
        },
      })
        .png()
        .toFile(path.join(dir, 'ic_launcher_background.png'))

      // ic_launcher_foreground.png (Emblem scaled & centered with safe-zone padding)
      const emblemSize = Math.round(sizes.fg * 0.62)
      const emblemBuffer = await sharp(MARK_COLOR)
        .resize(emblemSize, emblemSize)
        .toBuffer()

      await sharp({
        create: {
          width: sizes.fg,
          height: sizes.fg,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      })
        .composite([
          {
            input: emblemBuffer,
            top: Math.round((sizes.fg - emblemSize) / 2),
            left: Math.round((sizes.fg - emblemSize) / 2),
          },
        ])
        .png()
        .toFile(path.join(dir, 'ic_launcher_foreground.png'))
    }

    // 2. Splash Portrait
    for (const [folder, dims] of Object.entries(splashPortSizes)) {
      const dir = path.join(resDir, folder)
      fs.mkdirSync(dir, { recursive: true })
      const splashSvg = createSplashSvg(dims.w, dims.h)
      await sharp(Buffer.from(splashSvg)).png().toFile(path.join(dir, 'splash.png'))
    }

    // 3. Splash Landscape
    for (const [folder, dims] of Object.entries(splashLandSizes)) {
      const dir = path.join(resDir, folder)
      fs.mkdirSync(dir, { recursive: true })
      const splashSvg = createSplashSvg(dims.w, dims.h)
      await sharp(Buffer.from(splashSvg)).png().toFile(path.join(dir, 'splash.png'))
    }
  }

  // 2. iOS Assets
  const iosAppIconDir = path.resolve('mobile/ios/App/App/Assets.xcassets/AppIcon.appiconset')
  if (fs.existsSync(iosAppIconDir)) {
    console.log('Processing iOS AppIcon...')
    await sharp(APP_ICON_LIGHT).resize(1024, 1024).png().toFile(path.join(iosAppIconDir, 'AppIcon-512@2x.png'))
  }

  const iosSplashDir = path.resolve('mobile/ios/App/App/Assets.xcassets/Splash.imageset')
  if (fs.existsSync(iosSplashDir)) {
    console.log('Processing iOS Splash...')
    const iosSplashSvg = createSplashSvg(2732, 2732)
    const splashBuf = await sharp(Buffer.from(iosSplashSvg)).png().toBuffer()
    fs.writeFileSync(path.join(iosSplashDir, 'splash-2732x2732.png'), splashBuf)
    fs.writeFileSync(path.join(iosSplashDir, 'splash-2732x2732-1.png'), splashBuf)
    fs.writeFileSync(path.join(iosSplashDir, 'splash-2732x2732-2.png'), splashBuf)
  }

  console.log('Mobile assets successfully synced!')
}

generateMobileAssets().catch(console.error)
