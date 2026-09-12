import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import ScrollArea from './ScrollArea.vue'
import Popover from '../popover/Popover.vue'
import Button from '../button/Button.vue'
import Dialog from '../dialog/Dialog.vue'
import ContextMenu from '../context-menu/ContextMenu.vue'
import ContextMenuItem from '../context-menu/ContextMenuItem.vue'
import '../../../test/browser.css'

beforeEach(async () => {
  await page.viewport(1000, 720)
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
  await vi.waitFor(
    () => expect(area.querySelector('[data-overlayscrollbars-viewport]')).toBeTruthy(),
    { timeout: 5000 },
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

function touchmove(el: HTMLElement) {
  const event = new Event('touchmove', { bubbles: true, cancelable: true })
  el.dispatchEvent(event)
  return event.defaultPrevented
}

const nestedCases = [
  { overlay: 'context-menu', modal: true },
  { overlay: 'popover', modal: true },
  { overlay: 'popover', modal: false },
].flatMap(overlay =>
  (['vertical', 'horizontal'] as const).map(direction => ({ ...overlay, direction })),
)

it.each(nestedCases)(
  'Dialog 内 $overlay / modal=$modal / $direction 随顶层切换锁滚并保留顶层滚动',
  async ({ overlay, modal, direction }) => {
    const panel = () =>
      h(ScrollArea, { class: 'h-24 w-60', 'data-lock-panel': '' }, () =>
        h('div', { style: 'height:800px' }, [
          overlay === 'context-menu' ? h(ContextMenuItem, () => '菜单操作') : '浮层内容',
        ]),
      )
    const nested = () =>
      overlay === 'context-menu'
        ? h(
            ContextMenu,
            {},
            {
              default: () =>
                h('div', { 'data-lock-trigger': '', style: 'width:200px;height:80px' }, '右键打开'),
              content: panel,
            },
          )
        : h(
            Popover,
            { modal },
            {
              default: () => h(Button, { 'data-lock-trigger': '' }, () => '打开浮层'),
              content: panel,
            },
          )
    const w = mount(
      {
        setup: () => () =>
          h(
            Dialog,
            { title: '滚动列表', size: 'lg' },
            {
              default: () => h(Button, () => '打开对话框'),
              body: () =>
                h(ScrollArea, { direction, class: 'h-64', 'data-lock-outer': '' }, () =>
                  h(
                    'div',
                    { style: direction === 'horizontal' ? 'width:1800px' : 'height:1800px' },
                    [nested()],
                  ),
                ),
            },
          ),
      },
      { attachTo: document.body },
    )
    mounted.push(w)
    await userEvent.click(w.find('button').element as HTMLElement)
    await vi.waitFor(() => expect(document.querySelector('[data-lock-outer]')).toBeTruthy())
    const outer = await viewportOf(document.querySelector('[data-lock-outer]')!)
    await vi.waitFor(() => expect(document.body.style.pointerEvents).toBe('none'))
    expect(touchmove(outer)).toBe(false)
    expect(wheel(outer)).toBe(direction === 'horizontal')
    if (direction === 'horizontal') {
      expect(outer.scrollLeft).toBe(120)
      outer.scrollLeft = 0
    }

    for (let cycle = 0; cycle < 2; cycle++) {
      await userEvent.click(document.querySelector<HTMLElement>('[data-lock-trigger]')!, {
        button: overlay === 'context-menu' ? 'right' : 'left',
        position: { x: 20, y: 20 },
      })
      await vi.waitFor(() => expect(document.querySelector('[data-lock-panel]')).toBeTruthy())
      const inner = await viewportOf(document.querySelector('[data-lock-panel]')!)
      expect(document.body.style.pointerEvents).toBe('none')
      await vi.waitFor(() =>
        expect(getComputedStyle(outer).pointerEvents).toBe(modal ? 'none' : 'auto'),
      )
      const left = outer.scrollLeft
      expect(wheel(outer)).toBe(modal || direction === 'horizontal')
      expect(outer.scrollLeft).toBe(left + (!modal && direction === 'horizontal' ? 120 : 0))
      expect(touchmove(outer)).toBe(modal)
      expect(wheel(inner)).toBe(false)
      expect(touchmove(inner)).toBe(false)

      await userEvent.keyboard('{Escape}')
      await vi.waitFor(() => expect(document.querySelector('[data-lock-panel]')).toBeNull())
      expect(document.querySelector('[data-lock-outer]')).toBeTruthy()
      expect(document.body.style.pointerEvents).toBe('none')
      await vi.waitFor(() => expect(getComputedStyle(outer).pointerEvents).toBe('auto'))
      expect(touchmove(outer)).toBe(false)
      const restoredLeft = outer.scrollLeft
      expect(wheel(outer)).toBe(direction === 'horizontal')
      if (direction === 'horizontal') {
        expect(outer.scrollLeft).toBe(restoredLeft + 120)
        outer.scrollLeft = 0
      }
    }

    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(document.body.style.pointerEvents).toBe(''))
  },
)
