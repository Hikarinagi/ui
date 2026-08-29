import { describe, expect, it } from 'vitest'
import { renderToString } from 'vue/server-renderer'
import { createSSRApp, h } from 'vue'
import ScrollArea from './ScrollArea.vue'

describe('spike 4 · SSR 安全', () => {
  it('服务端渲染出可滚动内容,不触碰 window', async () => {
    const app = createSSRApp({
      render: () => h(ScrollArea, null, () => [h('p', '第一段'), h('p', '第二段')]),
    })
    const html = await renderToString(app)

    expect(html).toContain('第一段')
    expect(html).toContain('第二段')
    expect(html).toContain('data-overlayscrollbars-initialize')
    expect(html).toContain('hn-scroll-area')
  })

  it('focusable 时服务端就带上地标语义', async () => {
    const app = createSSRApp({
      render: () => h(ScrollArea, { focusable: true, label: '日志' }, () => h('p', '内容')),
    })
    const html = await renderToString(app)

    expect(html).toContain('role="region"')
    expect(html).toContain('aria-label="日志"')
    expect(html).toContain('tabindex="0"')
  })

  it('未标 focusable 时不加地标,避免污染 tab 序列', async () => {
    const app = createSSRApp({
      render: () => h(ScrollArea, null, () => h('p', '内容')),
    })
    const html = await renderToString(app)

    expect(html).not.toContain('role="region"')
    expect(html).not.toContain('tabindex')
  })
})
