import { describe, expect, it, vi, beforeEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount } from '@vue/test-utils'
import Button from './Button.vue'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

function attach() {
  const host = document.createElement('div')
  document.body.appendChild(host)
  return host
}

describe('键盘可达性', () => {
  it('Tab 可聚焦,并得到可见焦点环', async () => {
    const w = mount(Button, { slots: { default: () => '确定' }, attachTo: attach() })
    await userEvent.tab()

    expect(document.activeElement).toBe(w.element)
    const outline = getComputedStyle(w.element as HTMLElement).outlineWidth
    expect(outline).not.toBe('0px')
  })

  it('Enter 与 Space 都能激活', async () => {
    const onClick = vi.fn()
    mount(Button, { props: { onClick }, slots: { default: () => '激活' }, attachTo: attach() })

    await userEvent.tab()
    await userEvent.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledTimes(1)

    await userEvent.keyboard(' ')
    expect(onClick).toHaveBeenCalledTimes(2)
  })

  it('disabled 的原生按钮不进入 tab 序列', async () => {
    const skipped = mount(Button, {
      props: { disabled: true },
      slots: { default: () => '禁用' },
      attachTo: attach(),
    })
    const reachable = mount(Button, { slots: { default: () => '可用' }, attachTo: attach() })

    await userEvent.tab()
    expect(document.activeElement).not.toBe(skipped.element)
    expect(document.activeElement).toBe(reachable.element)
  })

  it('as="a" 且禁用时同样跳过', async () => {
    const skipped = mount(Button, {
      props: { as: 'a', href: '#', disabled: true },
      slots: { default: () => '禁用链接' },
      attachTo: attach(),
    })
    const reachable = mount(Button, { slots: { default: () => '可用' }, attachTo: attach() })

    await userEvent.tab()
    expect(document.activeElement).not.toBe(skipped.element)
    expect(document.activeElement).toBe(reachable.element)
  })

  it('loading 期间不可激活', async () => {
    const onClick = vi.fn()
    mount(Button, {
      props: { onClick, loading: true },
      slots: { default: () => '保存中' },
      attachTo: attach(),
    })
    await userEvent.tab()
    await userEvent.keyboard('{Enter}')
    expect(onClick).not.toHaveBeenCalled()
  })
})

describe('真实计算样式', () => {
  it('实心 accent 的前景与背景取自不同 token,不是继承色', async () => {
    const w = mount(Button, {
      props: { variant: 'solid', tone: 'accent' },
      slots: { default: () => '主操作' },
      attachTo: attach(),
    })
    const style = getComputedStyle(w.element as HTMLElement)
    expect(style.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(style.color).not.toBe(style.backgroundColor)
  })

  it('实心变体 hover 不换填充,只浮现薄墨', async () => {
    const w = mount(Button, {
      props: { variant: 'solid', tone: 'accent' },
      slots: { default: () => '主操作' },
      attachTo: attach(),
    })
    const el = w.element as HTMLElement
    const restBg = getComputedStyle(el).backgroundColor
    expect(getComputedStyle(el, '::after').opacity).toBe('0')

    await userEvent.hover(el)
    await vi.waitFor(() =>
      expect(Number(getComputedStyle(el, '::after').opacity)).toBeGreaterThan(0),
    )
    expect(getComputedStyle(el).backgroundColor).toBe(restBg)
  })

  it('link 变体 hover 时字色向墨极压深,不换色相、无下划线', async () => {
    const w = mount(Button, {
      props: { variant: 'link' },
      slots: { default: () => '链接' },
      attachTo: attach(),
    })
    const el = w.element as HTMLElement
    const rest = getComputedStyle(el).color
    expect(getComputedStyle(el).textDecorationLine).toBe('none')
    expect(getComputedStyle(el).transitionProperty).toContain('color')

    await userEvent.hover(el)
    await vi.waitFor(() => expect(getComputedStyle(el).color).not.toBe(rest))

    const parse = (c: string) => c.match(/[\d.]+/g)!.map(Number)
    const [r1, g1, b1] = parse(rest)
    const [r2, g2, b2] = parse(getComputedStyle(el).color)
    expect(r2! + g2! + b2!).toBeLessThan(r1! + g1! + b1!)
  })

  it('ghost 变体静止时状态层不可见,hover 后浮现', async () => {
    const w = mount(Button, {
      props: { variant: 'ghost', tone: 'neutral' },
      slots: { default: () => '幽灵' },
      attachTo: attach(),
    })
    const el = w.element as HTMLElement
    expect(getComputedStyle(el).backgroundColor).toBe('rgba(0, 0, 0, 0)')
    expect(getComputedStyle(el, '::after').opacity).toBe('0')

    await userEvent.hover(el)
    await vi.waitFor(() =>
      expect(Number(getComputedStyle(el, '::after').opacity)).toBeGreaterThan(0),
    )
  })

  it('状态层的透明度过渡是真过渡,不是瞬变', async () => {
    const w = mount(Button, {
      props: { variant: 'ghost', tone: 'neutral' },
      slots: { default: () => '过渡' },
      attachTo: attach(),
    })
    const after = getComputedStyle(w.element as HTMLElement, '::after')
    expect(after.transitionProperty).toContain('opacity')
    expect(after.transitionDuration).not.toBe('0s')
  })

  it('will-change 常驻,合成层状态全程不切换', async () => {
    const w = mount(Button, { slots: { default: () => '提升' }, attachTo: attach() })
    const el = w.element as HTMLElement

    expect(getComputedStyle(el).willChange).toBe('transform')

    await userEvent.hover(el)
    expect(getComputedStyle(el).willChange).toBe('transform')

    await userEvent.hover(document.body)
    expect(getComputedStyle(el).willChange).toBe('transform')
  })

  it('颜色过渡不用弹簧曲线,弹簧只给 transform', async () => {
    const w = mount(Button, { slots: { default: () => '曲线' }, attachTo: attach() })
    const style = getComputedStyle(w.element as HTMLElement)
    const props = style.transitionProperty.split(',').map(s => s.trim())
    const timings = style.transitionTimingFunction.split(/,(?![^(]*\))/).map(s => s.trim())
    const bgTiming = timings[props.indexOf('background-color')]
    const transformTiming = timings[props.indexOf('transform')]
    expect(bgTiming).not.toBe(transformTiming)
  })
})
