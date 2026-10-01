#!/usr/bin/env node
// Checks that every design token a codebase reads is defined. A `var(--dc-…, fallback)` whose token
// no stylesheet defines falls back silently — usually to a light default that shows up as a wrong
// colour only in the dark scheme — so a typo or a removed token goes unnoticed without this check.
//
//   desktop-compact-check-tokens [--defined <css>]... <dir|file>...
//
// This package's own tokens.css always counts as defined; `--defined` adds further stylesheets.
// Directories are scanned recursively (node_modules and dot-directories are skipped) for .ts, .js,
// .mjs and .css files. Exit 0 when every token read is defined, 1 when one is not, 2 on bad usage.

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const USAGE = 'usage: desktop-compact-check-tokens [--defined <css>]... <dir|file>...'
const SCANNED = new Set(['.ts', '.js', '.mjs', '.css'])
// A token is defined by a declaration (`--dc-x: …`) or registered by `@property --dc-x { … }` — a
// registered token without a value leaves the reading component's fallback in effect, by design.
const DEFINITION = /(--dc-[a-z0-9-]+)\s*:|@property\s+(--dc-[a-z0-9-]+)\s*\{/g
const COMMENT = /\/\*[\s\S]*?\*\//g
const REFERENCE = /var\(\s*(--dc-[a-z0-9-]+)/g
const OWN_TOKENS = fileURLToPath(new URL('../tokens.css', import.meta.url))

function fail(message) {
  console.error(`[tokens] ${message}\n${USAGE}`)
  process.exit(2)
}

function parseArgs(argv) {
  const stylesheets = [OWN_TOKENS]
  const targets = []
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '-h' || arg === '--help') {
      console.log(USAGE)
      process.exit(0)
    } else if (arg === '--defined') {
      if (i + 1 >= argv.length) fail('--defined needs a stylesheet path')
      stylesheets.push(argv[++i])
    } else if (arg.startsWith('--defined=')) {
      stylesheets.push(arg.slice('--defined='.length))
    } else if (arg.startsWith('-')) {
      fail(`unknown option ${arg}`)
    } else {
      targets.push(arg)
    }
  }
  if (targets.length === 0) {
    console.error(USAGE)
    process.exit(2)
  }
  return { stylesheets, targets }
}

function read(path) {
  try {
    return readFileSync(path, 'utf8')
  } catch (error) {
    fail(`cannot read ${path}: ${error.code ?? error.message}`)
  }
}

function* sourceFiles(path) {
  let stat
  try {
    stat = statSync(path)
  } catch (error) {
    fail(`cannot read ${path}: ${error.code ?? error.message}`)
  }
  if (stat.isFile()) {
    yield path
    return
  }
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    const full = join(path, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
      yield* sourceFiles(full)
    } else if (entry.isFile() && SCANNED.has(extname(entry.name))) {
      yield full
    }
  }
}

const { stylesheets, targets } = parseArgs(process.argv.slice(2))

const defined = new Set(
  stylesheets.flatMap((css) => [...read(css).replace(COMMENT, '').matchAll(DEFINITION)].map((m) => m[1] ?? m[2])),
)

const missing = new Set()
for (const target of targets) {
  for (const file of sourceFiles(target)) {
    const shown = relative(process.cwd(), file).split(sep).join('/') || file
    for (const m of read(file).matchAll(REFERENCE)) {
      if (!defined.has(m[1])) missing.add(`${m[1]} in ${shown}`)
    }
  }
}

if (missing.size > 0) {
  console.error(`[tokens] read but not defined:\n  ${[...missing].join('\n  ')}`)
  process.exit(1)
}
console.log(`[tokens] ok — ${defined.size} defined`)
