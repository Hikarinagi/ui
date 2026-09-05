import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import ScrollArea from './ScrollArea.vue'
import Popover from '../popover/Popover.vue'
import Button from '../button/Button.vue'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

let mounted: VueWrapper[] = []

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

function harness() {
  const host = document.createElement('div')
  host.style.cssText = 'height: 320px; width: 480px'
  document.body.appendChild(host)
  const w = mount(
    defineComponent({
      setup: () => () =>
        h(ScrollArea, { class: 'h-full', 'data-outer': '' }, () => [
          h('div', { style: 'height: 200px' }),
          h(
            Popover,
            {},
            {
              default: () => h(Button, { variant: 'outline', tone: 'neutral' }, () => '打开'),
              content: () =>
                h(ScrollArea, { class: 'h-24', 'data-inner': '' }, () =>
                  h('div', { style: 'height: 400px' }, '浮层内的长内容'),
                ),
            },
          ),
          h('div', { style: 'height: 1200px' }),
        ]),
    }),
    { attachTo: host },
  )
  mounted.push(w)
  return w
}

async function viewportOf(area: Element) {
  await vi.waitFor(() =>
    expect(area.querySelector('[data-overlayscrollbars-viewport]')).toBeTruthy(),
  )
  return area.querySelector('[data-overlayscrollbars-viewport]') as HTMLElement
}

function wheel(el: HTMLElement) {
  const event = new WheelEvent('wheel', { deltaY: 120, bubbles: true, cancelable: true })
  el.dispatchEvent(event)
  return event.defaultPrevented
}

describe('ScrollArea · 浮层锁滚', () => {
  it('浮层打开时页面里的滚动区域立即拦下滚轮，浮层里的滚动区域照常，关闭后恢复', async () => {
    const w = harness()
    const outer = await viewportOf(document.querySelector('[data-outer]')!)
    expect(wheel(outer)).toBe(false)
    const trigger = w.find('button').element as HTMLElement
    const before = { width: outer.clientWidth, left: trigger.getBoundingClientRect().left }

    await userEvent.click(trigger)
    await vi.waitFor(() => expect(document.body.style.pointerEvents).toBe('none'))
    await vi.waitFor(() => expect(wheel(outer)).toBe(true))
    expect(outer.clientWidth).toBe(before.width)
    expect(trigger.getBoundingClientRect().left).toBe(before.left)

    const inner = await viewportOf(document.querySelector('[data-inner]')!)
    expect(wheel(inner)).toBe(false)

    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(document.body.style.pointerEvents).toBe(''))
    await vi.waitFor(() => expect(wheel(outer)).toBe(false))
  })
})
