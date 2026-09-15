import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import DataTable from './DataTable.vue'
import type {
  DataTableApi,
  DataTableColumn,
  DataTableEditorContext,
  DataTableProps,
  DataTableState,
} from './types'

interface Item {
  id: number
  name: string
  count: number
  category: string
  enabled: boolean
  children?: Item[]
}
const rows: Item[] = [
  { id: 1, name: 'Alpha', count: 0, category: 'A', enabled: false },
  { id: 2, name: 'Beta', count: 20, category: 'B', enabled: true },
  { id: 3, name: 'Gamma', count: 30, category: 'A', enabled: true },
]
const columns: DataTableColumn<Item>[] = [
  { key: 'name', label: 'Name', sortable: true, editable: true },
  {
    key: 'count',
    label: 'Count',
    filterMode: 'range',
    aggregate: 'sum',
    editable: true,
    parse: Number,
    validate: value => (Number(value) < 0 ? 'Nonnegative' : undefined),
  },
  { key: 'category', label: 'Category', filterMode: 'in' },
  { key: 'enabled', label: 'Enabled', filterMode: 'equals' },
]
const mounted: VueWrapper[] = []
function render(props: Partial<DataTableProps<Item>> & Record<string, unknown> = {}, slots = {}) {
  const wrapper = mount(DataTable<Item>, {
    props: { rows, columns, rowKey: 'id', label: 'Entries', ...props },
    slots,
    attachTo: document.body,
  })
  mounted.push(wrapper)
  return wrapper
}
const api = (wrapper: VueWrapper) => (wrapper.vm as unknown as { api: DataTableApi<Item> }).api
const state = (wrapper: VueWrapper) =>
  (wrapper.vm as unknown as { state: DataTableState<Item> }).state
const ids = (wrapper: VueWrapper) =>
  api(wrapper)
    .getRows()
    .map(row => row.id)
const settle = async () => {
  await nextTick()
  await nextTick()
  await flushPromises()
}
afterEach(() => {
  mounted.forEach(wrapper => wrapper.unmount())
  mounted.length = 0
  document.body.innerHTML = ''
})

describe('DataTable advanced behavior', () => {
  it('combines typed column filters, including false and zero, without replacing global search', async () => {
    const wrapper = render()
    api(wrapper).setFilter('enabled', false)
    await settle()
    expect(ids(wrapper)).toEqual([1])
    api(wrapper).setFilter('count', [0, 0])
    await settle()
    expect(ids(wrapper)).toEqual([1])
    api(wrapper).setFilter('enabled', undefined)
    api(wrapper).setFilter('count', [10, null])
    api(wrapper).setFilter('category', ['A'])
    await settle()
    expect(ids(wrapper)).toEqual([3])
    await wrapper.setProps({ filter: 'Beta' })
    await settle()
    expect(ids(wrapper)).toEqual([])
  })

  it('keeps a restored manual query and supports pagination without a total', async () => {
    const wrapper = render({
      manual: true,
      pagination: true,
      page: 4,
      pageSize: 3,
      autoResetPage: false,
    })
    await wrapper.setProps({
      sorting: [{ key: 'name', desc: true }],
      columnFilters: [{ key: 'enabled', value: false }],
    })
    await settle()
    expect(state(wrapper).page).toBe(4)
    expect(ids(wrapper)).toEqual([1, 2, 3])
    expect(wrapper.findAll('nav button').at(-1)!.attributes('disabled')).toBeUndefined()
    await wrapper.setProps({ hasNextPage: false })
    expect(wrapper.findAll('nav button').at(-1)!.attributes()).toHaveProperty('disabled')
  })

  it('expands tree rows without consuming a parent page and preserves parents of matching children', async () => {
    const wrapper = render({
      rows: [{ ...rows[0]!, children: [rows[1]!] }, rows[2]!],
      getChildren: row => row.children,
      pagination: true,
      pageSize: 1,
    })
    expect(ids(wrapper)).toEqual([1])
    api(wrapper).toggleExpanded(1)
    await settle()
    expect(ids(wrapper)).toEqual([1, 2])
    expect(state(wrapper).total).toBe(2)
    await wrapper.setProps({ filter: 'Beta' })
    await settle()
    expect(ids(wrapper)).toEqual([1, 2])
    expect(state(wrapper).total).toBe(1)
  })

  it('maintains parent partial selection and supports independent child selection', async () => {
    const wrapper = render({
      rows: [{ ...rows[0]!, children: [rows[1]!, rows[2]!] }],
      getChildren: row => row.children,
      selectable: true,
      expanded: [1],
    })
    api(wrapper).toggleSelected(2)
    await settle()
    expect(wrapper.find('tbody [role="checkbox"]').attributes('aria-checked')).toBe('mixed')
    api(wrapper).toggleSelected(1, true)
    await settle()
    expect(new Set(state(wrapper).selected)).toEqual(new Set([1, 2, 3]))
    await wrapper.setProps({ selectChildren: false, selected: [] })
    api(wrapper).toggleSelected(1, true)
    await settle()
    expect(state(wrapper).selected).toEqual([1])
  })

  it('single selection replaces the previous row and excludes disabled rows', async () => {
    const wrapper = render({ selectionMode: 'single', selectable: row => row.id !== 3 })
    api(wrapper).toggleSelected(1)
    api(wrapper).toggleSelected(2)
    api(wrapper).toggleSelected(3)
    await settle()
    expect(state(wrapper).selected).toEqual([2])
    expect(wrapper.findAll('input[type="radio"]')).toHaveLength(3)
    expect(wrapper.find('thead [role="checkbox"]').exists()).toBe(false)
  })

  it('groups records, aggregates each group, and expands through the group slot context', async () => {
    const wrapper = render({ grouping: ['category'] })
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    expect(wrapper.find('tbody tr').text()).toContain('30')
    await wrapper.find('tbody button').trigger('click')
    await settle()
    expect(ids(wrapper)).toEqual([1, 3])
    expect(wrapper.findAll('tbody tr')).toHaveLength(4)
    expect(wrapper.emitted('update:expandedGroups')?.at(-1)).toEqual([['category:A']])
  })

  it('selects the members of a collapsed group on the current page without selecting other groups', async () => {
    const wrapper = render({
      grouping: ['category'],
      selectable: true,
      pagination: true,
      pageSize: 1,
    })
    await settle()
    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
    await wrapper.find('thead [role="checkbox"]').trigger('click')
    await settle()
    expect(state(wrapper).selected).toEqual([1, 3])
    await wrapper.find('tbody button').trigger('click')
    await settle()
    expect(
      wrapper.findAll('tbody [role="checkbox"]').map(check => check.attributes('aria-checked')),
    ).toEqual(['true', 'true'])
  })

  it('renders nested headers and filtered aggregates after visibility and ordering change', async () => {
    const wrapper = render({
      columns: [
        { key: 'identity', label: 'Identity', children: [columns[0]!, columns[2]!] },
        { ...columns[1]!, footer: true },
      ],
      filter: 'a',
    })
    expect(wrapper.find('thead th').attributes('colspan')).toBe('2')
    expect(wrapper.findAll('thead tr')).toHaveLength(2)
    expect(wrapper.findAll('thead th')[1]!.attributes('rowspan')).toBe('2')
    expect(wrapper.find('tfoot').text()).toBe('50')
    api(wrapper).setColumnHidden('category', true)
    api(wrapper).moveColumn('count', 'name')
    await settle()
    expect(state(wrapper).visibleColumns.map(column => column.key)).toEqual(['count', 'name'])
    expect(wrapper.findAll('tbody td')).toHaveLength(6)
  })

  it('exports scoped CSV with escaped text, formula protection and original numeric values', async () => {
    const wrapper = render({
      rows: [
        { ...rows[0]!, name: '=SUM(1,2)', count: -2 },
        { ...rows[1]!, name: 'A,"B"\nC' },
      ],
      hiddenColumns: ['category', 'enabled'],
      selectable: true,
    })
    api(wrapper).toggleSelected(1)
    await settle()
    expect(api(wrapper).toCsv({ scope: 'selected', bom: false })).toBe(
      '"Name","Count"\r\n"\'=SUM(1,2)","-2"',
    )
    expect(api(wrapper).toCsv({ bom: false })).toContain('"A,""B""\nC"')
    expect(api(wrapper).toCsv({ scope: 'all' }).charCodeAt(0)).toBe(0xfeff)
  })

  it('validates draft edits, catches save rejection, and emits once only after a successful save', async () => {
    const save = vi
      .fn()
      .mockRejectedValueOnce(new Error('Save failed'))
      .mockResolvedValueOnce(undefined)
    let editor: DataTableEditorContext<Item> | undefined
    const wrapper = render(
      { editMode: 'cell', onSave: save },
      {
        editor: (context: DataTableEditorContext<Item>) => {
          editor = context
          return h('span', String(context.value))
        },
      },
    )
    api(wrapper).startEdit(1, 'count')
    await settle()
    editor!.updateValue('-1')
    await api(wrapper).commitEdit()
    await settle()
    expect(save).not.toHaveBeenCalled()
    expect(editor!.error).toBe('Nonnegative')
    editor!.updateValue('12')
    await api(wrapper).commitEdit()
    await settle()
    expect(wrapper.emitted('edit')).toBeUndefined()
    expect(wrapper.emitted('editError')).toHaveLength(1)
    expect(editor!.error).toBe('Save failed')
    expect(rows[0]!.count).toBe(0)
    await api(wrapper).commitEdit()
    await settle()
    expect(save).toHaveBeenCalledTimes(2)
    expect(wrapper.emitted('edit')).toHaveLength(1)
    expect(save.mock.calls[1]![0].values).toEqual({ count: 12 })
    expect(wrapper.find('tbody input').exists()).toBe(false)
  })

  it('keeps a pending save exclusive and cancellation leaves the supplied row untouched', async () => {
    let resolve!: () => void
    const save = vi.fn(
      () =>
        new Promise<void>(done => {
          resolve = done
        }),
    )
    const wrapper = render({ editMode: 'row', onSave: save })
    api(wrapper).startEdit(1)
    await settle()
    await wrapper.find('tbody input').setValue('Changed')
    api(wrapper).cancelEdit()
    await settle()
    expect(rows[0]!.name).toBe('Alpha')
    api(wrapper).startEdit(1)
    const pending = api(wrapper).commitEdit()
    await settle()
    await api(wrapper).commitEdit()
    api(wrapper).cancelEdit()
    api(wrapper).startEdit(2)
    expect(save).toHaveBeenCalledOnce()
    resolve()
    await pending
    expect(wrapper.emitted('edit')?.[0]?.[0]).toMatchObject({ key: 1 })
  })

  it('reorders only eligible siblings and reports a new array without mutating input', async () => {
    const wrapper = render({ reorderable: true })
    api(wrapper).moveRow(1, 3)
    expect(wrapper.emitted('update:rows')?.[0]?.[0]).toEqual([rows[1], rows[2], rows[0]])
    expect(rows.map(row => row.id)).toEqual([1, 2, 3])
    await wrapper.setProps({ sorting: [{ key: 'name', desc: false }] })
    api(wrapper).moveRow(1, 2)
    expect(wrapper.emitted('rowReorder')).toHaveLength(1)
    await wrapper.setProps({
      sorting: [],
      rows: [{ ...rows[0]!, children: [rows[1]!, rows[2]!] }],
      getChildren: row => row.children,
    })
    api(wrapper).moveRow(2, 3)
    expect(wrapper.emitted('rowReorder')?.at(-1)?.[0]).toMatchObject({
      parent: { id: 1 },
      from: 0,
      to: 1,
    })
    expect(wrapper.emitted('update:rows')).toHaveLength(1)
  })
})
