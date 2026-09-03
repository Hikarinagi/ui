import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, reactive } from 'vue'
import SegmentedControl from './SegmentedControl.vue'
import Input from '../input/Input.vue'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

function attach() {
  const host = document.createElement('div')
  host.style.cssText = 'width: 360px; padding: 40px'
  document.body.appendChild(host)
  return host
}

const options = [
  { value: 'all', label: '全部' },
  { value: 'ongoing', label: '连载中' },
  { value: 'done', label: '已完结' },
]

interface State {
  modelValue?: string | number
  options: Array<{ value: string; label: string; disabled?: boolean }>
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

function mountControl(props: Partial<State> = {}) {
  const state = reactive<State>({ modelValue: 'all', options, ...props })
  const host = mount(
    defineComponent({
      render: () =>
        h(SegmentedControl, {
          ...state,
          'aria-label': '连载状态',
          'onUpdate:modelValue': (value?: string | number) => (state.modelValue = value),
        }),
    }),
    { attachTo: attach() },
  )
  mounted.push(host)
  const root = host.find('[data-hn-segmented-control]').element as HTMLElement
  return {
    state,
    root,
    items: () => Array.from(root.querySelectorAll('button')) as HTMLButtonElement[],
    thumb: () => root.querySelector('[data-hn-highlight]') as HTMLElement | null,
  }
}

const rect = (el: Element) => el.getBoundingClientRect()

describe('segmented-control · 滑块', () => {
  it('滑块就地渲染在选中项内；切换时以共享布局动画飞到新项，中途位置介于两端，落定后逐像素贴合', async () => {
    const { root, items, thumb } = mountControl()
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
    const { root, items, thumb } = mountControl()
    await vi.waitFor(() => expect(thumb()).not.toBeNull())
    const item = items()[0]!
    expect(rect(thumb()!).height).toBe(rect(item).height)
    expect(rect(thumb()!).top).toBe(rect(item).top)
    const pad = parseFloat(getComputedStyle(root).paddingTop)
    expect(parseFloat(getComputedStyle(thumb()!).borderRadius)).toBe(
      parseFloat(getComputedStyle(root).borderRadius) - pad,
    )
    expect(getComputedStyle(item).borderRadius).toBe(getComputedStyle(thumb()!).borderRadius)
  })
})

describe('segmented-control · 与输入面同一副尺寸', () => {
  it('三档高度与 Input 逐档相等', () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const input = mount(Input, {
        props: { size },
        attrs: { 'aria-label': size },
        attachTo: attach(),
      })
      mounted.push(input)
      const { root } = mountControl({ size })
      expect(root.offsetHeight).toBe((input.element as HTMLElement).offsetHeight)
    }
  })
})

describe('segmented-control · 键盘', () => {
  it('Tab 落在已选项；方向键只移焦点，空格才选中；禁用项被跳过', async () => {
    const { items, state } = mountControl({
      modelValue: 'ongoing',
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
    const { items } = mountControl()
    const [selected, idle] = items()
    const inkOf = (el: HTMLElement) => getComputedStyle(el, '::after').backgroundColor
    expect(inkOf(selected!)).toBe(inkOf(idle!))
    expect(parseFloat(getComputedStyle(selected!, '::after').opacity)).toBe(0)
    await userEvent.hover(selected!)
    await vi.waitFor(() =>
      expect(parseFloat(getComputedStyle(selected!, '::after').opacity)).toBeGreaterThan(0),
    )
  })

  it('整组禁用只淡根不叠项；单项禁用只淡那一项', () => {
    const { root, items } = mountControl({
      disabled: true,
      options: [...options.slice(0, 2), { value: 'done', label: '已完结', disabled: true }],
    })
    expect(getComputedStyle(root).opacity).toBe('0.5')
    expect(items().map(item => getComputedStyle(item).opacity)).toEqual(['1', '1', '1'])

    const { root: enabled, items: enabledItems } = mountControl({
      options: [...options.slice(0, 2), { value: 'done', label: '已完结', disabled: true }],
    })
    expect(getComputedStyle(enabled).opacity).toBe('1')
    expect(enabledItems().map(item => getComputedStyle(item).opacity)).toEqual(['1', '1', '0.5'])
  })
})
