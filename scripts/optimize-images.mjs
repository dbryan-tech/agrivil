import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const targetDirs = [
  'public/golden-acres/produce',
  'public/golden-acres/farmers',
  'public/golden-acres/recipes',
  'public/golden-acres',
];

async function optimizeImages() {
  let totalSavedBytes = 0;
  let totalOriginalBytes = 0;

  for (const relDir of targetDirs) {
    const absDir = path.resolve(relDir);
    if (!fs.existsSync(absDir)) continue;

    const files = fs.readdirSync(absDir);
    for (const file of files) {
      if (file.startsWith('temp-')) {
        try { fs.unlinkSync(path.join(absDir, file)); } catch {}
        continue;
      }

      const filePath = path.join(absDir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) continue;

      const ext = path.extname(file).toLowerCase();
      if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;

      const originalSize = stat.size;
      totalOriginalBytes += originalSize;

      try {
        const inputBuffer = fs.readFileSync(filePath);
        const metadata = await sharp(inputBuffer).metadata();

        // Calculate max dimension
        let maxDim = 800;
        if (relDir.includes('produce') || relDir.includes('farmers')) {
          maxDim = 500;
        } else if (file.includes('hero') || file.includes('banner')) {
          maxDim = 1000;
        }

        let pipeline = sharp(inputBuffer);
        if (metadata.width && metadata.width > maxDim) {
          pipeline = pipeline.resize({ width: maxDim, withoutEnlargement: true });
        }

        // 1. Generate WebP version
        const baseName = path.basename(file, ext);
        const webpPath = path.join(absDir, `${baseName}.webp`);
        const webpBuffer = await pipeline.clone().webp({ quality: 80, effort: 5 }).toBuffer();
        fs.writeFileSync(webpPath, webpBuffer);

        // 2. Overwrite the original .png/.jpg with optimized buffer
        let optimizedBuffer;
        if (ext === '.png') {
          optimizedBuffer = await pipeline.clone().png({ quality: 80, compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
        } else {
          optimizedBuffer = await pipeline.clone().jpeg({ quality: 80, mozjpeg: true }).toBuffer();
        }

        if (optimizedBuffer.length < originalSize) {
          fs.writeFileSync(filePath, optimizedBuffer);
          const saved = originalSize - optimizedBuffer.length;
          totalSavedBytes += saved;
          console.log(`[Optimized] ${file}: ${(originalSize / 1024).toFixed(1)} KB -> ${(optimizedBuffer.length / 1024).toFixed(1)} KB (WebP: ${(webpBuffer.length / 1024).toFixed(1)} KB) (Saved ${(saved / 1024).toFixed(1)} KB, ${(saved / originalSize * 100).toFixed(1)}%)`);
        } else {
          console.log(`[Kept Original] ${file}: ${(originalSize / 1024).toFixed(1)} KB (WebP: ${(webpBuffer.length / 1024).toFixed(1)} KB)`);
        }
      } catch (err) {
        console.error(`[Error] processing ${file}:`, err.message);
      }
    }
  }

  console.log(`\n==========================================`);
  console.log(`TOTAL ORIGINAL: ${(totalOriginalBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`TOTAL SAVED:    ${(totalSavedBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`REDUCTION:      ${((totalSavedBytes / totalOriginalBytes) * 100).toFixed(1)}%`);
  console.log(`==========================================\n`);
}

optimizeImages();
