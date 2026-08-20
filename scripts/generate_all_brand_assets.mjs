import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve('docs/brand-assets')
const PUBLIC_DIR = path.resolve('public')

// Brand Colors
const C_DARK_GREEN = '#0B3B25' // Primary Brand Green
const C_SUN_ORANGE = '#DF8821' // Warm Ochre / Orange Sun
const C_CLAY_RUST  = '#7A3F1C' // Clay Rust
const C_GOLD       = '#F0A81E' // Highlight Gold
const C_CREAM      = '#FAF7F2' // Warm Canvas
const C_CHARCOAL   = '#211A12' // Deep Soil Charcoal
const C_MUTED      = '#5C5247' // Muted Earth Charcoal

// -----------------------------------------------------------------------------
// 1. MASTER SVG BUILDERS
// -----------------------------------------------------------------------------

function getMarkSvg({ variant = 'color', size = 800, cx = 400, cy = 330, R = 220 } = {}) {
  const isColor = variant === 'color'
  const isWhite = variant === 'white'
  const isBlack = variant === 'black'
  const isGold  = variant === 'gold'

  const sunColor = isColor ? C_SUN_ORANGE : isWhite ? '#FFFFFF' : isGold ? C_GOLD : '#000000'
  const fieldColor = isColor ? C_DARK_GREEN : isWhite ? '#FFFFFF' : isGold ? C_GOLD : '#000000'

  const rSunOut = Math.round(R * 0.52)
  const rSunIn = Math.round(R * 0.29)
  const sunArch = `<path d="M ${cx - rSunOut} ${cy} A ${rSunOut} ${rSunOut} 0 0 1 ${cx + rSunOut} ${cy} L ${cx + rSunIn} ${cy} A ${rSunIn} ${rSunIn} 0 0 0 ${cx - rSunIn} ${cy} Z" fill="${sunColor}"/>`

  const rayAngles = [180, 205, 228, 249, 270, 291, 312, 335, 360]
  const rIn = Math.round(R * 0.645)
  const rOut = R
  const rayStroke = Math.max(3, Math.round(R * 0.059))

  const rays = rayAngles.map(deg => {
    const rad = (deg * Math.PI) / 180
    const x1 = (cx + rIn * Math.cos(rad)).toFixed(1)
    const y1 = (cy + rIn * Math.sin(rad)).toFixed(1)
    const x2 = (cx + rOut * Math.cos(rad)).toFixed(1)
    const y2 = (cy + rOut * Math.sin(rad)).toFixed(1)
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${sunColor}" stroke-width="${rayStroke}" stroke-linecap="round"/>`
  }).join('\n    ')

  const fieldSolid = `<path d="M ${cx - R} ${cy + 18} Q ${cx - Math.round(R * 0.5)} ${cy - 5} ${cx - 10} ${cy + 42} Q ${cx} ${cy + 48} ${cx + 10} ${cy + 42} Q ${cx + Math.round(R * 0.5)} ${cy - 5} ${cx + R} ${cy + 18} A ${R} ${R} 0 0 1 ${cx - R} ${cy + 18} Z" fill="${fieldColor}"/>`

  const cutStroke1 = Math.max(2, Math.round(R * 0.059))
  const cutStroke2 = Math.max(1.8, Math.round(R * 0.054))
  const maskId = `mask-${variant}-${Math.round(size)}-${Math.round(cx)}-${Math.round(cy)}`

  const maskDef = `
    <mask id="${maskId}">
      <rect width="${size}" height="${size}" fill="#FFFFFF"/>
      <g stroke="#000000" stroke-linecap="round" fill="none">
        <!-- Central ridge cut -->
        <path d="M ${cx} ${(cy + R * 0.20).toFixed(1)} C ${(cx - R * 0.16).toFixed(1)} ${(cy + R * 0.48).toFixed(1)} ${(cx - R * 0.39).toFixed(1)} ${(cy + R * 0.80).toFixed(1)} ${(cx - R * 0.57).toFixed(1)} ${(cy + R * 1.02).toFixed(1)}" stroke-width="${cutStroke1}"/>
        <!-- Left Hill cuts -->
        <path d="M ${(cx - R * 1.0).toFixed(1)} ${(cy + R * 0.24).toFixed(1)} Q ${(cx - R * 0.55).toFixed(1)} ${(cy + R * 0.19).toFixed(1)} ${(cx - R * 0.14).toFixed(1)} ${(cy + R * 0.37).toFixed(1)}" stroke-width="${cutStroke2}"/>
        <path d="M ${(cx - R * 0.89).toFixed(1)} ${(cy + R * 0.45).toFixed(1)} Q ${(cx - R * 0.57).toFixed(1)} ${(cy + R * 0.43).toFixed(1)} ${(cx - R * 0.32).toFixed(1)} ${(cy + R * 0.63).toFixed(1)}" stroke-width="${cutStroke2}"/>
        <!-- Right Hill cuts -->
        <path d="M ${(cx + R * 1.0).toFixed(1)} ${(cy + R * 0.24).toFixed(1)} C ${(cx + R * 0.59).toFixed(1)} ${(cy + R * 0.18).toFixed(1)} ${(cx + R * 0.16).toFixed(1)} ${(cy + R * 0.36).toFixed(1)} ${(cx - R * 0.23).toFixed(1)} ${(cy + R * 0.70).toFixed(1)}" stroke-width="${cutStroke2}"/>
        <path d="M ${(cx + R * 0.86).toFixed(1)} ${(cy + R * 0.46).toFixed(1)} C ${(cx + R * 0.48).toFixed(1)} ${(cy + R * 0.43).toFixed(1)} ${(cx + R * 0.09).toFixed(1)} ${(cy + R * 0.64).toFixed(1)} ${(cx - R * 0.25).toFixed(1)} ${(cy + R * 0.93).toFixed(1)}" stroke-width="${cutStroke2}"/>
        <path d="M ${(cx + R * 0.61).toFixed(1)} ${(cy + R * 0.69).toFixed(1)} C ${(cx + R * 0.27).toFixed(1)} ${(cy + R * 0.69).toFixed(1)} ${(cx - R * 0.02).toFixed(1)} ${(cy + R * 0.89).toFixed(1)} ${(cx - R * 0.20).toFixed(1)} ${(cy + R * 1.05).toFixed(1)}" stroke-width="${cutStroke2}"/>
      </g>
    </mask>`

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>${maskDef}
  </defs>
  <g id="agrivil-mark">
    <!-- Sun Rays -->
    <g id="sun-rays">
      ${rays}
    </g>
    <!-- Sun Arch -->
    ${sunArch}
    <!-- Farmland Furrows -->
    <g id="field-hills" mask="url(#${maskId})">
      ${fieldSolid}
    </g>
  </g>
</svg>`
}

function getMarkSvgSnippet({ variant = 'color', x = 0, y = 0, width = 800, height = 800 } = {}) {
  const fullSvg = getMarkSvg({ variant, size: 800, cx: 400, cy: 330, R: 220 })
  const inner = fullSvg.replace(/<\?xml[\s\S]*?\?>/gi, '').trim()
  const content = inner.slice(inner.indexOf('>') + 1, inner.lastIndexOf('</svg>'))
  return `<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="0 0 800 800">${content}</svg>`
}

function getStackedLogoSvg({ variant = 'color', withTagline = true } = {}) {
  const isWhite = variant === 'white'
  const isBlack = variant === 'black'
  const textColor = isWhite ? '#FFFFFF' : (variant === 'color' ? C_DARK_GREEN : '#000000')
  const taglineColor = isWhite ? '#E0E0E0' : (variant === 'color' ? C_CHARCOAL : '#333333')

  const markSnippet = getMarkSvgSnippet({ variant, x: 120, y: 30, width: 360, height: 360 })

  const height = withTagline ? 620 : 500
  const taglineSvg = withTagline ? `
  <text x="300" y="475" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif" font-size="22" font-weight="600" fill="${taglineColor}" letter-spacing="0.03em">
    Farm Fresh. Market Smart.
  </text>
  <text x="300" y="508" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif" font-size="19" font-weight="500" fill="${taglineColor}" letter-spacing="0.02em">
    Delivered with care.
  </text>` : ''

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 ${height}" width="600" height="${height}">
  ${markSnippet}
  <text x="300" y="420" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif" font-size="64" font-weight="800" fill="${textColor}" letter-spacing="0.22em">
    AGRIVIL
  </text>
  ${taglineSvg}
</svg>`
}

function getHorizontalLogoSvg({ variant = 'color', withTagline = true } = {}) {
  const isWhite = variant === 'white'
  const isBlack = variant === 'black'
  const textColor = isWhite ? '#FFFFFF' : (variant === 'color' ? C_DARK_GREEN : '#000000')
  const taglineColor = isWhite ? '#E0E0E0' : (variant === 'color' ? C_CHARCOAL : '#333333')

  const markSnippet = getMarkSvgSnippet({ variant, x: 10, y: 10, width: 260, height: 260 })

  const width = withTagline ? 960 : 820
  const taglineSvg = withTagline ? `
  <text x="300" y="175" font-family="'Segoe UI', Arial, sans-serif" font-size="22" font-weight="600" fill="${taglineColor}" letter-spacing="0.03em">
    Farm Fresh. Market Smart.
  </text>
  <text x="300" y="206" font-family="'Segoe UI', Arial, sans-serif" font-size="19" font-weight="500" fill="${taglineColor}" letter-spacing="0.02em">
    Delivered with care.
  </text>` : ''

  const wordmarkY = withTagline ? 125 : 155

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 280" width="${width}" height="280">
  ${markSnippet}
  <text x="300" y="${wordmarkY}" font-family="'Segoe UI', Arial, sans-serif" font-size="64" font-weight="800" fill="${textColor}" letter-spacing="0.22em">
    AGRIVIL
  </text>
  ${taglineSvg}
</svg>`
}

function getAppIconSvg({ variant = 'light', size = 512 } = {}) {
  const bgColor = variant === 'light' ? C_CREAM : (variant === 'dark' ? C_DARK_GREEN : C_SUN_ORANGE)
  const markVariant = variant === 'light' ? 'color' : 'white'

  const markSnippet = getMarkSvgSnippet({ variant: markVariant, x: size * 0.1, y: size * 0.1, width: size * 0.8, height: size * 0.8 })

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="${bgColor}"/>
  ${markSnippet}
</svg>`
}

// Circular Social Media Profile Avatar (Enclosed in a deep green circular border)
function getSocialAvatarSvg({ size = 800, bg = C_CREAM } = {}) {
  const strokeW = 16
  const markSnippet = getMarkSvgSnippet({ variant: 'color', x: 100, y: 100, width: 600, height: 600 })
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <circle cx="400" cy="400" r="392" fill="${bg}"/>
  <circle cx="400" cy="400" r="384" fill="none" stroke="${C_DARK_GREEN}" stroke-width="${strokeW}"/>
  ${markSnippet}
</svg>`
}

function getCurvedText({ text, cx, cy, r, startAngle, endAngle, fontSize, fill, fontWeight = '800', invert = false }) {
  const letters = text.split('')
  const totalAngle = endAngle - startAngle
  const step = letters.length > 1 ? totalAngle / (letters.length - 1) : 0
  return letters.map((char, i) => {
    const angle = startAngle + i * step
    const rad = (angle * Math.PI) / 180
    const x = cx + r * Math.cos(rad)
    const y = cy + r * Math.sin(rad)
    const rot = invert ? angle - 90 : angle + 90
    return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-family="'Segoe UI', Arial, sans-serif" font-size="${fontSize}" font-weight="${fontWeight}" fill="${fill}" text-anchor="middle" dominant-baseline="central" transform="rotate(${rot.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})">${char}</text>`
  }).join('\n    ')
}

// Circular Stamp Badge ("FARM FRESH · MARKET SMART")
function getRoundStampSvg({ size = 800 } = {}) {
  const markSnippet = getMarkSvgSnippet({ variant: 'color', x: 200, y: 200, width: 400, height: 400 })
  const topText = getCurvedText({ text: 'FARM FRESH', cx: 400, cy: 400, r: 295, startAngle: 215, endAngle: 325, fontSize: 38, fill: C_DARK_GREEN })
  const bottomText = getCurvedText({ text: 'MARKET SMART', cx: 400, cy: 400, r: 295, startAngle: 145, endAngle: 35, fontSize: 38, fill: C_DARK_GREEN, invert: true })

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <circle cx="400" cy="400" r="390" fill="${C_CREAM}"/>
  <circle cx="400" cy="400" r="380" fill="none" stroke="${C_DARK_GREEN}" stroke-width="8"/>
  <circle cx="400" cy="400" r="350" fill="none" stroke="${C_DARK_GREEN}" stroke-width="3" stroke-dasharray="8 6"/>
  <circle cx="400" cy="400" r="235" fill="none" stroke="${C_DARK_GREEN}" stroke-width="3"/>
  <!-- Top Arc Text -->
  ${topText}
  <!-- Bottom Arc Text -->
  ${bottomText}
  ${markSnippet}
</svg>`
}

// -----------------------------------------------------------------------------
// 2. UI ICONS BUILDER (12 Brand Icons)
// -----------------------------------------------------------------------------

const UI_ICONS = {
  home: '<path d="M3 10.5L12 3l9 7.5v9.5a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  search: '<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" fill="none"/><path d="M20 20l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  cart: '<circle cx="9" cy="20" r="1.5" fill="currentColor"/><circle cx="18" cy="20" r="1.5" fill="currentColor"/><path d="M1 2h3.5l2.6 13h12.4l3-9H5.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  heart: '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  user: '<circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" fill="none"/><path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>',
  location: '<path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="9" r="2.5" fill="currentColor"/>',
  bag: '<path d="M6 8h12l1 13H5L6 8z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/><path d="M9 8V5a3 3 0 0 1 6 0v3" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>',
  bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="2" fill="none"/>',
  recipe: '<path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  settings: '<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  package: '<path d="M12 2l9 4.5v11l-9 4.5-9-4.5v-11L12 2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/><path d="M12 22V11M2.5 6.8L12 11.5l9.5-4.7" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  farmer: '<circle cx="12" cy="7" r="3.5" stroke="currentColor" stroke-width="2" fill="none"/><path d="M3 8c2-3 16-3 18 0M4 21v-1a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v1" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>'
}

function getIconSvg(name, color = C_DARK_GREEN) {
  const content = UI_ICONS[name] || UI_ICONS.home
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="${color}">
  ${content}
</svg>`
}

// -----------------------------------------------------------------------------
// 3. EXECUTION & RENDERING
// -----------------------------------------------------------------------------

async function generateAll() {
  console.log('Generating AgriVil Brand Identity Assets (Concept 01 Master Suite)...')

  // 1. 01_LOGO_SYSTEM
  console.log('Generating 01_LOGO_SYSTEM...')
  const logoDir = path.join(ROOT, '01_LOGO_SYSTEM')

  // Mark files
  const markColorSvg = getMarkSvg({ variant: 'color' })
  const markWhiteSvg = getMarkSvg({ variant: 'white' })
  const markBlackSvg = getMarkSvg({ variant: 'black' })

  fs.writeFileSync(path.join(logoDir, 'agrivil_mark_color.svg'), markColorSvg)
  fs.writeFileSync(path.join(logoDir, 'agrivil_mark_white.svg'), markWhiteSvg)
  fs.writeFileSync(path.join(logoDir, 'agrivil_mark_black.svg'), markBlackSvg)

  await sharp(Buffer.from(markColorSvg)).resize(800, 800).png().toFile(path.join(logoDir, 'agrivil_mark_color.png'))
  await sharp(Buffer.from(markWhiteSvg)).resize(800, 800).png().toFile(path.join(logoDir, 'agrivil_mark_white.png'))
  await sharp(Buffer.from(markBlackSvg)).resize(800, 800).png().toFile(path.join(logoDir, 'agrivil_mark_black.png'))

  // Stacked Logo files
  const stackedSvg = getStackedLogoSvg({ variant: 'color', withTagline: true })
  const stackedNoTagSvg = getStackedLogoSvg({ variant: 'color', withTagline: false })

  fs.writeFileSync(path.join(logoDir, 'agrivil_logo_stacked.svg'), stackedSvg)
  fs.writeFileSync(path.join(logoDir, 'agrivil_logo_stacked_notagline.svg'), stackedNoTagSvg)

  await sharp(Buffer.from(stackedSvg)).resize(1200).png().toFile(path.join(logoDir, 'agrivil_logo_stacked.png'))
  await sharp(Buffer.from(stackedNoTagSvg)).resize(1200).png().toFile(path.join(logoDir, 'agrivil_logo_stacked_notagline.png'))

  // Horizontal Logo files
  const horizSvg = getHorizontalLogoSvg({ variant: 'color', withTagline: true })
  const horizNoTagSvg = getHorizontalLogoSvg({ variant: 'color', withTagline: false })
  const reverseSvg = getHorizontalLogoSvg({ variant: 'white', withTagline: false })
  const blackLogoSvg = getHorizontalLogoSvg({ variant: 'black', withTagline: false })

  fs.writeFileSync(path.join(logoDir, 'agrivil_logo_primary_horizontal.svg'), horizSvg)
  fs.writeFileSync(path.join(logoDir, 'agrivil_logo_primary_horizontal_notagline.svg'), horizNoTagSvg)
  fs.writeFileSync(path.join(logoDir, 'agrivil_logo_reverse.svg'), reverseSvg)
  fs.writeFileSync(path.join(logoDir, 'agrivil_logo_black.svg'), blackLogoSvg)

  await sharp(Buffer.from(horizSvg)).resize(1400).png().toFile(path.join(logoDir, 'agrivil_logo_primary_horizontal.png'))
  await sharp(Buffer.from(horizNoTagSvg)).resize(1200).png().toFile(path.join(logoDir, 'agrivil_logo_primary_horizontal_notagline.png'))
  await sharp(Buffer.from(reverseSvg)).resize(1200).png().toFile(path.join(logoDir, 'agrivil_logo_reverse.png'))
  await sharp(Buffer.from(blackLogoSvg)).resize(1200).png().toFile(path.join(logoDir, 'agrivil_logo_black.png'))

  // App Icon files in 01_LOGO_SYSTEM
  const appIconLightSvg = getAppIconSvg({ variant: 'light', size: 512 })
  const appIconDarkSvg = getAppIconSvg({ variant: 'dark', size: 512 })

  fs.writeFileSync(path.join(logoDir, 'agrivil_app_icon.svg'), appIconLightSvg)
  fs.writeFileSync(path.join(logoDir, 'agrivil_app_icon_dark.svg'), appIconDarkSvg)

  await sharp(Buffer.from(appIconLightSvg)).resize(512, 512).png().toFile(path.join(logoDir, 'agrivil_app_icon.png'))
  await sharp(Buffer.from(appIconDarkSvg)).resize(512, 512).png().toFile(path.join(logoDir, 'agrivil_app_icon_dark.png'))

  // Social Profile Avatar & Round Stamp Badge in 01_LOGO_SYSTEM
  const socialAvatarSvg = getSocialAvatarSvg({ size: 800 })
  const roundStampSvg = getRoundStampSvg({ size: 800 })

  fs.writeFileSync(path.join(logoDir, 'agrivil_social_avatar_circle.svg'), socialAvatarSvg)
  fs.writeFileSync(path.join(logoDir, 'agrivil_round_stamp_badge.svg'), roundStampSvg)

  await sharp(Buffer.from(socialAvatarSvg)).resize(800, 800).png().toFile(path.join(logoDir, 'agrivil_social_avatar_circle.png'))
  await sharp(Buffer.from(roundStampSvg)).resize(800, 800).png().toFile(path.join(logoDir, 'agrivil_round_stamp_badge.png'))

  // 2. 02_ICONS
  console.log('Generating 02_ICONS...')
  const iconDir = path.join(ROOT, '02_ICONS')
  for (const [name, _] of Object.entries(UI_ICONS)) {
    const iconSvg = getIconSvg(name, C_DARK_GREEN)
    fs.writeFileSync(path.join(iconDir, `${name}.svg`), iconSvg)
    await sharp(Buffer.from(iconSvg)).resize(256, 256).png().toFile(path.join(iconDir, `${name}.png`))
  }

  // 3. 03_DIGITAL_ASSETS
  console.log('Generating 03_DIGITAL_ASSETS...')
  const digitalDir = path.join(ROOT, '03_DIGITAL_ASSETS')

  const iconSizes = [1024, 512, 256, 192, 180, 144, 128, 96, 72, 48, 32, 16]
  for (const sz of iconSizes) {
    const iconSvg = getAppIconSvg({ variant: 'light', size: sz })
    await sharp(Buffer.from(iconSvg)).resize(sz, sz).png().toFile(path.join(digitalDir, `app-icon-${sz}.png`))
  }

  // Favicon.ico (using 32x32 png)
  const fav32 = await sharp(Buffer.from(getAppIconSvg({ variant: 'light', size: 32 }))).resize(32, 32).png().toBuffer()
  fs.writeFileSync(path.join(digitalDir, 'favicon.ico'), fav32)

  // Social & Platform Banners
  async function createBanner({ width, height, title, subtitle, bg = C_DARK_GREEN, outPath }) {
    const bannerSvg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${bg}"/>
      <circle cx="${width * 0.85}" cy="${height * 0.5}" r="${height * 0.6}" fill="#DF8821" opacity="0.12"/>
      <g transform="translate(${width * 0.08}, ${height * 0.32})">
        <text x="0" y="0" font-family="'Segoe UI', Arial, sans-serif" font-size="${Math.round(height * 0.09)}" font-weight="800" fill="#FAF7F2" letter-spacing="0.2em">
          AGRIVIL
        </text>
        <text x="0" y="${Math.round(height * 0.12)}" font-family="'Segoe UI', Arial, sans-serif" font-size="${Math.round(height * 0.065)}" font-weight="700" fill="#FAF7F2">
          ${title}
        </text>
        <text x="0" y="${Math.round(height * 0.22)}" font-family="'Segoe UI', Arial, sans-serif" font-size="${Math.round(height * 0.038)}" font-weight="500" fill="#FAF7F2" opacity="0.85">
          ${subtitle}
        </text>
      </g>
    </svg>`
    await sharp(Buffer.from(bannerSvg)).jpeg({ quality: 90 }).toFile(outPath)
  }

  await createBanner({
    width: 1200, height: 630,
    title: 'Farm Fresh. Market Smart.',
    subtitle: 'Direct-from-farm produce delivered with care across Ghana.',
    bg: C_DARK_GREEN,
    outPath: path.join(digitalDir, 'og_social_1200x630.jpg')
  })

  await createBanner({
    width: 1200, height: 627,
    title: 'The Premier Virtual Farmers Marketplace',
    subtitle: 'Connecting smallholder growers directly to modern consumers.',
    bg: C_DARK_GREEN,
    outPath: path.join(digitalDir, 'linkedin_1200x627.jpg')
  })

  await createBanner({
    width: 1500, height: 500,
    title: 'Farm Fresh. Market Smart. Delivered with care.',
    subtitle: 'Ghana’s cold-chain virtual farmers market.',
    bg: C_DARK_GREEN,
    outPath: path.join(digitalDir, 'x_twitter_1500x500.jpg')
  })

  await createBanner({
    width: 1290, height: 600,
    title: 'Download the AgriVil App',
    subtitle: 'Order fresh harvest in minutes with transparent farm-to-door cold chain.',
    bg: '#1A0F06',
    outPath: path.join(digitalDir, 'mobile_banner_1290x600.jpg')
  })

  await createBanner({
    width: 1600, height: 600,
    title: 'Direct From Local Farms To Your Door',
    subtitle: 'Harvested at dawn, packed in cold-chain, delivered fresh.',
    bg: C_DARK_GREEN,
    outPath: path.join(digitalDir, 'website_hero_1600x600.jpg')
  })

  await createBanner({
    width: 1080, height: 1080,
    title: 'Fresh From Farm',
    subtitle: '100% Verified Local Growers · Fast MoMo Payouts',
    bg: C_DARK_GREEN,
    outPath: path.join(digitalDir, 'facebook_post.jpg')
  })

  await createBanner({
    width: 1080, height: 1350,
    title: 'Nourishing Ghana',
    subtitle: 'Fair pricing for smallholder farmers. Freshest food for families.',
    bg: C_DARK_GREEN,
    outPath: path.join(digitalDir, 'instagram_portrait.jpg')
  })

  await createBanner({
    width: 1080, height: 1920,
    title: 'AgriVil Today',
    subtitle: 'Fresh harvests live on the marketplace now.',
    bg: C_DARK_GREEN,
    outPath: path.join(digitalDir, 'whatsapp_status.jpg')
  })

  // 4. 04_PRINT_ASSETS
  console.log('Generating 04_PRINT_ASSETS...')
  const printDir = path.join(ROOT, '04_PRINT_ASSETS')

  // Business Card Front (1050x600)
  const cardFrontSnippet = getMarkSvgSnippet({ variant: 'color', x: 680, y: 160, width: 280, height: 280 })
  const cardFrontSvg = `
  <svg width="1050" height="600" viewBox="0 0 1050 600" xmlns="http://www.w3.org/2000/svg">
    <rect width="1050" height="600" fill="${C_CREAM}"/>
    <g transform="translate(80, 140)">
      <text x="0" y="0" font-family="'Segoe UI', Arial, sans-serif" font-size="34" font-weight="800" fill="${C_CHARCOAL}">
        Kwame Mensah
      </text>
      <text x="0" y="32" font-family="'Segoe UI', Arial, sans-serif" font-size="18" font-weight="600" fill="${C_CLAY_RUST}">
        Co-Founder &amp; Head of Farm Operations
      </text>
      <g transform="translate(0, 100)" font-family="'Segoe UI', Arial, sans-serif" font-size="16" font-weight="500" fill="${C_MUTED}">
        <text x="0" y="0">+233 20 123 4567</text>
        <text x="0" y="30">kwame@agrivil.com</text>
        <text x="0" y="60">www.agrivil.com</text>
        <text x="0" y="90">Accra, Ghana</text>
      </g>
    </g>
    ${cardFrontSnippet}
  </svg>`
  await sharp(Buffer.from(cardFrontSvg)).png().toFile(path.join(printDir, 'business_card_front.png'))

  // Business Card Back
  const cardBackSnippet = getMarkSvgSnippet({ variant: 'white', x: 385, y: 110, width: 280, height: 280 })
  const cardBackSvg = `
  <svg width="1050" height="600" viewBox="0 0 1050 600" xmlns="http://www.w3.org/2000/svg">
    <rect width="1050" height="600" fill="${C_DARK_GREEN}"/>
    ${cardBackSnippet}
    <text x="525" y="440" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif" font-size="42" font-weight="800" fill="#FFFFFF" letter-spacing="0.22em">
      AGRIVIL
    </text>
    <text x="525" y="480" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif" font-size="16" font-weight="500" fill="#FAF7F2" opacity="0.85">
      Farm Fresh. Market Smart. Delivered with care.
    </text>
  </svg>`
  await sharp(Buffer.from(cardBackSvg)).png().toFile(path.join(printDir, 'business_card_back.png'))

  // Letterhead A4 (1240x1754)
  const letterheadSnippet = getMarkSvgSnippet({ variant: 'color', x: 1040, y: 50, width: 110, height: 110 })
  const letterheadSvg = `
  <svg width="1240" height="1754" viewBox="0 0 1240 1754" xmlns="http://www.w3.org/2000/svg">
    <rect width="1240" height="1754" fill="#FFFFFF"/>
    <!-- Header -->
    <rect width="1240" height="16" fill="${C_DARK_GREEN}"/>
    <g transform="translate(90, 80)">
      <text x="0" y="40" font-family="'Segoe UI', Arial, sans-serif" font-size="38" font-weight="800" fill="${C_DARK_GREEN}" letter-spacing="0.2em">
        AGRIVIL
      </text>
      <text x="0" y="68" font-family="'Segoe UI', Arial, sans-serif" font-size="15" font-weight="600" fill="${C_CLAY_RUST}">
        Farm Fresh. Market Smart. Delivered with care.
      </text>
    </g>
    ${letterheadSnippet}
    <line x1="90" y1="180" x2="1150" y2="180" stroke="${C_MUTED}" stroke-width="1" opacity="0.2"/>
    <!-- Footer -->
    <line x1="90" y1="1640" x2="1150" y2="1640" stroke="${C_MUTED}" stroke-width="1" opacity="0.2"/>
    <g transform="translate(90, 1680)" font-family="'Segoe UI', Arial, sans-serif" font-size="13" font-weight="500" fill="${C_MUTED}">
      <text x="0" y="0">AgriVil Ghana Ltd. · Accra Pilot Hub · GA-183-4250</text>
      <text x="1060" y="0" text-anchor="end">hello@agrivil.com · www.agrivil.com</text>
    </g>
  </svg>`
  await sharp(Buffer.from(letterheadSvg)).png().toFile(path.join(printDir, 'letterhead_A4.png'))

  // Email Signature (800x240)
  const emailSigSnippet = getMarkSvgSnippet({ variant: 'color', x: 30, y: 30, width: 180, height: 180 })
  const emailSigSvg = `
  <svg width="800" height="240" viewBox="0 0 800 240" xmlns="http://www.w3.org/2000/svg">
    <rect width="800" height="240" fill="#FFFFFF"/>
    ${emailSigSnippet}
    <line x1="240" y1="30" x2="240" y2="210" stroke="${C_MUTED}" stroke-width="1" opacity="0.25"/>
    <g transform="translate(270, 60)">
      <text x="0" y="0" font-family="'Segoe UI', Arial, sans-serif" font-size="22" font-weight="800" fill="${C_CHARCOAL}">
        Kwame Mensah
      </text>
      <text x="0" y="24" font-family="'Segoe UI', Arial, sans-serif" font-size="14" font-weight="600" fill="${C_CLAY_RUST}">
        Co-Founder · AgriVil
      </text>
      <g transform="translate(0, 60)" font-family="'Segoe UI', Arial, sans-serif" font-size="13" font-weight="500" fill="${C_MUTED}">
        <text x="0" y="0">+233 20 123 4567 · kwame@agrivil.com</text>
        <text x="0" y="22">www.agrivil.com · Farm Fresh. Market Smart.</text>
      </g>
    </g>
  </svg>`
  await sharp(Buffer.from(emailSigSvg)).png().toFile(path.join(printDir, 'email_signature.png'))

  // Invoice Header (1200x260)
  const invoiceHeaderSnippet = getMarkSvgSnippet({ variant: 'color', x: 980, y: 30, width: 200, height: 200 })
  const invoiceHeaderSvg = `
  <svg width="1200" height="260" viewBox="0 0 1200 260" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="260" fill="${C_CREAM}"/>
    <g transform="translate(60, 40)">
      <text x="0" y="45" font-family="'Segoe UI', Arial, sans-serif" font-size="44" font-weight="800" fill="${C_DARK_GREEN}" letter-spacing="0.22em">
        AGRIVIL
      </text>
      <text x="0" y="80" font-family="'Segoe UI', Arial, sans-serif" font-size="16" font-weight="600" fill="${C_CLAY_RUST}">
        Ghana’s Cold-Chain Virtual Farmers Marketplace
      </text>
    </g>
    ${invoiceHeaderSnippet}
  </svg>`
  await sharp(Buffer.from(invoiceHeaderSvg)).png().toFile(path.join(printDir, 'invoice_header.png'))

  // 5. 05_MOCKUPS
  console.log('Generating 05_MOCKUPS (Pattern tile)...')
  const mockupDir = path.join(ROOT, '05_MOCKUPS')

  // Brand pattern tile (600x600)
  const patternSvg = `
  <svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="600" fill="${C_CREAM}"/>
    <g opacity="0.18">
      ${getMarkSvgSnippet({ variant: 'color', x: 0, y: 0, width: 180, height: 180 })}
      ${getMarkSvgSnippet({ variant: 'color', x: 300, y: 0, width: 180, height: 180 })}
      ${getMarkSvgSnippet({ variant: 'color', x: 150, y: 200, width: 180, height: 180 })}
      ${getMarkSvgSnippet({ variant: 'color', x: 450, y: 200, width: 180, height: 180 })}
      ${getMarkSvgSnippet({ variant: 'color', x: 0, y: 400, width: 180, height: 180 })}
      ${getMarkSvgSnippet({ variant: 'color', x: 300, y: 400, width: 180, height: 180 })}
    </g>
  </svg>`
  await sharp(Buffer.from(patternSvg)).png().toFile(path.join(mockupDir, 'brand_pattern_tile.png'))

  // 6. 06_BRAND_GUIDE
  console.log('Generating 06_BRAND_GUIDE & Master usage board...')
  const guideDir = path.join(ROOT, '06_BRAND_GUIDE')

  // Master Logo Usage Board (3072x2048) in 01_LOGO_SYSTEM
  const stackedBoardSnippet = getMarkSvgSnippet({ variant: 'color', x: 320, y: 220, width: 420, height: 420 })
  const horizWhiteSnippet = getMarkSvgSnippet({ variant: 'white', x: 1060, y: 280, width: 220, height: 220 })
  const horizBlackSnippet = getMarkSvgSnippet({ variant: 'black', x: 1060, y: 780, width: 220, height: 220 })
  const appLightSnippet = getMarkSvgSnippet({ variant: 'color', x: 2150, y: 350, width: 240, height: 240 })
  const appDarkSnippet = getMarkSvgSnippet({ variant: 'white', x: 2550, y: 350, width: 240, height: 240 })

  const usageBoardSvg = `
  <svg width="3072" height="2048" viewBox="0 0 3072 2048" xmlns="http://www.w3.org/2000/svg">
    <rect width="3072" height="2048" fill="#F7F5F0"/>
    
    <!-- Top Header -->
    <rect width="3072" height="120" fill="${C_DARK_GREEN}"/>
    <text x="80" y="75" font-family="'Segoe UI', Arial, sans-serif" font-size="44" font-weight="800" fill="#FFFFFF" letter-spacing="0.22em">
      AGRIVIL — BRAND IDENTITY SYSTEM
    </text>
    <text x="2992" y="75" text-anchor="end" font-family="'Segoe UI', Arial, sans-serif" font-size="24" font-weight="600" fill="${C_GOLD}">
      CONCEPT 01 (MASTER SPECIFICATION)
    </text>

    <!-- Column 1: Primary Stacked Logo -->
    <g transform="translate(80, 180)">
      <rect width="900" height="960" rx="28" fill="#FFFFFF" stroke="#000000" stroke-opacity="0.06"/>
      <text x="50" y="70" font-family="'Segoe UI', Arial, sans-serif" font-size="22" font-weight="800" fill="${C_CHARCOAL}">
        PRIMARY STACKED LOGO
      </text>
    </g>
    ${stackedBoardSnippet}
    <text x="530" y="690" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif" font-size="64" font-weight="800" fill="${C_DARK_GREEN}" letter-spacing="0.22em">
      AGRIVIL
    </text>
    <text x="530" y="750" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif" font-size="22" font-weight="600" fill="${C_CHARCOAL}">
      Farm Fresh. Market Smart.
    </text>
    <text x="530" y="785" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif" font-size="19" font-weight="500" fill="${C_CHARCOAL}">
      Delivered with care.
    </text>

    <!-- Column 2: Logo Variations & Lockups -->
    <g transform="translate(1020, 180)">
      <!-- Reverse White Card -->
      <rect width="960" height="460" rx="28" fill="${C_DARK_GREEN}"/>
      <text x="50" y="60" font-family="'Segoe UI', Arial, sans-serif" font-size="20" font-weight="800" fill="#FFFFFF">
        REVERSE WHITE (DARK CANVAS)
      </text>
      <!-- Monochrome Black Card -->
      <g transform="translate(0, 500)">
        <rect width="960" height="460" rx="28" fill="#FFFFFF" stroke="#000000" stroke-opacity="0.06"/>
        <text x="50" y="60" font-family="'Segoe UI', Arial, sans-serif" font-size="20" font-weight="800" fill="${C_CHARCOAL}">
          MONOCHROME BLACK
        </text>
      </g>
    </g>
    ${horizWhiteSnippet}
    <text x="1330" y="405" font-family="'Segoe UI', Arial, sans-serif" font-size="64" font-weight="800" fill="#FFFFFF" letter-spacing="0.22em">
      AGRIVIL
    </text>
    ${horizBlackSnippet}
    <text x="1330" y="905" font-family="'Segoe UI', Arial, sans-serif" font-size="64" font-weight="800" fill="#000000" letter-spacing="0.22em">
      AGRIVIL
    </text>

    <!-- Column 3: App Icons & Favicons -->
    <g transform="translate(2020, 180)">
      <rect width="970" height="960" rx="28" fill="#FFFFFF" stroke="#000000" stroke-opacity="0.06"/>
      <text x="50" y="70" font-family="'Segoe UI', Arial, sans-serif" font-size="22" font-weight="800" fill="${C_CHARCOAL}">
        APP ICONS &amp; DIGITAL BADGES
      </text>
      <rect x="100" y="140" width="300" height="300" rx="66" fill="${C_CREAM}"/>
      <rect x="480" y="140" width="300" height="300" rx="66" fill="${C_DARK_GREEN}"/>
      <text x="250" y="490" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif" font-size="18" font-weight="600" fill="${C_MUTED}">Light Canvas (Default)</text>
      <text x="630" y="490" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif" font-size="18" font-weight="600" fill="${C_MUTED}">Dark Forest Green</text>
    </g>
    ${appLightSnippet}
    ${appDarkSnippet}

    <!-- Bottom Section: Color Palette & Typography -->
    <g transform="translate(80, 1180)">
      <rect width="2910" height="780" rx="28" fill="#FFFFFF" stroke="#000000" stroke-opacity="0.06"/>
      <text x="60" y="70" font-family="'Segoe UI', Arial, sans-serif" font-size="26" font-weight="800" fill="${C_CHARCOAL}">
        COLOR SYSTEM &amp; TYPOGRAPHY
      </text>

      <!-- Swatches -->
      <g transform="translate(60, 120)">
        <rect x="0" y="0" width="360" height="180" rx="16" fill="${C_DARK_GREEN}"/>
        <text x="20" y="220" font-family="'Segoe UI', Arial, sans-serif" font-size="18" font-weight="800" fill="${C_CHARCOAL}">Deep Forest Green</text>
        <text x="20" y="248" font-family="'Segoe UI', Arial, sans-serif" font-size="16" font-weight="600" fill="${C_MUTED}">#0B3B25 · Primary</text>

        <rect x="400" y="0" width="360" height="180" rx="16" fill="${C_SUN_ORANGE}"/>
        <text x="420" y="220" font-family="'Segoe UI', Arial, sans-serif" font-size="18" font-weight="800" fill="${C_CHARCOAL}">Sun Ochre / Orange</text>
        <text x="420" y="248" font-family="'Segoe UI', Arial, sans-serif" font-size="16" font-weight="600" fill="${C_MUTED}">#DF8821 · Harvest Sun</text>

        <rect x="800" y="0" width="360" height="180" rx="16" fill="${C_CLAY_RUST}"/>
        <text x="820" y="220" font-family="'Segoe UI', Arial, sans-serif" font-size="18" font-weight="800" fill="${C_CHARCOAL}">Clay Rust</text>
        <text x="820" y="248" font-family="'Segoe UI', Arial, sans-serif" font-size="16" font-weight="600" fill="${C_MUTED}">#7A3F1C · Farmer Tag</text>

        <rect x="1200" y="0" width="360" height="180" rx="16" fill="${C_GOLD}"/>
        <text x="1220" y="220" font-family="'Segoe UI', Arial, sans-serif" font-size="18" font-weight="800" fill="${C_CHARCOAL}">Harvest Gold</text>
        <text x="1220" y="248" font-family="'Segoe UI', Arial, sans-serif" font-size="16" font-weight="600" fill="${C_MUTED}">#F0A81E · Star Ratings</text>

        <rect x="1600" y="0" width="360" height="180" rx="16" fill="${C_CREAM}" stroke="#000000" stroke-opacity="0.1"/>
        <text x="1620" y="220" font-family="'Segoe UI', Arial, sans-serif" font-size="18" font-weight="800" fill="${C_CHARCOAL}">Warm Canvas</text>
        <text x="1620" y="248" font-family="'Segoe UI', Arial, sans-serif" font-size="16" font-weight="600" fill="${C_MUTED}">#FAF7F2 · Backgrounds</text>

        <rect x="2000" y="0" width="360" height="180" rx="16" fill="${C_CHARCOAL}"/>
        <text x="2020" y="220" font-family="'Segoe UI', Arial, sans-serif" font-size="18" font-weight="800" fill="${C_CHARCOAL}">Deep Soil Charcoal</text>
        <text x="2020" y="248" font-family="'Segoe UI', Arial, sans-serif" font-size="16" font-weight="600" fill="${C_MUTED}">#211A12 · Headings</text>
      </g>

      <!-- Typography Section -->
      <g transform="translate(60, 460)">
        <text x="0" y="0" font-family="'Segoe UI', Arial, sans-serif" font-size="36" font-weight="800" fill="${C_CHARCOAL}">
          Montserrat Bold / Manrope Bold / Segoe UI Bold — Primary Wordmark &amp; Headings
        </text>
        <text x="0" y="50" font-family="'Segoe UI', Arial, sans-serif" font-size="24" font-weight="500" fill="${C_MUTED}">
          Inter Regular &amp; SemiBold — Body text, interface metadata, descriptions, and packaging copy.
        </text>
        <text x="0" y="110" font-family="'Segoe UI', Arial, sans-serif" font-size="32" font-weight="800" fill="${C_DARK_GREEN}" letter-spacing="0.15em">
          FARM FRESH. MARKET SMART. DELIVERED WITH CARE.
        </text>
      </g>
    </g>
  </svg>`

  await sharp(Buffer.from(usageBoardSvg)).png().toFile(path.join(logoDir, 'logo_usage_board.png'))
  await sharp(Buffer.from(usageBoardSvg)).resize(1920).png().toFile(path.join(guideDir, 'logo_asset_contact_sheet.png'))

  // 7. BRAND GUIDE MARKDOWN
  const brandGuideMd = `# AgriVil — Brand Identity & Asset Guidelines (Concept 01)

> **Approved Master Brand Identity System**  
> **Source Reference**: Concept 01 from Client Brand Board (\`AI_brand_application_board_reference.png\`)  
> **Version**: 1.0.0 (Production Release)

---

## 1. Brand Concept & Story

**AgriVil** represents the dawn of direct-from-farm cold-chain commerce in Ghana.
The emblem unites two foundational agricultural elements:
1. **The Rising Sun (Harvest Sun)**: Radiating energy with 9 rays (7 radial + 2 horizontal baseline rays) and an open semicircular arch in warm Sun Ochre (\`#DF8821\`), symbolizing dawn harvest, renewal, and optimism.
2. **The Farmland Furrows & Terraced Hills**: Formed by the bottom hemisphere in Deep Forest Green (\`#0B3B25\`), cut with organic negative-space channels that convey rolling rows of crops, soil vitality, and transparent farm-to-table traceability.

---

## 2. Color Palette & Specifications

| Color Role | Name | Hex Code | RGB | CMYK | Usage |
|---|---|---|---|---|---|
| **Primary Brand** | Deep Forest Green | \`#0B3B25\` | \`11, 59, 37\` | \`81, 0, 37, 77\` | Wordmarks, primary buttons, dark backdrops |
| **Primary Accent** | Sun Ochre / Orange | \`#DF8821\` | \`223, 136, 33\` | \`0, 39, 85, 13\` | Sun arch, rays, energy accents |
| **Secondary Accent** | Clay Rust | \`#7A3F1C\` | \`122, 63, 28\` | \`0, 48, 77, 52\` | Farm attribution badges, discount labels |
| **Highlight** | Harvest Gold | \`#F0A81E\` | \`240, 168, 30\` | \`0, 30, 88, 6\` | Star ratings, premium farmer certifications |
| **Canvas / BG** | Warm Canvas | \`#FAF7F2\` | \`250, 247, 242\` | \`0, 1, 3, 2\` | Mobile & web canvas backgrounds, light app icons |
| **Primary Text** | Deep Soil Charcoal | \`#211A12\` | \`33, 26, 18\` | \`0, 21, 45, 87\` | Headings, high-contrast typography |
| **Secondary Text** | Muted Earth Charcoal | \`#5C5247\` | \`92, 82, 71\` | \`0, 11, 23, 64\` | Subtitles, metadata, body text |

---

## 3. Typography System

- **Primary Wordmark**: Geometric Bold Sans-Serif (\`Montserrat Bold\` / \`Manrope Bold\` / \`Segoe UI Bold\`) with \`letter-spacing: 0.22em\`.
- **Tagline**:
  - Line 1: **"Farm Fresh. Market Smart."** (Bold / SemiBold)
  - Line 2: **"Delivered with care."** (Medium / Regular)
- **Body & Interface**: \`Inter\` / system sans-serif for clean readability across Android, iOS, and Web.

---

## 4. Logo Lockups & Variations

1. **Primary Stacked Logo** (\`agrivil_logo_stacked.svg\` / \`.png\`):
   - Used for center-aligned headers, splash screens, packaging, and hero presentations.
2. **Primary Horizontal Logo** (\`agrivil_logo_primary_horizontal.svg\` / \`.png\`):
   - Standard navigation bar lockup, letterheads, invoice headers, and email signatures.
3. **Standalone Mark** (\`agrivil_mark_color.svg\`, \`agrivil_mark_white.svg\`, \`agrivil_mark_black.svg\`):
   - Social media profile avatars, favicon, stamps, and app icon centerpieces.
4. **Reverse White** (\`agrivil_logo_reverse.svg\` / \`.png\`):
   - For placement on Deep Forest Green or dark photo backgrounds.
5. **Monochrome Black** (\`agrivil_logo_black.svg\` / \`.png\`):
   - Single-color print, receipts, and carton stamping.
6. **Social Profile Avatar (Circular)** (\`agrivil_social_avatar_circle.svg\` / \`.png\`):
   - Circular border badge for social media profile pictures.
7. **Round Farm Fresh Stamp Badge** (\`agrivil_round_stamp_badge.svg\` / \`.png\`):
   - Circular stamp badge with "FARM FRESH · MARKET SMART".
8. **App Icons** (\`agrivil_app_icon.png\`, \`agrivil_app_icon_dark.png\`):
   - Android Capacitor and iOS mobile application icons.

---

## 5. Clear Space & Minimum Sizing Rules

- **Clear Space**: Maintain a minimum exclusion zone around the logo equal to the radius of the inner sun arch ($R_{in} \\approx 0.3\\times$ total mark height).
- **Minimum Digital Sizing**:
  - Horizontal logo: Minimum 140px width.
  - Stacked logo: Minimum 90px width.
  - Standalone mark: Minimum 24px $\\times$ 24px.
- **Do's & Don'ts**:
  - DO use the official vector SVGs whenever possible.
  - DO place the reverse white logo on Deep Forest Green backgrounds.
  - DO NOT rotate, skew, or stretch the logo proportions.
  - DO NOT replace brand colors with arbitrary shades.
  - DO NOT add drop shadows or bevels to the vector mark.

---

## 6. Directory Structure & Asset Inventory

\`\`\`
LOGO-ASSETS-REFERENCE-TYPE-OF-EACH-REQUIRED-ASSET/
├── 01_LOGO_SYSTEM/         # Core marks, lockups, reverse, monochrome, social circle, stamp, and usage board
├── 02_ICONS/               # 12 UI SVG & PNG icons (home, cart, search, farmer, etc.)
├── 03_DIGITAL_ASSETS/      # App icon suite (16px to 1024px), favicon.ico, social banners
├── 04_PRINT_ASSETS/        # Business cards, A4 letterhead, email signature, invoice header
├── 05_MOCKUPS/             # Brand pattern tile & reference mockups
├── 06_BRAND_GUIDE/         # This guide, ASSET_MANIFEST.json, contact sheet
└── 07_SOURCE_REFERENCES/   # Original client reference board and concept sheet
\`\`\`
`
  fs.writeFileSync(path.join(guideDir, 'AGRIVIL_BRAND_IDENTITY_GUIDE.md'), brandGuideMd)

  // 8. SYNC TO APP PUBLIC ASSETS
  fs.writeFileSync(path.join(PUBLIC_DIR, 'agrivil-logo.svg'), horizSvg)
  await sharp(Buffer.from(getAppIconSvg({ variant: 'light', size: 192 }))).resize(192, 192).png().toFile(path.join(PUBLIC_DIR, 'icon.png'))
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), fav32)

  // 9. ASSET MANIFEST
  const manifest = []
  function walk(dir, rel = '') {
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f)
      const r = rel ? `${rel}/${f}` : f
      if (fs.statSync(full).isDirectory()) {
        walk(full, r)
      } else {
        manifest.push({
          path: r,
          bytes: fs.statSync(full).size
        })
      }
    }
  }
  walk(ROOT)
  fs.writeFileSync(path.join(guideDir, 'ASSET_MANIFEST.json'), JSON.stringify(manifest, null, 2))

  console.log(`Generated all assets! Total files: ${manifest.length}`)
}

generateAll().catch(console.error)
