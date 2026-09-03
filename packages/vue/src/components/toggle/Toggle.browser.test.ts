import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, reactive } from 'vue'
import Toggle from './Toggle.vue'
import Button from '../button/Button.vue'
import TooltipProvider from '../tooltip/TooltipProvider.vue'
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

interface State {
  modelValue?: boolean
  label?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'ghost' | 'outline'
}

function mountToggle(props: Partial<State> = {}, slots: Record<string, () => unknown> = {}) {
  const state = reactive<State>({ modelValue: false, ...props })
  const host = mount(
    defineComponent({
      render: () =>
        h(TooltipProvider, null, () =>
          h(
            Toggle,
            {
              ...state,
              'onUpdate:modelValue': (value: boolean) => (state.modelValue = value),
            },
            { default: () => '加粗', ...slots },
          ),
        ),
    }),
    { attachTo: attach(), global: { stubs: { transition: false } } },
  )
  mounted.push(host)
  const button = host.find('[data-hn-toggle]').element as HTMLButtonElement
  return { state, button }
}

const ink = (el: Element) => getComputedStyle(el, '::after')
const reference = (className: string) => {
  const el = document.createElement('span')
  el.className = className
  document.body.appendChild(el)
  return getComputedStyle(el)
}

describe('toggle · 按下态', () => {
  it('松开时无墨、字色 fg；按下后墨是品牌色的选中墨、字色转 accent-text', async () => {
    const { button } = mountToggle()
    expect(parseFloat(ink(button).opacity)).toBe(0)
    expect(getComputedStyle(button).color).toBe(reference('text-fg').color)

    await userEvent.click(button)
    await vi.waitFor(() => expect(button.getAttribute('aria-pressed')).toBe('true'))
    await userEvent.unhover(button)
    const selected = parseFloat(
      getComputedStyle(button).getPropertyValue('--hn-state-selected-opacity'),
    )
    await vi.waitFor(() => expect(parseFloat(ink(button).opacity)).toBeCloseTo(selected, 2))
    expect(ink(button).backgroundColor).toBe(reference('bg-accent').backgroundColor)
    await vi.waitFor(() =>
      expect(getComputedStyle(button).color).toBe(reference('text-accent-text').color),
    )
  })

  it('悬停按下态的按钮，hover 墨叠在选中墨之上', async () => {
    const { button } = mountToggle({ modelValue: true })
    const selected = parseFloat(
      getComputedStyle(button).getPropertyValue('--hn-state-selected-opacity'),
    )
    const hover = parseFloat(getComputedStyle(button).getPropertyValue('--hn-state-hover-opacity'))
    await userEvent.hover(button)
    await vi.waitFor(() => expect(parseFloat(ink(button).opacity)).toBeCloseTo(selected + hover, 2))
  })
})

describe('toggle · 图标型', () => {
  it('label 让按钮成正方形，悬停出现同名文字提示', async () => {
    const { button } = mountToggle(
      { label: '加粗' },
      { default: undefined as unknown as () => unknown, icon: () => h('svg') },
    )
    expect(button.offsetWidth).toBe(button.offsetHeight)
    expect(button.getAttribute('aria-label')).toBe('加粗')
    await userEvent.hover(button)
    await vi.waitFor(() =>
      expect(document.querySelector('[role="tooltip"]')?.textContent?.trim()).toBe('加粗'),
    )
  })

  it('有 #pressed-icon 时按下是交叉淡变：离场图标短暂叠在原位，随后只剩新图标', async () => {
    const { button } = mountToggle(
      { label: '收藏' },
      {
        default: undefined as unknown as () => unknown,
        icon: () => h('svg', { 'data-icon': 'off' }),
        'pressed-icon': () => h('svg', { 'data-icon': 'on' }),
      },
    )
    await userEvent.click(button)
    await vi.waitFor(() => expect(button.querySelector('[data-icon="on"]')).not.toBeNull())
    expect(button.innerHTML).toContain('data-icon="off"')
    await vi.waitFor(() => expect(button.querySelector('[data-icon="off"]')).toBeNull(), {
      timeout: 1500,
    })
  })
})

describe('toggle · 与 Button 同一副尺寸', () => {
  it('三档高度与 Button 逐档相等', () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const button = mount(Button, {
        props: { size },
        slots: { default: '按钮' },
        attachTo: attach(),
      })
      mounted.push(button)
      const { button: toggleEl } = mountToggle({ size })
      expect(toggleEl.offsetHeight).toBe((button.element as HTMLElement).offsetHeight)
    }
  })
})
