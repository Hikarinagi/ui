import { expect, it, vi } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import ScrollTop from './ScrollTop.vue'

it('does not read a target getter or render a visible button during SSR', async () => {
  const target = vi.fn(() => {
    throw new Error('Client-only target')
  })
  const html = await renderToString(createSSRApp({ render: () => h(ScrollTop, { target }) }))
  expect(target).not.toHaveBeenCalled()
  expect(html).not.toContain('<button')
})

it('safely defaults to the page without accessing window during SSR', async () => {
  const html = await renderToString(createSSRApp({ render: () => h(ScrollTop) }))
  expect(html).not.toContain('<button')
})
