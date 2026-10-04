import { describe, expect, it } from 'vitest'
import type { ReactElement } from 'react'
import { renderToString } from 'react-dom/server'
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
    { name: 'Select', render: () => <Select options={options} virtualize /> },
    {
      name: 'MultiSelect',
      render: () => <MultiSelect options={options} virtualize name="items" value={[9999]} />,
    },
    { name: 'Combobox', render: () => <Combobox options={options} virtualize /> },
    { name: 'MultiCombobox', render: () => <MultiCombobox options={options} virtualize /> },
    { name: 'Listbox', render: () => <Listbox options={options} virtualize /> },
    {
      name: 'CommandPalette',
      render: () => (
        <CommandPalette
          items={options.map(option => ({ id: String(option.value), label: option.label }))}
          inline
          virtualize
        />
      ),
    },
    { name: 'Tree', render: () => <Tree items={options} virtualize /> },
    { name: 'TreeSelect', render: () => <TreeSelect items={options} virtualize /> },
  ])('renders $name without browser globals or the entire collection', async ({ render, name }) => {
    const html = renderToString(render() as ReactElement)
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
      const html = renderToString(
        name === 'Listbox' ? (
          <Listbox options={options} virtualize value={7890} />
        ) : (
          <Tree items={options} virtualize value={7890} />
        ),
      )
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
        const shared = { virtualize: true, open, name: 'items', options }
        const html = renderToString(
          name === 'TreeSelect' ? (
            <TreeSelect virtualize open={open} name="items" items={options} value={7890} />
          ) : name === 'Select' ? (
            <Select {...shared} value={7890} />
          ) : name === 'MultiSelect' ? (
            <MultiSelect {...shared} value={[7890, 9999]} />
          ) : name === 'Combobox' ? (
            <Combobox {...shared} value={7890} />
          ) : (
            <MultiCombobox {...shared} value={[7890, 9999]} />
          ),
        )
        expect(html).toContain('Item 7890')
        if (name.startsWith('Multi')) expect(html).toContain('Item 9999')
        expect(html).not.toMatch(/role="(?:option|treeitem)"/)
        expect(html).not.toContain('data-index=')
        expect(html.length).toBeLessThan(15000)
      }
    },
  )

  it('renders a bounded DataTable body with virtualization enabled', async () => {
    const html = renderToString(
      <DataTable<(typeof options)[number]>
        rows={options}
        columns={[{ key: 'label', label: 'Name' }]}
        rowKey="value"
        virtualize
        selected={[7890]}
        selectable
      />,
    )
    expect(html).toContain('Item 0')
    expect(html).not.toContain('Item 9999')
    expect((html.match(/data-hn-row=/g) ?? []).length).toBeLessThan(50)
  })
})
