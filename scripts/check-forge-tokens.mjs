#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

export const FORBIDDEN_PATTERNS = [
  /forge/i,
  /license/i,
  /telemetry/i,
  /\.fex\b/i,
  /engine:/i,
  /guard/i,
]

export function findForbiddenTokens(rootDir) {
  const violations = []

  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const fullPath = join(dir, entry)
      const stat = statSync(fullPath)
      if (stat.isDirectory()) {
        walk(fullPath)
        continue
      }
      if (!entry.endsWith('.ts')) continue
      const content = readFileSync(fullPath, 'utf8')
      content.split('\n').forEach((line, i) => {
        for (const pattern of FORBIDDEN_PATTERNS) {
          if (pattern.test(line)) {
            violations.push(`${fullPath}:${i + 1}: matches ${pattern} — "${line.trim()}"`)
          }
        }
      })
    }
  }

  walk(rootDir)
  return violations
}

function main() {
  const violations = findForbiddenTokens(join(process.cwd(), 'src'))
  if (violations.length > 0) {
    console.error('forge-ignorance guard failed — forbidden tokens found in src/:\n')
    violations.forEach((v) => console.error('  ' + v))
    process.exit(1)
  }
  console.log('forge-ignorance guard passed — no forbidden tokens in src/.')
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
