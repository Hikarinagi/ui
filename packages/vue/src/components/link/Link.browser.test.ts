import { describe, expect, it, vi, beforeEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount } from '@vue/test-utils'
import Link from './Link.vue'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

function attach() {
  const host = document.createElement('div')
  document.body.appendChild(host)
  return host
}

function resolveVar(name: string) {
  const probe = document.createElement('span')
  probe.style.color = `var(${name})`
  document.body.appendChild(probe)
  return getComputedStyle(probe).color
}

describe('Link', () => {
  it('默认渲染 a · accent 文字色 · 无下划线,neutral 用 fg', async () => {
    const w = mount(Link, {
      attrs: { href: '#' },
      slots: { default: () => '进入藏书阁' },
      attachTo: attach(),
    })
    expect(w.element.tagName).toBe('A')
    expect(getComputedStyle(w.element as HTMLElement).color).toBe(resolveVar('--hn-accent-text'))
    expect(getComputedStyle(w.element as HTMLElement).textDecorationLine).toBe('none')

    const quiet = mount(Link, {
      props: { tone: 'neutral' },
      attrs: { href: '#' },
      slots: { default: () => '静默导航' },
      attachTo: attach(),
    })
    expect(getComputedStyle(quiet.element as HTMLElement).color).toBe(resolveVar('--hn-fg-default'))
  })

  it('hover 字色向墨极压深 —— 与 hn-link 同一套墨', async () => {
    const w = mount(Link, {
      attrs: { href: '#' },
      slots: { default: () => '悬停' },
      attachTo: attach(),
    })
    const el = w.element as HTMLElement
    const rest = getComputedStyle(el).color

    await userEvent.hover(el)
    await vi.waitFor(() => expect(getComputedStyle(el).color).not.toBe(rest))
    const parse = (c: string) => c.match(/[\d.]+/g)!.map(Number)
    const [r1, g1, b1] = parse(rest)
    const [r2, g2, b2] = parse(getComputedStyle(el).color)
    expect(r2! + g2! + b2!).toBeLessThan(r1! + g1! + b1!)
  })

  it('underline 是静态身份标识:40% 半透明线,hover 转实色', async () => {
    const w = mount(Link, {
      props: { underline: true },
      attrs: { href: '#' },
      slots: { default: () => '正文里的链接' },
      attachTo: attach(),
    })
    const el = w.element as HTMLElement
    const style = getComputedStyle(el)
    expect(style.textDecorationLine).toBe('underline')
    expect(style.textDecorationColor).not.toBe(style.color)

    await userEvent.hover(el)
    await vi.waitFor(() =>
      expect(getComputedStyle(el).textDecorationColor).toBe(getComputedStyle(el).color),
    )
  })

  it('Tab 可达并得到焦点环', async () => {
    const w = mount(Link, {
      attrs: { href: '#' },
      slots: { default: () => '键盘' },
      attachTo: attach(),
    })
    await userEvent.tab()
    expect(document.activeElement).toBe(w.element)
    expect(getComputedStyle(w.element as HTMLElement).outlineWidth).not.toBe('0px')
  })
})
