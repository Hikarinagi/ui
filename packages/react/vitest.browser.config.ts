import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import { BaseSequencer } from 'vitest/node'
import { playwright } from '@vitest/browser-playwright'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { balancedSequencer, durationReporter } from '../shared/test/balanced-shards'

const durations = fileURLToPath(new URL('./test/browser-durations.json', import.meta.url))

const browser = process.env.HINA_TEST_BROWSER ?? 'chromium'
if (browser !== 'chromium' && browser !== 'firefox' && browser !== 'webkit') {
  throw new Error(`Unsupported HINA_TEST_BROWSER: ${browser}`)
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'import.meta.env.HINA_TEST_CPU_THROTTLE': JSON.stringify(
      process.env.HINA_TEST_CPU_THROTTLE ?? '',
    ),
  },
  resolve: {
    alias: { '@hina-ui/react': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  optimizeDeps: {
    include: [
      'react',
      'react/jsx-runtime',
      'react-dom',
      'react-dom/client',
      'react-dom/server',
      'vitest-browser-react',
      'motion/react',
      'lucide-react',
      'aria-hidden',
      'clsx',
      'tailwind-merge',
      'tailwind-variants',
      'overlayscrollbars',
      '@internationalized/date',
      'uqr',
      'jsqr',
      '@floating-ui/dom',
      '@floating-ui/react-dom',
      '@tanstack/react-table',
      '@tanstack/react-virtual',
      'embla-carousel',
    ],
  },
  test: {
    setupFiles: ['../shared/test/browser-setup.ts'],
    testTimeout: 30_000,
    sequence: { sequencer: balancedSequencer(BaseSequencer, durations) },
    reporters: process.env.HINA_UPDATE_DURATIONS
      ? ['default', durationReporter(durations)]
      : ['default'],
    include: ['src/**/*.browser.test.{ts,tsx}'],
    globals: false,
    fileParallelism: false,
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{ browser }],
    },
  },
})
