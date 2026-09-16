import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { Timeline, type TimelineItem } from '../../index'

const items: TimelineItem[] = [
  { id: 'a', title: 'First event', time: '09:00', dateTime: '2026-09-16T09:00:00Z' },
  { id: 'b', title: 'Last event' },
]

describe('Timeline SSR', () => {
  it('renders the public export without browser APIs or measurement', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(Timeline, {
            items,
            orientation: 'horizontal',
            align: 'alternate',
            reverse: true,
            dir: 'rtl',
            timePosition: 'opposite',
          }),
      }),
    )
    expect(html).toContain('<ol')
    expect(html).toContain('datetime="2026-09-16T09:00:00Z"')
    expect(html).toContain('dir="rtl"')
    expect(html.indexOf('Last event')).toBeLessThan(html.indexOf('First event'))
    expect(html.match(/class="hn-timeline-connector/g)).toHaveLength(1)
  })
})
