import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const BIN = fileURLToPath(new URL('../bin/check-tokens.mjs', import.meta.url))

/** Runs the bin from `cwd` and returns its exit status and output. */
function run(cwd, ...args) {
  const r = spawnSync(process.execPath, [BIN, ...args], { cwd, encoding: 'utf8' })
  return { status: r.status, stdout: r.stdout, stderr: r.stderr }
}

/** A temp directory holding `files` (relative path → content); removed after `body`. */
function withFixture(files, body) {
  const dir = mkdtempSync(join(tmpdir(), 'dc-check-tokens-'))
  try {
    for (const [path, content] of Object.entries(files)) {
      mkdirSync(join(dir, path, '..'), { recursive: true })
      writeFileSync(join(dir, path), content)
    }
    body(dir)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

test('passes when every token read is defined by the package tokens.css', () => {
  withFixture(
    {
      'src/a.ts': 'css`color: var(--dc-color-text); background: var(--dc-color-bg, #fff);`',
      'src/nested/b.css': '.x { border-color: var(--dc-color-border); }',
    },
    (dir) => {
      const r = run(dir, 'src')
      assert.equal(r.status, 0, r.stderr)
      assert.match(r.stdout, /^\[tokens\] ok — \d+ defined/)
    },
  )
})

test('reports an undefined token with its file and exits 1', () => {
  withFixture({ 'src/nested/a.ts': 'css`color: var(--dc-no-such-token, red);`' }, (dir) => {
    const r = run(dir, 'src')
    assert.equal(r.status, 1)
    assert.match(r.stderr, /--dc-no-such-token in src\/nested\/a\.ts/)
  })
})

test('--defined adds the tokens of another stylesheet', () => {
  withFixture(
    {
      'extra.css': ':root { --dc-extra-gap: 4px; }',
      'src/a.mjs': 'const s = "gap: var(--dc-extra-gap)"',
    },
    (dir) => {
      assert.equal(run(dir, 'src').status, 1)
      const r = run(dir, '--defined', 'extra.css', 'src')
      assert.equal(r.status, 0, r.stderr)
    },
  )
})

test('skips node_modules, dot-directories and unscanned extensions', () => {
  withFixture(
    {
      'src/ok.ts': 'export const x = 1',
      'src/node_modules/dep/a.js': 'var(--dc-missing-a)',
      'src/.cache/a.css': '.x { color: var(--dc-missing-b); }',
      'src/notes.md': 'var(--dc-missing-c)',
    },
    (dir) => assert.equal(run(dir, 'src').status, 0),
  )
})

test('accepts a file as a positional argument', () => {
  withFixture({ 'a.css': '.x { color: var(--dc-missing-d); }' }, (dir) => {
    const r = run(dir, 'a.css')
    assert.equal(r.status, 1)
    assert.match(r.stderr, /--dc-missing-d in a\.css/)
  })
})

test('prints usage and exits 2 without a directory or file', () => {
  withFixture({}, (dir) => {
    const r = run(dir)
    assert.equal(r.status, 2)
    assert.match(r.stderr, /^usage: desktop-compact-check-tokens/)
  })
})

test('exits 2 when a path cannot be read', () => {
  withFixture({}, (dir) => {
    assert.equal(run(dir, 'nowhere').status, 2)
    assert.equal(run(dir, '--defined', 'nowhere.css', '.').status, 2)
  })
})
