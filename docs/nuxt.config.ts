import { utimesSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { markdown } from './markdown'
import { searchIndex } from './search-index'

const uiSrc = fileURLToPath(new URL('../packages/vue/src', import.meta.url))
const contentDir = fileURLToPath(new URL('./content', import.meta.url))
const demosDir = fileURLToPath(new URL('./app/demos', import.meta.url))
const cssEntry = fileURLToPath(new URL('./app/assets/css/main.css', import.meta.url))
const heroGlobEntry = fileURLToPath(
  new URL('./app/components/docs/CategoryGrid.vue', import.meta.url),
)

export default defineNuxtConfig({
  compatibilityDate: '2026-08-01',
  ssr: true,
  devtools: { enabled: false },
  modules: ['@nuxt/eslint', '@nuxt/fonts', '@nuxtjs/color-mode', '@nuxtjs/i18n', 'motion-v/nuxt'],
  i18n: {
    defaultLocale: 'zh-CN',
    strategy: 'prefix_except_default',
    locales: [
      { code: 'zh-CN', language: 'zh-CN', name: '简体中文', file: 'zh-CN.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
    ],
    detectBrowserLanguage: false,
    experimental: {
      prerenderMessages: true,
    },
  },
  alias: {
    '@hina-ui/vue': uiSrc,
  },
  hooks: {
    'vite:serverCreated'(server) {
      server.watcher.add([uiSrc, contentDir])

      const refreshDocs = (file: string, event: 'add' | 'unlink' | 'change') => {
        const isContent = file.startsWith(contentDir) && file.endsWith('.md')
        const isDemo = file.includes('/demos/') && file.endsWith('.vue')
        if (!isContent && !isDemo) return

        if (event !== 'change') {
          const now = new Date()
          utimesSync(cssEntry, now, now)
          if (isDemo) utimesSync(heroGlobEntry, now, now)
        }
        for (const mod of server.moduleGraph.idToModuleMap.values()) {
          if (
            mod.id?.endsWith('.md') ||
            mod.id?.includes('slug') ||
            mod.id?.includes('docs-search')
          )
            server.moduleGraph.invalidateModule(mod)
        }
        server.ws.send({ type: 'full-reload', path: '*' })
      }

      for (const event of ['add', 'unlink', 'change'] as const) {
        server.watcher.on(event, file => refreshDocs(file, event))
      }
    },
  },
  css: ['~/assets/css/main.css'],
  watch: ['markdown.ts', 'search-index.ts'],
  nitro: {
    serverAssets: [
      { baseName: 'content', dir: contentDir },
      { baseName: 'demos', dir: demosDir },
    ],
    prerender: {
      routes: ['/', '/en', '/components', '/en/components'],
      autoSubfolderIndex: false,
    },
  },
  vite: {
    plugins: [tailwindcss(), markdown(), searchIndex()],
    vue: {
      include: [/\.vue$/, /\.md$/],
    },
  },
  app: {
    head: {
      titleTemplate: '%s · Hina UI',
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    },
  },
  colorMode: {
    classSuffix: '',
    storageKey: 'hn-docs-color-mode',
  },
  fonts: {
    families: [
      { name: 'Noto Sans SC', provider: 'google', weights: [400, 500, 600, 700], global: true },
      { name: 'JetBrains Mono', provider: 'google', weights: [400, 500], global: true },
    ],
  },
})
