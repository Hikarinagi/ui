import { afterEach, describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { createSSRApp, h, nextTick, type App } from 'vue'
import { renderToString } from 'vue/server-renderer'
import DataTable from './DataTable.vue'
import { allocateWidths } from './column-sizing'
import type { DataTableColumn } from './types'
import '../../../test/browser.css'

type Row = { id: number; name: string; state: string; count: number; owner: string }
const rows: Row[] = [{ id: 1, name: 'Name', state: 'Ready', count: 2, owner: 'Owner' }]
const columns: DataTableColumn<Row>[] = [
  { key: 'id', label: 'ID', width: 56, minWidth: 48, pin: 'start' },
  { key: 'name', label: 'Name', width: 224, maxWidth: 264 },
  { key: 'state', label: 'State', width: 160, maxWidth: 360 },
  { key: 'count', label: 'Count', width: 96, minWidth: 80, maxWidth: 296 },
  { key: 'owner', label: 'Owner', width: 160, maxWidth: 360 },
]
const apps: App[] = []
afterEach(() => {
  apps.splice(0).forEach(app => app.unmount())
  document.body.innerHTML = ''
  document.documentElement.dir = 'ltr'
})

const frame = () => new Promise(resolve => requestAnimationFrame(resolve))
function geometry(host: HTMLElement) {
  return [host.querySelector('table')!, ...host.querySelectorAll('thead [data-hn-column]')].map(
    element => element.getBoundingClientRect().width,
  )
}

function expected(width: number, overrides: Record<string, number>, controls: number) {
  const sizes = Object.values(allocateWidths(columns, overrides, width - 2 - controls))
  return [sizes.reduce((sum, size) => sum + size, controls), ...sizes]
}

function same(actual: number[], target: number[]) {
  expect(actual).toHaveLength(target.length)
  actual.forEach((value, index) => expect(Math.abs(value - target[index]!)).toBeLessThan(0.2))
}

describe('DataTable initial column geometry', () => {
  it.each<{ width: number; controls: boolean; overrides: Record<string, number>; dir: string }>([
    { width: 1102, controls: false, overrides: {}, dir: 'ltr' },
    { width: 480, controls: true, overrides: {}, dir: 'ltr' },
    { width: 1800, controls: false, overrides: {}, dir: 'rtl' },
    { width: 1102, controls: true, overrides: { name: 240 }, dir: 'rtl' },
  ])('keeps SSR and hydrated widths equal ($width px, $dir, controls=$controls)', async fixture => {
    await page.viewport(2000, 900)
    document.documentElement.dir = fixture.dir
    const host = document.createElement('div')
    host.style.width = `${fixture.width}px`
    document.body.append(host)
    const options = {
      render: () =>
        h(DataTable<Row>, {
          rows,
          columns,
          rowKey: 'id',
          resizable: true,
          selectable: fixture.controls,
          editMode: fixture.controls ? 'row' : undefined,
          columnWidths: fixture.overrides,
        }),
    }
    host.innerHTML = await renderToString(createSSRApp(options))
    await frame()
    const before = geometry(host)
    const controls = fixture.controls ? 120 : 0
    same(before, expected(fixture.width, fixture.overrides, controls))
    const app = createSSRApp(options)
    apps.push(app)
    app.mount(host)
    await nextTick()
    same(geometry(host), before)
    await vi.waitFor(() =>
      expect(host.querySelector('[data-overlayscrollbars-viewport]')).not.toBeNull(),
    )
    await frame()
    await frame()
    same(geometry(host), before)
    host.style.width = '1200px'
    await frame()
    same(geometry(host), expected(1200, fixture.overrides, controls))
  })
})
