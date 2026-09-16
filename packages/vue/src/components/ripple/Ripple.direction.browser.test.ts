import { afterEach, expect, it, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import Button from '../button/Button.vue'
import '../../../test/browser.css'

const wrappers: VueWrapper[] = []
afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
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
    const wrapper = mount(Button, {
      props: { variant: 'ghost', tone: 'neutral', class: 'w-48' },
      slots: { default: () => 'Ripple' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    const host = wrapper.element as HTMLElement
    const surface = wrapper.find('.hn-ripple-surface').element as HTMLElement
    const container = wrapper.find('.hn-ripple').element
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
