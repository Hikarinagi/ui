import { afterEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h, type VNode } from 'vue'
import DataTable from './DataTable.vue'
import type { DataTableColumn, DataTableProps } from './types'
import '../../../test/browser.css'

type Item = { a: string; b: string; c: string; id: number }
const rows = Array.from({ length: 12 }, (_, id) => ({ id, a: 'Alpha', b: 'Beta', c: 'Gamma' }))
const columns: DataTableColumn<Item>[] = [
  { key: 'a', label: 'A', width: 240, minWidth: 100, maxWidth: 600 },
  { key: 'b', label: 'B', width: 240, minWidth: 100, maxWidth: 600 },
  { key: 'c', label: 'C', width: 160, minWidth: 80, maxWidth: 600 },
]
const mounted: VueWrapper[] = []
async function render(
  props: Partial<DataTableProps<Item>> & { columnWidths?: Record<string, number> } = {},
  options: {
    width?: number
    scale?: number
    slots?: { cell: (context: { value: unknown }) => VNode }
  } = {},
) {
  await page.viewport(1200, 900)
  const host = document.createElement('div')
  host.style.cssText = `width:${options.width ?? 800}px;transform:scale(${options.scale ?? 1});transform-origin:top left`
  document.body.append(host)
  const wrapper = mount(DataTable<Item>, {
    props: { rows, columns, rowKey: 'id', label: 'Entries', resizable: true, ...props },
    slots: options.slots,
    attachTo: host,
  })
  wrapper.element.parentElement!.style.cssText = 'display:flex;justify-content:center'
  mounted.push(wrapper)
  await vi.waitFor(() => expect(viewport(wrapper)).toBeTruthy())
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  return { wrapper, host }
}
const viewport = (wrapper: VueWrapper) =>
  (wrapper.element as HTMLElement).querySelector<HTMLElement>('[data-overlayscrollbars-viewport]')!
const cell = (wrapper: VueWrapper, key: string) =>
  wrapper.find(`[data-hn-column="${key}"]`).element as HTMLElement
const rect = (wrapper: VueWrapper, key: string) => cell(wrapper, key).getBoundingClientRect()
const widths = (wrapper: VueWrapper) => columns.map(column => rect(wrapper, column.key).width)
const pointer = (type: string, x: number, y = 20) =>
  new PointerEvent(type, { bubbles: true, pointerId: 3, button: 0, clientX: x, clientY: y })
function start(wrapper: VueWrapper, key: string) {
  const handle = cell(wrapper, key).querySelector<HTMLElement>('[role="separator"]')!
  expect(handle).not.toBeNull()
  vi.spyOn(handle, 'setPointerCapture').mockImplementation(() => {})
  const box = handle.getBoundingClientRect()
  const x = box.x + box.width / 2,
    y = box.y + box.height / 2
  handle.dispatchEvent(pointer('pointerdown', x, y))
  return { x, y, handle }
}
const move = (x: number, y = 20) => window.dispatchEvent(pointer('pointermove', x, y))
const up = (x: number, y = 20) => window.dispatchEvent(pointer('pointerup', x, y))
afterEach(() => {
  mounted.forEach(wrapper => wrapper.unmount())
  mounted.length = 0
  document.body.innerHTML = ''
  document.documentElement.dir = 'ltr'
})

describe('DataTable resize geometry', () => {
  it('keeps the scroll container stationary and does not overflow just because a handle exists', async () => {
    const { wrapper } = await render({ resizeMode: 'expand' })
    const area = viewport(wrapper)
    const before = area.getBoundingClientRect()
    expect(area.scrollWidth).toBe(area.clientWidth)
    expect(before.width).toBeGreaterThan(790)
    const boundary = rect(wrapper, 'a').right
    const { x, y } = start(wrapper, 'a')
    move(x + 35, y)
    await vi.waitFor(() => expect(rect(wrapper, 'a').right - boundary).toBeCloseTo(35, 0))
    expect(area.getBoundingClientRect().left).toBe(before.left)
    expect(area.getBoundingClientRect().width).toBe(before.width)
    up(x + 35, y)
  })

  it.each(['ltr', 'rtl'])(
    'stops expanding-mode shrink at the viewport width for both pointer and keyboard in %s',
    async dir => {
      document.documentElement.dir = dir
      const { wrapper } = await render({ resizeMode: 'expand' })
      const initial = widths(wrapper)
      const area = viewport(wrapper)
      const sign = dir === 'rtl' ? -1 : 1
      const { x, y, handle } = start(wrapper, 'a')
      expect(Number(handle.getAttribute('aria-valuemin'))).toBeCloseTo(initial[0]!, 0)
      move(x - 100 * sign, y)
      up(x - 100 * sign, y)
      await new Promise(resolve => requestAnimationFrame(resolve))
      expect(widths(wrapper)).toEqual(initial)
      expect(wrapper.emitted('update:columnWidths')).toBeUndefined()
      const grow = start(wrapper, 'a')
      move(grow.x + 80 * sign, grow.y)
      await vi.waitFor(() => expect(rect(wrapper, 'a').width).toBeCloseTo(initial[0]! + 80, 0))
      move(grow.x - 100 * sign, grow.y)
      await vi.waitFor(() => expect(rect(wrapper, 'a').width).toBeCloseTo(initial[0]!, 0))
      expect(wrapper.find('table').element.getBoundingClientRect().width).toBeCloseTo(
        area.clientWidth,
        0,
      )
      up(grow.x - 100 * sign, grow.y)
      handle.focus()
      const count = wrapper.emitted('update:columnWidths')?.length
      await userEvent.keyboard('{Home}')
      expect(wrapper.emitted('update:columnWidths')?.length).toBe(count)
      await userEvent.keyboard('{End}')
      await vi.waitFor(() => expect(rect(wrapper, 'a').width).toBe(600))
      await userEvent.keyboard('{Home}')
      await vi.waitFor(() => expect(widths(wrapper)).toEqual(initial))
      expect(area.scrollWidth).toBe(area.clientWidth)
    },
  )

  it.each(['ltr', 'rtl'])(
    'uses the same total-width limit for an end-pinned column while scrolled in %s',
    async dir => {
      document.documentElement.dir = dir
      const { wrapper } = await render(
        {
          resizeMode: 'expand',
          columns: columns.map(column => (column.key === 'c' ? { ...column, pin: 'end' } : column)),
          columnWidths: { a: 200, b: 200, c: 400 },
        },
        { width: 600 },
      )
      const area = viewport(wrapper)
      area.scrollLeft = dir === 'rtl' ? -area.scrollWidth : area.scrollWidth
      await vi.waitFor(() => expect(Math.abs(area.scrollLeft)).toBeGreaterThan(190))
      const initial = widths(wrapper)
      const { x, y, handle } = start(wrapper, 'c')
      const delta = dir === 'rtl' ? -500 : 500
      move(x + delta, y)
      const min = area.clientWidth - initial[0]! - initial[1]!
      await vi.waitFor(() => expect(rect(wrapper, 'c').width).toBeCloseTo(min, 0))
      expect(rect(wrapper, 'a').width).toBe(initial[0])
      expect(rect(wrapper, 'b').width).toBe(initial[1])
      expect(area.scrollWidth).toBe(area.clientWidth)
      up(x + delta, y)
      handle.focus()
      await userEvent.keyboard('{Home}')
      expect(rect(wrapper, 'c').width).toBeCloseTo(min, 0)
      expect(wrapper.find('table').element.getBoundingClientRect().width).toBeCloseTo(
        area.clientWidth,
        0,
      )
    },
  )

  it('accounts for selection and row-edit action columns in the available width', async () => {
    const { wrapper } = await render({ resizeMode: 'expand', selectable: true, editMode: 'row' })
    const initial = widths(wrapper)
    const { x, y } = start(wrapper, 'a')
    move(x + 80, y)
    await vi.waitFor(() => expect(rect(wrapper, 'a').width).toBeCloseTo(initial[0]! + 80, 0))
    move(x - 100, y)
    await vi.waitFor(() => expect(rect(wrapper, 'a').width).toBeCloseTo(initial[0]!, 0))
    up(x - 100, y)
    expect(widths(wrapper)).toEqual(initial)
    expect(wrapper.find('table').element.getBoundingClientRect().width).toBeCloseTo(
      viewport(wrapper).clientWidth,
      0,
    )
  })

  it('does not persist widths after a click and continues responding to container resizing', async () => {
    const { wrapper, host } = await render()
    const initial = widths(wrapper)
    const { x, y } = start(wrapper, 'a')
    up(x, y)
    expect(wrapper.emitted('update:columnWidths')).toBeUndefined()
    host.style.width = '1000px'
    await vi.waitFor(() => expect(rect(wrapper, 'a').width).toBeGreaterThan(initial[0]!))
    expect(wrapper.find('table').element.getBoundingClientRect().width).toBeGreaterThan(990)
  })

  it('keeps unspecified columns flexible with an initial width override and after resizing a pair', async () => {
    const { wrapper, host } = await render({ columnWidths: { a: 200 } })
    expect(rect(wrapper, 'a').width).toBe(200)
    expect(wrapper.find('table').element.getBoundingClientRect().width).toBeGreaterThan(790)
    const initial = widths(wrapper)
    const { x, y } = start(wrapper, 'a')
    move(x + 30, y)
    up(x + 30, y)
    await vi.waitFor(() => expect(rect(wrapper, 'a').width).toBe(230))
    expect(rect(wrapper, 'c').width).toBeCloseTo(initial[2]!, 0)
    host.style.width = '900px'
    await vi.waitFor(() => expect(rect(wrapper, 'c').width).toBeGreaterThan(initial[2]! + 90))
    expect(rect(wrapper, 'a').width).toBe(230)
    expect(rect(wrapper, 'b').width).toBeCloseTo(initial[1]! - 30, 0)
  })

  it('converts viewport motion to column widths when an ancestor is scaled', async () => {
    const { wrapper } = await render({}, { scale: 0.75 })
    const initial = widths(wrapper)
    const boundary = rect(wrapper, 'a').right
    const { x, y } = start(wrapper, 'a')
    move(x + 36, y)
    await vi.waitFor(() => expect(rect(wrapper, 'a').right - boundary).toBeCloseTo(36, 0))
    expect(rect(wrapper, 'a').width - initial[0]!).toBeCloseTo(36, 0)
    expect(rect(wrapper, 'b').width - initial[1]!).toBeCloseTo(-36, 0)
    up(x + 36, y)
    const change = wrapper.emitted('update:columnWidths')!.at(-1)![0] as Record<string, number>
    expect(change.a! - initial[0]! / 0.75).toBeCloseTo(48, 0)
  })

  it.each(['ltr', 'rtl'])(
    'resizes the inner edge of end-pinned columns while scrolled in %s',
    async dir => {
      document.documentElement.dir = dir
      const { wrapper } = await render(
        {
          columns: columns.map(column => (column.key === 'c' ? { ...column, pin: 'end' } : column)),
          columnWidths: { a: 300, b: 400, c: 160 },
        },
        { width: 600 },
      )
      const area = viewport(wrapper)
      area.scrollLeft = dir === 'rtl' ? -100 : 100
      await vi.waitFor(() => expect(Math.abs(area.scrollLeft)).toBeGreaterThan(90))
      expect(cell(wrapper, 'b').querySelector('[role="separator"]')).toBeNull()
      const initial = widths(wrapper)
      const before = rect(wrapper, 'c')
      const { x, y, handle } = start(wrapper, 'c')
      expect(handle.dataset.side).toBe('start')
      const delta = dir === 'rtl' ? -30 : 30
      move(x + delta, y)
      await vi.waitFor(() => expect(rect(wrapper, 'c').width).toBeCloseTo(initial[2]! - 30, 0))
      expect(rect(wrapper, 'b').width).toBeCloseTo(initial[1]! + 30, 0)
      const after = rect(wrapper, 'c')
      expect(dir === 'rtl' ? after.right - before.right : after.left - before.left).toBeCloseTo(
        delta,
        0,
      )
      expect(dir === 'rtl' ? after.left : after.right).toBeCloseTo(
        dir === 'rtl' ? before.left : before.right,
        0,
      )
      up(x + delta, y)
      await wrapper.setProps({ resizeMode: 'expand' })
      const next = start(wrapper, 'c')
      const frozen = widths(wrapper)
      move(next.x - delta, next.y)
      await vi.waitFor(() => expect(rect(wrapper, 'c').width).toBeCloseTo(frozen[2]! + 30, 0))
      expect(rect(wrapper, 'a').width).toBeCloseTo(frozen[0]!, 0)
      expect(rect(wrapper, 'b').width).toBeCloseTo(frozen[1]!, 0)
      up(next.x - delta, next.y)
    },
  )

  it('keeps both columns independently resizable beside an end pin in expand mode', async () => {
    const { wrapper } = await render(
      {
        resizeMode: 'expand',
        columns: columns.map(column => (column.key === 'c' ? { ...column, pin: 'end' } : column)),
        columnWidths: { a: 300, b: 400, c: 160 },
      },
      { width: 600 },
    )
    const area = viewport(wrapper)
    area.scrollLeft = area.scrollWidth
    await vi.waitFor(() => expect(area.scrollLeft).toBeGreaterThan(250))
    const { x, y, handle } = start(wrapper, 'b')
    expect(document.elementFromPoint(x, y)).toBe(handle)
    move(x - 30, y)
    await vi.waitFor(() => expect(rect(wrapper, 'b').width).toBeCloseTo(370, 0))
    expect(rect(wrapper, 'c').width).toBe(160)
    up(x - 30, y)
  })

  it('keeps the grabbed boundary under the pointer while its viewport scrolls', async () => {
    const { wrapper } = await render({ columnWidths: { a: 300, b: 400, c: 160 } }, { width: 600 })
    const boundary = rect(wrapper, 'a').right
    const { x, y } = start(wrapper, 'a')
    move(x + 20, y)
    await vi.waitFor(() => expect(rect(wrapper, 'a').width).toBeCloseTo(320, 0))
    viewport(wrapper).scrollLeft = 50
    await vi.waitFor(() => expect(rect(wrapper, 'a').width).toBeCloseTo(370, 0))
    expect(rect(wrapper, 'a').right).toBeCloseTo(boundary + 20, 0)
    up(x + 20, y)
  })

  it('respects both columns limits, recovers from the limit and updates accessible bounds', async () => {
    const { wrapper } = await render({
      columns: [{ ...columns[0]!, maxWidth: 330 }, { ...columns[1]!, minWidth: 220 }, columns[2]!],
      columnWidths: { a: 300, b: 240, c: 160 },
    })
    const { x, y, handle } = start(wrapper, 'a')
    expect(handle.getAttribute('aria-valuemax')).toBe('320')
    move(x + 100, y)
    await vi.waitFor(() => expect(rect(wrapper, 'a').width).toBe(320))
    expect(rect(wrapper, 'b').width).toBe(220)
    move(x - 20, y)
    await vi.waitFor(() => expect(rect(wrapper, 'a').width).toBe(280))
    expect(rect(wrapper, 'b').width).toBe(260)
    up(x - 20, y)
  })

  it('keeps long header labels inside their resized column without growing the header', async () => {
    const { wrapper } = await render({
      columns: [
        { ...columns[0]!, label: 'A long header with several words', minWidth: 48 },
        columns[1]!,
        columns[2]!,
      ],
      columnWidths: { a: 300, b: 240, c: 160 },
    })
    const height = cell(wrapper, 'a').getBoundingClientRect().height
    const { x, y } = start(wrapper, 'a')
    move(x - 252, y)
    await vi.waitFor(() => expect(rect(wrapper, 'a').width).toBe(48))
    expect(cell(wrapper, 'a').getBoundingClientRect().height).toBe(height)
    const label = cell(wrapper, 'a').querySelector<HTMLElement>('[data-hn-table-heading] > span')!
    expect(getComputedStyle(label).textOverflow).toBe('ellipsis')
    expect(label.getBoundingClientRect().right).toBeLessThanOrEqual(rect(wrapper, 'a').right)
    up(x - 252, y)
  })

  it('changes geometry without rerendering every custom cell for each pointer move', async () => {
    const renderCell = vi.fn(({ value }: { value: unknown }) => h('span', String(value)))
    const { wrapper } = await render({}, { slots: { cell: renderCell } })
    const before = renderCell.mock.calls.length
    const { x, y } = start(wrapper, 'a')
    for (const delta of [10, 20, 30]) {
      move(x + delta, y)
      await vi.waitFor(() => expect(rect(wrapper, 'a').right).toBeCloseTo(x + delta + 4.5, 0))
    }
    expect(renderCell.mock.calls.length).toBe(before)
    up(x + 30, y)
    const event = new MouseEvent('contextmenu', { bubbles: true })
    wrapper.find('tbody tr').element.dispatchEvent(event)
    expect(wrapper.emitted('rowContextmenu')?.[0]).toEqual([rows[0], event])
  })
})
