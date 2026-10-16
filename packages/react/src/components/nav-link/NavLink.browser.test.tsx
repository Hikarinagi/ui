import { describe, expect, it, beforeEach, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { NavLink } from './NavLink'
import { mount } from '../../../test/mount'
import '../../../test/browser.css'

beforeEach(async () => {
  document.body.innerHTML = ''
  const park = document.createElement('div')
  park.style.cssText = 'position: fixed; bottom: 0; right: 0; width: 8px; height: 8px'
  document.body.appendChild(park)
  await userEvent.hover(park)
})

describe('选中墨真实上屏', () => {
  it('active 的状态层 ::after 以 accent 色显影到选中档,静止为 0', async () => {
    const rest = await mount(<NavLink href="/a">静止</NavLink>)
    const active = await mount(
      <NavLink active href="/b">
        选中
      </NavLink>,
    )

    await vi.waitFor(() => {
      expect(getComputedStyle(active.container.querySelector('a')!, '::after').opacity).toBe('0.14')
    })
    expect(getComputedStyle(rest.container.querySelector('a')!, '::after').opacity).toBe('0')

    const probe = document.createElement('span')
    probe.style.color = 'var(--hn-accent)'
    document.body.appendChild(probe)
    expect(getComputedStyle(active.container.querySelector('a')!, '::after').backgroundColor).toBe(
      getComputedStyle(probe).color,
    )
  })

  it('退选的墨全程保持 accent 淡出,色相交接推迟到不可见之后', async () => {
    const probe = document.createElement('span')
    probe.style.color = 'var(--hn-accent)'
    document.body.appendChild(probe)
    const accent = getComputedStyle(probe).color

    const w = await mount(
      <NavLink active href="/x">
        将退选
      </NavLink>,
    )
    const link = () => w.container.querySelector('a')!
    await vi.waitFor(() => expect(getComputedStyle(link(), '::after').opacity).toBe('0.14'))

    await w.rerender(
      <NavLink active={false} href="/x">
        将退选
      </NavLink>,
    )
    await new Promise(resolve => setTimeout(resolve, 80))
    const mid = getComputedStyle(link(), '::after')
    expect(parseFloat(mid.opacity)).toBeLessThan(0.14)
    expect(mid.backgroundColor).toBe(accent)

    await vi.waitFor(() => {
      const s = getComputedStyle(link(), '::after')
      expect(s.opacity).toBe('0')
      expect(s.backgroundColor).not.toBe(accent)
    })
  })

  it('选中项上的 hover 墨是叠加不是替换:0.14 + 0.06 = 0.2,对比只升不降', async () => {
    const active = await mount(
      <NavLink active href="/b">
        选中
      </NavLink>,
    )
    await userEvent.hover(active.container.querySelector('a')!)
    await vi.waitFor(() => {
      expect(getComputedStyle(active.container.querySelector('a')!, '::after').opacity).toBe('0.2')
    })
  })
})

describe('长标题', () => {
  const title = '第十二章 一个很长很长、放不进面板的章节标题'

  it('在横排面板里截断标题，页数留在面板内', async () => {
    await mount(
      <div data-panel="" style={{ display: 'flex', alignItems: 'center', width: '200px' }}>
        <NavLink href="#">{title}</NavLink>
        <span data-count="" style={{ flexShrink: 0 }}>
          12 页
        </span>
      </div>,
    )
    const panel = document.querySelector('[data-panel]')!.getBoundingClientRect()
    const count = document.querySelector('[data-count]')!.getBoundingClientRect()
    const label = document.querySelector<HTMLElement>('[data-hn-label]')!
    expect(count.right).toBeLessThanOrEqual(panel.right)
    expect(label.getBoundingClientRect().right).toBeLessThanOrEqual(count.left)
    expect(label.scrollWidth).toBeGreaterThan(label.clientWidth)
    expect(getComputedStyle(label).textOverflow).toBe('ellipsis')
  })

  it('在竖排列表里截断标题，不溢出链接', async () => {
    await mount(
      <nav style={{ display: 'flex', flexDirection: 'column', width: '160px' }}>
        <NavLink href="#">{title}</NavLink>
      </nav>,
    )
    const link = document.querySelector('a')!.getBoundingClientRect()
    const label = document.querySelector<HTMLElement>('[data-hn-label]')!
    expect(link.width).toBe(160)
    expect(label.getBoundingClientRect().right).toBeLessThanOrEqual(link.right)
    expect(label.scrollWidth).toBeGreaterThan(label.clientWidth)
  })

  it('trailing 里的页数留在链接内，标题截断', async () => {
    await mount(
      <div style={{ width: '200px' }}>
        <NavLink href="#" trailing={<span data-count="">12 页</span>}>
          {title}
        </NavLink>
      </div>,
    )
    const link = document.querySelector('a')!.getBoundingClientRect()
    const count = document.querySelector('[data-count]')!.getBoundingClientRect()
    const label = document.querySelector<HTMLElement>('[data-hn-label]')!
    expect(link.width).toBe(200)
    expect(count.width).toBeGreaterThan(0)
    expect(count.right).toBeLessThanOrEqual(link.right)
    expect(label.getBoundingClientRect().right).toBeLessThanOrEqual(count.left)
    expect(label.scrollWidth).toBeGreaterThan(label.clientWidth)
  })

  it('标题较短时 trailing 贴在行末', async () => {
    await mount(
      <div style={{ width: '200px' }}>
        <NavLink href="#" trailing={<span data-count="">3 页</span>}>
          序章
        </NavLink>
      </div>,
    )
    const link = document.querySelector('a')!
    const count = document.querySelector('[data-count]')!.getBoundingClientRect()
    const end =
      link.getBoundingClientRect().right - Number.parseFloat(getComputedStyle(link).paddingRight)
    expect(Math.abs(count.right - end)).toBeLessThan(1)
  })
})
