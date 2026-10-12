import { afterEach, expect, it, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'
import Dialog from '../dialog/Dialog.vue'
import Drawer from '../drawer/Drawer.vue'
import Sheet from '../sheet/Sheet.vue'
import ScrollArea from './ScrollArea.vue'
import '../../../test/browser.css'

let wrapper: VueWrapper | undefined
const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()))

afterEach(() => {
  wrapper?.unmount()
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

it('initializes on the next frame despite scrolling and unavailable idle time, preserving the native offset', async () => {
  const idle = vi.spyOn(window, 'requestIdleCallback').mockReturnValue(1)
  wrapper = mount(ScrollArea, {
    attachTo: document.body,
    props: { class: 'h-40', autoHide: 'never' },
    slots: { default: () => h('div', { style: 'height:2000px' }, 'Content') },
  })
  await nextTick()
  const area = wrapper.findComponent(ScrollArea)
  const host = area.get<HTMLElement>('[data-overlayscrollbars-initialize]').element
  host.scrollTop = 180
  host.dispatchEvent(new Event('scroll'))
  host.dispatchEvent(new WheelEvent('wheel', { deltaY: 180, bubbles: true }))
  host.dispatchEvent(new Event('touchmove', { bubbles: true }))
  expect(area.vm.instance).toBeUndefined()
  await frame()
  expect(idle).not.toHaveBeenCalled()
  expect(area.vm.instance).toBeDefined()
  expect(area.vm.viewport?.scrollTop).toBe(180)
  expect(area.find('.os-scrollbar-vertical').exists()).toBe(true)
})

it('leaves the content in place while initializing, so animations and transitions inside keep running', async () => {
  wrapper = mount(ScrollArea, {
    attachTo: document.body,
    props: { class: 'h-40' },
    slots: {
      default: () => [
        h('div', { 'data-probe': 'spin', style: 'animation:hn-spin 10s linear infinite' }),
        h('div', { 'data-probe': 'fade', style: 'transition:opacity 5s linear' }),
        h('iframe', { 'data-probe': 'frame' }),
        h('div', { style: 'height:2000px' }),
      ],
    },
  })
  await nextTick()
  const area = wrapper.findComponent(ScrollArea)
  const host = area.get<HTMLElement>('[data-overlayscrollbars-initialize]').element
  const content = host.firstElementChild!
  const spin = host.querySelector<HTMLElement>('[data-probe="spin"]')!
  const fade = host.querySelector<HTMLElement>('[data-probe="fade"]')!
  const inner = host.querySelector<HTMLIFrameElement>('[data-probe="frame"]')!.contentWindow
  expect(getComputedStyle(fade).opacity).toBe('1')
  fade.style.opacity = '0.2'
  const running = [spin.getAnimations()[0], fade.getAnimations()[0]]
  expect(running.every(Boolean)).toBe(true)
  const removed: Node[] = []
  const observer = new MutationObserver(records => {
    for (const record of records) removed.push(...record.removedNodes)
  })
  observer.observe(host, { childList: true })
  observer.observe(content, { childList: true })
  expect(area.vm.instance).toBeUndefined()
  await frame()
  expect(area.vm.instance).toBeDefined()
  for (const record of observer.takeRecords()) removed.push(...record.removedNodes)
  observer.disconnect()
  expect(removed).toEqual([])
  expect(spin.getAnimations()[0]).toBe(running[0])
  expect(fade.getAnimations()[0]).toBe(running[1])
  expect(Number(getComputedStyle(fade).opacity)).toBeGreaterThan(0.2)
  expect(host.querySelector<HTMLIFrameElement>('[data-probe="frame"]')!.contentWindow).toBe(inner)
})

it.each([Dialog, Sheet, Drawer])(
  '$name initializes the built-in scrollbar immediately on both opening and reopening after scrolling',
  async component => {
    vi.spyOn(window, 'requestIdleCallback').mockReturnValue(1)
    const open = ref(false)
    wrapper = mount(
      {
        render: () =>
          h(
            component,
            { open: open.value, title: 'Content' },
            {
              content: () => h('div', { style: 'height:2000px' }, 'Long content'),
            },
          ),
      },
      { attachTo: document.body, global: { stubs: { transition: false } } },
    )
    for (let cycle = 0; cycle < 2; cycle++) {
      open.value = true
      await nextTick()
      const area = wrapper.findComponent(ScrollArea)
      const host = area.get<HTMLElement>('[data-overlayscrollbars-initialize]').element
      host.scrollTop = 160
      host.dispatchEvent(new Event('scroll'))
      await frame()
      expect(area.vm.instance).toBeDefined()
      expect(area.vm.viewport?.scrollTop).toBe(160)
      expect(area.find('.os-scrollbar-vertical').exists()).toBe(true)
      area.vm.viewport!.scrollTop += 160
      area.vm.viewport!.dispatchEvent(new Event('scroll'))
      open.value = false
      await nextTick()
      await vi.waitFor(() => expect(wrapper!.findComponent(ScrollArea).exists()).toBe(false))
    }
  },
)

it('cancels initialization when unmounted before the next frame', async () => {
  wrapper = mount(ScrollArea, {
    attachTo: document.body,
    props: { class: 'h-40' },
    slots: { default: () => h('div', { style: 'height:2000px' }) },
  })
  const root = wrapper.element
  const area = wrapper.findComponent(ScrollArea)
  wrapper.unmount()
  wrapper = undefined
  await frame()
  expect(area.vm.instance).toBeUndefined()
  expect(root.querySelector('.os-scrollbar')).toBeNull()
})
