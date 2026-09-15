import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h, nextTick, toRaw } from 'vue'
import DataTable from './DataTable.vue'
import type { DataTableColumn, DataTableKey, DataTableProps } from './types'
import { expectNoA11yViolations } from '../../../test/axe'

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
const mounted: VueWrapper[] = []
function render(props: Partial<DataTableProps<Item>> & Record<string, unknown> = {}, slots = {}) {
  const wrapper = mount(DataTable<Item>, {
    props: { rows: items, columns, rowKey: 'id', label: 'Entries', ...props },
    slots,
    attachTo: document.body,
    global: { stubs: { transition: false } },
  })
  mounted.push(wrapper)
  return wrapper
}
const textRows = (wrapper: VueWrapper) => wrapper.findAll('tbody tr').map(row => row.text())
const settle = async () => {
  await nextTick()
  await nextTick()
}
afterEach(() => {
  mounted.forEach(wrapper => wrapper.unmount())
  mounted.length = 0
  document.body.innerHTML = ''
})

describe('DataTable', () => {
  it('renders a semantic table with only requested controls and retains original slot data', async () => {
    let received: Item | undefined
    const wrapper = render(
      {},
      {
        'cell-name': (context: { row: Item }) => {
          received ??= context.row
          return h('strong', context.row.name)
        },
      },
    )
    expect(wrapper.find('table').attributes('aria-label')).toBe('Entries')
    expect(wrapper.findAll('tbody tr')).toHaveLength(3)
    expect(wrapper.find('nav').exists()).toBe(false)
    expect(wrapper.find('[role="checkbox"]').exists()).toBe(false)
    expect(wrapper.find('strong').text()).toBe('Item 10')
    expect(toRaw(received)).toBe(items[0])
    expect(textRows(wrapper).at(-1)).toContain('—')
    await expectNoA11yViolations(wrapper.element as HTMLElement)
  })

  it('cycles numeric sorting, keeps missing values last and does not mutate the source', async () => {
    const wrapper = render()
    const trigger = wrapper.findAll('thead button')[1]!
    await trigger.trigger('click')
    await settle()
    expect(textRows(wrapper)).toEqual(['Item 22', 'Item 1010', 'Empty—'])
    expect(wrapper.findAll('th')[1]!.attributes('aria-sort')).toBe('ascending')
    await trigger.trigger('click')
    await settle()
    expect(textRows(wrapper)).toEqual(['Item 1010', 'Item 22', 'Empty—'])
    expect(wrapper.findAll('th')[1]!.attributes('aria-sort')).toBe('descending')
    await trigger.trigger('click')
    await settle()
    expect(wrapper.findAll('th')[1]!.attributes('aria-sort')).toBeUndefined()
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
    await wrapper.findAll('thead button')[1]!.trigger('click')
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
    expect(wrapper.find('table').attributes()).toHaveProperty('inert')
    expect(wrapper.text()).not.toContain('暂无数据')
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
    await checks()[1]!.trigger('click')
    await settle()
    expect(wrapper.emitted('update:selected')?.at(-1)).toEqual([[1]])
    await wrapper.setProps({ selected: [1] })
    await settle()
    expect(checks()[0]!.attributes('aria-checked')).toBe('mixed')
    await checks()[0]!.trigger('click')
    await settle()
    expect(wrapper.emitted('update:selected')?.at(-1)).toEqual([[1, '1']])
    await wrapper.setProps({ selected: [1, '1'], page: 2 })
    await settle()
    expect(checks()[1]!.attributes()).toHaveProperty('disabled')
    await checks()[0]!.trigger('click')
    await settle()
    expect(wrapper.emitted('update:selected')?.at(-1)).toEqual([[1, '1', 4]])
    await wrapper.setProps({ selected: [1, '1', 4] })
    await settle()
    expect(checks()[0]!.attributes('aria-checked')).toBe('true')
    await checks()[0]!.trigger('click')
    await settle()
    expect(wrapper.emitted('update:selected')?.at(-1)).toEqual([[1, '1']])
  })

  it('keeps cell actions separate from row activation and supports keyboard row actions', async () => {
    const action = vi.fn()
    const wrapper = render(
      { rowClickable: true, selectable: true },
      {
        'cell-name': ({ row }: { row: Item }) => h('button', { onClick: action }, row.name),
      },
    )
    await wrapper.find('tbody button:not([role="checkbox"])').trigger('click')
    expect(action).toHaveBeenCalledOnce()
    expect(wrapper.emitted('rowClick')).toBeUndefined()
    await wrapper.find('tbody [role="checkbox"]').trigger('click')
    expect(wrapper.emitted('rowClick')).toBeUndefined()
    await wrapper.find('tbody tr').trigger('click')
    await wrapper.find('tbody tr').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('rowClick')).toHaveLength(2)
    expect(toRaw(wrapper.emitted('rowClick')?.[0]?.[0])).toBe(items[0])
  })

  it('handles empty columns, loading and disabled state without phantom selection or actions', async () => {
    const wrapper = render({ selectable: true, rows: [] })
    expect(wrapper.find('thead [role="checkbox"]').attributes('aria-checked')).toBe('false')
    expect(wrapper.find('thead [role="checkbox"]').attributes()).toHaveProperty('disabled')
    await wrapper.setProps({ selectable: false, hiddenColumns: ['name', 'count'] })
    await settle()
    expect(wrapper.text()).toContain('没有可见列')
    expect(wrapper.find('td').attributes('colspan')).toBe('1')
    await wrapper.setProps({ hiddenColumns: [], rows: items, disabled: true, rowClickable: true })
    await wrapper.find('thead button').trigger('click')
    await wrapper.find('tbody tr').trigger('click')
    expect(wrapper.emitted('update:sorting')).toBeUndefined()
    expect(wrapper.emitted('rowClick')).toBeUndefined()
  })
})
