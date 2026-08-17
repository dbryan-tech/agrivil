import fs from 'node:fs'
import path from 'node:path'

const srcDir = 'C:\\Users\\HP\\Desktop\\knust-bazaar-master\\mobile\\android'
const destDir = path.resolve('mobile/android')

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src)
  const stats = exists && fs.statSync(src)
  const isDirectory = exists && stats.isDirectory()
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true })
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName))
    })
  } else {
    fs.copyFileSync(src, dest)
  }
}

if (fs.existsSync(srcDir)) {
  console.log(`Copying Android project from ${srcDir} to ${destDir}...`)
  copyRecursiveSync(srcDir, destDir)
  console.log('Android project files copied successfully!')
} else {
  console.warn('Source android dir does not exist.')
}
