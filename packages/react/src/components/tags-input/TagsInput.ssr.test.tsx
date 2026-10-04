import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { TagsInput } from './TagsInput'

describe('服务端渲染', () => {
  it('首屏没有任何标签处于选中态', async () => {
    const html = renderToString(<TagsInput value={['galgame', 'manga']} aria-label="标签" />)
    expect(html.match(/data-hn-chip/g)).toHaveLength(2)
    expect(html).not.toContain('data-state="active"')
    expect(html).not.toContain('aria-current')
  })
})
