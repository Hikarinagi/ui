import { existsSync, readFileSync } from 'node:fs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Component } from 'vue'
import { h } from 'vue'
import type { ComponentType } from 'react'
import { createElement } from 'react'
import { TooltipProvider as VueTooltipProvider } from '@hina-ui/vue'
import { TooltipProvider as ReactTooltipProvider } from '@hina-ui/react'
import { normalizeMarkup } from '../src/normalize'
import { renderReact, renderVue } from '../src/render'

const react = import.meta.glob<{ default: ComponentType }>(
  '../../../docs-react/demos/{zh-CN,en}/**/*.tsx',
)
const vue = import.meta.glob<{ default: Component }>('../../../docs/app/demos/*/**/*.vue')

const NUXT_ONLY = /from '#(?:components|app|imports)'|useI18n\(|NuxtLink|navigateTo\(/

const DIRECTIVE =
  'v-tooltip is a Vue directive with no React equivalent, so the twin wraps each trigger in Tooltip, which adds its trigger attributes'
const PROSE_HTML =
  "the Vue demo binds v-html on the Prose component, which Vue's server renderer drops, so its content only appears after hydration"

const SETUP_CODE =
  'the sample shows how to mount an app, so the React twin shows React setup code instead of createApp'

const KNOWN_DIFFERENCES: Record<string, string> = {
  'zh-CN/code-block/hero': SETUP_CODE,
  'en/code-block/hero': SETUP_CODE,
  'zh-CN/tooltip/directive': DIRECTIVE,
  'en/tooltip/directive': DIRECTIVE,
  'zh-CN/prose/basic': PROSE_HTML,
  'en/prose/basic': PROSE_HTML,
  'zh-CN/data-list/virtual':
    'Vue lets DataList report its visible range to the parent during server setup; React cannot update parent state while rendering on the server, so the footer shows the range after hydration',
  'en/data-list/virtual':
    'Vue lets DataList report its visible range to the parent during server setup; React cannot update parent state while rendering on the server, so the footer shows the range after hydration',
}

describe('documentation demos render identically in Vue and React', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'], now: new Date('2026-04-01T08:00:00.000Z') })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  for (const [path, load] of Object.entries(react)) {
    const name = path.replace('../../../docs-react/demos/', '').replace(/\.tsx$/, '')
    const twin = `../../../docs/app/demos/${name}.vue`
    const difference = KNOWN_DIFFERENCES[name]
    if (difference) {
      it.skip(`${name} (${difference})`)
      continue
    }
    it(name, { timeout: 120_000 }, async () => {
      expect(vue[twin], `missing Vue demo ${name}`).toBeDefined()
      const source = new URL(twin, import.meta.url)
      if (existsSync(source) && NUXT_ONLY.test(readFileSync(source, 'utf8'))) return
      const [{ default: VueDemo }, { default: ReactDemo }] = await Promise.all([
        vue[twin]!(),
        load(),
      ])
      const options = { userIcons: true }
      const expected = normalizeMarkup(
        (await renderVue(() => h(VueTooltipProvider, null, () => h(VueDemo)))).replaceAll(
          '@hina-ui/vue',
          '@hina-ui/react',
        ),
        options,
      )
      const actual = normalizeMarkup(
        renderReact(() => createElement(ReactTooltipProvider, null, createElement(ReactDemo))),
        options,
      )
      expect(actual).toBe(expected)
    })
  }
})
