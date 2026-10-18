import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { cleanup, render } from 'vitest-browser-react'
import { SegmentedControl } from './SegmentedControl'
import { Input } from '../input/Input'
import { signal } from '../../../test/signal'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(async () => {
  await cleanup()
})

function attach(style = 'width: 360px; padding: 40px') {
  const host = document.createElement('div')
  host.style.cssText = style
  document.body.appendChild(host)
  return host
}

const options = [
  { value: 'all', label: '全部' },
  { value: 'ongoing', label: '连载中' },
  { value: 'done', label: '已完结' },
]

interface State {
  value?: string | number
  options: Array<{ value: string; label: string; disabled?: boolean }>
  size?: 'sm' | 'md' | 'lg'
  orientation?: 'horizontal' | 'vertical'
  block?: boolean
  disabled?: boolean
}

async function mountControl(props: Partial<State> = {}, style?: string) {
  const state = signal<State>({ value: 'all', options, ...props })
  function Harness() {
    const current = state.use()
    return (
      <SegmentedControl
        {...current}
        aria-label="连载状态"
        onValueChange={value => (state.value = { ...state.value, value })}
      />
    )
  }
  const host = attach(style)
  await render(<Harness />, { container: host })
  const root = host.querySelector('[data-hn-segmented-control]') as HTMLElement
  return {
    state: {
      get modelValue() {
        return state.value.value
      },
    },
    root,
    frame: root.closest('.hn-scroll-area') as HTMLElement,
    items: () => Array.from(root.querySelectorAll('button')) as HTMLButtonElement[],
    thumb: () => root.querySelector('[data-hn-highlight]') as HTMLElement | null,
  }
}

const rect = (el: Element) => el.getBoundingClientRect()

describe('segmented-control · 滑块', () => {
  it('滑块就地渲染在选中项内；切换时以共享布局动画飞到新项，中途位置介于两端，落定后逐像素贴合', async () => {
    const { root, items, thumb } = await mountControl()
    await vi.waitFor(() => expect(thumb()).not.toBeNull())
    const [all, ongoing] = items()
    expect(all!.contains(thumb())).toBe(true)
    expect(Math.abs(rect(thumb()!).left - rect(all!).left)).toBeLessThan(0.01)
    const from = rect(all!).left
    const to = rect(ongoing!).left

    await userEvent.click(ongoing!)
    await vi.waitFor(() => expect(ongoing!.contains(thumb())).toBe(true))
    await vi.waitFor(() => {
      const left = rect(thumb()!).left
      expect(left).toBeGreaterThan(from + 1)
      expect(left).toBeLessThan(to - 1)
    })
    await vi.waitFor(
      () => {
        expect(Math.abs(rect(thumb()!).left - to)).toBeLessThan(0.01)
        expect(Math.abs(rect(thumb()!).width - rect(ongoing!).width)).toBeLessThan(0.01)
      },
      { timeout: 1500 },
    )
    expect(root.querySelectorAll('[data-hn-highlight]').length).toBe(1)
  })

  it('滑块的盒等于项的盒，圆角比槽小一个内边距', async () => {
    const { root, frame, items, thumb } = await mountControl()
    await vi.waitFor(() => expect(thumb()).not.toBeNull())
    const item = items()[0]!
    expect(rect(thumb()!).height).toBe(rect(item).height)
    expect(rect(thumb()!).top).toBe(rect(item).top)
    const pad = parseFloat(getComputedStyle(root).paddingTop)
    expect(parseFloat(getComputedStyle(thumb()!).borderRadius)).toBe(
      parseFloat(getComputedStyle(frame).borderRadius) - pad,
    )
    expect(getComputedStyle(item).borderRadius).toBe(getComputedStyle(thumb()!).borderRadius)
  })
})

describe('segmented-control · 与输入面同一副尺寸', () => {
  it('三档高度与 Input 逐档相等', async () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const inputHost = attach()
      await render(<Input size={size} aria-label={size} />, { container: inputHost })
      const { root, frame } = await mountControl({ size })
      expect(root.offsetHeight).toBe((inputHost.firstElementChild as HTMLElement).offsetHeight)
      expect(frame.offsetHeight).toBe(root.offsetHeight)
    }
  })
})

describe('segmented-control · 键盘', () => {
  it('Tab 落在已选项；方向键只移焦点，空格才选中；禁用项被跳过', async () => {
    const { items, state } = await mountControl({
      value: 'ongoing',
      options: [...options.slice(0, 2), { value: 'done', label: '已完结', disabled: true }],
    })
    await userEvent.keyboard('{Tab}')
    await vi.waitFor(() => expect(document.activeElement).toBe(items()[1]))
    await userEvent.keyboard('{ArrowLeft}')
    await vi.waitFor(() => expect(document.activeElement).toBe(items()[0]))
    expect(state.modelValue).toBe('ongoing')
    await userEvent.keyboard(' ')
    await vi.waitFor(() => expect(state.modelValue).toBe('all'))
    await userEvent.keyboard('{ArrowLeft}')
    await vi.waitFor(() => expect(document.activeElement).toBe(items()[1]))
  })
})

describe('segmented-control · 墨与禁用', () => {
  it('选中项与未选中项的交互墨同色；悬停已选项时墨落在滑块上', async () => {
    const { items } = await mountControl()
    const [selected, idle] = items()
    const inkOf = (el: HTMLElement) => getComputedStyle(el, '::after').backgroundColor
    expect(inkOf(selected!)).toBe(inkOf(idle!))
    expect(parseFloat(getComputedStyle(selected!, '::after').opacity)).toBe(0)
    await userEvent.hover(selected!)
    await vi.waitFor(() =>
      expect(parseFloat(getComputedStyle(selected!, '::after').opacity)).toBeGreaterThan(0),
    )
  })

  it('整组禁用只淡根不叠项；单项禁用只淡那一项', async () => {
    const { root, frame, items } = await mountControl({
      disabled: true,
      options: [...options.slice(0, 2), { value: 'done', label: '已完结', disabled: true }],
    })
    expect(getComputedStyle(frame).opacity).toBe('0.5')
    expect(getComputedStyle(root).opacity).toBe('1')
    expect(items().map(item => getComputedStyle(item).opacity)).toEqual(['1', '1', '1'])

    const { frame: enabled, items: enabledItems } = await mountControl({
      options: [...options.slice(0, 2), { value: 'done', label: '已完结', disabled: true }],
    })
    expect(getComputedStyle(enabled).opacity).toBe('1')
    expect(enabledItems().map(item => getComputedStyle(item).opacity)).toEqual(['1', '1', '0.5'])
  })
})

describe('segmented-control · 溢出', () => {
  const many = Array.from({ length: 8 }, (_, i) => ({ value: `g${i}`, label: `很长的选项${i}` }))
  const viewportOf = (frame: HTMLElement) =>
    vi.waitFor(() => {
      const viewport = frame.querySelector<HTMLElement>('[data-overlayscrollbars-viewport]')
      expect(viewport).not.toBeNull()
      return viewport!
    })

  it('放得下时外框贴合各项，不产生滚动', async () => {
    const { root, frame } = await mountControl()
    const viewport = await viewportOf(frame)
    expect(rect(frame).width).toBe(rect(root).width)
    expect(rect(frame).height).toBe(rect(root).height)
    expect(viewport.scrollWidth).toBe(viewport.clientWidth)
  })

  it('项超出容器宽度时整行横向滚动，不显示滚动条，内边距包住最后一项', async () => {
    const { root, frame, items } = await mountControl(
      { options: many, value: 'g0' },
      'width: 240px',
    )
    const viewport = await viewportOf(frame)
    await vi.waitFor(() => expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth))
    expect(rect(frame).width).toBe(240)
    for (const bar of frame.querySelectorAll('.os-scrollbar')) {
      expect(getComputedStyle(bar).visibility).toBe('hidden')
    }
    const pad = parseFloat(getComputedStyle(root).paddingRight)
    expect(rect(root).right - rect(items().at(-1)!).right).toBeCloseTo(pad, 1)
    expect(viewport.scrollWidth).toBe(Math.round(rect(root).width))
  })

  it('方向键把焦点移到视口外的项时滚动到该项，选中后滑块落在该项上', async () => {
    const { state, frame, items, thumb } = await mountControl(
      { options: many, value: 'g0' },
      'width: 240px',
    )
    const viewport = await viewportOf(frame)
    await vi.waitFor(() => expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth))
    const last = items().at(-1)!
    expect(rect(last).left).toBeGreaterThan(rect(viewport).right)
    await userEvent.keyboard('{Tab}')
    await vi.waitFor(() => expect(document.activeElement).toBe(items()[0]))
    await userEvent.keyboard('{ArrowLeft}')
    await vi.waitFor(() => expect(document.activeElement).toBe(last))
    await vi.waitFor(() => {
      expect(rect(last).left).toBeGreaterThanOrEqual(rect(viewport).left - 0.5)
      expect(rect(last).right).toBeLessThanOrEqual(rect(viewport).right + 0.5)
    })
    await userEvent.keyboard(' ')
    await vi.waitFor(() => expect(state.modelValue).toBe('g7'))
    await vi.waitFor(
      () => {
        expect(last.contains(thumb())).toBe(true)
        expect(Math.abs(rect(thumb()!).left - rect(last).left)).toBeLessThan(0.01)
        expect(Math.abs(rect(thumb()!).width - rect(last).width)).toBeLessThan(0.01)
      },
      { timeout: 1500 },
    )
  })

  it('block 放得下时各项等宽占满，放不下时各项保持内容宽度并可滚动', async () => {
    const fits = await mountControl({ block: true }, 'width: 360px')
    await viewportOf(fits.frame)
    expect(rect(fits.frame).width).toBe(360)
    expect(rect(fits.root).width).toBe(360)
    const widths = fits.items().map(item => rect(item).width)
    expect(Math.max(...widths) - Math.min(...widths)).toBeLessThan(0.5)

    const overflow = await mountControl({ options: many, block: true }, 'width: 240px')
    const viewport = await viewportOf(overflow.frame)
    await vi.waitFor(() => expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth))
    expect(rect(overflow.frame).width).toBe(240)
    for (const item of overflow.items()) {
      expect(item.scrollWidth).toBeLessThanOrEqual(item.clientWidth)
    }
    const pad = parseFloat(getComputedStyle(overflow.root).paddingRight)
    expect(rect(overflow.root).right - rect(overflow.items().at(-1)!).right).toBeCloseTo(pad, 1)
  })

  it('竖排时超出容器高度改为纵向滚动', async () => {
    const { frame, items } = await mountControl(
      { options: many, orientation: 'vertical' },
      'display: grid; grid-template-rows: minmax(0, 1fr); height: 160px',
    )
    const viewport = await viewportOf(frame)
    await vi.waitFor(() => expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight))
    expect(rect(frame).height).toBe(160)
    expect(viewport.scrollWidth).toBe(viewport.clientWidth)
    expect(rect(items().at(-1)!).top).toBeGreaterThan(rect(viewport).bottom)
  })
})
