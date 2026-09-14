import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h, nextTick, ref, shallowRef, type Component } from 'vue'
import Popover from '../components/popover/Popover.vue'
import DropdownMenu from '../components/dropdown-menu/DropdownMenu.vue'
import DropdownMenuItem from '../components/dropdown-menu/DropdownMenuItem.vue'
import HoverCard from '../components/hover-card/HoverCard.vue'
import type { OverlayAnchor, OverlayPositionStrategy } from '../index'
import '../../test/browser.css'

let wrapper: VueWrapper | undefined
const settle = (ms = 80) => new Promise(resolve => setTimeout(resolve, ms))

beforeEach(async () => {
  await page.viewport(1000, 800)
  const park = document.createElement('div')
  park.style.cssText = 'position:fixed;left:0;top:0;width:20px;height:20px'
  document.body.append(park)
  await userEvent.hover(park)
  park.remove()
})

afterEach(async () => {
  wrapper?.unmount()
  wrapper = undefined
  await vi.waitFor(() => expect(document.body.style.pointerEvents).toBe(''))
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

const components: Record<string, Component> = { Popover, DropdownMenu, HoverCard }

function render(
  kind: string,
  context = true,
  initialStrategy: OverlayPositionStrategy = 'always',
  trigger = false,
) {
  const scroller = document.createElement('div')
  scroller.style.cssText =
    'position:absolute;left:140px;top:100px;width:650px;height:480px;overflow:auto'
  const inner = document.createElement('div')
  inner.style.height = '1400px'
  const editor = document.createElement('textarea')
  editor.style.cssText = 'width:160px;height:32px'
  inner.append(editor)
  scroller.append(inner)
  document.body.append(scroller)
  editor.focus()
  let x = 220,
    y = 180
  const measure = vi.fn(() => {
    const rect = scroller.getBoundingClientRect()
    const left = rect.left + x,
      top = rect.top + y - scroller.scrollTop
    return { x: left, y: top, left, top, right: left + 2, bottom: top + 20, width: 2, height: 20 }
  })
  const anchor = shallowRef<OverlayAnchor | null>({
    getBoundingClientRect: measure,
    ...(context ? { contextElement: inner } : {}),
  })
  const strategy = ref(initialStrategy)
  const open = ref(false)
  wrapper = mount(
    {
      setup: () => () =>
        h(
          components[kind]!,
          {
            anchor: anchor.value,
            open: open.value,
            modal: false,
            align: 'start',
            side: 'bottom',
            closeDelay: 20,
            updatePositionStrategy: strategy.value,
            'onUpdate:open': (value: boolean) => {
              open.value = value
            },
            onOpenAutoFocus:
              kind === 'Popover' ? (event: Event) => event.preventDefault() : undefined,
          },
          {
            default: trigger
              ? () => h('button', { style: 'position:fixed;left:40px;top:40px' }, 'Trigger')
              : undefined,
            content: () =>
              kind === 'DropdownMenu'
                ? [h(DropdownMenuItem, () => 'First'), h(DropdownMenuItem, () => 'Second')]
                : h('div', { style: 'width:120px;height:40px' }, 'Content'),
          },
        ),
    },
    { attachTo: document.body },
  )
  const panel = () =>
    document.querySelector<HTMLElement>(
      kind === 'HoverCard'
        ? '[data-hn-hover-card]'
        : kind === 'Popover'
          ? '[role="dialog"]'
          : '[role="menu"]',
    )
  const positioner = () => panel()!.parentElement!
  async function aligned() {
    await vi.waitFor(() => {
      const rect = positioner().getBoundingClientRect(),
        target = measure()
      expect(rect.left).toBeCloseTo(target.left, 0)
      expect(rect.top).toBeCloseTo(target.bottom + 8, 0)
    })
  }
  async function show() {
    open.value = true
    await vi.waitFor(() => expect(panel()?.dataset.state).toBe('open'))
    await Promise.allSettled(
      panel()!
        .getAnimations()
        .map(animation => animation.finished),
    )
    await aligned()
  }
  async function exit() {
    open.value = false
    await vi.waitFor(() => expect(panel()?.dataset.state).toBe('closed'), { interval: 5 })
    const animations = panel()!.getAnimations()
    expect(animations.length).toBeGreaterThan(0)
    animations.forEach(animation => animation.pause())
    return animations
  }
  return {
    anchor,
    open,
    strategy,
    scroller,
    editor,
    measure,
    panel,
    positioner,
    aligned,
    show,
    exit,
    move: (dx = 45, dy = 30) => {
      x += dx
      y += dy
    },
  }
}

describe.each(Object.keys(components))('%s virtual anchor', kind => {
  it.each([true, false])(
    'tracks changing coordinates on the same object with context=%s',
    async context => {
      const demo = render(kind, context)
      await nextTick()
      expect(demo.panel()).toBeNull()
      await demo.show()
      const panel = demo.panel()
      demo.move()
      await demo.aligned()
      expect(demo.panel()).toBe(panel)
      if (kind !== 'DropdownMenu') expect(document.activeElement).toBe(demo.editor)
      await userEvent.keyboard('{Escape}')
      await vi.waitFor(() => expect(demo.panel()).toBeNull())
      expect(demo.open.value).toBe(false)
      expect(document.activeElement).toBe(demo.editor)
      await settle()
      demo.measure.mockClear()
      await settle()
      expect(demo.measure).not.toHaveBeenCalled()
    },
  )

  it('follows ancestor scrolling in optimized mode without closing', async () => {
    const demo = render(kind, true, 'optimized')
    await demo.show()
    demo.scroller.scrollTop = 60
    await demo.aligned()
    expect(demo.open.value).toBe(true)
    await settle()
    demo.measure.mockClear()
    await settle()
    expect(demo.measure).not.toHaveBeenCalled()
  })

  it('changes tracking strategy without remounting or moving focus', async () => {
    const demo = render(kind, false, 'optimized')
    await demo.show()
    const panel = demo.panel(),
      focus = document.activeElement
    demo.strategy.value = 'always'
    await nextTick()
    demo.move()
    await demo.aligned()
    demo.strategy.value = 'optimized'
    await settle()
    demo.measure.mockClear()
    await settle()
    expect(demo.measure).not.toHaveBeenCalled()
    demo.strategy.value = 'always'
    await nextTick()
    demo.move()
    await demo.aligned()
    expect(demo.panel()).toBe(panel)
    expect(document.activeElement).toBe(focus)
  })

  it.each(['clear', 'detach'])(
    'follows through exit and retains the last rect after %s',
    async action => {
      const demo = render(kind)
      await demo.show()
      const animations = await demo.exit()
      demo.move()
      demo.scroller.scrollTop = 30
      await demo.aligned()
      const transform = demo.positioner().style.transform
      if (action === 'clear') demo.anchor.value = null
      else demo.scroller.remove()
      demo.move()
      await settle()
      expect(demo.positioner().style.transform).toBe(transform)
      animations.forEach(animation => animation.play())
      await vi.waitFor(() => expect(demo.panel()).toBeNull())
      await settle()
      demo.measure.mockClear()
      await settle()
      expect(demo.measure).not.toHaveBeenCalled()
    },
  )

  it('freezes a reused mutable rectangle when the anchor is cleared', async () => {
    const demo = render(kind, false)
    const rect = new DOMRect(360, 280, 2, 20)
    demo.anchor.value = { getBoundingClientRect: () => rect }
    await demo.show()
    const animations = await demo.exit()
    const transform = demo.positioner().style.transform
    demo.anchor.value = null
    await nextTick()
    rect.x += 100
    await settle()
    expect(demo.positioner().style.transform).toBe(transform)
    animations.forEach(animation => animation.play())
    await vi.waitFor(() => expect(demo.panel()).toBeNull())
  })

  it('treats contextElement as positioning metadata, not an outside-click exception', async () => {
    const demo = render(kind)
    await demo.show()
    if (kind === 'HoverCard') {
      await userEvent.hover(demo.panel()!)
      await userEvent.hover(demo.editor)
      await settle()
      expect(demo.open.value).toBe(true)
    }
    await userEvent.click(demo.editor)
    await vi.waitFor(() => expect(demo.open.value).toBe(false))
    await vi.waitFor(() => expect(demo.panel()).toBeNull())
    expect(document.activeElement).toBe(demo.editor)
  })

  it('switches between real and virtual anchors and stops measuring on unmount', async () => {
    const demo = render(kind)
    await demo.show()
    const panel = demo.panel(),
      virtual = demo.anchor.value
    demo.anchor.value = demo.editor
    await vi.waitFor(() =>
      expect(demo.positioner().getBoundingClientRect().left).toBeCloseTo(
        demo.editor.getBoundingClientRect().left,
        0,
      ),
    )
    demo.anchor.value = virtual
    await nextTick()
    demo.move()
    await demo.aligned()
    expect(demo.panel()).toBe(panel)
    wrapper!.unmount()
    wrapper = undefined
    await settle()
    demo.measure.mockClear()
    await settle()
    expect(demo.measure).not.toHaveBeenCalled()
  })
})

it.each(['Popover', 'DropdownMenu'])(
  '%s retains virtual exit geometry with a separate slotted trigger',
  async kind => {
    const demo = render(kind, true, 'always', true)
    await demo.show()
    const animations = await demo.exit()
    const transform = demo.positioner().style.transform
    demo.anchor.value = null
    await settle()
    expect(demo.positioner().style.transform).toBe(transform)
    animations.forEach(animation => animation.play())
    await vi.waitFor(() => expect(demo.panel()).toBeNull())
  },
)

it('HoverCard switches tracking strategy for a slotted trigger without replacing the panel', async () => {
  const strategy = ref<OverlayPositionStrategy>('optimized')
  wrapper = mount(
    {
      setup: () => () =>
        h(
          HoverCard,
          { open: true, updatePositionStrategy: strategy.value },
          {
            default: () =>
              h('button', { style: 'position:absolute;left:200px;top:200px' }, 'Trigger'),
            content: () => h('div', 'Content'),
          },
        ),
    },
    { attachTo: document.body },
  )
  const trigger = wrapper.get('button').element as HTMLElement
  await vi.waitFor(() => expect(document.querySelector('[data-hn-hover-card]')).not.toBeNull())
  const card = document.querySelector<HTMLElement>('[data-hn-hover-card]')!
  await Promise.allSettled(card.getAnimations().map(animation => animation.finished))
  const measure = vi.spyOn(trigger, 'getBoundingClientRect')
  strategy.value = 'always'
  await settle()
  measure.mockClear()
  await settle()
  expect(measure).toHaveBeenCalled()
  strategy.value = 'optimized'
  await settle()
  measure.mockClear()
  await settle()
  expect(measure).not.toHaveBeenCalled()
  expect(document.querySelector('[data-hn-hover-card]')).toBe(card)
})
