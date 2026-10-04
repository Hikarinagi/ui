import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import vue from '@vitejs/plugin-vue'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readVueLock, writeVueLock, type VueLockKind, type VueLockRecord } from './src/vue-lock.ts'

const source = (path: string) => fileURLToPath(new URL(path, import.meta.url))

const browser = process.env.HINA_TEST_BROWSER ?? 'chromium'
if (browser !== 'chromium' && browser !== 'firefox' && browser !== 'webkit') {
  throw new Error(`Unsupported HINA_TEST_BROWSER: ${browser}`)
}

export default defineConfig({
  plugins: [vue(), react(), tailwindcss()],
  resolve: {
    alias: [
      { find: /^@hina-ui\/vue$/, replacement: source('../vue/src/index.ts') },
      { find: /^@hina-ui\/vue\/(.*)$/, replacement: `${source('../vue/src')}/$1` },
      { find: /^@hina-ui\/react$/, replacement: source('../react/src/index.ts') },
      { find: /^@hina-ui\/react\/(.*)$/, replacement: `${source('../react/src')}/$1` },
    ],
    dedupe: ['vue', 'react', 'react-dom', 'reka-ui', 'radix-ui'],
  },
  optimizeDeps: {
    entries: ['cases/*.live.tsx', 'test/*.browser.test.ts'],
    include: [
      'vue',
      '@hina-ui/vue > reka-ui',
      'react',
      'react/jsx-runtime',
      'react-dom',
      'react-dom/client',
      '@hina-ui/react > radix-ui',
      '@hina-ui/react > radix-ui/internal',
      '@hina-ui/react > aria-hidden',
      '@hina-ui/react > @floating-ui/react-dom',
      '@hina-ui/react > lucide-react',
      '@hina-ui/vue > @lucide/vue',
      '@hina-ui/react > @internationalized/date',
      '@hina-ui/react > @internationalized/number',
      '@hina-ui/vue > @internationalized/date',
      '@hina-ui/react > embla-carousel',
      '@hina-ui/vue > embla-carousel',
      '@hina-ui/shared > shiki/core',
      '@hina-ui/shared > shiki/engine/javascript',
      ...[
        'bash',
        'css',
        'diff',
        'html',
        'javascript',
        'json',
        'jsx',
        'markdown',
        'prisma',
        'sql',
        'tsx',
        'typescript',
        'vue',
        'yaml',
      ].map(lang => `@hina-ui/shared > shiki/langs/${lang}.mjs`),
      '@hina-ui/shared > shiki/themes/vitesse-dark.mjs',
      '@hina-ui/shared > shiki/themes/vitesse-light.mjs',
    ],
  },
  test: {
    include: ['test/**/*.browser.test.ts'],
    globals: false,
    fileParallelism: false,
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{ browser }],
      commands: {
        readVueLock: (_, kind: VueLockKind, component: string) => readVueLock(kind, component),
        writeVueLock: (_, kind: VueLockKind, component: string, record: VueLockRecord) =>
          writeVueLock(kind, component, record),
      },
    },
  },
})
