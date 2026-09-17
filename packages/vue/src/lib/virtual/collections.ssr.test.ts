import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import {
  Select,
  MultiSelect,
  Combobox,
  MultiCombobox,
  Listbox,
  CommandPalette,
  Tree,
  TreeSelect,
} from '../../index'

const options = Array.from({ length: 10000 }, (_, value) => ({ value, label: `Item ${value}` }))

describe('virtual collections SSR', () => {
  it.each([
    { name: 'Select', render: () => h(Select, { options, virtualize: true }) },
    {
      name: 'MultiSelect',
      render: () =>
        h(MultiSelect, { options, virtualize: true, name: 'items', modelValue: [9999] }),
    },
    { name: 'Combobox', render: () => h(Combobox, { options, virtualize: true }) },
    { name: 'MultiCombobox', render: () => h(MultiCombobox, { options, virtualize: true }) },
    { name: 'Listbox', render: () => h(Listbox, { options, virtualize: true }) },
    {
      name: 'CommandPalette',
      render: () =>
        h(CommandPalette, {
          items: options.map(option => ({ id: String(option.value), label: option.label })),
          inline: true,
          virtualize: true,
        }),
    },
    { name: 'Tree', render: () => h(Tree, { items: options, virtualize: true }) },
    { name: 'TreeSelect', render: () => h(TreeSelect, { items: options, virtualize: true }) },
  ])('renders $name without browser globals or the entire collection', async ({ render, name }) => {
    const html = await renderToString(createSSRApp({ render }))
    expect(html.length).toBeGreaterThan(100)
    expect((html.match(/role="(?:option|treeitem)"/g) ?? []).length).toBeLessThan(50)
    if (['Listbox', 'Tree', 'CommandPalette'].includes(name)) {
      expect(html).toContain('Item 0')
      expect(html).not.toContain('Item 9999')
      expect(html).toContain('padding-block-end:')
    }
  })
})
