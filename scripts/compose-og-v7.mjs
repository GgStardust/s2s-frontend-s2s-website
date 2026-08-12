/**
 * Compose final OG (1200×630) from relational field plate + og-v5-matched typography.
 * Text sits inside the center-square safe zone (x ≈ 285–915).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { createElement as h } from 'react'

const require = createRequire(import.meta.url)
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const { ImageResponse } = require('next/dist/compiled/@vercel/og')

const FONT_DIR = join(root, '.tmp/og-fonts')
const CORM =
  join(FONT_DIR, 'corm-unpack/Cormorant_Install_v3.609/1. TrueType Font Files/CormorantGaramond-Medium.ttf')
const CORM_REG =
  join(FONT_DIR, 'corm-unpack/Cormorant_Install_v3.609/1. TrueType Font Files/CormorantGaramond-Regular.ttf')

function font(path) {
  if (!existsSync(path)) throw new Error(`Missing font ${path}`)
  return readFileSync(path)
}

const platePath = process.argv[2] || '/tmp/og-v7-field-plate.png'
const outPath = process.argv[3] || join(root, 'public/og-v7.png')
const plateData = `data:image/png;base64,${readFileSync(platePath).toString('base64')}`

const IVORY = '#e8dcc8' // warm cream matching og-v5 legibility
const IVORY_DIM = 'rgba(232, 220, 200, 0.88)'

const element = h(
  'div',
  {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      position: 'relative',
      backgroundColor: '#05070c',
    },
  },
  h('img', {
    src: plateData,
    width: 1200,
    height: 630,
    style: { position: 'absolute', left: 0, top: 0, width: 1200, height: 630, objectFit: 'cover' },
  }),
  // Soft dark veil behind text for legibility without erasing the field language
  h('div', {
    style: {
      position: 'absolute',
      left: 240,
      top: 0,
      width: 420,
      height: 630,
      display: 'flex',
      backgroundImage:
        'linear-gradient(90deg, rgba(5,7,12,0.55) 0%, rgba(5,7,12,0.42) 55%, rgba(5,7,12,0) 100%)',
    },
  }),
  h(
    'div',
    {
      style: {
        position: 'absolute',
        // Center-square safe zone starts ~285px — keep type inside it
        left: 310,
        top: 0,
        bottom: 0,
        width: 420,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        color: IVORY,
      },
    },
    h(
      'div',
      {
        style: {
          fontFamily: 'Cormorant',
          fontSize: 16,
          letterSpacing: '0.26em',
          textTransform: 'uppercase',
          color: IVORY_DIM,
          marginBottom: 34,
        },
      },
      'Stardust to Sovereignty',
    ),
    h(
      'div',
      {
        style: {
          fontFamily: 'Cormorant',
          fontSize: 44,
          lineHeight: 1.2,
          fontWeight: 500,
          letterSpacing: '0.005em',
          color: IVORY,
          marginBottom: 6,
        },
      },
      'What becomes visible',
    ),
    h(
      'div',
      {
        style: {
          fontFamily: 'Cormorant',
          fontSize: 44,
          lineHeight: 1.2,
          fontWeight: 500,
          color: IVORY,
          marginBottom: 6,
        },
      },
      'when we follow',
    ),
    h(
      'div',
      {
        style: {
          fontFamily: 'Cormorant',
          fontSize: 44,
          lineHeight: 1.2,
          fontWeight: 500,
          color: IVORY,
          marginBottom: 36,
        },
      },
      'how things relate?',
    ),
    h(
      'div',
      {
        style: {
          fontFamily: 'Cormorant',
          fontSize: 15,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: IVORY_DIM,
        },
      },
      'Gigi Stardust',
    ),
  ),
)

const response = new ImageResponse(element, {
  width: 1200,
  height: 630,
  fonts: [
    { name: 'Cormorant', data: font(CORM), style: 'normal', weight: 500 },
    { name: 'Cormorant', data: font(CORM_REG), style: 'normal', weight: 400 },
  ],
})

const buf = Buffer.from(await response.arrayBuffer())
mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, buf)
console.log(`Wrote ${outPath} (${buf.length} bytes)`)
