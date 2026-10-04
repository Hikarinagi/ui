import { afterEach, expect, it, vi } from 'vitest'
import type { RenderResult } from 'vitest-browser-react'
import { Button } from '../button/Button'
import { mount } from '../../../test/mount'
import '../../../test/browser.css'

const wrappers: RenderResult[] = []
afterEach(async () => {
  for (const wrapper of wrappers.splice(0)) await wrapper.unmount()
  document.body.innerHTML = ''
})

function rippleBounds(surface: HTMLElement) {
  const style = getComputedStyle(surface, '::after')
  const probe = document.createElement('span')
  for (const property of [
    'position',
    'top',
    'right',
    'bottom',
    'left',
    'width',
    'height',
    'transform',
    'transform-origin',
    'box-sizing',
    'margin',
    'padding',
    'border',
  ])
    probe.style.setProperty(property, style.getPropertyValue(property))
  surface.appendChild(probe)
  const rect = probe.getBoundingClientRect()
  probe.remove()
  return rect
}

it.each(['pointer-start', 'pointer-middle', 'pointer-end', 'keyboard'] as const)(
  'keeps %s ripple geometry unchanged by RTL and grows toward the host center',
  async activation => {
    const wrapper = await mount(
      <Button variant="ghost" tone="neutral" className="w-48">
        Ripple
      </Button>,
    )
    wrappers.push(wrapper)
    const host = wrapper.element
    const surface = host.querySelector('.hn-ripple-surface') as HTMLElement
    const container = host.querySelector('.hn-ripple')!
    const starts: DOMRect[] = []
    for (const dir of ['ltr', 'rtl', 'ltr']) {
      host.dir = dir
      const bounds = container.getBoundingClientRect()
      const fraction =
        activation === 'pointer-start' ? 0.1 : activation === 'pointer-end' ? 0.9 : 0.5
      if (activation === 'keyboard') host.click()
      else
        host.dispatchEvent(
          new PointerEvent('pointerdown', {
            bubbles: true,
            isPrimary: true,
            pointerType: 'mouse',
            pointerId: 1,
            buttons: 1,
            clientX: bounds.left + bounds.width * fraction,
            clientY: bounds.top + bounds.height / 2,
          }),
        )
      const animation = surface
        .getAnimations({ subtree: true })
        .find(animation =>
          (animation.effect as KeyframeEffect).getKeyframes().some(frame => frame.width),
        )!
      expect(animation).toBeTruthy()
      animation.pause()
      animation.currentTime = 0
      await new Promise(requestAnimationFrame)
      const start = rippleBounds(surface)
      starts.push(start)
      if (activation === 'keyboard') {
        expect(start.left + start.width / 2).toBeCloseTo(bounds.left + bounds.width / 2, 1)
      }
      animation.currentTime = Number(animation.effect!.getTiming().duration)
      await new Promise(requestAnimationFrame)
      const end = rippleBounds(surface)
      expect(end.left + end.width / 2).toBeCloseTo(bounds.left + bounds.width / 2, 1)
      expect(end.top + end.height / 2).toBeCloseTo(bounds.top + bounds.height / 2, 1)
      expect(getComputedStyle(host).direction).toBe(dir)
      host.dispatchEvent(
        new PointerEvent('pointercancel', {
          bubbles: true,
          isPrimary: true,
          pointerType: 'mouse',
          pointerId: 1,
          buttons: 1,
        }),
      )
      await vi.waitFor(() => expect(surface.hasAttribute('data-pressed')).toBe(false))
    }
    for (const start of starts.slice(1)) {
      expect(start.left).toBeCloseTo(starts[0]!.left, 1)
      expect(start.top).toBeCloseTo(starts[0]!.top, 1)
    }
  },
)
