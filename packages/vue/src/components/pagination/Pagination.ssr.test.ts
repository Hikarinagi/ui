import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Pagination from './Pagination.vue'

describe('Pagination SSR', () => {
  it('renders selected page, localized controls and RTL without browser globals', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(Pagination, { total: 200, modelValue: 10, dir: 'rtl', showFirstLast: true }),
      }),
    )
    expect(html).toContain('dir="rtl"')
    expect(html).toContain('aria-current="page"')
    expect(html).toContain('aria-label="第 10 页"')
    expect(html).toContain('rotate-180')
    expect(html).not.toContain('NaN')
  })
})
