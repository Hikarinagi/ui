import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import react from '@vitejs/plugin-react'

const source = (path: string) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  plugins: [vue(), react()],
  resolve: {
    alias: [
      { find: /^@hina-ui\/vue$/, replacement: source('../vue/src/index.ts') },
      { find: /^@hina-ui\/vue\/(.*)$/, replacement: `${source('../vue/src')}/$1` },
      { find: /^@hina-ui\/react$/, replacement: source('../react/src/index.ts') },
      { find: /^@hina-ui\/react\/(.*)$/, replacement: `${source('../react/src')}/$1` },
      { find: /^~\/(.*)$/, replacement: `${source('../../docs/vue/app')}/$1` },
    ],
  },
  test: {
    environment: 'node',
    server: { deps: { inline: [/docs\/react/] } },
    include: ['test/**/*.test.ts'],
    exclude: ['**/node_modules/**', 'test/**/*.browser.test.ts'],
    globals: false,
  },
})
