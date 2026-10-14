import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const read = (name) => readFileSync(fileURLToPath(new URL(`../${name}`, import.meta.url)), 'utf8')

test('every desktop-compact token u-bridge.css reads is one tokens.css defines', () => {
  const defined = new Set(read('tokens.css').match(/--dc-[a-z0-9-]+(?=\s*:)/g))
  const read_ = new Set(read('u-bridge.css').match(/var\((--dc-[a-z0-9-]+)\)/g).map((v) => v.slice(4, -1)))
  assert.deepEqual([...read_].filter((t) => !defined.has(t)), [])
})

test('u-bridge.css sets each u token once, inside the house layer', () => {
  const sheet = read('u-bridge.css')
  const body = sheet.slice(sheet.indexOf('@layer iyu.house {'))
  const set = body.match(/--u-[a-z0-9-]+(?=\s*:)/g)
  assert.ok(set.length > 50)
  assert.deepEqual(set.filter((t, i) => set.indexOf(t) !== i), [])
  assert.equal(sheet.slice(0, sheet.indexOf('@layer iyu.house {')).match(/--u-[a-z0-9-]+\s*:/g), null, 'nothing set outside the layer')
})
