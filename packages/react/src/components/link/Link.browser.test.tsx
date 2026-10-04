import { describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { Link } from './Link'
import { mount } from '../../../test/mount'
import '../../../test/browser.css'

function resolveVar(name: string) {
  const probe = document.createElement('span')
  probe.style.color = `var(${name})`
  document.body.appendChild(probe)
  const color = getComputedStyle(probe).color
  probe.remove()
  return color
}

describe('Link', () => {
  it('默认渲染 a · accent 文字色 · 无下划线,neutral 用 fg', async () => {
    const w = await mount(<Link href="#">进入藏书阁</Link>)
    expect(w.element.tagName).toBe('A')
    expect(getComputedStyle(w.element).color).toBe(resolveVar('--hn-accent-text'))
    expect(getComputedStyle(w.element).textDecorationLine).toBe('none')

    const quiet = await mount(
      <Link tone="neutral" href="#">
        静默导航
      </Link>,
    )
    expect(getComputedStyle(quiet.element).color).toBe(resolveVar('--hn-fg-default'))
  })

  it('hover 字色向墨极压深 —— 与 hn-link 同一套墨', async () => {
    const w = await mount(<Link href="#">悬停</Link>)
    const el = w.element
    const rest = getComputedStyle(el).color

    await userEvent.hover(el)
    await vi.waitFor(() => expect(getComputedStyle(el).color).not.toBe(rest))
    const parse = (c: string) => c.match(/[\d.]+/g)!.map(Number)
    const [r1, g1, b1] = parse(rest)
    const [r2, g2, b2] = parse(getComputedStyle(el).color)
    expect(r2! + g2! + b2!).toBeLessThan(r1! + g1! + b1!)
  })

  it('underline 是静态身份标识:40% 半透明线,hover 转实色', async () => {
    const w = await mount(
      <Link underline href="#">
        正文里的链接
      </Link>,
    )
    const el = w.element
    const style = getComputedStyle(el)
    expect(style.textDecorationLine).toBe('underline')
    expect(style.textDecorationColor).not.toBe(style.color)

    await userEvent.hover(el)
    await vi.waitFor(() =>
      expect(getComputedStyle(el).textDecorationColor).toBe(getComputedStyle(el).color),
    )
  })

  it('Tab 可达并得到焦点环', async () => {
    const w = await mount(<Link href="#">键盘</Link>)
    await userEvent.tab()
    expect(document.activeElement).toBe(w.element)
    expect(getComputedStyle(w.element).outlineWidth).not.toBe('0px')
  })
})
