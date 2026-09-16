import { expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import {
  Toolbar,
  ToolbarButton,
  ToolbarLink,
  ToolbarToggleGroup,
  ToolbarToggleItem,
  ToolbarSeparator,
} from '../../index'

it('renders all toolbar parts from package exports without browser globals', async () => {
  const html = await renderToString(
    createSSRApp({
      render: () =>
        h(Toolbar, { label: 'Tools', dir: 'rtl', orientation: 'vertical' }, () => [
          h(ToolbarButton, {}, () => 'Action'),
          h(ToolbarSeparator),
          h(ToolbarToggleGroup, { type: 'multiple', defaultValue: ['bold'] }, () =>
            h(ToolbarToggleItem, { value: 'bold' }, () => 'Bold'),
          ),
          h(ToolbarLink, { href: '#help' }, () => 'Help'),
        ]),
    }),
  )
  expect(html).toContain('role="toolbar"')
  expect(html).toContain('aria-label="Tools"')
  expect(html).toContain('dir="rtl"')
  expect(html).toContain('aria-orientation="vertical"')
  expect(html).toContain('aria-pressed="true"')
  expect(html).toContain('href="#help"')
})
