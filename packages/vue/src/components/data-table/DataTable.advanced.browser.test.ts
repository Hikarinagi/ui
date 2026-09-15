import { afterEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h, ref, defineComponent } from 'vue'
import DataTable from './DataTable.vue'
import type { DataTableApi, DataTableColumn, DataTableProps } from './types'
import { expectNoA11yViolations } from '../../../test/axe'
import '../../../test/browser.css'

interface Item {
  id: number
  name: string
  count: number
}
const rows = Array.from({ length: 30 }, (_, id) => ({
  id,
  name: `Entry ${id} with a longer descriptive text`,
  count: id,
}))
const columns: DataTableColumn<Item>[] = [
  {
    key: 'name',
    label: 'Name',
    width: 220,
    minWidth: 120,
    maxWidth: 360,
    truncate: true,
    pin: 'start',
  },
  { key: 'count', label: 'Count', width: 300 },
  { key: 'id', label: 'ID', width: 120, pin: 'end' },
]
const mounted: VueWrapper[] = []
function host(width = 500) {
  const host = document.createElement('div')
  host.style.width = `${width}px`
  document.body.append(host)
  return host
}
function render(props: Partial<DataTableProps<Item>> & Record<string, unknown> = {}, slots = {}) {
  const wrapper = mount(DataTable<Item>, {
    props: { rows, columns, rowKey: 'id', rowLabel: 'id', label: 'Entries', ...props },
    slots,
    attachTo: host(),
  })
  mounted.push(wrapper)
  return wrapper
}
const api = (wrapper: VueWrapper) => (wrapper.vm as unknown as { api: DataTableApi<Item> }).api
const viewport = (wrapper: VueWrapper) =>
  wrapper.element.querySelector('[data-overlayscrollbars-viewport]') as HTMLElement
const ready = async (wrapper: VueWrapper) => {
  await vi.waitFor(() => expect(viewport(wrapper)).toBeTruthy())
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
}
afterEach(() => {
  mounted.forEach(wrapper => wrapper.unmount())
  mounted.length = 0
  document.body.innerHTML = ''
  document.documentElement.dir = 'ltr'
})

describe('DataTable advanced browser behavior', () => {
  it.each(['ltr', 'rtl'])(
    'keeps pinned cells aligned while resizing and scrolling in %s',
    async dir => {
      await page.viewport(900, 700)
      document.documentElement.dir = dir
      const wrapper = render({
        resizable: true,
        selectable: true,
        stickyHeader: true,
        maxHeight: 220,
      })
      await ready(wrapper)
      const first = wrapper.find('[data-hn-cell="name"]').element as HTMLElement
      const last = wrapper.find('[data-hn-cell="id"]').element as HTMLElement
      const start = first.getBoundingClientRect().x,
        end = last.getBoundingClientRect().x
      viewport(wrapper).scrollLeft = dir === 'rtl' ? -160 : 160
      await vi.waitFor(() => expect(Math.abs(viewport(wrapper).scrollLeft)).toBeGreaterThan(0))
      expect(Math.abs(first.getBoundingClientRect().x - start)).toBeLessThanOrEqual(1)
      expect(Math.abs(last.getBoundingClientRect().x - end)).toBeLessThanOrEqual(1)
      const handle = wrapper.find('[data-hn-column="name"] [role="separator"]')
        .element as HTMLElement
      handle.focus()
      await userEvent.keyboard(
        dir === 'rtl' ? '{Shift>}{ArrowLeft}{/Shift}' : '{Shift>}{ArrowRight}{/Shift}',
      )
      await vi.waitFor(() => expect(first.getBoundingClientRect().width).toBeCloseTo(230, 0))
      expect(wrapper.emitted('update:columnWidths')?.at(-1)).toEqual([{ name: 230 }])
      await userEvent.keyboard('{Home}')
      await vi.waitFor(() => expect(first.getBoundingClientRect().width).toBeCloseTo(120, 0))
      await expectNoA11yViolations(wrapper.element as HTMLElement)
    },
  )

  it('fills the remaining table width without leaving an empty strip after fixed columns', async () => {
    const wrapper = render({
      rows: rows.slice(0, 3),
      layout: 'fixed',
      resizable: true,
      columns: [
        { key: 'name', label: 'Name', width: 120 },
        { key: 'count', label: 'Count', width: 80, pin: 'end' },
      ],
    })
    await ready(wrapper)
    const table = wrapper.find('table').element.getBoundingClientRect()
    const last = wrapper
      .findAll('tbody tr')[0]!
      .findAll('td')
      .at(-1)!
      .element.getBoundingClientRect()
    expect(Math.abs(last.right - table.right)).toBeLessThanOrEqual(1)
    expect(table.width).toBeGreaterThan(490)
    expect(viewport(wrapper).scrollWidth).toBe(viewport(wrapper).clientWidth)
  })

  it('commits the last pointer resize even when pointerup arrives before the next frame', async () => {
    const wrapper = render({ resizable: true })
    await ready(wrapper)
    const handle = wrapper.find('[role="separator"]').element
    handle.dispatchEvent(
      new PointerEvent('pointerdown', { bubbles: true, button: 0, clientX: 200 }),
    )
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 260 }))
    window.dispatchEvent(new PointerEvent('pointerup', { clientX: 260 }))
    await vi.waitFor(() =>
      expect(
        wrapper.find('[data-hn-cell="name"]').element.getBoundingClientRect().width,
      ).toBeCloseTo(280, 0),
    )
  })

  it('keeps multilevel headers and the summary pinned in a filled container', async () => {
    const wrapper = render({
      height: 300,
      pagination: true,
      pageSize: 20,
      stickyHeader: true,
      stickyFooter: true,
      columns: [
        {
          key: 'info',
          label: 'Info',
          children: columns.slice(0, 2).map(column => ({ ...column, pin: undefined })),
        },
        { ...columns[2]!, aggregate: 'sum', footer: true },
      ],
    })
    await ready(wrapper)
    const head = wrapper.findAll('thead tr')[1]!.find('th').element as HTMLElement
    const foot = wrapper.find('tfoot td').element as HTMLElement
    const top = head.getBoundingClientRect().top,
      bottom = foot.getBoundingClientRect().bottom
    expect((wrapper.element as HTMLElement).getBoundingClientRect().height).toBe(300)
    viewport(wrapper).scrollTop = 300
    await vi.waitFor(() => expect(viewport(wrapper).scrollTop).toBeGreaterThan(0))
    expect(Math.abs(head.getBoundingClientRect().top - top)).toBeLessThanOrEqual(1)
    expect(Math.abs(foot.getBoundingClientRect().bottom - bottom)).toBeLessThanOrEqual(1)
    await expectNoA11yViolations(wrapper.element as HTMLElement)
  })

  it('windows thousands of rows and measures expanded content without losing the target', async () => {
    await page.viewport(900, 700)
    const data = Array.from({ length: 5000 }, (_, id) => ({ id, name: `Entry ${id}`, count: id }))
    const wrapper = render(
      { rows: data, virtualize: true, expandable: true, stickyHeader: true, height: 300 },
      { expansion: () => h('div', { style: 'height: 180px' }, 'Expanded content') },
    )
    await ready(wrapper)
    expect(wrapper.findAll('tbody [data-hn-row]').length).toBeLessThan(35)
    expect(wrapper.findAll('tbody [data-hn-row]').length).toBeGreaterThan(3)
    api(wrapper).scrollToRow(2500)
    await vi.waitFor(() => expect(wrapper.find('[data-hn-row="number:2500"]').exists()).toBe(true))
    api(wrapper).toggleExpanded(2500)
    await vi.waitFor(() => expect(wrapper.text()).toContain('Expanded content'))
    const target = wrapper.find('[data-hn-row="number:2500"]').element as HTMLElement
    const next = wrapper.find('[data-hn-row="number:2501"]').element as HTMLElement
    await vi.waitFor(() =>
      expect(
        next.getBoundingClientRect().top - target.getBoundingClientRect().bottom,
      ).toBeGreaterThan(180),
    )
    expect(wrapper.findAll('tbody [data-hn-row]').length).toBeLessThan(35)
    api(wrapper).scrollToRow(4999)
    await vi.waitFor(() => expect(wrapper.find('[data-hn-row="number:4999"]').exists()).toBe(true))
    expect(viewport(wrapper).scrollHeight).toBeGreaterThan(100000)
  })

  it('uses the final pointer position for a fast drop and cancels drops outside the table', async () => {
    const wrapper = render({ rows: rows.slice(0, 4), reorderable: true })
    await ready(wrapper)
    const source = wrapper.find('tbody button').element
    const origin = source.getBoundingClientRect(),
      target = wrapper.findAll('tbody tr')[2]!.element.getBoundingClientRect()
    source.dispatchEvent(
      new PointerEvent('pointerdown', {
        bubbles: true,
        button: 0,
        clientX: origin.x + 10,
        clientY: origin.y + 10,
      }),
    )
    window.dispatchEvent(
      new PointerEvent('pointermove', { clientX: target.x + 70, clientY: target.y + 10 }),
    )
    window.dispatchEvent(new PointerEvent('pointerup'))
    expect(wrapper.emitted('rowReorder')?.[0]?.[0]).toMatchObject({ from: 0, to: 2 })
    source.dispatchEvent(
      new PointerEvent('pointerdown', {
        bubbles: true,
        button: 0,
        clientX: origin.x + 10,
        clientY: origin.y + 10,
      }),
    )
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: -100, clientY: -100 }))
    window.dispatchEvent(new PointerEvent('pointerup'))
    expect(wrapper.emitted('rowReorder')).toHaveLength(1)
  })

  it('supports keyboard row and column reordering with stable data and focus', async () => {
    const data = ref(rows.slice(0, 4))
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(DataTable<Item>, {
            rows: data.value,
            columns: columns.map(column => ({ ...column, pin: undefined })),
            rowKey: 'id',
            label: 'Entries',
            reorderable: true,
            reorderColumns: true,
            'onUpdate:rows': value => {
              data.value = value
            },
          }),
      }),
      { attachTo: host() },
    )
    mounted.push(wrapper)
    await ready(wrapper)
    const rowHandle = wrapper.find('tbody button').element as HTMLElement
    rowHandle.focus()
    await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(() => expect(data.value.map(row => row.id)).toEqual([1, 0, 2, 3]))
    expect(document.activeElement).toBe(rowHandle)
    const columnHandle = wrapper.find('[data-hn-column="name"] button').element as HTMLElement
    columnHandle.focus()
    await userEvent.keyboard('{ArrowRight}')
    await vi.waitFor(() =>
      expect(
        wrapper.findAll('[data-hn-column]').map(header => header.attributes('data-hn-column')),
      ).toEqual(['count', 'name', 'id']),
    )
    expect(document.activeElement).toBe(columnHandle)
  })

  it('edits with keyboard controls and keeps action buttons inside a fixed edit column', async () => {
    const wrapper = render({
      rows: rows.slice(0, 2),
      editMode: 'row',
      columns: [
        { key: 'name', label: 'Name', width: 240, editable: true },
        { key: 'count', label: 'Count', width: 180, editable: true },
      ],
    })
    await ready(wrapper)
    await userEvent.click(wrapper.find('tbody button').element)
    await vi.waitFor(() => expect(wrapper.findAll('tbody input')).toHaveLength(2))
    const actions = wrapper.findAll('tbody td')[2]!.element
    for (const button of actions.querySelectorAll('button'))
      expect(button.getBoundingClientRect().right).toBeLessThanOrEqual(
        actions.getBoundingClientRect().right,
      )
    const input = wrapper.find('tbody input').element as HTMLInputElement
    input.focus()
    await userEvent.fill(input, 'Renamed')
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() => expect(wrapper.emitted('edit')).toHaveLength(1))
    expect(wrapper.emitted('edit')?.[0]?.[0]).toMatchObject({ values: { name: 'Renamed' } })
    await wrapper.setProps({ editMode: 'cell' })
    const cell = wrapper.find('[data-hn-cell="name"]').element as HTMLElement
    cell.focus()
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() => expect(wrapper.find('tbody input').exists()).toBe(true))
    await userEvent.click(wrapper.find('tbody input').element)
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(wrapper.find('tbody input').exists()).toBe(false))
  })
})
