import { expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import SplitButton from './SplitButton.vue'
import DropdownMenuItem from '../dropdown-menu/DropdownMenuItem.vue'

it.each([false, true])('renders usable controls without a browser when open=%s', async open => {
  const html = await renderToString(
    createSSRApp({
      render: () =>
        h(
          SplitButton,
          { open, type: 'submit', name: 'intent', value: 'save', menuLabel: 'Save options' },
          {
            default: () => 'Save <draft>',
            content: () => h(DropdownMenuItem, {}, () => 'Publish'),
          },
        ),
    }),
  )
  expect(html).toContain('Save &lt;draft&gt;')
  expect(html).toContain('name="intent"')
  expect(html).toContain('type="submit"')
  expect(html).toContain('type="button"')
  expect(html).toContain('aria-label="Save options"')
  expect(html.match(/<button /g)).toHaveLength(2)
})

it('renders a link and disables both controls while loading', async () => {
  const html = await renderToString(
    createSSRApp({
      render: () =>
        h(
          SplitButton,
          { as: 'a', href: '/document', loading: true },
          { default: () => 'Open', content: () => [] },
        ),
    }),
  )
  expect(html).toContain('href="/document"')
  expect(html).toContain('aria-busy="true"')
  expect(html).toContain('aria-disabled="true"')
  expect(html).toContain(' disabled')
})
