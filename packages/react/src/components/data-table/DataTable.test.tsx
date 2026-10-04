import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render as mount } from '@testing-library/react'
import type { DataTableColumn, DataTableKey, DataTableProps } from './types'
import { expectNoA11yViolations } from '../../../test/axe'
import { tableHarness } from '../../../test/data-table'

interface Item {
  id: number | string
  name: string
  count: number | null
  disabled?: boolean
}
const columns: DataTableColumn<Item>[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'count', label: 'Count', sortable: true, align: 'end' },
]
const items: Item[] = [
  { id: 1, name: 'Item 10', count: 10 },
  { id: 2, name: 'Item 2', count: 2 },
  { id: 3, name: 'Empty', count: null },
]
function render(props: Partial<DataTableProps<Item>> = {}) {
  const harness = tableHarness<Item>({
    rows: items,
    columns,
    rowKey: 'id',
    label: 'Entries',
    ...props,
  })
  const screen = mount(harness.element())
  const root = screen.container
  return {
    ...harness,
    root,
    find: (selector: string) => root.querySelector<HTMLElement>(selector)!,
    findAll: (selector: string) => [...root.querySelectorAll<HTMLElement>(selector)],
    setProps: (next: Partial<DataTableProps<Item>>) =>
      act(async () => {
        harness.props.value = { ...harness.props.value, ...next }
      }),
  }
}
type Wrapper = ReturnType<typeof render>
const textRows = (wrapper: Wrapper) =>
  wrapper.findAll('tbody tr').map(row => row.textContent?.trim())
const settle = () =>
  act(async () => {
    await Promise.resolve()
    await Promise.resolve()
  })
const click = (element: Element) => act(async () => void fireEvent.click(element))
afterEach(() => {
  cleanup()
  document.body.innerHTML = ''
})

describe('DataTable', () => {
  it('renders a semantic table with only requested controls and retains original slot data', async () => {
    let received: Item | undefined
    const wrapper = render({
      renderCell: context => {
        if (context.column.key !== 'name') return undefined
        received ??= context.row
        return <strong>{context.row.name}</strong>
      },
    })
    expect(wrapper.find('table').getAttribute('aria-label')).toBe('Entries')
    expect(wrapper.findAll('tbody tr')).toHaveLength(3)
    expect(wrapper.find('nav')).toBeNull()
    expect(wrapper.find('[role="checkbox"]')).toBeNull()
    expect(wrapper.find('strong').textContent).toBe('Item 10')
    expect(received).toBe(items[0])
    expect(textRows(wrapper).at(-1)).toContain('—')
    await expectNoA11yViolations(wrapper.root.firstElementChild!)
  })

  it('cycles numeric sorting, keeps missing values last and does not mutate the source', async () => {
    const wrapper = render()
    const trigger = wrapper.findAll('thead button')[1]!
    await click(trigger)
    await settle()
    expect(textRows(wrapper)).toEqual(['Item 22', 'Item 1010', 'Empty—'])
    expect(wrapper.findAll('th')[1]!.getAttribute('aria-sort')).toBe('ascending')
    await click(trigger)
    await settle()
    expect(textRows(wrapper)).toEqual(['Item 1010', 'Item 22', 'Empty—'])
    expect(wrapper.findAll('th')[1]!.getAttribute('aria-sort')).toBe('descending')
    await click(trigger)
    await settle()
    expect(wrapper.findAll('th')[1]!.getAttribute('aria-sort')).toBeNull()
    expect(items.map(row => row.id)).toEqual([1, 2, 3])
  })

  it('filters before pagination, resets the page on query changes and clamps after deletion', async () => {
    const rows = Array.from({ length: 13 }, (_, id) => ({ id, name: `Entry ${id}`, count: id }))
    const wrapper = render({ rows, pagination: true, pageSize: 5 })
    await wrapper.setProps({ page: 3 })
    await settle()
    expect(wrapper.findAll('tbody tr')).toHaveLength(3)
    await wrapper.setProps({ rows: rows.slice(0, 6) })
    await settle()
    expect(wrapper.emitted('update:page')?.at(-1)).toEqual([2])
    await wrapper.setProps({ page: 2, filter: 'Entry 0' })
    await settle()
    expect(wrapper.emitted('update:page')?.at(-1)).toEqual([1])
    await wrapper.setProps({ page: 1 })
    await settle()
    expect(textRows(wrapper)).toEqual(['Entry 00'])
  })

  it('starts on a valid page and respects custom accessors, matching and formatting', async () => {
    const wrapper = render({ pagination: true, pageSize: 2, page: 50 })
    await settle()
    expect(wrapper.emitted('update:page')?.at(-1)).toEqual([2])
    expect(textRows(wrapper)).toEqual(['Empty—'])
    await wrapper.setProps({
      filter: '2',
      columns: [
        { key: 'title', label: 'Title', field: 'name', filterable: false },
        {
          key: 'computed',
          label: 'Computed',
          accessor: row => row.count,
          filter: (row, query) => String(row.count) === query,
          format: (_, row) => `Count ${row.count}`,
        },
      ],
    })
    await settle()
    expect(textRows(wrapper)).toEqual(['Item 2Count 2'])
  })

  it('passes remote rows through and emits a single complete query when sorting resets a page', async () => {
    const wrapper = render({ manual: true, pagination: true, total: 100, page: 3, pageSize: 2 })
    expect(wrapper.findAll('tbody tr')).toHaveLength(3)
    await click(wrapper.findAll('thead button')[1]!)
    await settle()
    expect(textRows(wrapper)).toEqual(['Item 1010', 'Item 22', 'Empty—'])
    expect(wrapper.emitted('update:page')?.at(-1)).toEqual([1])
    expect(wrapper.emitted('change')).toEqual([
      [
        {
          page: 1,
          pageSize: 2,
          sorting: [{ key: 'count', desc: false }],
          filter: '',
          columnFilters: [],
          grouping: [],
        },
      ],
    ])
    await wrapper.setProps({ loading: true, rows: [], total: 0, page: 3 })
    await settle()
    expect(wrapper.emitted('update:page')?.at(-1)).toEqual([1])
    expect(wrapper.find('table').hasAttribute('inert')).toBe(true)
    expect(wrapper.root.textContent).not.toContain('暂无数据')
  })

  it('selects only eligible rows on the current page and preserves distinct keys across pages', async () => {
    const selected: DataTableKey[] = []
    const rows: Item[] = [
      { id: 1, name: 'Numeric', count: 1 },
      { id: '1', name: 'String', count: 1 },
      { id: 3, name: 'Disabled', count: 3, disabled: true },
      { id: 4, name: 'Last', count: 4 },
    ]
    const wrapper = render({
      rows,
      selectable: row => !row.disabled,
      pagination: true,
      pageSize: 2,
      selected,
    })
    const checks = () => wrapper.findAll('[role="checkbox"]')
    await click(checks()[1]!)
    await settle()
    expect(wrapper.emitted('update:selected')?.at(-1)).toEqual([[1]])
    await wrapper.setProps({ selected: [1] })
    await settle()
    expect(checks()[0]!.getAttribute('aria-checked')).toBe('mixed')
    await click(checks()[0]!)
    await settle()
    expect(wrapper.emitted('update:selected')?.at(-1)).toEqual([[1, '1']])
    await wrapper.setProps({ selected: [1, '1'], page: 2 })
    await settle()
    expect(checks()[1]!.hasAttribute('disabled')).toBe(true)
    await click(checks()[0]!)
    await settle()
    expect(wrapper.emitted('update:selected')?.at(-1)).toEqual([[1, '1', 4]])
    await wrapper.setProps({ selected: [1, '1', 4] })
    await settle()
    expect(checks()[0]!.getAttribute('aria-checked')).toBe('true')
    await click(checks()[0]!)
    await settle()
    expect(wrapper.emitted('update:selected')?.at(-1)).toEqual([[1, '1']])
  })

  it('keeps cell actions separate from row activation and supports keyboard row actions', async () => {
    const action = vi.fn()
    const wrapper = render({
      rowClickable: true,
      selectable: true,
      renderCell: ({ row, column }) =>
        column.key === 'name' ? <button onClick={action}>{row.name}</button> : undefined,
    })
    await click(wrapper.find('tbody button:not([role="checkbox"])'))
    expect(action).toHaveBeenCalledOnce()
    expect(wrapper.emitted('rowClick')).toBeUndefined()
    await click(wrapper.find('tbody [role="checkbox"]'))
    expect(wrapper.emitted('rowClick')).toBeUndefined()
    await click(wrapper.find('tbody tr'))
    await act(async () => void fireEvent.keyDown(wrapper.find('tbody tr'), { key: 'Enter' }))
    expect(wrapper.emitted('rowClick')).toHaveLength(2)
    expect(wrapper.emitted('rowClick')?.[0]?.[0]).toBe(items[0])
  })

  it('handles empty columns, loading and disabled state without phantom selection or actions', async () => {
    const wrapper = render({ selectable: true, rows: [] })
    expect(wrapper.find('thead [role="checkbox"]').getAttribute('aria-checked')).toBe('false')
    expect(wrapper.find('thead [role="checkbox"]').hasAttribute('disabled')).toBe(true)
    await wrapper.setProps({ selectable: false, hiddenColumns: ['name', 'count'] })
    await settle()
    expect(wrapper.root.textContent).toContain('没有可见列')
    expect(wrapper.find('td').getAttribute('colspan')).toBe('1')
    await wrapper.setProps({ hiddenColumns: [], rows: items, disabled: true, rowClickable: true })
    await click(wrapper.find('thead button'))
    await click(wrapper.find('tbody tr'))
    expect(wrapper.emitted('update:sorting')).toBeUndefined()
    expect(wrapper.emitted('rowClick')).toBeUndefined()
  })
})
