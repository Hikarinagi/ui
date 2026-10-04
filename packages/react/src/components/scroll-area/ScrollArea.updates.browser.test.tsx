import { createRef, type CSSProperties, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { RenderResult } from 'vitest-browser-react'
import { LayoutTransitionProvider } from '../../lib/layout-stability'
import { ScrollArea, type ScrollAreaHandle } from './ScrollArea'
import { mount } from '../../../test/mount'
import '../../../test/browser.css'

const mounted: Pick<RenderResult, 'unmount'>[] = []

function mountSync(ui: ReactNode) {
  const container = document.body.appendChild(document.createElement('div'))
  const root = createRoot(container)
  flushSync(() => root.render(ui))
  return {
    element: container.firstElementChild as HTMLElement,
    unmount: async () => root.unmount(),
  }
}

afterEach(async () => {
  for (const wrapper of mounted.splice(0)) await wrapper.unmount()
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

async function harness() {
  const area = createRef<ScrollAreaHandle>()
  const ui = ({ transitioning, height }: { transitioning: boolean; height: number }) => (
    <LayoutTransitionProvider transitioning={transitioning}>
      <ScrollArea ref={area} className="h-40 w-60">
        <div data-content="" style={{ height: `${height}px` }} />
      </ScrollArea>
    </LayoutTransitionProvider>
  )
  const state = { transitioning: false, height: 400 }
  const wrapper = await mount(ui(state))
  mounted.push(wrapper)
  await vi.waitFor(() => expect(area.current?.instance).toBeTruthy())
  const instance = area.current!.instance!
  await vi.waitFor(() => expect(instance.state().overflowAmount.y).toBe(240))
  await new Promise(resolve => setTimeout(resolve, 60))
  const update = (next: Partial<typeof state>) => {
    Object.assign(state, next)
    return wrapper.rerender(ui(state))
  }
  return { update, instance, viewport: area.current!.viewport! }
}

describe('ScrollArea measurement updates', () => {
  it.each<[string, CSSProperties, number]>([
    ['natural', {}, 400],
    ['fixed', { height: '160px' }, 160],
    ['maximum', { maxHeight: '160px' }, 160],
  ])('preserves %s height and overflow before and after enhancement', async (_, style, height) => {
    const area = createRef<ScrollAreaHandle>()
    const wrapper = mountSync(
      <ScrollArea ref={area} className="w-60" style={style}>
        <div style={{ height: '400px' }} />
      </ScrollArea>,
    )
    mounted.push(wrapper)
    const host = wrapper.element.querySelector<HTMLElement>('[data-overlayscrollbars-initialize]')!
    expect(host.clientHeight).toBe(height)
    await vi.waitFor(() => expect(area.current?.instance).toBeTruthy())
    const viewport = area.current!.viewport!
    expect(viewport.clientHeight).toBe(height)
    expect(viewport.scrollHeight).toBe(400)
  })

  it('does not write identical viewport attributes during forced updates', async () => {
    const { instance, viewport } = await harness()
    const identical: string[] = []
    const setAttribute = viewport.setAttribute.bind(viewport)
    vi.spyOn(viewport, 'setAttribute').mockImplementation((name, value) => {
      if (viewport.getAttribute(name) === value) identical.push(name)
      setAttribute(name, value)
    })
    viewport.scrollTop = 80
    for (let i = 0; i < 3; i++) instance.update(true)
    expect(identical).toEqual([])
    expect(viewport.scrollTop).toBe(80)
    expect(instance.state().overflowAmount.y).toBe(240)
  })

  it('coalesces bubbled animation and transition completions into one update', async () => {
    const { instance, viewport } = await harness()
    const update = vi.spyOn(instance, 'update')
    const child = viewport.querySelector('[data-content]')!
    for (let i = 0; i < 20; i++) {
      child.dispatchEvent(new Event('transitionend', { bubbles: true }))
      child.dispatchEvent(new Event('animationend', { bubbles: true }))
    }
    expect(update).not.toHaveBeenCalled()
    await new Promise(requestAnimationFrame)
    expect(update).toHaveBeenCalledTimes(1)
  })

  it('defers content measurements during a layout transition and catches up when it ends', async () => {
    const { instance, update, viewport } = await harness()
    const updates = vi.fn()
    instance.on('updated', updates)
    await update({ transitioning: true })
    expect(instance.state().sleeping).toBe(true)
    const scrollHeight = vi.spyOn(viewport, 'scrollHeight', 'get')
    const geometry = vi.spyOn(viewport, 'getBoundingClientRect')
    await update({ height: 700 })
    viewport
      .querySelector('[data-content]')!
      .dispatchEvent(new Event('transitionend', { bubbles: true }))
    await new Promise(requestAnimationFrame)
    await new Promise(requestAnimationFrame)
    expect(updates).not.toHaveBeenCalled()
    expect(scrollHeight).not.toHaveBeenCalled()
    expect(geometry).not.toHaveBeenCalled()
    viewport.scrollTop = 120
    await update({ transitioning: false })
    await vi.waitFor(() => expect(instance.state().overflowAmount.y).toBe(540))
    expect(instance.state().sleeping).toBe(false)
    expect(viewport.scrollTop).toBe(120)
  })

  it('waits for both nested layout transitions before resuming measurements', async () => {
    const area = createRef<ScrollAreaHandle>()
    const ui = (outer: boolean, inner: boolean) => (
      <LayoutTransitionProvider transitioning={outer}>
        <LayoutTransitionProvider transitioning={inner}>
          <ScrollArea ref={area} className="h-40 w-60">
            <div style={{ height: '400px' }} />
          </ScrollArea>
        </LayoutTransitionProvider>
      </LayoutTransitionProvider>
    )
    const wrapper = await mount(ui(false, false))
    mounted.push(wrapper)
    await vi.waitFor(() => expect(area.current?.instance).toBeTruthy())
    const instance = area.current!.instance!
    await wrapper.rerender(ui(true, false))
    expect(instance.state().sleeping).toBe(true)
    await wrapper.rerender(ui(true, true))
    await wrapper.rerender(ui(false, true))
    expect(instance.state().sleeping).toBe(true)
    await wrapper.rerender(ui(false, false))
    expect(instance.state().sleeping).toBe(false)
  })
})
