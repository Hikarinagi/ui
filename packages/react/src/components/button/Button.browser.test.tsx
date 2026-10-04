import { describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { Button } from './Button'
import { mount } from '../../../test/mount'
import '../../../test/browser.css'

describe('键盘可达性', () => {
  it('Tab 可聚焦,并得到可见焦点环', async () => {
    const w = await mount(<Button>确定</Button>)
    await userEvent.tab()

    expect(document.activeElement).toBe(w.element)
    const outline = getComputedStyle(w.element).outlineWidth
    expect(outline).not.toBe('0px')
  })

  it('Enter 与 Space 都能激活', async () => {
    const onClick = vi.fn()
    await mount(<Button onClick={onClick}>激活</Button>)

    await userEvent.tab()
    await userEvent.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledTimes(1)

    await userEvent.keyboard(' ')
    expect(onClick).toHaveBeenCalledTimes(2)
  })

  it('disabled 的原生按钮不进入 tab 序列', async () => {
    const skipped = await mount(<Button disabled={true}>禁用</Button>)
    const reachable = await mount(<Button>可用</Button>)

    await userEvent.tab()
    expect(document.activeElement).not.toBe(skipped.element)
    expect(document.activeElement).toBe(reachable.element)
  })

  it('as="a" 且禁用时同样跳过', async () => {
    const skipped = await mount(
      <Button as="a" href="#" disabled={true}>
        禁用链接
      </Button>,
    )
    const reachable = await mount(<Button>可用</Button>)

    await userEvent.tab()
    expect(document.activeElement).not.toBe(skipped.element)
    expect(document.activeElement).toBe(reachable.element)
  })

  it('loading 期间不可激活', async () => {
    const onClick = vi.fn()
    await mount(
      <Button onClick={onClick} loading={true}>
        保存中
      </Button>,
    )
    await userEvent.tab()
    await userEvent.keyboard('{Enter}')
    expect(onClick).not.toHaveBeenCalled()
  })
})

describe('真实计算样式', () => {
  it('实心 accent 的前景与背景取自不同 token,不是继承色', async () => {
    const w = await mount(
      <Button variant="solid" tone="accent">
        主操作
      </Button>,
    )
    const style = getComputedStyle(w.element)
    expect(style.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(style.color).not.toBe(style.backgroundColor)
  })

  it('实心变体 hover 不换填充,只浮现薄墨', async () => {
    const w = await mount(
      <Button variant="solid" tone="accent">
        主操作
      </Button>,
    )
    const el = w.element
    const restBg = getComputedStyle(el).backgroundColor
    expect(getComputedStyle(el, '::after').opacity).toBe('0')

    await userEvent.hover(el)
    await vi.waitFor(() =>
      expect(Number(getComputedStyle(el, '::after').opacity)).toBeGreaterThan(0),
    )
    expect(getComputedStyle(el).backgroundColor).toBe(restBg)
  })

  it('link 变体 hover 时字色向墨极压深,不换色相、无下划线', async () => {
    const w = await mount(<Button variant="link">链接</Button>)
    const el = w.element
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
    const w = await mount(
      <Button variant="ghost" tone="neutral">
        幽灵
      </Button>,
    )
    const el = w.element
    expect(getComputedStyle(el).backgroundColor).toBe('rgba(0, 0, 0, 0)')
    expect(getComputedStyle(el, '::after').opacity).toBe('0')

    await userEvent.hover(el)
    await vi.waitFor(() =>
      expect(Number(getComputedStyle(el, '::after').opacity)).toBeGreaterThan(0),
    )
  })

  it('交互墨随表面色相:有色 tone 的 hover 墨与波纹同取 tone 色,neutral 保持灰', async () => {
    const mountBtn = async (tone: 'accent' | 'neutral' | 'danger') => {
      const w = await mount(
        <Button variant="soft" tone={tone}>
          钮
        </Button>,
      )
      return w.element
    }
    const rippleInk = (el: HTMLElement) =>
      getComputedStyle(el.querySelector('.hn-ripple-surface')!, '::after').backgroundImage
    const hoverInk = (el: HTMLElement) => getComputedStyle(el, '::after').backgroundColor

    const accent = await mountBtn('accent')
    const neutral = await mountBtn('neutral')
    const danger = await mountBtn('danger')

    expect(rippleInk(accent)).not.toBe(rippleInk(neutral))
    expect(rippleInk(danger)).not.toBe(rippleInk(neutral))
    expect(rippleInk(accent)).not.toBe(rippleInk(danger))
    expect(hoverInk(accent)).not.toBe(hoverInk(neutral))
    expect(hoverInk(danger)).not.toBe(hoverInk(neutral))
    expect(hoverInk(accent)).not.toBe(hoverInk(danger))
  })

  it('状态层的透明度过渡是真过渡,不是瞬变', async () => {
    const w = await mount(
      <Button variant="ghost" tone="neutral">
        过渡
      </Button>,
    )
    const after = getComputedStyle(w.element, '::after')
    expect(after.transitionProperty).toContain('opacity')
    expect(after.transitionDuration).not.toBe('0s')
  })

  it('will-change 常驻,合成层状态全程不切换', async () => {
    const w = await mount(<Button>提升</Button>)
    const el = w.element

    expect(getComputedStyle(el).willChange).toBe('transform')

    await userEvent.hover(el)
    expect(getComputedStyle(el).willChange).toBe('transform')

    await userEvent.hover(document.body)
    expect(getComputedStyle(el).willChange).toBe('transform')
  })

  it('颜色过渡不用弹簧曲线,弹簧只给 transform', async () => {
    const w = await mount(<Button>曲线</Button>)
    const style = getComputedStyle(w.element)
    const props = style.transitionProperty.split(',').map(s => s.trim())
    const timings = style.transitionTimingFunction.split(/,(?![^(]*\))/).map(s => s.trim())
    const bgTiming = timings[props.indexOf('background-color')]
    const transformTiming = timings[props.indexOf('transform')]
    expect(bgTiming).not.toBe(transformTiming)
  })
})
