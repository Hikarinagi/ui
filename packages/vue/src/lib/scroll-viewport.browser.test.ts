import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h, nextTick, ref, shallowRef, watch, type Component } from 'vue'
import Sheet from '../components/sheet/Sheet.vue'
import Drawer from '../components/drawer/Drawer.vue'
import Dialog from '../components/dialog/Dialog.vue'
import ScrollArea from '../components/scroll-area/ScrollArea.vue'
import '../../test/browser.css'

let wrapper: VueWrapper | undefined
beforeEach(async () => {
  await page.viewport(1000, 800)
  document.body.innerHTML = ''
})
afterEach(async () => {
  wrapper?.unmount()
  wrapper = undefined
  await vi.waitFor(() => expect(document.body.style.overflow).toBe(''))
  document.body.innerHTML = ''
})

const components: Record<string, Component> = { Sheet, Drawer, Dialog }
function render(kind: string, content = true) {
  const modal = shallowRef<{ readonly viewport: HTMLElement | undefined }>()
  const open = ref(false)
  const hasContent = ref(content)
  const body = ref(false)
  const changes: Array<HTMLElement | undefined> = []
  wrapper = mount(
    {
      setup() {
        watch(
          () => modal.value?.viewport,
          value => changes.push(value),
        )
        return () =>
          h(
            components[kind]!,
            {
              ref: modal,
              title: 'Scroll viewport',
              description: 'Content area',
              open: open.value,
              'onUpdate:open': (value: boolean) => {
                open.value = value
              },
            },
            {
              ...(hasContent.value
                ? { content: () => h('div', { style: 'height:2400px' }, 'Content') }
                : {}),
              ...(body.value
                ? {
                    body: () =>
                      h(ScrollArea, { class: 'h-40' }, () =>
                        h('div', { style: 'height:1200px' }, 'Custom body'),
                      ),
                  }
                : {}),
              footer: () => h('button', 'Footer'),
            },
          )
      },
    },
    { attachTo: document.body },
  )
  const panel = () => document.querySelector<HTMLElement>('[role="dialog"]')
  async function ready() {
    await vi.waitFor(() => expect(modal.value?.viewport).toBeInstanceOf(HTMLElement), {
      timeout: 5000,
    })
    await Promise.allSettled(
      panel()!
        .getAnimations()
        .map(animation => animation.finished),
    )
    return modal.value!.viewport!
  }
  return { modal, open, hasContent, body, changes, panel, ready }
}

describe.each(Object.keys(components))('%s content viewport', kind => {
  it('exposes the actual scrollable element reactively and supports native scroll events and methods', async () => {
    const demo = render(kind)
    expect(demo.modal.value?.viewport).toBeUndefined()
    demo.open.value = true
    const viewport = await demo.ready()
    expect(viewport).toBe(demo.panel()!.querySelector('[data-overlayscrollbars-viewport]'))
    expect(viewport).not.toBe(demo.panel())
    expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight)
    expect(demo.changes).toContain(viewport)
    const scroll = vi.fn()
    viewport.addEventListener('scroll', scroll)
    viewport.scrollTo({ top: 180 })
    await vi.waitFor(() => {
      expect(viewport.scrollTop).toBe(180)
      expect(scroll).toHaveBeenCalled()
    })
    viewport.scrollTo({ top: 0 })
    await vi.waitFor(() => expect(viewport.scrollTop).toBe(0))
    viewport.removeEventListener('scroll', scroll)
  })

  it('retains the viewport during exit, clears it on unmount and exposes a fresh element on reopen', async () => {
    const demo = render(kind)
    demo.open.value = true
    const viewport = await demo.ready()
    demo.open.value = false
    await vi.waitFor(() => expect(demo.panel()?.dataset.state).toBe('closed'), { interval: 5 })
    const animations = demo.panel()!.getAnimations()
    expect(animations.length).toBeGreaterThan(0)
    animations.forEach(animation => animation.pause())
    expect(demo.modal.value?.viewport).toBe(viewport)
    expect(viewport.isConnected).toBe(true)
    animations.forEach(animation => animation.play())
    await vi.waitFor(() => expect(demo.modal.value?.viewport).toBeUndefined())
    expect(viewport.isConnected).toBe(false)
    expect(demo.changes.at(-1)).toBeUndefined()
    demo.open.value = true
    const next = await demo.ready()
    expect(next).not.toBe(viewport)
    expect(demo.changes.at(-1)).toBe(next)
    const instance = demo.modal.value!
    wrapper!.unmount()
    wrapper = undefined
    expect(instance.viewport).toBeUndefined()
    expect(next.isConnected).toBe(false)
  })

  it('tracks content slot removal and restoration without exposing the panel or footer', async () => {
    const demo = render(kind, false)
    demo.open.value = true
    await vi.waitFor(() => expect(demo.panel()).not.toBeNull())
    expect(demo.modal.value?.viewport).toBeUndefined()
    demo.hasContent.value = true
    const viewport = await demo.ready()
    demo.hasContent.value = false
    await nextTick()
    expect(demo.modal.value?.viewport).toBeUndefined()
    expect(viewport.isConnected).toBe(false)
    expect(demo.panel()).not.toBeNull()
    demo.hasContent.value = true
    expect(await demo.ready()).not.toBe(viewport)
  })
})

it('Dialog body bypasses the built-in viewport even when it includes a custom ScrollArea', async () => {
  const demo = render('Dialog')
  demo.open.value = true
  const viewport = await demo.ready()
  demo.body.value = true
  await vi.waitFor(() => expect(demo.modal.value?.viewport).toBeUndefined())
  expect(viewport.isConnected).toBe(false)
  await vi.waitFor(() =>
    expect(demo.panel()!.querySelector('[data-overlayscrollbars-viewport]')).not.toBeNull(),
  )
  expect(demo.modal.value?.viewport).toBeUndefined()
  demo.body.value = false
  expect(await demo.ready()).not.toBe(viewport)
})
