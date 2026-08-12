/**
 * Render public/og-v6.png — cleanroom home-hero OG (1200×630).
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { createElement as h } from 'react'

const require = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const { ImageResponse } = require('next/dist/compiled/@vercel/og')

const FONT_DIR = join(root, '.tmp/og-fonts')
const OUT = join(root, 'public/og-v6.png')
const GLYPH = join(root, 'public/assets/glyphs/glyph_01.png')

function loadFont(name) {
  const path = join(FONT_DIR, name)
  if (!existsSync(path)) throw new Error(`Missing font: ${path}`)
  return readFileSync(path)
}

const serif = loadFont('CormorantGaramond-Medium.ttf')
const mono = loadFont('IBMPlexMono-Medium.ttf')
const glyphDataUrl = `data:image/png;base64,${readFileSync(GLYPH).toString('base64')}`

const PAPER = '#f4f0e6'
const INK = '#0a0a0a'
const MUTED = '#6b6560'

const element = h(
  'div',
  {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      backgroundColor: PAPER,
      color: INK,
      position: 'relative',
    },
  },
  h(
    'div',
    {
      style: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        padding: '64px 72px 56px',
        boxSizing: 'border-box',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 48,
      },
    },
    h(
      'div',
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flex: 1,
          maxWidth: 720,
        },
      },
      h(
        'div',
        {
          style: {
            fontFamily: 'IBMPlexMono',
            fontSize: 18,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: MUTED,
            marginBottom: 28,
          },
        },
        'An evolving inquiry by Gigi Stardust',
      ),
      h(
        'div',
        {
          style: {
            fontFamily: 'Cormorant',
            fontSize: 78,
            lineHeight: 1.05,
            fontWeight: 500,
            letterSpacing: '-0.01em',
            marginBottom: 8,
          },
        },
        'Stardust to',
      ),
      h(
        'div',
        {
          style: {
            fontFamily: 'Cormorant',
            fontSize: 78,
            lineHeight: 1.05,
            fontWeight: 500,
            letterSpacing: '-0.01em',
            marginBottom: 28,
          },
        },
        'Sovereignty',
      ),
      h(
        'div',
        {
          style: {
            fontFamily: 'Cormorant',
            fontSize: 28,
            lineHeight: 1.35,
            color: INK,
            maxWidth: 560,
            opacity: 0.88,
          },
        },
        'What does it mean to remain whole while participating in systems larger than ourselves?',
      ),
    ),
    h(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          width: 200,
          flexShrink: 0,
        },
      },
      h('img', {
        src: glyphDataUrl,
        width: 148,
        height: 280,
        style: { objectFit: 'contain', opacity: 0.92 },
      }),
    ),
  ),
  h('div', {
    style: {
      position: 'absolute',
      left: 72,
      right: 72,
      bottom: 36,
      height: 1,
      backgroundColor: 'rgba(10,10,10,0.18)',
      display: 'flex',
    },
  }),
  h(
    'div',
    {
      style: {
        position: 'absolute',
        right: 72,
        bottom: 18,
        fontFamily: 'IBMPlexMono',
        fontSize: 14,
        letterSpacing: '0.12em',
        color: MUTED,
        display: 'flex',
      },
    },
    '13',
  ),
)

const response = new ImageResponse(element, {
  width: 1200,
  height: 630,
  fonts: [
    { name: 'Cormorant', data: serif, style: 'normal', weight: 500 },
    { name: 'IBMPlexMono', data: mono, style: 'normal', weight: 500 },
  ],
})

const buf = Buffer.from(await response.arrayBuffer())
mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, buf)
console.log(`Wrote ${OUT} (${buf.length} bytes)`)
