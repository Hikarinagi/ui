import { expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { Stepper } from '../../index'

it('renders steps, descriptions and current-state semantics without a browser', async () => {
  const html = await renderToString(
    createSSRApp({
      render: () =>
        h(Stepper, {
          items: [{ title: 'First' }, { title: 'Second', description: 'Details' }],
          defaultValue: 2,
          dir: 'rtl',
        }),
    }),
  )
  expect(html).toContain('aria-current="step"')
  expect(html).toContain('dir="rtl"')
  expect(html).toContain('Details')
  expect(html).toContain('第 2 步，共 2 步')
  expect(html).not.toContain('aria-controls=')
})
