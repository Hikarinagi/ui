import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { cleanup, render } from 'vitest-browser-react'
import { RangeSlider, type RangeSliderProps } from './RangeSlider'
import { TooltipProvider } from '../tooltip/TooltipProvider'
import { signal, tick } from '../../../test/signal'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(async () => {
  await cleanup()
})

function attach() {
  const host = document.createElement('div')
  host.style.cssText = 'width: 360px; padding: 40px'
  document.body.appendChild(host)
  return host
}

async function mountRange(props: Partial<RangeSliderProps> = {}) {
  const state = signal<Partial<RangeSliderProps>>({ value: [25, 75], ...props })
  function Harness() {
    const current = state.use()
    return (
      <TooltipProvider>
        <RangeSlider
          {...current}
          aria-label="区间"
          onValueChange={value => (state.value = { ...state.value, value })}
        />
      </TooltipProvider>
    )
  }
  const host = attach()
  await render(<Harness />, { container: host })
  const root = host.querySelector('[data-hn-range-slider]') as HTMLElement
  const track = root.firstElementChild as HTMLElement
  return {
    state,
    root,
    track,
    thumbs: () => Array.from(root.querySelectorAll('[role="slider"]')) as HTMLElement[],
    range: track.querySelector('.bg-accent') as HTMLElement,
    value: () => state.value.value as [number, number],
    set: async (v: [number, number]) => {
      state.value = { ...state.value, value: v }
      await tick()
    },
  }
}

const tooltips = () =>
  Array.from(document.querySelectorAll('[role="tooltip"]')).map(t => t.textContent?.trim())

describe('range-slider · 几何', () => {
  it('填充包住两个拇指：起于第一个拇指外 4px，止于第二个拇指外 4px；两拇指落在各自的取值点上', async () => {
    const { set, track, thumbs, range } = await mountRange()
    await vi.waitFor(() => expect(thumbs()[1]!.offsetWidth).toBeGreaterThan(0))
    const r = track.getBoundingClientRect()
    const travel = r.width - 8 - thumbs()[0]!.offsetWidth
    for (const [a, b] of [
      [25, 75],
      [0, 100],
      [40, 45],
    ] as const) {
      await set([a, b])
      await vi.waitFor(() => {
        const [t1, t2] = thumbs().map(t => t.getBoundingClientRect())
        expect(Math.abs(t1!.left - (r.left + 4 + (travel * a) / 100))).toBeLessThan(0.5)
        expect(Math.abs(t2!.left - (r.left + 4 + (travel * b) / 100))).toBeLessThan(0.5)
        const f = range.getBoundingClientRect()
        expect(Math.abs(f.left - (t1!.left - 4))).toBeLessThan(0.5)
        expect(Math.abs(f.right - (t2!.right + 4))).toBeLessThan(0.5)
      })
    }
  })
})

describe('range-slider · 交互', () => {
  it('Tab 依次落在两个拇指上，方向键只动持焦的那个；每个拇指各有自己的取值标签', async () => {
    const { value, thumbs, root } = await mountRange({ step: 5 })
    await userEvent.unhover(root)
    const before = document.createElement('button')
    document.body.prepend(before)
    before.focus()
    await userEvent.keyboard('{Tab}')
    await vi.waitFor(() => expect(document.activeElement).toBe(thumbs()[0]))
    await userEvent.keyboard('{ArrowRight}')
    await vi.waitFor(() => expect(value()).toEqual([30, 75]))
    await userEvent.keyboard('{Tab}')
    await vi.waitFor(() => expect(document.activeElement).toBe(thumbs()[1]))
    await userEvent.keyboard('{ArrowLeft}')
    await vi.waitFor(() => expect(value()).toEqual([30, 70]))
    await vi.waitFor(() => expect(tooltips().sort()).toEqual(['30', '70']))
    before.focus()
    await vi.waitFor(() =>
      expect(thumbs().some(t => t.hasAttribute('data-focus-ring'))).toBe(false),
    )
    await vi.waitFor(() => expect(tooltips()).toEqual([]))
    await userEvent.hover(root)
    await vi.waitFor(() => expect(tooltips().sort()).toEqual(['30', '70']))
  })
})
