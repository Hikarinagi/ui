import { afterEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render as mountReact } from 'vitest-browser-react'
import { ConfigProvider } from '../../lib/config'
import { DataTable } from './DataTable'
import type { DataTableColumn, DataTableProps } from './types'
import { mountTable } from '../../../test/data-table'
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
const mounted: Array<{ unmount: () => unknown }> = []
async function render(props: Partial<DataTableProps<Item>> = {}) {
  await page.viewport(1000, 800)
  const host = document.createElement('div')
  host.style.width = '700px'
  document.body.append(host)
  const wrapper = await mountTable<Item>(
    { rows, columns, rowKey: 'id', label: 'Entries', resizable: true, ...props },
    host,
  )
  mounted.push(wrapper)
  await vi.waitFor(() =>
    expect(wrapper.element.querySelector('[data-overlayscrollbars-viewport]')).toBeTruthy(),
  )
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  return wrapper
}
type Wrapper = Awaited<ReturnType<typeof render>>
const rect = (wrapper: Wrapper, key: string) =>
  wrapper.find(`[data-hn-column="${key}"]`)!.getBoundingClientRect()
const widths = (wrapper: Wrapper) => ['name', 'count', 'id'].map(key => rect(wrapper, key).width)
const pointer = (type: string, x: number, y: number) =>
  new PointerEvent(type, { bubbles: true, button: 0, pointerId: 1, clientX: x, clientY: y })
function begin(element: Element, x: number, y: number) {
  vi.spyOn(element, 'setPointerCapture').mockImplementation(() => {})
  element.dispatchEvent(pointer('pointerdown', x, y))
}
afterEach(async () => {
  for (const wrapper of mounted.splice(0)) await wrapper.unmount()
  document.body.innerHTML = ''
  document.documentElement.dir = 'ltr'
  document.documentElement.removeAttribute('data-density')
})

describe('DataTable direct manipulation', () => {
  it('mounts resize guides and drag previews in the configured portal target', async () => {
    const target = document.createElement('div')
    target.id = 'table-portals'
    document.body.append(target)
    await page.viewport(1000, 800)
    const container = document.createElement('div')
    document.body.append(container)
    mounted.push(
      await mountReact(
        <ConfigProvider teleportTo="#table-portals">
          <DataTable<Item>
            rows={rows}
            columns={columns}
            rowKey="id"
            resizable
            reorderColumns
            style={{ width: '700px' }}
          />
        </ConfigProvider>,
        { container },
      ),
    )
    await vi.waitFor(() =>
      expect(container.querySelector('[data-overlayscrollbars-viewport]')).not.toBeNull(),
    )
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    const handle = container.querySelector('[data-hn-column="name"] [role="separator"]')!
    const box = handle.getBoundingClientRect()
    begin(handle, box.x + 2, box.y + 2)
    window.dispatchEvent(pointer('pointermove', box.x + 22, box.y + 2))
    await vi.waitFor(() => expect(target.querySelector('[data-hn-resize-guide]')).not.toBeNull())
    expect(target.querySelector('[data-hn-resize-label]')).not.toBeNull()
    window.dispatchEvent(pointer('pointerup', box.x + 22, box.y + 2))
    const header = container.querySelector('[data-hn-column="name"]')!
    const origin = header.getBoundingClientRect()
    begin(header, origin.x + 20, origin.y + 20)
    window.dispatchEvent(pointer('pointermove', origin.x + 70, origin.y + 20))
    await vi.waitFor(() => expect(target.querySelector('[data-hn-drag-preview]')).not.toBeNull())
    window.dispatchEvent(pointer('pointerup', origin.x + 70, origin.y + 20))
    await vi.waitFor(() => expect(target.childElementCount).toBe(0))
  })

  it.each(['ltr', 'rtl'])(
    'resizes from visible widths without moving other boundaries in %s',
    async dir => {
      document.documentElement.dir = dir
      const wrapper = await render()
      const initial = widths(wrapper)
      expect(initial[0]).toBeGreaterThan(160)
      expect(initial[2]).toBeLessThanOrEqual(120)
      const sign = dir === 'rtl' ? -1 : 1
      const handle = wrapper.find('[data-hn-column="name"] [role="separator"]')!
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
      expect(wrapper.find('[data-hn-column="id"] [role="separator"]')).toBeNull()
    },
  )

  it('expands only the resized column and restores widths and cursor on cancellation', async () => {
    const wrapper = await render({ resizeMode: 'expand' })
    const initial = widths(wrapper)
    const tableWidth = wrapper.find('table')!.getBoundingClientRect().width
    const handle = wrapper.find('[data-hn-column="name"] [role="separator"]')!
    const box = handle.getBoundingClientRect()
    begin(handle, box.x + 2, box.y + 2)
    window.dispatchEvent(pointer('pointermove', box.x + 62, box.y + 40))
    await vi.waitFor(() => expect(rect(wrapper, 'name').width).toBeCloseTo(initial[0]! + 60, 0))
    expect(rect(wrapper, 'count').width).toBeCloseTo(initial[1]!, 0)
    expect(wrapper.find('table')!.getBoundingClientRect().width).toBeCloseTo(tableWidth + 60, 0)
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(widths(wrapper)).toEqual(initial))
    expect(document.documentElement.hasAttribute('data-hn-table-gesture')).toBe(false)
    expect(document.querySelector('[data-hn-resize-guide]')).toBeNull()
    expect(wrapper.find('[data-hn-column="id"] [role="separator"]')).toBeNull()
    begin(handle, box.x + 2, box.y + 2)
    window.dispatchEvent(pointer('pointermove', box.x - 500, box.y + 40))
    window.dispatchEvent(pointer('pointerup', box.x - 500, box.y + 40))
    await vi.waitFor(() => expect(rect(wrapper, 'name').width).toBeCloseTo(initial[0]!, 0))
    expect(rect(wrapper, 'count').width).toBeCloseTo(initial[1]!, 0)
  })

  it('shows an insertion boundary only after a deliberate header drag and does not sort on drop', async () => {
    const wrapper = await render({ reorderColumns: true })
    const header = wrapper.find('[data-hn-column="name"]')!
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
        wrapper.findAll('[data-hn-column]').map(cell => cell.getAttribute('data-hn-column')),
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
      wrapper.findAll('[data-hn-column]').map(cell => cell.getAttribute('data-hn-column')),
    ).toEqual(['count', 'name', 'id'])
    expect(document.querySelector('[data-hn-drag-preview]')).toBeNull()
    await new Promise(resolve => setTimeout(resolve, 10))
    document.dispatchEvent(pointer('pointerup', first.left + 20, y))
    button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    expect(wrapper.emitted('update:sorting')).toHaveLength(1)
  })

  it('keeps custom header controls independent from header dragging', async () => {
    const click = vi.fn()
    const wrapper = await render({
      reorderColumns: true,
      renderHeader: ({ column }) =>
        column.key === 'name' ? <button onClick={click}>Filter</button> : undefined,
    })
    const button = wrapper.find('[data-hn-column="name"] button')!
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
      const row = wrapper.find('tbody tr')!
      const cell = wrapper.find('[data-hn-cell="name"]')!
      const height = row.getBoundingClientRect().height
      cell.focus()
      await userEvent.keyboard('{Enter}')
      await vi.waitFor(() => expect(wrapper.find('tbody input')).not.toBeNull())
      expect(row.getBoundingClientRect().height).toBe(height)
      const input = wrapper.find('tbody input') as HTMLInputElement
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
      await vi.waitFor(() => expect(wrapper.find('tbody input')).toBeNull())
      expect(document.activeElement).toBe(cell)
      expect(row.getBoundingClientRect().height).toBe(height)
    },
  )
})
