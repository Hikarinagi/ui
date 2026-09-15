import { afterEach, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import DataTable from './DataTable.vue'
import type { DataTableColumn, DataTableProps } from './types'
import '../../../test/browser.css'

type Item = { id: number; a: string; b: string; c: string }
const rows: Item[] = [{ id: 1, a: 'Alpha', b: 'Beta', c: 'Gamma' }]
const columns: DataTableColumn<Item>[] = [
  { key: 'a', label: 'A', pin: 'start' },
  { key: 'b', label: 'B' },
  { key: 'c', label: 'C', pin: 'end' },
]
const mounted: VueWrapper[] = []
const frame = () =>
  new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
async function render(
  props: Partial<DataTableProps<Item>> & { columnWidths?: Record<string, number> } = {},
  scale = 1,
) {
  await page.viewport(1000, 800)
  const host = document.createElement('div')
  host.style.cssText = `width:600px;transform:scale(${scale});transform-origin:top left`
  document.body.append(host)
  const wrapper = mount(DataTable<Item>, {
    props: {
      rows,
      columns,
      rowKey: 'id',
      resizable: true,
      resizeMode: 'expand',
      columnWidths: { a: 120, b: 500, c: 140 },
      ...props,
    },
    attachTo: host,
  })
  mounted.push(wrapper)
  await vi.waitFor(() =>
    expect(wrapper.find('[data-overlayscrollbars-viewport]').exists()).toBe(true),
  )
  await vi.waitFor(() => expect(getComputedStyle(handle(wrapper, 'b')).visibility).toBe('visible'))
  await frame()
  return wrapper
}
const header = (wrapper: VueWrapper, key: string) =>
  wrapper.find(`[data-hn-column="${key}"]`).element as HTMLElement
const handle = (wrapper: VueWrapper, key: string) =>
  header(wrapper, key).querySelector<HTMLElement>('[role="separator"]')!
const width = (wrapper: VueWrapper, key: string) =>
  Number(handle(wrapper, key).getAttribute('aria-valuenow'))
const pointer = (type: string, x: number, y: number) =>
  new PointerEvent(type, { bubbles: true, pointerId: 7, button: 0, clientX: x, clientY: y })
function start(wrapper: VueWrapper, key: string) {
  const target = handle(wrapper, key)
  const box = target.getBoundingClientRect(),
    x = box.x + box.width / 2,
    y = box.y + box.height / 2
  expect(document.elementFromPoint(x, y)).toBe(target)
  vi.spyOn(target, 'setPointerCapture').mockImplementation(() => {})
  target.dispatchEvent(pointer('pointerdown', x, y))
  return { x, y, target }
}
const move = (x: number, y: number) => window.dispatchEvent(pointer('pointermove', x, y))
const up = (x: number, y: number) => window.dispatchEvent(pointer('pointerup', x, y))
afterEach(() => {
  mounted.forEach(wrapper => wrapper.unmount())
  mounted.length = 0
  document.body.innerHTML = ''
  document.documentElement.dir = 'ltr'
})

it.each([
  ['ltr', 1],
  ['rtl', 1],
  ['ltr', 0.75],
] as const)(
  'keeps the clipped column handle separate and draggable again after release (%s, scale=%s)',
  async (dir, scale) => {
    document.documentElement.dir = dir
    const wrapper = await render({}, scale)
    const box = handle(wrapper, 'b').getBoundingClientRect()
    const pin = handle(wrapper, 'c').getBoundingClientRect()
    expect(dir === 'rtl' ? pin.right <= box.left + 0.01 : box.right <= pin.left + 0.01).toBe(true)
    const first = start(wrapper, 'b')
    const delta = (dir === 'rtl' ? -1 : 1) * 80 * scale
    move(first.x + delta, first.y)
    await vi.waitFor(() => expect(width(wrapper, 'b')).toBe(580))
    expect(width(wrapper, 'a')).toBe(120)
    expect(width(wrapper, 'c')).toBe(140)
    await vi.waitFor(() =>
      expect(document.querySelector('[data-hn-resize-label]')?.textContent).toContain('580px'),
    )
    expect(document.querySelector('[data-hn-resize-label]')?.textContent).toContain('B')
    await vi.waitFor(() => {
      const edge = handle(wrapper, 'b').getBoundingClientRect()
      const guide = document
        .querySelector<HTMLElement>('[data-hn-resize-guide]')!
        .getBoundingClientRect()
      expect(guide.left + guide.width / 2).toBeCloseTo(dir === 'rtl' ? edge.left : edge.right, 0)
    })
    up(first.x + delta, first.y)
    await frame()
    expect(document.querySelector('[data-hn-resize-label]')).toBeNull()
    const second = start(wrapper, 'b')
    move(second.x - delta, second.y)
    await vi.waitFor(() => expect(width(wrapper, 'b')).toBe(500))
    up(second.x - delta, second.y)
    await frame()
    const pinned = start(wrapper, 'c')
    move(pinned.x - delta / 2, pinned.y)
    await vi.waitFor(() => expect(width(wrapper, 'c')).toBe(180))
    expect(width(wrapper, 'b')).toBe(500)
    up(pinned.x - delta / 2, pinned.y)
  },
)

it.each(['ltr', 'rtl'])(
  'removes fully covered handles from hit testing and tab order, then restores them on scroll (%s)',
  async dir => {
    document.documentElement.dir = dir
    const wrapper = await render({
      columns: [columns[0]!, columns[1]!, { key: 'id', label: 'ID' }, columns[2]!],
      columnWidths: { a: 120, b: 320, id: 400, c: 140 },
    })
    const target = handle(wrapper, 'b')
    const viewport = wrapper.find('[data-overlayscrollbars-viewport]').element as HTMLElement
    viewport.scrollLeft = dir === 'rtl' ? -360 : 360
    await vi.waitFor(() => expect(getComputedStyle(target).visibility).toBe('hidden'))
    expect(target.tabIndex).toBe(-1)
    viewport.scrollLeft = 0
    await vi.waitFor(() => expect(getComputedStyle(target).visibility).toBe('visible'))
    expect(target.tabIndex).toBe(0)
    const box = target.getBoundingClientRect()
    expect(document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2)).toBe(target)
  },
)

it.each([
  ['ltr', 'a'],
  ['rtl', 'a'],
  ['ltr', 'c'],
  ['rtl', 'c'],
])(
  'reserves the center viewport when resizing pinned columns, including control columns (%s, %s)',
  async (dir, key) => {
    document.documentElement.dir = dir
    const wrapper = await render({ selectable: true, editMode: 'row' })
    const initial = { a: width(wrapper, 'a'), b: width(wrapper, 'b'), c: width(wrapper, 'c') }
    const current = start(wrapper, key!)
    const sign = (dir === 'rtl' ? -1 : 1) * (key === 'c' ? -1 : 1)
    move(current.x + 1000 * sign, current.y)
    await vi.waitFor(() =>
      expect(width(wrapper, key!)).toBe(Number(current.target.getAttribute('aria-valuemax'))),
    )
    up(current.x + 1000 * sign, current.y)
    await frame()
    const left = header(wrapper, 'a').getBoundingClientRect()
    const right = header(wrapper, 'c').getBoundingClientRect()
    expect(dir === 'rtl' ? left.left - right.right : right.left - left.right).toBeCloseTo(48, 0)
    expect(width(wrapper, 'b')).toBe(initial.b)
    expect(width(wrapper, key === 'a' ? 'c' : 'a')).toBe(key === 'a' ? initial.c : initial.a)
    current.target.focus()
    await userEvent.keyboard('{End}')
    expect(
      dir === 'rtl'
        ? header(wrapper, 'a').getBoundingClientRect().left -
            header(wrapper, 'c').getBoundingClientRect().right
        : header(wrapper, 'c').getBoundingClientRect().left -
            header(wrapper, 'a').getBoundingClientRect().right,
    ).toBeCloseTo(48, 0)
  },
)
