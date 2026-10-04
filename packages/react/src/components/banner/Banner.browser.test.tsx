import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { page } from 'vitest/browser'
import type { ReactNode } from 'react'
import { Banner } from './Banner'
import { Link } from '../link/Link'
import { mount as render } from '../../../test/mount'
import '../../../test/browser.css'

let mounted: Array<{ unmount: () => Promise<void> }> = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(async () => {
  for (const w of mounted) await w.unmount()
  mounted = []
})

async function mount(ui: ReactNode, width: string | undefined = '640px') {
  const w = await render(<div style={width ? { width } : undefined}>{ui}</div>)
  mounted.push(w)
  return w
}

const body = '新版本已发布。'

describe('banner · 通栏公告', () => {
  it('正文相对整条居中，关闭钮贴末端，链接继承实底上的字色', async () => {
    await page.viewport(1024, 800)
    const w = await mount(
      <Banner closable>
        <span>新版本已发布。</span>
        <Link href="#">查看说明</Link>
      </Banner>,
    )
    const bar = w.container.querySelector('[data-tone]') as HTMLElement
    const content = bar.firstElementChild as HTMLElement
    const close = w.container.querySelector('button') as HTMLElement
    const link = w.container.querySelector('a') as HTMLElement
    const barRect = bar.getBoundingClientRect()
    const contentRect = content.getBoundingClientRect()
    const closeRect = close.getBoundingClientRect()
    const barCenter = barRect.left + barRect.width / 2
    const contentCenter = contentRect.left + contentRect.width / 2
    expect(Math.abs(contentCenter - barCenter)).toBeLessThan(1)
    expect(barRect.right - closeRect.right).toBeLessThan(16)
    expect(getComputedStyle(link).color).toBe(getComputedStyle(bar).color)
    expect(getComputedStyle(close).color).toBe(getComputedStyle(bar).color)
  })

  it('窄视口:正文靠起始边占满整行、按段落换行,控件仍贴末端', async () => {
    await page.viewport(390, 800)
    try {
      const w = await mount(
        <Banner closable>
          <span>本站将于 3 月 1 日 02:00 至 04:00 停机维护。</span>
          <Link href="#">查看公告</Link>
        </Banner>,
        undefined,
      )
      const bar = w.container.querySelector('[data-tone]') as HTMLElement
      const content = bar.firstElementChild as HTMLElement
      const close = w.container.querySelector('button') as HTMLElement
      const barRect = bar.getBoundingClientRect()
      const contentRect = content.getBoundingClientRect()
      expect(contentRect.left - barRect.left).toBeLessThan(24)
      expect(contentRect.width).toBeGreaterThan(barRect.width * 0.7)
      expect(barRect.right - close.getBoundingClientRect().right).toBeLessThan(16)
      expect(getComputedStyle(content).textAlign).toBe('start')
    } finally {
      await page.viewport(1024, 800)
    }
  })

  it('切到不同 tone 的一条:底色平滑过渡,正文按方向滑出;高度不变', async () => {
    const w = await mount(
      <Banner<{ text: string; tone?: 'warning' }>
        items={[{ text: '一' }, { text: '二', tone: 'warning' }]}
        renderItem={({ item }) => item.text}
      />,
    )
    const bar = w.container.querySelector('[data-tone]') as HTMLElement
    const before = getComputedStyle(bar).backgroundColor
    const height = bar.getBoundingClientRect().height
    const leaving = bar.querySelector('[aria-live] > span') as HTMLElement

    w.container.querySelectorAll('button')[1]!.click()
    let during = before
    await vi.waitFor(() => {
      const translate = getComputedStyle(leaving).translate
      expect(translate).not.toBe('none')
      expect(parseFloat(translate)).toBeLessThan(0)
      during = getComputedStyle(bar).backgroundColor
      expect(during).not.toBe(before)
    })
    await vi.waitFor(() => {
      const after = getComputedStyle(bar).backgroundColor
      expect(after).not.toBe(during)
      expect(bar.textContent).toContain('二')
    })
    expect(bar.getBoundingClientRect().height).toBe(height)
  })

  it('关闭时收合高度并淡出，再从文档移除', async () => {
    const w = await mount(<Banner closable>{body}</Banner>)
    const shell = w.container.querySelector('[data-hn-banner]') as HTMLElement
    const before = shell.offsetHeight
    expect(before).toBeGreaterThan(0)

    w.container.querySelector('button')!.click()
    expect(shell.isConnected).toBe(true)
    await vi.waitFor(() => {
      expect(shell.isConnected).toBe(true)
      expect(shell.offsetHeight).toBeLessThan(before)
      expect(parseFloat(getComputedStyle(shell).opacity)).toBeLessThan(1)
    })
    await vi.waitFor(() => expect(shell.isConnected).toBe(false))
  })
})
