import { createRef, type ElementType, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import { afterEach, expect, it, vi } from 'vitest'
import type { RenderResult } from 'vitest-browser-react'
import { OverlayScrollbars } from 'overlayscrollbars'
import { Dialog } from '../dialog/Dialog'
import { Drawer } from '../drawer/Drawer'
import { Sheet } from '../sheet/Sheet'
import { ScrollArea, type ScrollAreaHandle } from './ScrollArea'
import '../../../test/browser.css'

let wrapper: Pick<RenderResult, 'unmount'> | undefined
const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()))

afterEach(async () => {
  await wrapper?.unmount()
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

function mountSync(ui: ReactNode) {
  const container = document.body.appendChild(document.createElement('div'))
  const root = createRoot(container)
  flushSync(() => root.render(ui))
  return {
    container,
    element: container.firstElementChild as HTMLElement,
    rerender: async (next: ReactNode) => flushSync(() => root.render(next)),
    unmount: async () => root.unmount(),
  }
}

function scrollAreaIn(root: ParentNode) {
  const element = root.querySelector<HTMLElement>('.hn-scroll-area')
  if (!element) return undefined
  const host = element.querySelector<HTMLElement>('[data-overlayscrollbars-initialize]')!
  return {
    element,
    host,
    get instance() {
      return OverlayScrollbars(host)
    },
    get viewport() {
      return OverlayScrollbars(host)?.elements().viewport
    },
  }
}

it('initializes on the next frame despite scrolling and unavailable idle time, preserving the native offset', async () => {
  const idle = vi.spyOn(window, 'requestIdleCallback').mockReturnValue(1)
  const area = createRef<ScrollAreaHandle>()
  const screen = mountSync(
    <ScrollArea ref={area} className="h-40" autoHide="never">
      <div style={{ height: '2000px' }}>Content</div>
    </ScrollArea>,
  )
  wrapper = screen
  const host = screen.element.querySelector<HTMLElement>('[data-overlayscrollbars-initialize]')!
  host.scrollTop = 180
  host.dispatchEvent(new Event('scroll'))
  host.dispatchEvent(new WheelEvent('wheel', { deltaY: 180, bubbles: true }))
  host.dispatchEvent(new Event('touchmove', { bubbles: true }))
  expect(area.current?.instance).toBeUndefined()
  await frame()
  expect(idle).not.toHaveBeenCalled()
  expect(area.current?.instance).toBeDefined()
  expect(area.current?.viewport?.scrollTop).toBe(180)
  expect(screen.element.querySelector('.os-scrollbar-vertical') !== null).toBe(true)
})

it.each<{ name: string; component: ElementType }>([
  { name: 'HnDialog', component: Dialog },
  { name: 'HnSheet', component: Sheet },
  { name: 'HnDrawer', component: Drawer },
])(
  '$name initializes the built-in scrollbar immediately on both opening and reopening after scrolling',
  async ({ component: Overlay }) => {
    vi.spyOn(window, 'requestIdleCallback').mockReturnValue(1)
    const ui = (open: boolean) => (
      <Overlay
        open={open}
        title="Content"
        renderContent={() => <div style={{ height: '2000px' }}>Long content</div>}
      />
    )
    const screen = mountSync(ui(false))
    wrapper = screen
    for (let cycle = 0; cycle < 2; cycle++) {
      await screen.rerender(ui(true))
      const area = scrollAreaIn(document)!
      const host = area.host
      host.scrollTop = 160
      host.dispatchEvent(new Event('scroll'))
      await frame()
      expect(area.instance).toBeDefined()
      expect(area.viewport?.scrollTop).toBe(160)
      expect(area.element.querySelector('.os-scrollbar-vertical') !== null).toBe(true)
      area.viewport!.scrollTop += 160
      area.viewport!.dispatchEvent(new Event('scroll'))
      await screen.rerender(ui(false))
      await vi.waitFor(() => expect(scrollAreaIn(document) !== undefined).toBe(false))
    }
  },
)

it('cancels initialization when unmounted before the next frame', async () => {
  const area = createRef<ScrollAreaHandle>()
  const screen = mountSync(
    <ScrollArea ref={area} className="h-40">
      <div style={{ height: '2000px' }} />
    </ScrollArea>,
  )
  wrapper = screen
  const root = screen.element
  await screen.unmount()
  wrapper = undefined
  await frame()
  expect(area.current?.instance).toBeUndefined()
  expect(root.querySelector('.os-scrollbar')).toBeNull()
})
