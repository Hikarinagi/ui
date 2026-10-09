import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { cleanup, render } from 'vitest-browser-react'
import { Slider, type SliderProps } from './Slider'
import { TooltipProvider } from '../tooltip/TooltipProvider'
import { signal, tick } from '../../../test/signal'
import '../../../test/browser.css'

beforeEach(async () => {
  document.body.innerHTML = ''
  const spot = document.createElement('div')
  spot.style.cssText = 'position: fixed; right: 0; bottom: 0; width: 8px; height: 8px'
  document.body.appendChild(spot)
  await userEvent.hover(spot)
  spot.remove()
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

async function mountSlider(props: Partial<SliderProps> = {}) {
  const state = signal<Partial<SliderProps>>({ value: 50, ...props })
  function Harness() {
    const current = state.use()
    return (
      <TooltipProvider>
        <Slider
          {...current}
          aria-label="音量"
          onValueChange={value => (state.value = { ...state.value, value })}
        />
      </TooltipProvider>
    )
  }
  const host = attach()
  await render(<Harness />, { container: host })
  const root = host.querySelector('[data-hn-slider]') as HTMLElement
  const track = root.firstElementChild as HTMLElement
  return {
    state,
    root,
    track,
    thumb: root.querySelector('[role="slider"]') as HTMLElement,
    range: track.querySelector('.bg-accent') as HTMLElement,
    value: () => state.value.value,
    set: async (v: number) => {
      state.value = { ...state.value, value: v }
      await tick()
    },
  }
}

const center = (el: Element) => {
  const r = el.getBoundingClientRect()
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
}
const tooltip = () => document.querySelector('[role="tooltip"]')
const bubble = () => tooltip()?.closest('[data-state]') as HTMLElement | null

describe('slider · 几何', () => {
  it('三档轨道高 20 / 24 / 28、拇指 12 / 16 / 20，与 Switch 相同；拇指中心落在轨道中线与取值点上', async () => {
    for (const [size, h, t] of [
      ['sm', 20, 12],
      ['md', 24, 16],
      ['lg', 28, 20],
    ] as const) {
      const { track, thumb } = await mountSlider({ size })
      await vi.waitFor(() => expect(thumb.offsetWidth).toBe(t))
      expect(thumb.offsetHeight).toBe(t)
      expect(track.offsetHeight).toBe(h)
      expect(getComputedStyle(track).borderRadius).not.toBe('0px')
      const r = track.getBoundingClientRect()
      expect(Math.abs(center(thumb).y - (r.top + r.height / 2))).toBeLessThan(0.5)
      expect(Math.abs(center(thumb).x - (r.left + r.width / 2))).toBeLessThan(0.5)
    }
  })

  it('高亮包住拇指：拇指离轨道外缘 4px，填充延伸到拇指远端外 4px，任何取值下都是一圈 accent', async () => {
    const { set, track, thumb, range } = await mountSlider({ value: 0 })
    await vi.waitFor(() => expect(thumb.offsetWidth).toBeGreaterThan(0))
    let r = track.getBoundingClientRect()
    await vi.waitFor(() => expect(thumb.getBoundingClientRect().left - r.left).toBe(4))
    expect(range.getBoundingClientRect().width).toBe(thumb.offsetWidth + 8)
    for (const value of [25, 60, 100]) {
      await set(value)
      await vi.waitFor(() => expect(thumb.getAttribute('aria-valuenow')).toBe(String(value)))
      const travel = r.width - 8 - thumb.offsetWidth
      await vi.waitFor(() => {
        const t = thumb.getBoundingClientRect()
        expect(Math.abs(t.left - (r.left + 4 + (travel * value) / 100))).toBeLessThan(0.5)
        expect(Math.abs(range.getBoundingClientRect().right - t.right - 4)).toBeLessThan(0.5)
      })
    }
    r = track.getBoundingClientRect()
    await vi.waitFor(() => expect(r.right - thumb.getBoundingClientRect().right).toBe(4))
    expect(range.getBoundingClientRect().right).toBe(r.right)
    const t = thumb.getBoundingClientRect()
    expect(t.top - r.top).toBe(4)
    expect(r.bottom - t.bottom).toBe(4)
  })
})

describe('slider · 交互', () => {
  it('点击轨道即跳到该处，鼠标带来的焦点不画环；方向键按 step 改值并亮环', async () => {
    const { value, thumb, track } = await mountSlider({ step: 10 })
    const r = track.getBoundingClientRect()
    await userEvent.click(track, { position: { x: r.width * 0.8, y: r.height / 2 } })
    await vi.waitFor(() => expect(value()).toBe(80))
    await vi.waitFor(() => expect(document.activeElement).toBe(thumb))
    expect(getComputedStyle(thumb).outlineStyle).toBe('none')
    await userEvent.keyboard('{ArrowLeft}')
    await vi.waitFor(() => expect(value()).toBe(70))
    expect(getComputedStyle(thumb).outlineStyle).toBe('solid')
    await vi.waitFor(() => expect(tooltip()?.textContent?.trim()).toBe('70'))
    await userEvent.keyboard('{Home}')
    await vi.waitFor(() => expect(value()).toBe(0))
  })

  it('取值标签是 Tooltip：悬停整条滑块时出现在拇指上方，移开消失；always 常显并可 format', async () => {
    const { root, thumb } = await mountSlider()
    expect(tooltip()).toBeNull()
    await userEvent.hover(root)
    await vi.waitFor(() => expect(tooltip()?.textContent?.trim()).toBe('50'))
    await vi.waitFor(() => {
      const b = bubble()!.getBoundingClientRect()
      const t = thumb.getBoundingClientRect()
      expect(b.bottom).toBeLessThan(t.top)
      expect(Math.abs(b.left + b.width / 2 - (t.left + t.width / 2))).toBeLessThan(1)
    })
    await userEvent.unhover(root)
    await vi.waitFor(() => expect(tooltip()).toBeNull())
    await mountSlider({ label: 'always', format: (v: number) => `${v}%` })
    await vi.waitFor(() => expect(tooltip()?.textContent?.trim()).toBe('50%'))
  })

  it('键盘聚焦时环长在拇指上、标签随之出现；悬停整条滑块时拇指落墨', async () => {
    const { track, thumb } = await mountSlider()
    const before = document.createElement('button')
    document.body.prepend(before)
    before.focus()
    await userEvent.keyboard('{Tab}')
    await vi.waitFor(() => expect(document.activeElement).toBe(thumb))
    expect(getComputedStyle(thumb).outlineStyle).toBe('solid')
    expect(getComputedStyle(thumb).outlineWidth).toBe('2px')
    await vi.waitFor(() => expect(tooltip()?.textContent?.trim()).toBe('50'))
    expect(parseFloat(getComputedStyle(thumb, '::after').opacity)).toBe(0)
    await userEvent.hover(track)
    await vi.waitFor(() =>
      expect(parseFloat(getComputedStyle(thumb, '::after').opacity)).toBeGreaterThan(0),
    )
  })
})
