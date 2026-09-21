import { expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Affix from './Affix.vue'

it.each(['top', 'bottom'] as const)(
  'renders %s positioning and content before hydration',
  async position => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(
            Affix,
            { as: 'aside', position, offset: 16, 'aria-label': 'Actions' },
            {
              default: ({ affixed }: { affixed: boolean }) => h('button', `Save ${affixed}`),
            },
          ),
      }),
    )
    expect(html).toContain('<aside')
    expect(html).toContain('sticky')
    expect(html).toContain(`data-position="${position}"`)
    expect(html).toContain('--hn-affix-offset:16px')
    expect(html).toContain('aria-label="Actions"')
    expect(html).toContain('Save false')
    expect(html).not.toContain('data-affixed')
  },
)

it('renders disabled content in normal flow and sanitizes non-finite offsets', async () => {
  const html = await renderToString(
    createSSRApp({
      render: () => h(Affix, { disabled: true, offset: Infinity }, () => 'Content'),
    }),
  )
  expect(html).not.toContain('sticky')
  expect(html).toContain('data-disabled')
  expect(html).toContain('--hn-affix-offset:0px')
  expect(html).toContain('Content')
})
