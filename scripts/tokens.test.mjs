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

/** Tokens the light palette (bare :root) must define. */
const ROOT_TOKENS = [
  '--dc-color-surface-raised', '--dc-color-rule', '--dc-color-secondary', '--dc-color-secondary-text',
  '--dc-color-secondary-contrast', '--dc-color-accent-subtle', '--dc-color-secondary-subtle',
  '--dc-color-success-subtle', '--dc-color-warning-subtle', '--dc-color-danger-subtle',
  '--dc-font-size-xl', '--dc-font-size-2xl', '--dc-font-size-display', '--dc-line-height-tight',
  '--dc-line-height-normal', '--dc-font-weight-bold', '--dc-elevation-1', '--dc-elevation-2', '--dc-elevation-3',
  '--dc-page-eyebrow-color', '--dc-page-eyebrow-size', '--dc-page-title-size', '--dc-page-title-weight',
  '--dc-page-description-color', '--dc-page-rule', '--dc-section-title-weight', '--dc-section-description-color',
  '--dc-section-marker-color', '--dc-card-bg', '--dc-card-border', '--dc-card-elevation', '--dc-card-radius',
  '--dc-card-header-size', '--dc-card-header-accent', '--dc-card-footer-bg', '--dc-field-label-size',
  '--dc-field-label-weight', '--dc-field-label-color', '--dc-field-hint-color', '--dc-field-required-color',
  '--dc-field-gap', '--dc-metric-size', '--dc-metric-accent-1', '--dc-metric-accent-2', '--dc-indicator-color',
  '--dc-selection-bg', '--dc-table-header-bg', '--dc-table-header-color', '--dc-table-rule', '--dc-table-total-rule',
]
/** Color tokens with a literal light value — each needs its own dark value too. */
const DARK_TOKENS = ['--dc-color-surface-raised', '--dc-color-secondary', '--dc-color-secondary-text', '--dc-color-secondary-contrast']

/** Tokens registered with `@property` — declared without a value, so a component's fallback applies. */
const declared = new Set([...css.matchAll(/@property\s+(--dc-[a-z0-9-]+)\s*\{/g)].map((m) => m[1]))

test('the light palette defines or declares every primitive and role token', () => {
  const [light] = palettes(css)
  for (const token of ROOT_TOKENS) {
    assert.ok(new RegExp(`${token}\\s*:`).test(light) || declared.has(token), `${token} in :root or an @property rule`)
  }
})

// A token whose value reads another token is resolved where it is set: set on :root, it would freeze
// the root value of the base token, and a subtree overriding that base token would no longer reach a
// component reading the derived one. Derived tokens are declared instead; components derive them.
test('no palette gives a token a value that reads another token', () => {
  for (const body of palettes(css)) assert.doesNotMatch(body, /--dc-[a-z0-9-]+\s*:[^;]*var\(/)
})

test('declared tokens carry no initial value, so the component fallback applies', () => {
  const rules = [...css.matchAll(/@property\s+(--dc-[a-z0-9-]+)\s*\{([^}]*)\}/g)]
  assert.ok(rules.length > 0)
  for (const [, name, body] of rules) {
    assert.match(body, /syntax\s*:\s*'\*'/, `${name} syntax`)
    assert.match(body, /inherits\s*:\s*true/, `${name} inherits`)
    assert.doesNotMatch(body, /initial-value/, `${name} initial-value`)
  }
})

test('both dark palettes give the literal color tokens a dark value', () => {
  const [, ...dark] = palettes(css)
  assert.equal(dark.length, 2)
  for (const body of dark) for (const token of DARK_TOKENS) assert.match(body, new RegExp(`${token}\\s*:`), `${token} in a dark palette`)
})

test('secondary text reads at 4.5:1 on the background and the raised surface, in every palette', () => {
  const contrast = (a, b) => { const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }
  for (const body of palettes(css)) {
    const get = (t) => body.match(new RegExp(`${t}\\s*:\\s*(#[0-9a-fA-F]{6})`))?.[1]
    const text = get('--dc-color-secondary-text')
    for (const ground of [get('--dc-color-bg'), get('--dc-color-surface-raised')]) assert.ok(contrast(text, ground) >= 4.5, `${text} on ${ground}`)
  }
})
