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
  DataTable,
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

  it.each(['Listbox', 'Tree'] as const)(
    'renders visible initial rows in %s before hydration with a distant selection',
    async name => {
      const render =
        name === 'Listbox'
          ? () => h(Listbox, { options, virtualize: true, modelValue: 7890 })
          : () => h(Tree, { items: options, virtualize: true, modelValue: 7890 })
      const html = await renderToString(createSSRApp({ render }))
      expect(html).toContain('Item 0')
      expect(html).toContain('Item 7890')
      expect(html).toContain('padding-block-start:0px')
      expect((html.match(/data-index=/g) ?? []).length).toBeLessThan(50)
    },
  )

  it.each(['Select', 'MultiSelect', 'Combobox', 'MultiCombobox', 'TreeSelect'] as const)(
    'preserves the selected label in %s without rendering the popup on the server',
    async name => {
      for (const open of [false, true]) {
        const shared = { virtualize: true, open, name: 'items' }
        const render = {
          Select: () => h(Select, { ...shared, options, modelValue: 7890 }),
          MultiSelect: () => h(MultiSelect, { ...shared, options, modelValue: [7890, 9999] }),
          Combobox: () => h(Combobox, { ...shared, options, modelValue: 7890 }),
          MultiCombobox: () => h(MultiCombobox, { ...shared, options, modelValue: [7890, 9999] }),
          TreeSelect: () => h(TreeSelect, { ...shared, items: options, modelValue: 7890 }),
        }[name]
        const html = await renderToString(createSSRApp({ render }))
        expect(html).toContain('Item 7890')
        if (name.startsWith('Multi')) expect(html).toContain('Item 9999')
        expect(html).not.toMatch(/role="(?:option|treeitem)"/)
        expect(html).not.toContain('data-index=')
        expect(html.length).toBeLessThan(15000)
      }
    },
  )

  it('renders a bounded DataTable body with virtualization enabled', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(DataTable<(typeof options)[number]>, {
            rows: options,
            columns: [{ key: 'label', label: 'Name' }],
            rowKey: 'value',
            virtualize: true,
            selected: [7890],
            selectable: true,
          }),
      }),
    )
    expect(html).toContain('Item 0')
    expect(html).not.toContain('Item 9999')
    expect((html.match(/data-hn-row=/g) ?? []).length).toBeLessThan(50)
  })
})
