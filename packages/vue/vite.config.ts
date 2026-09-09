import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const require = createRequire(import.meta.url)
const pkg = require('./package.json') as {
  dependencies: Record<string, string>
  peerDependencies: Record<string, string>
}

const bare = [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)]

export default defineConfig({
  plugins: [vue()],
  build: {
    target: 'es2023',
    minify: false,
    sourcemap: true,
    lib: {
      entry: fileURLToPath(new URL('src/index.ts', import.meta.url)),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: id => bare.some(name => id === name || id.startsWith(`${name}/`)),
    },
  },
})
