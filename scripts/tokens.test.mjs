import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

// Each palette in tokens.css tells the browser which scheme it is, so what the browser draws itself —
// scrollbars, native form controls — is light or dark with the palette rather than always light.

const css = readFileSync(new URL('../tokens.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')

/** The innermost rule bodies that set a background token: one per palette. */
function palettes(source) {
  return [...source.matchAll(/\{([^{}]*)\}/g)].map((m) => m[1]).filter((body) => /--dc-color-bg\s*:/.test(body))
}

/** Relative luminance of a `#rrggbb` color (WCAG). */
function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

test('every palette declares the color-scheme its background is', () => {
  const found = palettes(css)
  assert.ok(found.length >= 3, `expected the light palette and two dark ones, found ${found.length}`)
  for (const body of found) {
    const bg = body.match(/--dc-color-bg\s*:\s*(#[0-9a-fA-F]{6})/)?.[1]
    const scheme = body.match(/color-scheme\s*:\s*([a-z ]+);/)?.[1].trim()
    assert.ok(bg, 'a palette background is a #rrggbb color')
    assert.equal(scheme, luminance(bg) > 0.5 ? 'light' : 'dark', `palette with background ${bg}`)
  }
})
