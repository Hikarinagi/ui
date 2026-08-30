import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import Table from './Table.vue'
import TableHeader from './TableHeader.vue'
import TableBody from './TableBody.vue'
import TableRow from './TableRow.vue'
import TableHead from './TableHead.vue'
import TableCell from './TableCell.vue'
import Prose from '../prose/Prose.vue'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

function attach(width = 640) {
  const host = document.createElement('div')
  host.style.cssText = `width: ${width}px`
  document.body.appendChild(host)
  return host
}

function harness(width = 640, cols = 3) {
  const w = mount(
    defineComponent({
      setup: () => () =>
        h(Table, { caption: '对照' }, () => [
          h(TableHeader, () => [
            h(TableRow, () =>
              Array.from({ length: cols }, (_, i) => h(TableHead, () => `列${i + 1}`)),
            ),
          ]),
          h(TableBody, () => [
            h(TableRow, () =>
              Array.from({ length: cols }, (_, i) => h(TableCell, () => `第一行数据${i + 1}`)),
            ),
            h(TableRow, () =>
              Array.from({ length: cols }, (_, i) => h(TableCell, () => `第二行数据${i + 1}`)),
            ),
          ]),
        ]),
    }),
    { attachTo: attach(width) },
  )
  mounted.push(w)
  return w
}

describe('table · 样式表族', () => {
  it('发丝线分隔、无斑马纹;表头 muted 加重;数字栏 tabular-nums', () => {
    const w = harness()
    const rows = w.findAll('tbody tr')
    const bg = (el: Element) => getComputedStyle(el).backgroundColor
    expect(bg(rows[0]!.element)).toBe(bg(rows[1]!.element))

    const td = w.find('td').element
    expect(getComputedStyle(td).borderBottomWidth).toBe('1px')

    const th = w.find('th').element
    expect(getComputedStyle(th).fontWeight).toBe('500')
    expect(getComputedStyle(th).color).not.toBe(getComputedStyle(td).color)

    expect(getComputedStyle(w.find('table').element).fontVariantNumeric).toContain('tabular-nums')
  })

  it('primary:surface 面板 + 表头 subtle 底 + 末行无下线;secondary:inset 扁平无框无影', () => {
    const w = harness()
    const wrapper = w.element as HTMLElement
    const wcs = getComputedStyle(wrapper)
    expect(parseFloat(wcs.borderTopLeftRadius)).toBeGreaterThan(0)
    expect(wcs.borderTopWidth).toBe('1px')
    expect(wcs.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')

    const headCell = w.find('thead th').element
    expect(getComputedStyle(headCell).backgroundColor).not.toBe(wcs.backgroundColor)

    const lastTd = w.findAll('tbody tr').at(-1)!.find('td').element
    expect(getComputedStyle(lastTd).borderBottomWidth).toBe('0px')

    const secondary = mount(
      defineComponent({
        setup: () => () =>
          h(Table, { variant: 'secondary' }, () => [
            h(TableHeader, () => [h(TableRow, () => [h(TableHead, () => '列')])]),
            h(TableBody, () => [h(TableRow, () => [h(TableCell, () => '值')])]),
          ]),
      }),
      { attachTo: attach() },
    )
    mounted.push(secondary)
    const scs = getComputedStyle(secondary.element as HTMLElement)
    expect(scs.borderTopWidth).toBe('0px')
    expect(scs.boxShadow).toBe('none')
    expect(scs.backgroundColor).toBe('rgba(0, 0, 0, 0)')
    const secHead = getComputedStyle(secondary.find('thead th').element)
    expect(secHead.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(parseFloat(secHead.borderStartStartRadius)).toBeGreaterThan(0)
  })

  it('行 hover 走薄墨:tbody 行挂 state-layer,悬停浮现;表头行不挂', async () => {
    const w = harness()
    const row = w.find('tbody tr').element as HTMLElement
    expect(getComputedStyle(row, '::after').content).toBe('""')
    expect(getComputedStyle(row, '::after').opacity).toBe('0')

    row.setAttribute('data-highlighted', '')
    await vi.waitFor(() =>
      expect(Number(getComputedStyle(row, '::after').opacity)).toBeGreaterThan(0),
    )

    const headRow = w.find('thead tr').element as HTMLElement
    expect(getComputedStyle(headRow, '::after').content).toBe('none')
  })

  it('吸顶表头:容器内纵滚时 th 钉在顶缘,自带实底', async () => {
    const w = mount(
      defineComponent({
        setup: () => () =>
          h(Table, { stickyHeader: true, class: 'max-h-40' }, () => [
            h(TableHeader, () => [h(TableRow, () => [h(TableHead, () => '列头')])]),
            h(TableBody, () =>
              Array.from({ length: 20 }, (_, i) =>
                h(TableRow, { key: i }, () => [h(TableCell, () => `行 ${i + 1}`)]),
              ),
            ),
          ]),
      }),
      { attachTo: attach(300) },
    )
    mounted.push(w)
    await vi.waitFor(() =>
      expect(w.element.querySelector('[data-overlayscrollbars-viewport]')).not.toBeNull(),
    )
    const viewport = w.element.querySelector('[data-overlayscrollbars-viewport]') as HTMLElement
    const th = w.find('th').element as HTMLElement
    expect(getComputedStyle(th).position).toBe('sticky')
    expect(getComputedStyle(th).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')

    const topBefore = th.getBoundingClientRect().top
    viewport.scrollTop = 200
    viewport.dispatchEvent(new Event('scroll'))
    await vi.waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(0))
    expect(Math.abs(th.getBoundingClientRect().top - topBefore)).toBeLessThan(2)
  })

  it('吸首列:横滚时 sticky 列钉在起始缘,分界线与实底齐备', async () => {
    const w = mount(
      defineComponent({
        setup: () => () =>
          h(Table, null, () => [
            h(TableBody, () => [
              h(TableRow, () => [
                h(TableCell, { sticky: true, class: 'min-w-28' }, () => '钉住列'),
                ...Array.from({ length: 8 }, (_, i) =>
                  h(TableCell, { class: 'min-w-36' }, () => `列 ${i + 1}`),
                ),
              ]),
            ]),
          ]),
      }),
      { attachTo: attach(320) },
    )
    mounted.push(w)
    await vi.waitFor(() =>
      expect(w.element.querySelector('[data-overlayscrollbars-viewport]')).not.toBeNull(),
    )
    const viewport = w.element.querySelector('[data-overlayscrollbars-viewport]') as HTMLElement
    const cell = w.find('td').element as HTMLElement
    expect(getComputedStyle(cell).position).toBe('sticky')
    expect(getComputedStyle(cell).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(getComputedStyle(cell).borderInlineEndWidth).toBe('1px')

    const leftBefore = cell.getBoundingClientRect().left
    viewport.scrollLeft = 180
    viewport.dispatchEvent(new Event('scroll'))
    await vi.waitFor(() => expect(viewport.scrollLeft).toBeGreaterThan(0))
    expect(Math.abs(cell.getBoundingClientRect().left - leftBefore)).toBeLessThan(2)
  })

  it('行高吃 --hn-row-h,compact 密度自动收紧', () => {
    const w = harness()
    const td = w.find('td').element as HTMLElement
    expect(td.offsetHeight).toBe(44)

    const host = attach()
    host.setAttribute('data-density', 'compact')
    const c = mount(
      defineComponent({
        setup: () => () =>
          h(Table, null, () => [
            h(TableBody, () => [h(TableRow, () => [h(TableCell, () => '紧凑')])]),
          ]),
      }),
      { attachTo: host },
    )
    mounted.push(c)
    expect((c.find('td').element as HTMLElement).offsetHeight).toBe(34)
  })

  it('组件表与 prose 裸表同源:关键计算样式一致', () => {
    const w = harness()
    const host = attach()
    const p = mount(Prose, {
      slots: {
        default: () =>
          h('table', [
            h('thead', [h('tr', [h('th', '列')])]),
            h('tbody', [h('tr', [h('td', '值')])]),
          ]),
      },
      attachTo: host,
    })
    mounted.push(p)

    const ours = getComputedStyle(w.find('table').element)
    const prose = getComputedStyle(p.find('table').element)
    for (const key of ['fontSize', 'borderCollapse', 'fontVariantNumeric'] as const) {
      expect(ours[key], key).toBe(prose[key])
    }
    const ourTh = getComputedStyle(w.find('th').element)
    const proseTh = getComputedStyle(p.find('th').element)
    for (const key of ['color', 'fontWeight', 'textAlign', 'borderBottomWidth'] as const) {
      expect(ourTh[key], key).toBe(proseTh[key])
    }
  })

  it('宽表在窄容器里由 ScrollArea 接管横滚,页面不横向溢出', async () => {
    const w = mount(
      defineComponent({
        setup: () => () =>
          h(Table, null, () => [
            h(TableBody, () => [
              h(TableRow, () =>
                Array.from({ length: 12 }, (_, i) =>
                  h(TableCell, { class: 'whitespace-nowrap' }, () => `很宽很宽的单元格内容${i}`),
                ),
              ),
            ]),
          ]),
      }),
      { attachTo: attach(260) },
    )
    mounted.push(w)

    await vi.waitFor(() => {
      const viewport = w.element.querySelector('[data-overlayscrollbars-viewport]') as HTMLElement
      expect(viewport).not.toBeNull()
      expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth)
    })
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth + 1,
    )
  })
})
