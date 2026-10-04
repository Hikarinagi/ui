import { describe, expect, it, vi, beforeEach } from 'vitest'
import { userEvent } from 'vitest/browser'
import { Button } from '../button/Button'
import { mount } from '../../../test/mount'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

function pointerDown(el: Element) {
  el.dispatchEvent(
    new PointerEvent('pointerdown', {
      bubbles: true,
      isPrimary: true,
      buttons: 1,
      pointerType: 'mouse',
    }),
  )
}

describe('波纹生命周期', () => {
  it('点击走完整周期:按下浮现,松开淡出,有进必有出', async () => {
    const w = await mount(<Button>波纹</Button>)
    const surface = w.element.querySelector('.hn-ripple-surface') as HTMLElement

    expect(surface.hasAttribute('data-pressed')).toBe(false)
    expect(getComputedStyle(surface, '::after').transitionProperty).toContain('opacity')

    await userEvent.click(w.element)
    await vi.waitFor(() => expect(surface.hasAttribute('data-pressed')).toBe(true))
    await vi.waitFor(() => expect(surface.hasAttribute('data-pressed')).toBe(false), {
      timeout: 2000,
    })
  })

  it('按下时在 ::after 上启动真实的生长动画', async () => {
    const w = await mount(<Button>生长</Button>)
    const surface = w.element.querySelector('.hn-ripple-surface') as HTMLElement

    pointerDown(w.element)
    await vi.waitFor(() => expect(surface.getAnimations({ subtree: true }).length).toBe(1))
    const animation = surface.getAnimations({ subtree: true })[0]!
    expect((animation.effect as KeyframeEffect).pseudoElement).toBe('::after')
  })

  it('键盘激活也出波纹,从中心生长', async () => {
    const w = await mount(<Button>键盘</Button>)
    const surface = w.element.querySelector('.hn-ripple-surface') as HTMLElement

    await userEvent.tab()
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() => expect(surface.hasAttribute('data-pressed')).toBe(true))
    await vi.waitFor(() => expect(surface.hasAttribute('data-pressed')).toBe(false), {
      timeout: 2000,
    })
  })

  it('禁用时按下不产生波纹', async () => {
    const w = await mount(<Button disabled={true}>禁用</Button>)
    const surface = w.element.querySelector('.hn-ripple-surface') as HTMLElement

    pointerDown(w.element)
    await new Promise(resolve => setTimeout(resolve, 60))
    expect(surface.hasAttribute('data-pressed')).toBe(false)
    expect(surface.getAnimations({ subtree: true }).length).toBe(0)
  })

  it('波纹颜色与透明度取自状态层 token', async () => {
    const w = await mount(
      <Button variant="ghost" tone="neutral">
        token
      </Button>,
    )
    const surface = w.element.querySelector('.hn-ripple-surface') as HTMLElement

    pointerDown(w.element)
    const pressToken = Number(
      getComputedStyle(w.element).getPropertyValue('--hn-state-press-opacity'),
    )
    expect(pressToken).toBeGreaterThan(0)
    await vi.waitFor(() =>
      expect(Number(getComputedStyle(surface, '::after').opacity)).toBeCloseTo(pressToken, 2),
    )
  })
})
