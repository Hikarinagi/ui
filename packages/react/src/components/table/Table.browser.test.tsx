import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import type { ReactNode } from 'react'
import { Table } from './Table'
import { TableHeader } from './TableHeader'
import { TableBody } from './TableBody'
import { TableRow } from './TableRow'
import { TableHead } from './TableHead'
import { TableCell } from './TableCell'
import { Prose } from '../prose/Prose'
import '../../../test/browser.css'

let mounted: Array<{ unmount: () => void | Promise<void> }> = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(async () => {
  for (const screen of mounted) await screen.unmount()
  mounted = []
  document.documentElement.dir = 'ltr'
})

function attach(width = 640) {
  const host = document.createElement('div')
  host.style.cssText = `width: ${width}px`
  document.body.appendChild(host)
  return host
}

async function mount(ui: ReactNode, host = attach()) {
  const screen = await render(ui, { container: host })
  mounted.push(screen)
  return host.firstElementChild as HTMLElement
}

function harness(width = 640, cols = 3) {
  return mount(
    <Table caption="对照">
      <TableHeader>
        <TableRow>
          {Array.from({ length: cols }, (_, i) => (
            <TableHead key={i}>{`列${i + 1}`}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          {Array.from({ length: cols }, (_, i) => (
            <TableCell key={i}>{`第一行数据${i + 1}`}</TableCell>
          ))}
        </TableRow>
        <TableRow>
          {Array.from({ length: cols }, (_, i) => (
            <TableCell key={i}>{`第二行数据${i + 1}`}</TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>,
    attach(width),
  )
}

describe('table · 样式表族', () => {
  it.each(['ltr', 'rtl'])('preserves explicit header alignment in %s', async dir => {
    document.documentElement.dir = dir
    const aligns = ['start', 'center', 'end'] as const
    const wrapper = await mount(
      <Table>
        <TableHeader>
          <TableRow>
            {aligns.map(align => (
              <TableHead key={align} align={align}>
                {align}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            {aligns.map(align => (
              <TableCell key={align} align={align}>
                {align}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>,
    )
    expect(
      [...wrapper.querySelectorAll('th')].map(cell => getComputedStyle(cell).textAlign),
    ).toEqual(aligns)
    expect(
      [...wrapper.querySelectorAll('td')].map(cell => getComputedStyle(cell).textAlign),
    ).toEqual(aligns)
  })

  it('发丝线分隔、无斑马纹;表头 muted 加重;数字栏 tabular-nums', async () => {
    const w = await harness()
    const rows = w.querySelectorAll('tbody tr')
    const bg = (el: Element) => getComputedStyle(el).backgroundColor
    expect(bg(rows[0]!)).toBe(bg(rows[1]!))

    const td = w.querySelector('td')!
    expect(getComputedStyle(td).borderBottomWidth).toBe('1px')

    const th = w.querySelector('th')!
    expect(getComputedStyle(th).fontWeight).toBe('500')
    expect(getComputedStyle(th).color).not.toBe(getComputedStyle(td).color)

    expect(getComputedStyle(w.querySelector('table')!).fontVariantNumeric).toContain('tabular-nums')
  })

  it('primary:surface 面板 + 表头 subtle 底 + 末行无下线;secondary:inset 扁平无框无影', async () => {
    const w = await harness()
    const wrapper = w
    const wcs = getComputedStyle(wrapper)
    expect(parseFloat(wcs.borderTopLeftRadius)).toBeGreaterThan(0)
    expect(wcs.borderTopWidth).toBe('1px')
    expect(wcs.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')

    const headCell = w.querySelector('thead th')!
    expect(getComputedStyle(headCell).backgroundColor).not.toBe(wcs.backgroundColor)

    const lastTd = [...w.querySelectorAll('tbody tr')].at(-1)!.querySelector('td')!
    expect(getComputedStyle(lastTd).borderBottomWidth).toBe('0px')

    const secondary = await mount(
      <Table variant="secondary">
        <TableHeader>
          <TableRow>
            <TableHead>列</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>值</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )
    const scs = getComputedStyle(secondary)
    expect(scs.borderTopWidth).toBe('0px')
    expect(scs.boxShadow).toBe('none')
    expect(scs.backgroundColor).toBe('rgba(0, 0, 0, 0)')
    const secHead = getComputedStyle(secondary.querySelector('thead th')!)
    expect(secHead.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(parseFloat(secHead.borderStartStartRadius)).toBeGreaterThan(0)
  })

  it('行 hover 走薄墨:tbody 行挂 state-layer,悬停浮现;表头行不挂', async () => {
    const w = await harness()
    const row = w.querySelector('tbody tr') as HTMLElement
    expect(getComputedStyle(row, '::after').content).toBe('""')
    expect(getComputedStyle(row, '::after').opacity).toBe('0')

    row.setAttribute('data-highlighted', '')
    await vi.waitFor(() =>
      expect(Number(getComputedStyle(row, '::after').opacity)).toBeGreaterThan(0),
    )

    const headRow = w.querySelector('thead tr') as HTMLElement
    expect(getComputedStyle(headRow, '::after').content).toBe('none')
  })

  it('吸顶表头:容器内纵滚时 th 钉在顶缘,自带实底', async () => {
    const w = await mount(
      <Table stickyHeader className="max-h-40">
        <TableHeader>
          <TableRow>
            <TableHead>列头</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 20 }, (_, i) => (
            <TableRow key={i}>
              <TableCell>{`行 ${i + 1}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>,
      attach(300),
    )
    await vi.waitFor(() =>
      expect(w.querySelector('[data-overlayscrollbars-viewport]')).not.toBeNull(),
    )
    const viewport = w.querySelector('[data-overlayscrollbars-viewport]') as HTMLElement
    const th = w.querySelector('th') as HTMLElement
    expect(getComputedStyle(th).position).toBe('sticky')
    expect(getComputedStyle(th).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')

    const topBefore = th.getBoundingClientRect().top
    viewport.scrollTop = 200
    viewport.dispatchEvent(new Event('scroll'))
    await vi.waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(0))
    expect(Math.abs(th.getBoundingClientRect().top - topBefore)).toBeLessThan(2)
  })

  it('吸首列:横滚时 sticky 列钉在起始缘,分界线与实底齐备', async () => {
    const w = await mount(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell sticky className="min-w-28">
              钉住列
            </TableCell>
            {Array.from({ length: 8 }, (_, i) => (
              <TableCell key={i} className="min-w-36">{`列 ${i + 1}`}</TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>,
      attach(320),
    )
    await vi.waitFor(() =>
      expect(w.querySelector('[data-overlayscrollbars-viewport]')).not.toBeNull(),
    )
    const viewport = w.querySelector('[data-overlayscrollbars-viewport]') as HTMLElement
    const cell = w.querySelector('td') as HTMLElement
    expect(getComputedStyle(cell).position).toBe('sticky')
    expect(getComputedStyle(cell).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(getComputedStyle(cell).borderInlineEndWidth).toBe('1px')

    const leftBefore = cell.getBoundingClientRect().left
    viewport.scrollLeft = 180
    viewport.dispatchEvent(new Event('scroll'))
    await vi.waitFor(() => expect(viewport.scrollLeft).toBeGreaterThan(0))
    expect(Math.abs(cell.getBoundingClientRect().left - leftBefore)).toBeLessThan(2)
  })

  it('行高吃 --hn-row-h,compact 密度自动收紧', async () => {
    const w = await harness()
    const td = w.querySelector('td') as HTMLElement
    expect(td.offsetHeight).toBe(44)

    const host = attach()
    host.setAttribute('data-density', 'compact')
    const c = await mount(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>紧凑</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
      host,
    )
    expect((c.querySelector('td') as HTMLElement).offsetHeight).toBe(34)
  })

  it('组件表与 prose 裸表同源:关键计算样式一致', async () => {
    const w = await harness()
    const p = await mount(
      <Prose>
        <table>
          <thead>
            <tr>
              <th>列</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>值</td>
            </tr>
          </tbody>
        </table>
      </Prose>,
    )

    const ours = getComputedStyle(w.querySelector('table')!)
    const prose = getComputedStyle(p.querySelector('table')!)
    for (const key of ['fontSize', 'borderCollapse', 'fontVariantNumeric'] as const) {
      expect(ours[key], key).toBe(prose[key])
    }
    const ourTh = getComputedStyle(w.querySelector('th')!)
    const proseTh = getComputedStyle(p.querySelector('th')!)
    for (const key of ['color', 'fontWeight', 'textAlign', 'borderBottomWidth'] as const) {
      expect(ourTh[key], key).toBe(proseTh[key])
    }
  })

  it('宽表在窄容器里由 ScrollArea 接管横滚,页面不横向溢出', async () => {
    const w = await mount(
      <Table>
        <TableBody>
          <TableRow>
            {Array.from({ length: 12 }, (_, i) => (
              <TableCell
                key={i}
                className="whitespace-nowrap"
              >{`很宽很宽的单元格内容${i}`}</TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>,
      attach(260),
    )

    await vi.waitFor(() => {
      const viewport = w.querySelector('[data-overlayscrollbars-viewport]') as HTMLElement
      expect(viewport).not.toBeNull()
      expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth)
    })
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth + 1,
    )
  })
})
