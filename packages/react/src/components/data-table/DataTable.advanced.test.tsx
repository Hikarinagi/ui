import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render as mount } from '@testing-library/react'
import type { DataTableColumn, DataTableEditorContext, DataTableProps } from './types'
import { tableHarness } from '../../../test/data-table'

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
function render(props: Partial<DataTableProps<Item>> = {}, bind = true) {
  const harness = tableHarness<Item>(
    { rows, columns, rowKey: 'id', label: 'Entries', ...props },
    { bind },
  )
  const screen = mount(harness.element())
  const root = screen.container
  return {
    ...harness,
    root,
    find: (selector: string) => root.querySelector<HTMLElement>(selector),
    findAll: (selector: string) => [...root.querySelectorAll<HTMLElement>(selector)],
    setProps: (next: Partial<DataTableProps<Item>>) =>
      act(async () => {
        harness.props.value = { ...harness.props.value, ...next }
      }),
  }
}
type Wrapper = ReturnType<typeof render>
const api = (wrapper: Wrapper) => wrapper.handle.current!.api
const state = (wrapper: Wrapper) => wrapper.handle.current!.state
const ids = (wrapper: Wrapper) =>
  api(wrapper)
    .getRows()
    .map(row => row.id)
const settle = () =>
  act(async () => {
    await Promise.resolve()
    await Promise.resolve()
    await new Promise(resolve => setTimeout(resolve, 0))
  })
const run = (callback: () => unknown) => act(async () => void callback())
const click = (element: Element) => act(async () => void fireEvent.click(element))
afterEach(() => {
  cleanup()
  document.body.innerHTML = ''
})

describe('DataTable advanced behavior', () => {
  it('combines typed column filters, including false and zero, without replacing global search', async () => {
    const wrapper = render({}, false)
    await run(() => api(wrapper).setFilter('enabled', false))
    await settle()
    expect(ids(wrapper)).toEqual([1])
    await run(() => api(wrapper).setFilter('count', [0, 0]))
    await settle()
    expect(ids(wrapper)).toEqual([1])
    await run(() => {
      api(wrapper).setFilter('enabled', undefined)
      api(wrapper).setFilter('count', [10, null])
      api(wrapper).setFilter('category', ['A'])
    })
    await settle()
    expect(ids(wrapper)).toEqual([3])
    await wrapper.setProps({ filter: 'Beta' })
    await settle()
    expect(ids(wrapper)).toEqual([])
  })

  it.each([null, undefined, '', []])(
    'removes a cleared column filter (%j) without clearing other columns',
    async empty => {
      const wrapper = render({}, false)
      await run(() => {
        api(wrapper).setFilter('enabled', true)
        api(wrapper).setFilter('category', ['A'])
      })
      await settle()
      expect(ids(wrapper)).toEqual([3])
      await run(() => api(wrapper).setFilter('category', empty))
      await settle()
      expect(ids(wrapper)).toEqual([2, 3])
      expect(state(wrapper).columnFilters).toEqual([{ key: 'enabled', value: true }])
      await run(() => api(wrapper).setFilter('enabled', empty))
      await settle()
      expect(ids(wrapper)).toEqual([1, 2, 3])
      expect(state(wrapper).columnFilters).toEqual([])
    },
  )

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
    expect(wrapper.findAll('nav button').at(-1)!.hasAttribute('disabled')).toBe(false)
    await wrapper.setProps({ hasNextPage: false })
    expect(wrapper.findAll('nav button').at(-1)!.hasAttribute('disabled')).toBe(true)
  })

  it('expands tree rows without consuming a parent page and preserves parents of matching children', async () => {
    const wrapper = render({
      rows: [{ ...rows[0]!, children: [rows[1]!] }, rows[2]!],
      getChildren: row => row.children,
      pagination: true,
      pageSize: 1,
    })
    expect(ids(wrapper)).toEqual([1])
    await run(() => api(wrapper).toggleExpanded(1))
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
    await run(() => api(wrapper).toggleSelected(2))
    await settle()
    expect(wrapper.find('tbody [role="checkbox"]')!.getAttribute('aria-checked')).toBe('mixed')
    await run(() => api(wrapper).toggleSelected(1, true))
    await settle()
    expect(new Set(state(wrapper).selected)).toEqual(new Set([1, 2, 3]))
    await wrapper.setProps({ selectChildren: false, selected: [] })
    await run(() => api(wrapper).toggleSelected(1, true))
    await settle()
    expect(state(wrapper).selected).toEqual([1])
  })

  it('single selection replaces the previous row and excludes disabled rows', async () => {
    const wrapper = render({ selectionMode: 'single', selectable: row => row.id !== 3 })
    await run(() => {
      api(wrapper).toggleSelected(1)
      api(wrapper).toggleSelected(2)
      api(wrapper).toggleSelected(3)
    })
    await settle()
    expect(state(wrapper).selected).toEqual([2])
    expect(wrapper.findAll('input[type="radio"]')).toHaveLength(3)
    expect(wrapper.find('thead [role="checkbox"]')).toBeNull()
  })

  it('groups records, aggregates each group, and expands through the group slot context', async () => {
    const wrapper = render({ grouping: ['category'] })
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    expect(wrapper.find('tbody tr')!.textContent).toContain('30')
    await click(wrapper.find('tbody button')!)
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
    await click(wrapper.find('thead [role="checkbox"]')!)
    await settle()
    expect(state(wrapper).selected).toEqual([1, 3])
    await click(wrapper.find('tbody button')!)
    await settle()
    expect(
      wrapper.findAll('tbody [role="checkbox"]').map(check => check.getAttribute('aria-checked')),
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
    expect(wrapper.find('thead th')!.getAttribute('colspan')).toBe('2')
    expect(wrapper.findAll('thead tr')).toHaveLength(2)
    expect(wrapper.findAll('thead th')[1]!.getAttribute('rowspan')).toBe('2')
    expect(wrapper.find('tfoot')!.textContent?.trim()).toBe('50')
    await run(() => {
      api(wrapper).setColumnHidden('category', true)
      api(wrapper).moveColumn('count', 'name')
    })
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
    await run(() => api(wrapper).toggleSelected(1))
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
    const wrapper = render({
      editMode: 'cell',
      onSave: save,
      renderEditor: context => {
        editor = context
        return <span>{String(context.value)}</span>
      },
    })
    await run(() => api(wrapper).startEdit(1, 'count'))
    await settle()
    await run(() => editor!.updateValue('-1'))
    await act(() => api(wrapper).commitEdit())
    await settle()
    expect(save).not.toHaveBeenCalled()
    expect(editor!.error).toBe('Nonnegative')
    await run(() => editor!.updateValue('12'))
    await act(() => api(wrapper).commitEdit())
    await settle()
    expect(wrapper.emitted('edit')).toBeUndefined()
    expect(wrapper.emitted('editError')).toHaveLength(1)
    expect(editor!.error).toBe('Save failed')
    expect(rows[0]!.count).toBe(0)
    await act(() => api(wrapper).commitEdit())
    await settle()
    expect(save).toHaveBeenCalledTimes(2)
    expect(wrapper.emitted('edit')).toHaveLength(1)
    expect(save.mock.calls[1]![0].values).toEqual({ count: 12 })
    expect(wrapper.find('tbody input')).toBeNull()
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
    await run(() => api(wrapper).startEdit(1))
    await settle()
    await act(
      async () =>
        void fireEvent.change(wrapper.find('tbody input')!, { target: { value: 'Changed' } }),
    )
    await run(() => api(wrapper).cancelEdit())
    await settle()
    expect(rows[0]!.name).toBe('Alpha')
    let pending!: Promise<void>
    await run(() => {
      api(wrapper).startEdit(1)
      pending = api(wrapper).commitEdit()
    })
    await settle()
    await act(() => api(wrapper).commitEdit())
    await run(() => {
      api(wrapper).cancelEdit()
      api(wrapper).startEdit(2)
    })
    expect(save).toHaveBeenCalledOnce()
    await act(async () => {
      resolve()
      await pending
    })
    expect(wrapper.emitted('edit')?.[0]?.[0]).toMatchObject({ key: 1 })
  })

  it('reorders only eligible siblings and reports a new array without mutating input', async () => {
    const wrapper = render({ reorderable: true })
    await run(() => api(wrapper).moveRow(1, 3))
    expect(wrapper.emitted('update:rows')?.[0]?.[0]).toEqual([rows[1], rows[2], rows[0]])
    expect(rows.map(row => row.id)).toEqual([1, 2, 3])
    await wrapper.setProps({ sorting: [{ key: 'name', desc: false }] })
    await run(() => api(wrapper).moveRow(1, 2))
    expect(wrapper.emitted('rowReorder')).toHaveLength(1)
    await wrapper.setProps({
      sorting: [],
      rows: [{ ...rows[0]!, children: [rows[1]!, rows[2]!] }],
      getChildren: row => row.children,
    })
    await run(() => api(wrapper).moveRow(2, 3))
    expect(wrapper.emitted('rowReorder')?.at(-1)?.[0]).toMatchObject({
      parent: { id: 1 },
      from: 0,
      to: 1,
    })
    expect(wrapper.emitted('update:rows')).toHaveLength(1)
  })
})
