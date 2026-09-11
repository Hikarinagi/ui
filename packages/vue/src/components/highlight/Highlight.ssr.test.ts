import { expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Highlight from './Highlight.vue'

it.each(['x', 'y', 'both'] as const)('axis=%s 可在没有浏览器 API 时输出高亮', async axis => {
  const app = createSSRApp({
    render: () => h(Highlight, { axis, as: 'li', class: 'absolute inset-0' }),
  })

  const html = await renderToString(app)

  expect(html).toContain('<li')
  expect(html).toContain('data-hn-highlight')
  expect(html).toContain('aria-hidden="true"')
  expect(html).toContain('absolute inset-0')
})
