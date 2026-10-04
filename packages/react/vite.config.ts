import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const require = createRequire(import.meta.url)
const pkg = require('./package.json') as {
  dependencies: Record<string, string>
  peerDependencies: Record<string, string>
}

const bare = [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)].filter(
  name => name !== 'overlayscrollbars',
)

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2023',
    minify: false,
    sourcemap: true,
    lib: {
      entry: fileURLToPath(new URL('src/index.ts', import.meta.url)),
      formats: ['es'],
    },
    rollupOptions: {
      external: id =>
        id.startsWith('overlayscrollbars/') ||
        bare.some(name => id === name || id.startsWith(`${name}/`)),
      output: {
        preserveModules: true,
        preserveModulesRoot: fileURLToPath(new URL('..', import.meta.url)),
        entryFileNames: 'esm/[name].js',
      },
    },
  },
})
