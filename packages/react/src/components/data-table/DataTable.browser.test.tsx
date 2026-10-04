import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import type { DataTableColumn, DataTableKey, DataTableProps } from './types'
import { mountTable } from '../../../test/data-table'
import '../../../test/browser.css'

interface Item {
  id: number
  name: string
  count: number
}
const rows: Item[] = Array.from({ length: 30 }, (_, index) => ({
  id: index + 1,
  name: `Entry ${index + 1}`,
  count: 30 - index,
}))
const columns: DataTableColumn<Item>[] = [
  { key: 'name', label: 'Name', sortable: true, width: 240 },
  { key: 'count', label: 'Count', sortable: true, width: 200, align: 'end' },
]
const mounted: Array<{ unmount: () => unknown }> = []
beforeEach(() => {
  document.body.innerHTML = ''
})
afterEach(async () => {
  for (const wrapper of mounted.splice(0)) await wrapper.unmount()
  document.documentElement.dir = 'ltr'
  document.documentElement.classList.remove('dark')
})
function host(width = 700, compact = false) {
  const element = document.createElement('div')
  element.style.width = `${width}px`
  if (compact) element.dataset.density = 'compact'
  document.body.appendChild(element)
  return element
}
async function mount(props: Partial<DataTableProps<Item>>, target = host()) {
  const wrapper = await mountTable<Item>(
    { rows, columns, rowKey: 'id', label: 'Entries', ...props },
    target,
  )
  mounted.push(wrapper)
  return wrapper
}
function area(wrapper: { element: HTMLElement }) {
  return wrapper.element.querySelector('[data-overlayscrollbars-viewport]') as HTMLElement
}

describe('DataTable browser', () => {
  it.each([
    { dir: 'ltr', compact: false },
    { dir: 'rtl', compact: true },
  ])(
    'contains a wide table and keeps its header pinned ($dir, compact=$compact)',
    async ({ dir, compact }) => {
      await page.viewport(800, 600)
      document.documentElement.dir = dir
      document.documentElement.classList.toggle('dark', compact)
      const wrapper = await mount({ stickyHeader: true, maxHeight: 180 }, host(320, compact))
      await vi.waitFor(() => expect(area(wrapper)).toBeTruthy())
      const viewport = area(wrapper)
      const root = wrapper.element
      const header = wrapper.find('th')!
      expect(root.getBoundingClientRect().width).toBeLessThanOrEqual(320)
      expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth)
      expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight)
      expect(wrapper.find('tbody tr')!.getBoundingClientRect().height).toBe(compact ? 34 : 44)
      const top = header.getBoundingClientRect().top
      viewport.scrollTop = 200
      viewport.scrollLeft = dir === 'rtl' ? -150 : 150
      await vi.waitFor(() => expect(viewport.scrollTop).toBe(200))
      expect(Math.abs(header.getBoundingClientRect().top - top)).toBeLessThanOrEqual(1)
      expect(Math.abs(viewport.scrollLeft)).toBeGreaterThan(0)
      expect(getComputedStyle(header).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
      const count = wrapper.findAll('tbody td')[1]!
      expect(getComputedStyle(count).textAlign).toBe('end')
      expect(getComputedStyle(wrapper.findAll('th')[1]!).textAlign).toBe('end')
    },
  )

  it('supports keyboard sorting, shift multi-sort and cross-page selection with real controls', async () => {
    await page.viewport(900, 700)
    let selected: DataTableKey[] = []
    const wrapper = await mount({
      pagination: true,
      pageSize: 5,
      selectable: true,
      multiSort: true,
      selected,
      onSelectedChange: value => (selected = value),
    })
    await vi.waitFor(() => expect(area(wrapper)).toBeTruthy())
    const sort = wrapper.findAll('thead button:not([role="checkbox"])')[1]!
    sort.focus()
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() => expect(wrapper.find('tbody tr')!.textContent).toContain('Entry 30'))
    const other = wrapper.findAll('thead button:not([role="checkbox"])')[0]!
    await userEvent.keyboard('{Shift>}')
    await userEvent.click(other)
    await userEvent.keyboard('{/Shift}')
    expect(wrapper.findAll('[aria-sort]')).toHaveLength(2)
    const check = wrapper.find('tbody [role="checkbox"]')!
    check.focus()
    await userEvent.keyboard(' ')
    await vi.waitFor(() => expect(selected).toEqual([30]))
    expect(wrapper.find('thead [role="checkbox"]')!.getAttribute('aria-checked')).toBe('mixed')
    await userEvent.click(page.getByRole('button', { name: '下一页', exact: true }))
    await vi.waitFor(() => expect(wrapper.find('tbody tr')!.textContent).toContain('Entry 25'))
    await userEvent.click(wrapper.find('thead [role="checkbox"]')!)
    await vi.waitFor(() => expect(selected).toHaveLength(6))
    await userEvent.click(page.getByRole('button', { name: '上一页', exact: true }))
    await vi.waitFor(() => expect(wrapper.find('tbody tr')!.textContent).toContain('Entry 30'))
    expect(wrapper.find('tbody [role="checkbox"]')!.getAttribute('aria-checked')).toBe('true')
  })

  it('blocks stale rows while loading and keeps an embedded action separate from its row', async () => {
    await page.viewport(900, 700)
    const action = vi.fn()
    const rowClick = vi.fn()
    const wrapper = await mount({
      rows: rows.slice(0, 3),
      rowClickable: true,
      onRowClick: rowClick,
      renderCell: ({ row, column }) =>
        column.key === 'name' ? <button onClick={action}>{row.name}</button> : undefined,
    })
    await userEvent.click(wrapper.find('tbody button')!)
    expect(action).toHaveBeenCalledOnce()
    expect(rowClick).not.toHaveBeenCalled()
    const row = wrapper.find('tbody tr')!
    row.focus()
    await userEvent.keyboard('{Enter}')
    expect(rowClick).toHaveBeenCalledOnce()
    await wrapper.setProps({ loading: true })
    expect((wrapper.find('table') as HTMLElement).inert).toBe(true)
    const button = wrapper.find('tbody button')!.getBoundingClientRect()
    expect(
      document
        .elementFromPoint(button.x + button.width / 2, button.y + button.height / 2)
        ?.closest('[data-hn-loading-blocker], [data-hn-loading-overlay]'),
    ).toBeTruthy()
    await wrapper.setProps({ loading: false })
    await vi.waitFor(() =>
      expect(
        wrapper.element.querySelector('[data-hn-loading-blocker], [data-hn-loading-overlay]'),
      ).toBeNull(),
    )
    await userEvent.click(wrapper.find('tbody button')!)
    expect(action).toHaveBeenCalledTimes(2)
  })
})
