import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, reactive } from 'vue'
import Rating from './Rating.vue'
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
  host.style.cssText = 'padding: 40px'
  document.body.appendChild(host)
  return host
}

function mountRating(props: Record<string, unknown> = {}) {
  const state = reactive<{ modelValue: number }>({ modelValue: 2 })
  const w = mount(
    defineComponent({
      render: () =>
        h(Rating, {
          ...state,
          ...props,
          'aria-label': '评分',
          'onUpdate:modelValue': (value: number) => (state.modelValue = value),
        }),
    }),
    { attachTo: attach() },
  )
  mounted.push(w)
  const root = w.find('[data-hn-rating]').element as HTMLElement
  return {
    state,
    root,
    radios: () => Array.from(root.querySelectorAll('[role="radio"]')) as HTMLElement[],
    stars: () => Array.from(root.querySelectorAll('svg')) as SVGElement[],
  }
}

const NONE = 'rgba(0, 0, 0, 0)'

describe('rating · 悬停与键盘', () => {
  it('悬停到第四颗星时前四颗预览为实心，移开后回到选中的两颗；点击即选中', async () => {
    const { state, root, radios, stars } = mountRating()
    const filled = () =>
      stars().filter(s => getComputedStyle(s).fill !== 'none' && getComputedStyle(s).fill !== NONE)
    await vi.waitFor(() => expect(filled()).toHaveLength(2))
    await userEvent.hover(radios()[3]!)
    await vi.waitFor(() => expect(filled()).toHaveLength(4))
    await userEvent.unhover(root)
    await vi.waitFor(() => expect(filled()).toHaveLength(2))
    await userEvent.click(radios()[3]!)
    await vi.waitFor(() => expect(state.modelValue).toBe(4))
  })

  it('方向键在星之间移动并选中，焦点环画在整颗星上', async () => {
    const { state, radios } = mountRating()
    radios()[1]!.focus()
    await userEvent.keyboard('{ArrowRight>}')
    await vi.waitFor(() => expect(state.modelValue).toBe(3))
    await userEvent.keyboard('{/ArrowRight}')
    expect(document.activeElement).toBe(radios()[2])
    const item = radios()[2]!.parentElement as HTMLElement
    expect(getComputedStyle(item).outlineStyle).toBe('solid')
  })

  it('半星：悬停到某颗星的左半只亮半颗', async () => {
    const { root, radios } = mountRating({ modelValue: 0, step: 0.5 })
    const half = radios()[4]!
    await userEvent.hover(half)
    await vi.waitFor(() => {
      const active = root.querySelectorAll('[role="radio"][data-state="active"]')
      expect(active).toHaveLength(5)
    })
    expect(half.getBoundingClientRect().width).toBe(
      (half.parentElement as HTMLElement).getBoundingClientRect().width / 2,
    )
  })
})

describe('rating · 尺寸', () => {
  it('三档星的边长分别是 16、20、24 像素', () => {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
    for (const [size, px] of [
      ['sm', 1],
      ['md', 1.25],
      ['lg', 1.5],
    ] as const) {
      const { stars } = mountRating({ size })
      expect(stars()[0]!.getBoundingClientRect().width).toBe(px * rem)
    }
  })
})
