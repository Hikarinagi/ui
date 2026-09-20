import { expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { TooltipProvider } from 'reka-ui'
import FloatButton from './FloatButton.vue'

it.each([false, true])(
  'renders accessible button content before hydration, provider=%s',
  async provider => {
    const button = () =>
      h(
        FloatButton,
        { label: 'Create <project>', position: 'absolute', extended: true },
        { default: () => h('svg', { 'aria-hidden': 'true' }) },
      )
    const html = await renderToString(
      createSSRApp({
        render: () => (provider ? h(TooltipProvider, {}, { default: button }) : button()),
      }),
    )
    expect(html).toContain('<button')
    expect(html).toContain('aria-label="Create &lt;project&gt;"')
    expect(html).toContain('data-position="absolute"')
    expect(html).not.toContain('role="tooltip"')
  },
)

it('renders no focusable action when hidden', async () => {
  const html = await renderToString(
    createSSRApp({ render: () => h(FloatButton, { label: 'Create', visible: false }, () => '+') }),
  )
  expect(html).not.toContain('<button')
})
