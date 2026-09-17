import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h } from 'vue'
import ScrollArea from './ScrollArea.vue'
import '../../../test/browser.css'

const wrappers: VueWrapper[] = []
afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
})

async function create(dir: 'ltr' | 'rtl') {
  const host = document.createElement('div')
  host.dir = dir
  document.body.append(host)
  const wrapper = mount(ScrollArea, {
    attachTo: host,
    props: { direction: 'horizontal', class: 'w-[200px]' },
    slots: { default: () => h('div', { style: { width: '600px', height: '80px' } }) },
  })
  wrappers.push(wrapper)
  await vi.waitFor(() => expect(wrapper.vm.viewport).toBeInstanceOf(HTMLElement))
  return { wrapper, viewport: wrapper.vm.viewport!, host }
}

function wheel(viewport: HTMLElement, deltaY: number, deltaX = 0) {
  const event = new WheelEvent('wheel', { deltaY, deltaX, bubbles: true, cancelable: true })
  viewport.dispatchEvent(event)
  return event.defaultPrevented
}

describe('ScrollArea logical wheel redirection', () => {
  it.each(['ltr', 'rtl'] as const)('scrolls towards the logical end and back in %s', async dir => {
    const { viewport } = await create(dir)
    const sign = dir === 'rtl' ? -1 : 1
    expect(wheel(viewport, 120)).toBe(true)
    expect(viewport.scrollLeft).toBe(120 * sign)
    expect(wheel(viewport, -50)).toBe(true)
    expect(viewport.scrollLeft).toBe(70 * sign)
  })

  it('releases outward wheel events at both RTL boundaries', async () => {
    const { viewport } = await create('rtl')
    expect(wheel(viewport, -120)).toBe(false)
    expect(wheel(viewport, 500)).toBe(true)
    expect(viewport.scrollLeft).toBe(-400)
    expect(wheel(viewport, 120)).toBe(false)
    expect(wheel(viewport, -100)).toBe(true)
    expect(viewport.scrollLeft).toBe(-300)
    expect(wheel(viewport, -500)).toBe(true)
    expect(viewport.scrollLeft).toBe(0)
    expect(wheel(viewport, -120)).toBe(false)
  })

  it('uses the current inherited direction after it changes', async () => {
    const { viewport, host } = await create('ltr')
    expect(wheel(viewport, 120)).toBe(true)
    expect(viewport.scrollLeft).toBe(120)
    host.dir = 'rtl'
    viewport.scrollLeft = 0
    expect(wheel(viewport, 120)).toBe(true)
    expect(viewport.scrollLeft).toBe(-120)
  })

  it('preserves native horizontal gestures and the opt-out in RTL', async () => {
    const { viewport, wrapper } = await create('rtl')
    expect(wheel(viewport, 10, -100)).toBe(false)
    expect(viewport.scrollLeft).toBe(0)
    await wrapper.setProps({ wheelRedirect: false })
    expect(wheel(viewport, 120)).toBe(false)
    expect(viewport.scrollLeft).toBe(0)
  })
})
