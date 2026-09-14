import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import HoverCard from './HoverCard.vue'

describe('HoverCard SSR', () => {
  it('renders the ordinary trigger without browser globals', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(
            HoverCard,
            { positionerClass: 'positioner-only' },
            { default: () => h('a', { href: '#' }, 'Trigger'), content: () => 'Content' },
          ),
      }),
    )
    expect(html).toContain('Trigger')
    expect(html).not.toContain('positioner-only')
    expect(html).not.toContain('data-hn-hover-card')
  })

  it('allows an empty trigger slot and a null external anchor during server rendering', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(
            HoverCard,
            { anchor: null, open: true, positionerClass: 'positioner-only' },
            { content: () => 'Content' },
          ),
      }),
    )
    expect(html).not.toContain('data-hn-hover-card')
  })
})
