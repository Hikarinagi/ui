import { afterEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h } from 'vue'
import DataTable from './DataTable.vue'
import type { DataTableColumn, DataTableProps } from './types'
import '../../../test/browser.css'

interface Item {
  id: number
  name: string
  count: number
}
const rows: Item[] = [
  { id: 1, name: 'Alpha', count: 10 },
  { id: 2, name: 'Beta', count: 20 },
]
const columns: DataTableColumn<Item>[] = [
  {
    key: 'name',
    label: 'Name',
    width: 160,
    minWidth: 100,
    maxWidth: 450,
    sortable: true,
    editable: true,
  },
  { key: 'count', label: 'Count', width: 160, minWidth: 80, maxWidth: 450, editable: true },
  { key: 'id', label: 'ID', width: 80, minWidth: 60, maxWidth: 120 },
]
const mounted: VueWrapper[] = []
async function render(props: Partial<DataTableProps<Item>> = {}, slots = {}) {
  await page.viewport(1000, 800)
  const host = document.createElement('div')
  host.style.width = '700px'
  document.body.append(host)
  const wrapper = mount(DataTable<Item>, {
    props: { rows, columns, rowKey: 'id', label: 'Entries', resizable: true, ...props },
    slots,
    attachTo: host,
  })
  mounted.push(wrapper)
  await vi.waitFor(() =>
    expect(wrapper.element.querySelector('[data-overlayscrollbars-viewport]')).toBeTruthy(),
  )
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  return wrapper
}
const rect = (wrapper: VueWrapper, key: string) =>
  wrapper.find(`[data-hn-column="${key}"]`).element.getBoundingClientRect()
const widths = (wrapper: VueWrapper) => ['name', 'count', 'id'].map(key => rect(wrapper, key).width)
const pointer = (type: string, x: number, y: number) =>
  new PointerEvent(type, { bubbles: true, button: 0, pointerId: 1, clientX: x, clientY: y })
function begin(element: Element, x: number, y: number) {
  vi.spyOn(element, 'setPointerCapture').mockImplementation(() => {})
  element.dispatchEvent(pointer('pointerdown', x, y))
}
afterEach(() => {
  mounted.forEach(wrapper => wrapper.unmount())
  mounted.length = 0
  document.body.innerHTML = ''
  document.documentElement.dir = 'ltr'
  document.documentElement.removeAttribute('data-density')
})

describe('DataTable direct manipulation', () => {
  it.each(['ltr', 'rtl'])(
    'resizes from visible widths without moving other boundaries in %s',
    async dir => {
      document.documentElement.dir = dir
      const wrapper = await render()
      const initial = widths(wrapper)
      expect(initial[0]).toBeGreaterThan(160)
      expect(initial[2]).toBeLessThanOrEqual(120)
      const sign = dir === 'rtl' ? -1 : 1
      const handle = wrapper.find('[data-hn-column="name"] [role="separator"]').element
      const box = handle.getBoundingClientRect()
      const x = box.x + box.width / 2,
        y = box.y + box.height / 2
      begin(handle, x, y)
      window.dispatchEvent(pointer('pointermove', x + 40 * sign, y + 80))
      await vi.waitFor(() => expect(rect(wrapper, 'name').width).toBeCloseTo(initial[0]! + 40, 0))
      expect(rect(wrapper, 'count').width).toBeCloseTo(initial[1]! - 40, 0)
      expect(rect(wrapper, 'id').width).toBeCloseTo(initial[2]!, 0)
      const guide = document.querySelector<HTMLElement>('[data-hn-resize-guide]')!
      expect(guide.getBoundingClientRect().height).toBeGreaterThan(box.height * 2)
      expect(guide.getBoundingClientRect().left + 1).toBeCloseTo(
        dir === 'rtl' ? rect(wrapper, 'name').left : rect(wrapper, 'name').right,
        0,
      )
      expect(getComputedStyle(document.body).cursor).toBe('col-resize')
      window.dispatchEvent(pointer('pointerup', x + 40 * sign, y + 80))
      await vi.waitFor(() => expect(document.querySelector('[data-hn-resize-guide]')).toBeNull())
      const updated = handle.getBoundingClientRect()
      begin(handle, updated.x + 2, updated.y + 2)
      window.dispatchEvent(pointer('pointermove', updated.x + 2 - 20 * sign, updated.y + 40))
      window.dispatchEvent(pointer('pointerup', updated.x + 2 - 20 * sign, updated.y + 40))
      await vi.waitFor(() => expect(rect(wrapper, 'name').width).toBeCloseTo(initial[0]! + 20, 0))
      expect(rect(wrapper, 'count').width).toBeCloseTo(initial[1]! - 20, 0)
      expect(wrapper.find('[data-hn-column="id"] [role="separator"]').exists()).toBe(false)
    },
  )

  it('expands only the resized column and restores widths and cursor on cancellation', async () => {
    const wrapper = await render({ resizeMode: 'expand' })
    const initial = widths(wrapper)
    const tableWidth = wrapper.find('table').element.getBoundingClientRect().width
    const handle = wrapper.find('[data-hn-column="name"] [role="separator"]').element
    const box = handle.getBoundingClientRect()
    begin(handle, box.x + 2, box.y + 2)
    window.dispatchEvent(pointer('pointermove', box.x + 62, box.y + 40))
    await vi.waitFor(() => expect(rect(wrapper, 'name').width).toBeCloseTo(initial[0]! + 60, 0))
    expect(rect(wrapper, 'count').width).toBeCloseTo(initial[1]!, 0)
    expect(wrapper.find('table').element.getBoundingClientRect().width).toBeCloseTo(
      tableWidth + 60,
      0,
    )
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(widths(wrapper)).toEqual(initial))
    expect(document.documentElement.hasAttribute('data-hn-table-gesture')).toBe(false)
    expect(document.querySelector('[data-hn-resize-guide]')).toBeNull()
    expect(wrapper.find('[data-hn-column="id"] [role="separator"]').exists()).toBe(false)
    begin(handle, box.x + 2, box.y + 2)
    window.dispatchEvent(pointer('pointermove', box.x - 500, box.y + 40))
    window.dispatchEvent(pointer('pointerup', box.x - 500, box.y + 40))
    await vi.waitFor(() => expect(rect(wrapper, 'name').width).toBeCloseTo(initial[0]!, 0))
    expect(rect(wrapper, 'count').width).toBeCloseTo(initial[1]!, 0)
  })

  it('shows an insertion boundary only after a deliberate header drag and does not sort on drop', async () => {
    const wrapper = await render({ reorderColumns: true })
    const header = wrapper.find('[data-hn-column="name"]').element
    const button = header.querySelector('button')!
    const origin = rect(wrapper, 'name'),
      target = rect(wrapper, 'count')
    const x = origin.x + 40,
      y = origin.y + origin.height / 2
    begin(header, x, y)
    window.dispatchEvent(pointer('pointermove', x + 3, y))
    expect(document.querySelector('[data-hn-drag-preview]')).toBeNull()
    window.dispatchEvent(pointer('pointermove', target.right - 20, y))
    await vi.waitFor(() => expect(document.querySelector('[data-hn-drop-line]')).not.toBeNull())
    const line = document.querySelector('[data-hn-drop-line]')!.getBoundingClientRect()
    expect(line.left + 1).toBeCloseTo(target.right, 0)
    expect(document.querySelector('[data-hn-drag-preview]')!.textContent).toContain('Alpha')
    window.dispatchEvent(pointer('pointerup', target.right - 20, y))
    button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await vi.waitFor(() =>
      expect(
        wrapper.findAll('[data-hn-column]').map(cell => cell.attributes('data-hn-column')),
      ).toEqual(['count', 'name', 'id']),
    )
    expect(wrapper.emitted('update:sorting')).toBeUndefined()
    expect(document.querySelector('[data-hn-drop-line]')).toBeNull()
    await userEvent.click(button)
    expect(wrapper.emitted('update:sorting')).toHaveLength(1)
    const current = rect(wrapper, 'name'),
      first = rect(wrapper, 'count')
    begin(header, current.left + 20, y)
    window.dispatchEvent(pointer('pointermove', first.left + 20, y))
    await vi.waitFor(() => expect(document.querySelector('[data-hn-drop-line]')).not.toBeNull())
    await userEvent.keyboard('{Escape}')
    expect(
      wrapper.findAll('[data-hn-column]').map(cell => cell.attributes('data-hn-column')),
    ).toEqual(['count', 'name', 'id'])
    expect(document.querySelector('[data-hn-drag-preview]')).toBeNull()
    await new Promise(resolve => setTimeout(resolve, 10))
    document.dispatchEvent(pointer('pointerup', first.left + 20, y))
    button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    expect(wrapper.emitted('update:sorting')).toHaveLength(1)
  })

  it('keeps custom header controls independent from header dragging', async () => {
    const click = vi.fn()
    const wrapper = await render(
      { reorderColumns: true },
      { 'header-name': () => h('button', { onClick: click }, 'Filter') },
    )
    const button = wrapper.find('[data-hn-column="name"] button').element
    const box = button.getBoundingClientRect()
    button.dispatchEvent(pointer('pointerdown', box.x + 5, box.y + 5))
    window.dispatchEvent(pointer('pointermove', box.x + 100, box.y + 5))
    window.dispatchEvent(pointer('pointerup', box.x + 100, box.y + 5))
    await userEvent.click(button)
    expect(click).toHaveBeenCalledOnce()
    expect(wrapper.emitted('update:columnOrder')).toBeUndefined()
    expect(document.querySelector('[data-hn-drag-preview]')).toBeNull()
  })

  it.each([false, true])(
    'keeps editing aligned without changing the row height (compact=%s)',
    async compact => {
      if (compact) document.documentElement.dataset.density = 'compact'
      const wrapper = await render({ editMode: 'cell' })
      const row = wrapper.find('tbody tr').element
      const cell = wrapper.find('[data-hn-cell="name"]').element as HTMLElement
      const height = row.getBoundingClientRect().height
      cell.focus()
      await userEvent.keyboard('{Enter}')
      await vi.waitFor(() => expect(wrapper.find('tbody input').exists()).toBe(true))
      expect(row.getBoundingClientRect().height).toBe(height)
      const input = wrapper.find('tbody input').element as HTMLInputElement
      expect(document.activeElement).toBe(input)
      expect(
        Math.abs(
          input.getBoundingClientRect().left -
            cell.getBoundingClientRect().left -
            parseFloat(getComputedStyle(cell).paddingLeft),
        ),
      ).toBeLessThan(1)
      for (const action of cell.querySelectorAll('button'))
        expect(action.getBoundingClientRect().width).toBe(24)
      await userEvent.keyboard('{Escape}')
      await vi.waitFor(() => expect(wrapper.find('tbody input').exists()).toBe(false))
      expect(document.activeElement).toBe(cell)
      expect(row.getBoundingClientRect().height).toBe(height)
    },
  )
})
