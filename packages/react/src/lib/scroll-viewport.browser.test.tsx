import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import type { ComponentType, ReactNode, Ref } from 'react'
import { Sheet } from '../components/sheet/Sheet'
import { Drawer } from '../components/drawer/Drawer'
import { Dialog } from '../components/dialog/Dialog'
import { ScrollArea } from '../components/scroll-area/ScrollArea'
import { mount } from '../../test/mount'
import { signal, tick } from '../../test/signal'
import '../../test/browser.css'

interface ModalHandle {
  readonly viewport: HTMLElement | undefined
}

interface ModalProps {
  title: string
  description?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  renderContent?: () => ReactNode
  renderBody?: () => ReactNode
  renderFooter?: () => ReactNode
  ref?: Ref<ModalHandle>
}

let wrapper: { unmount: () => Promise<void> } | undefined
beforeEach(async () => {
  await page.viewport(1000, 800)
  document.body.innerHTML = ''
})
afterEach(async () => {
  await wrapper?.unmount()
  wrapper = undefined
  await vi.waitFor(() => expect(document.body.style.overflow).toBe(''))
  document.body.innerHTML = ''
})

const components: Record<string, ComponentType<ModalProps>> = { Sheet, Drawer, Dialog }
async function render(kind: string, content = true) {
  const modal: { value: ModalHandle | null } = { value: null }
  const open = signal(false)
  const hasContent = signal(content)
  const body = signal(false)
  const changes: Array<HTMLElement | undefined> = []
  let recorded: HTMLElement | undefined
  const Modal = components[kind]!
  function Harness() {
    const withContent = hasContent.use()
    const withBody = body.use()
    return (
      <Modal
        ref={handle => {
          modal.value = handle
          if (!handle) return
          if (handle.viewport === recorded) return
          recorded = handle.viewport
          changes.push(handle.viewport)
        }}
        title="Scroll viewport"
        description="Content area"
        open={open.use()}
        onOpenChange={value => {
          open.value = value
        }}
        {...(withContent
          ? { renderContent: () => <div style={{ height: '2400px' }}>Content</div> }
          : {})}
        {...(withBody
          ? {
              renderBody: () => (
                <ScrollArea className="h-40">
                  <div style={{ height: '1200px' }}>Custom body</div>
                </ScrollArea>
              ),
            }
          : {})}
        renderFooter={() => <button>Footer</button>}
      />
    )
  }
  wrapper = await mount(<Harness />)
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
    const demo = await render(kind)
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
    const demo = await render(kind)
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
    await wrapper!.unmount()
    wrapper = undefined
    expect(instance.viewport).toBeUndefined()
    expect(next.isConnected).toBe(false)
  })

  it('tracks content slot removal and restoration without exposing the panel or footer', async () => {
    const demo = await render(kind, false)
    demo.open.value = true
    await vi.waitFor(() => expect(demo.panel()).not.toBeNull())
    expect(demo.modal.value?.viewport).toBeUndefined()
    demo.hasContent.value = true
    const viewport = await demo.ready()
    demo.hasContent.value = false
    await tick()
    expect(demo.modal.value?.viewport).toBeUndefined()
    expect(viewport.isConnected).toBe(false)
    expect(demo.panel()).not.toBeNull()
    demo.hasContent.value = true
    expect(await demo.ready()).not.toBe(viewport)
  })
})

it.each(Object.keys(components))(
  '%s body bypasses the built-in viewport even when it includes a custom ScrollArea',
  async kind => {
    const demo = await render(kind)
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
  },
)
