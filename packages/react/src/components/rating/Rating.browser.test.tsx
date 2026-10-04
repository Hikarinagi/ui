import { describe, expect, it, vi, beforeEach } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { useState } from 'react'
import { Rating, type RatingProps } from './Rating'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

function attach() {
  const host = document.createElement('div')
  host.style.cssText = 'padding: 40px'
  document.body.appendChild(host)
  return host
}

async function mountRating(props: Partial<RatingProps> & { modelValue?: number } = {}) {
  const state = { modelValue: 2 }
  const { modelValue, ...rest } = props
  function Harness() {
    const [value, setValue] = useState(state.modelValue)
    return (
      <Rating
        value={modelValue ?? value}
        {...rest}
        aria-label="评分"
        onValueChange={next => {
          state.modelValue = next
          setValue(next)
        }}
      />
    )
  }
  const host = attach()
  await render(<Harness />, { container: host })
  const root = host.querySelector('[data-hn-rating]') as HTMLElement
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
    const { state, root, radios, stars } = await mountRating()
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
    const { state, radios } = await mountRating()
    radios()[1]!.focus()
    await userEvent.keyboard('{ArrowRight>}')
    await vi.waitFor(() => expect(state.modelValue).toBe(3))
    await userEvent.keyboard('{/ArrowRight}')
    expect(document.activeElement).toBe(radios()[2])
    const item = radios()[2]!.parentElement as HTMLElement
    expect(getComputedStyle(item).outlineStyle).toBe('solid')
  })

  it('半星：悬停到某颗星的左半只亮半颗', async () => {
    const { root, radios } = await mountRating({ modelValue: 0, step: 0.5 })
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
  it('三档星的边长分别是 16、20、24 像素', async () => {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
    for (const [size, px] of [
      ['sm', 1],
      ['md', 1.25],
      ['lg', 1.5],
    ] as const) {
      const { stars } = await mountRating({ size })
      expect(stars()[0]!.getBoundingClientRect().width).toBe(px * rem)
    }
  })
})

describe('rating · 分制', () => {
  it('五颗星的半星点击、悬停预览和清零对应十分制', async () => {
    const { state, root, radios } = await mountRating({ max: 10, stars: 5, step: 0.5 })
    expect(root.querySelectorAll('label')).toHaveLength(5)
    await userEvent.hover(radios()[6]!)
    await vi.waitFor(() => {
      expect(root.querySelectorAll('[role="radio"][data-state="active"]')).toHaveLength(7)
    })
    expect(state.modelValue).toBe(2)
    await userEvent.unhover(root)
    await vi.waitFor(() => {
      expect(root.querySelectorAll('[role="radio"][data-state="active"]')).toHaveLength(2)
    })
    await userEvent.click(radios()[6]!)
    await vi.waitFor(() => expect(state.modelValue).toBe(7))
    expect(radios()[6]!.getAttribute('aria-checked')).toBe('true')
    expect(radios()[6]!.getAttribute('aria-label')).toBe('7 分，满分 10 分')
    await userEvent.click(radios()[6]!)
    await vi.waitFor(() => expect(state.modelValue).toBe(0))
  })

  it.each(['ltr', 'rtl'] as const)('%s 方向键选择使用实际分值', async dir => {
    const { state, radios } = await mountRating({ max: 10, stars: 5, step: 0.5, dir })
    radios()[1]!.focus()
    await userEvent.keyboard(dir === 'rtl' ? '{ArrowLeft>}' : '{ArrowRight>}')
    await vi.waitFor(() => expect(state.modelValue).toBe(3))
    await userEvent.keyboard(dir === 'rtl' ? '{/ArrowLeft}' : '{/ArrowRight}')
    expect(document.activeElement).toBe(radios()[2])
    await userEvent.keyboard('{End}')
    await vi.waitFor(() => expect(document.activeElement).toBe(radios()[9]))
    await userEvent.keyboard(' ')
    await vi.waitFor(() => expect(state.modelValue).toBe(10))
  })
})
