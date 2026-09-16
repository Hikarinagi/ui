import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import DataTable from './DataTable.vue'
import type { DataTableColumn, DataTableKey } from './types'
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
const mounted: VueWrapper[] = []
beforeEach(() => {
  document.body.innerHTML = ''
})
afterEach(() => {
  mounted.forEach(wrapper => wrapper.unmount())
  mounted.length = 0
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
function area(wrapper: VueWrapper) {
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
      const wrapper = mount(DataTable<Item>, {
        props: {
          rows,
          columns,
          rowKey: 'id',
          label: 'Entries',
          stickyHeader: true,
          maxHeight: 180,
        },
        attachTo: host(320, compact),
      })
      mounted.push(wrapper)
      await vi.waitFor(() => expect(area(wrapper)).toBeTruthy())
      const viewport = area(wrapper)
      const root = wrapper.element as HTMLElement
      const header = wrapper.find('th').element as HTMLElement
      expect(root.getBoundingClientRect().width).toBeLessThanOrEqual(320)
      expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth)
      expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight)
      expect(wrapper.find('tbody tr').element.getBoundingClientRect().height).toBe(
        compact ? 34 : 44,
      )
      const top = header.getBoundingClientRect().top
      viewport.scrollTop = 200
      viewport.scrollLeft = dir === 'rtl' ? -150 : 150
      await vi.waitFor(() => expect(viewport.scrollTop).toBe(200))
      expect(Math.abs(header.getBoundingClientRect().top - top)).toBeLessThanOrEqual(1)
      expect(Math.abs(viewport.scrollLeft)).toBeGreaterThan(0)
      expect(getComputedStyle(header).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
      const count = wrapper.findAll('tbody td')[1]!.element
      expect(getComputedStyle(count).textAlign).toBe('end')
      expect(getComputedStyle(wrapper.findAll('th')[1]!.element).textAlign).toBe('end')
    },
  )

  it('supports keyboard sorting, shift multi-sort and cross-page selection with real controls', async () => {
    await page.viewport(900, 700)
    const selected = ref<DataTableKey[]>([])
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(DataTable<Item>, {
            rows,
            columns,
            rowKey: 'id',
            label: 'Entries',
            pagination: true,
            pageSize: 5,
            selectable: true,
            multiSort: true,
            selected: selected.value,
            'onUpdate:selected': value => (selected.value = value),
          }),
      }),
      { attachTo: host() },
    )
    mounted.push(wrapper)
    await vi.waitFor(() => expect(area(wrapper)).toBeTruthy())
    const sort = wrapper.findAll('thead button:not([role="checkbox"])')[1]!.element as HTMLElement
    sort.focus()
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() => expect(wrapper.find('tbody tr').text()).toContain('Entry 30'))
    const other = wrapper.findAll('thead button:not([role="checkbox"])')[0]!.element
    await userEvent.keyboard('{Shift>}')
    await userEvent.click(other)
    await userEvent.keyboard('{/Shift}')
    expect(wrapper.findAll('[aria-sort]')).toHaveLength(2)
    const check = wrapper.find('tbody [role="checkbox"]').element as HTMLElement
    check.focus()
    await userEvent.keyboard(' ')
    await vi.waitFor(() => expect(selected.value).toEqual([30]))
    expect(wrapper.find('thead [role="checkbox"]').attributes('aria-checked')).toBe('mixed')
    await userEvent.click(page.getByRole('button', { name: '下一页', exact: true }))
    await vi.waitFor(() => expect(wrapper.find('tbody tr').text()).toContain('Entry 25'))
    await userEvent.click(wrapper.find('thead [role="checkbox"]').element)
    await vi.waitFor(() => expect(selected.value).toHaveLength(6))
    await userEvent.click(page.getByRole('button', { name: '上一页', exact: true }))
    await vi.waitFor(() => expect(wrapper.find('tbody tr').text()).toContain('Entry 30'))
    expect(wrapper.find('tbody [role="checkbox"]').attributes('aria-checked')).toBe('true')
  })

  it('blocks stale rows while loading and keeps an embedded action separate from its row', async () => {
    await page.viewport(900, 700)
    const action = vi.fn()
    const rowClick = vi.fn()
    const wrapper = mount(DataTable<Item>, {
      props: {
        rows: rows.slice(0, 3),
        columns,
        rowKey: 'id',
        label: 'Entries',
        rowClickable: true,
        onRowClick: rowClick,
      },
      slots: {
        'cell-name': ({ row }: { row: Item }) => h('button', { onClick: action }, row.name),
      },
      attachTo: host(),
    })
    mounted.push(wrapper)
    await userEvent.click(wrapper.find('tbody button').element)
    expect(action).toHaveBeenCalledOnce()
    expect(rowClick).not.toHaveBeenCalled()
    const row = wrapper.find('tbody tr').element as HTMLElement
    row.focus()
    await userEvent.keyboard('{Enter}')
    expect(rowClick).toHaveBeenCalledOnce()
    await wrapper.setProps({ loading: true })
    expect((wrapper.find('table').element as HTMLElement).inert).toBe(true)
    const button = wrapper.find('tbody button').element.getBoundingClientRect()
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
    await userEvent.click(wrapper.find('tbody button').element)
    expect(action).toHaveBeenCalledTimes(2)
  })
})
