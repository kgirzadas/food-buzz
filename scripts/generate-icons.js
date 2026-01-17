import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]
const iconsDir = path.join(__dirname, '../public/icons')

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true })
}

// Generate SVG icons for each size
sizes.forEach(size => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4f46e5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad)"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.5}" fill="white" text-anchor="middle" dominant-baseline="central">🍽️</text>
</svg>`

  const filename = path.join(iconsDir, `icon-${size}x${size}.png`)

  // For now, just create SVG files (PNG conversion would require additional dependencies)
  const svgFilename = path.join(iconsDir, `icon-${size}x${size}.svg`)
  fs.writeFileSync(svgFilename, svg)

  console.log(`Generated icon: ${svgFilename}`)
})

// Create a simple PNG placeholder by copying the SVG as a fallback
// In a real project, you'd use sharp or similar to convert SVG to PNG
sizes.forEach(size => {
  const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`)
  const pngPath = path.join(iconsDir, `icon-${size}x${size}.png`)

  // For GitHub Pages, we'll use SVG directly, but copy with .png extension for manifest compatibility
  fs.copyFileSync(svgPath, pngPath)
  console.log(`Created PNG reference: ${pngPath}`)
})

console.log('Icons generated successfully!')
