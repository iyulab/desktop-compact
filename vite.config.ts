import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { existsSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

function discoverComponentEntries(): Record<string, string> {
  const entries: Record<string, string> = { index: 'src/index.ts' }
  const componentsDir = join(process.cwd(), 'src/components')
  if (!existsSync(componentsDir)) return entries
  for (const dir of readdirSync(componentsDir)) {
    const dirPath = join(componentsDir, dir)
    if (!statSync(dirPath).isDirectory()) continue
    entries[dir] = `src/components/${dir}/dc-${dir}.ts`
  }
  return entries
}

export default defineConfig({
  build: {
    lib: {
      entry: discoverComponentEntries(),
      formats: ['es'],
    },
    rollupOptions: {
      external: [/^lit/],
    },
  },
  plugins: [
    dts({ include: ['src'] }),
    {
      name: 'dts-wrapper-generator',
      apply: 'build',
      enforce: 'post',
      closeBundle() {
        // Generate wrapper .d.ts files for each component entry
        const entries = discoverComponentEntries()
        const distDir = 'dist'
        for (const [name, entryPath] of Object.entries(entries)) {
          if (name === 'index') continue
          const wrapperPath = join(distDir, `${name}.d.ts`)
          const componentName = name.replace(/-/g, '_')
          writeFileSync(wrapperPath, `export * from './components/${componentName}/${entryPath.split('/').pop()?.replace('.ts', '')}.js';\n`)
        }
      },
    },
  ],
})
