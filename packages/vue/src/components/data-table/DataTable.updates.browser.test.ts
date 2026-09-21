import { afterEach, describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h } from 'vue'
import DataTable from './DataTable.vue'
import type { DataTableColumn } from './types'
import '../../../test/browser.css'

type Row = { id: number; label: string; count: number }
const rows: Row[] = Array.from({ length: 25 }, (_, id) => ({ id, label: `Entry ${id}`, count: id }))
const columns: DataTableColumn<Row>[] = [
  { key: 'id', label: 'ID', width: 80, pin: 'start' },
  { key: 'label', label: 'Label', width: 180, minWidth: 100, maxWidth: 900, truncate: true },
  { key: 'count', label: 'Count', width: 120, minWidth: 80, maxWidth: 900 },
]
const mounted: VueWrapper[] = []
const frames = () =>
  new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))

afterEach(() => {
  mounted.splice(0).forEach(wrapper => wrapper.unmount())
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

describe('DataTable container resizing', () => {
  it.each([false, true])(
    'resizes columns without rerendering body slots (resizable=%s)',
    async resizable => {
      await page.viewport(1300, 900)
      const host = document.createElement('div')
      host.style.width = '800px'
      document.body.append(host)
      const cell = vi.fn(({ value }: { value: unknown }) => h('span', String(value)))
      const wrapper = mount(DataTable<Row>, {
        props: { rows, columns, rowKey: 'id', resizable, maxHeight: 300 },
        slots: { cell },
        attachTo: host,
      })
      mounted.push(wrapper)
      await vi.waitFor(() =>
        expect(host.querySelector('[data-overlayscrollbars-viewport]')).not.toBeNull(),
      )
      await frames()
      const area = host.querySelector<HTMLElement>('[data-overlayscrollbars-viewport]')!
      const target = host.querySelector<HTMLElement>('thead [data-hn-column="label"]')!
      const readHeader = vi.spyOn(target, 'getBoundingClientRect')
      cell.mockClear()
      const widths: number[] = []
      for (const width of [850, 900, 1000, 1100]) {
        host.style.width = `${width}px`
        await frames()
        widths.push(target.offsetWidth)
        expect(host.querySelector('table')!.getBoundingClientRect().width).toBeCloseTo(
          area.clientWidth,
          0,
        )
        expect(host.querySelector<HTMLElement>('tbody [data-hn-cell="id"]')!.offsetWidth).toBe(80)
      }
      expect(widths.every((width, index) => index === 0 || width > widths[index - 1]!)).toBe(true)
      expect(cell).not.toHaveBeenCalled()
      if (!resizable) expect(readHeader).not.toHaveBeenCalled()
    },
  )

  it('keeps column geometry independent of a query container inside a body cell', async () => {
    const host = document.createElement('div')
    host.style.width = '900px'
    document.body.append(host)
    const wrapper = mount(DataTable<Row>, {
      props: { rows: rows.slice(0, 1), columns, rowKey: 'id' },
      slots: {
        'cell-label': () =>
          h('div', { style: 'container-type:inline-size;width:60px' }, [
            h(DataTable<Row>, {
              rows: rows.slice(0, 1),
              columns: [{ key: 'label', label: 'Nested', width: 48, minWidth: 20, maxWidth: 60 }],
              rowKey: 'id',
            }),
          ]),
      },
      attachTo: host,
    })
    mounted.push(wrapper)
    await frames()
    const tables = host.querySelectorAll('table')
    expect(tables).toHaveLength(2)
    expect(tables[0]!.getBoundingClientRect().width).toBeCloseTo(898, 0)
    expect(tables[1]!.getBoundingClientRect().width).toBeCloseTo(58, 0)
    host.style.width = '1100px'
    await frames()
    expect(tables[0]!.getBoundingClientRect().width).toBeCloseTo(1098, 0)
    expect(tables[1]!.getBoundingClientRect().width).toBeCloseTo(58, 0)
  })
})
