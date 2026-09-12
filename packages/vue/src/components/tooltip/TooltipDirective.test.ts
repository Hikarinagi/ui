import { describe, expect, it } from 'vitest'
import { createSSRApp, h, withDirectives } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { vTooltip } from './directive'
import TooltipProvider from './TooltipProvider.vue'

describe('tooltip directive SSR', () => {
  it('renders only the original trigger without a popup or generated description', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(TooltipProvider, {}, () =>
            withDirectives(h('button', { 'aria-describedby': 'existing' }, '按钮'), [
              [vTooltip, '提示'],
            ]),
          ),
      }),
    )
    expect(html).toContain('<button aria-describedby="existing">按钮</button>')
    expect(html).not.toContain('role="tooltip"')
    expect(html).not.toContain('hn-tooltip')
  })
})
