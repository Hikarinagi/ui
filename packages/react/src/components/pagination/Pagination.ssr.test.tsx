import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { Pagination } from './Pagination'

describe('Pagination SSR', () => {
  it('renders selected page, localized controls and RTL without browser globals', async () => {
    const html = renderToString(
      <Pagination total={200} defaultValue={10} dir="rtl" showFirstLast />,
    )
    expect(html).toContain('dir="rtl"')
    expect(html).toContain('aria-current="page"')
    expect(html).toContain('aria-label="第 10 页"')
    expect(html).toContain('rotate-180')
    expect(html).not.toContain('NaN')
  })
})
