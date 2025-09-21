#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

async function ensureDir(p) {
  await fs.promises.mkdir(p, { recursive: true })
}

async function loadLucideSvg(name) {
  const iconPath = path.join(process.cwd(), 'node_modules', 'lucide-static', 'icons', `${name}.svg`)
  const svg = await fs.promises.readFile(iconPath, 'utf8')
  // make strokes white
  return svg
    .replace(/currentColor/g, '#ffffff')
    .replace(/stroke="[^"]*"/g, 'stroke="#ffffff"')
}

async function renderIconPng(options) {
  const { svg, outPath, size, bg = '#4f46e5', scale = 0.65 } = options
  const inner = Math.round(size * scale)
  const iconPng = await sharp(Buffer.from(svg))
    .resize(inner, inner, { fit: 'contain' })
    .png({ compressionLevel: 9 })
    .toBuffer()

  const base = sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: bg,
    },
  })

  const left = Math.round((size - inner) / 2)
  const top = Math.round((size - inner) / 2)

  const out = await base
    .composite([{ input: iconPng, left, top }])
    .png({ compressionLevel: 9 })
    .toBuffer()

  await fs.promises.writeFile(outPath, out)
}

async function main() {
  const iconName = process.env.ICON || 'bar-chart-2'
  const publicIcons = path.join(process.cwd(), 'public', 'icons')
  await ensureDir(publicIcons)

  const svg = await loadLucideSvg(iconName)

  const targets = [
    { size: 192, out: path.join(publicIcons, 'icon-192.png') },
    { size: 512, out: path.join(publicIcons, 'icon-512.png') },
  ]

  for (const t of targets) {
    await renderIconPng({ svg, outPath: t.out, size: t.size })
    console.log('Wrote', t.out)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
