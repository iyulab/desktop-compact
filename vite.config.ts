import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { existsSync, readdirSync, statSync } from 'node:fs'
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
  plugins: [dts({ include: ['src'] })],
})
