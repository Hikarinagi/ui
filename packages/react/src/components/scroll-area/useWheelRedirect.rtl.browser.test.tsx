import { createRef } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, type RenderResult } from 'vitest-browser-react'
import { ScrollArea, type ScrollAreaHandle, type ScrollAreaProps } from './ScrollArea'
import '../../../test/browser.css'

const wrappers: RenderResult[] = []
afterEach(async () => {
  for (const wrapper of wrappers.splice(0)) await wrapper.unmount()
  document.body.innerHTML = ''
})

async function create(dir: 'ltr' | 'rtl') {
  const host = document.createElement('div')
  host.dir = dir
  document.body.append(host)
  const handle = createRef<ScrollAreaHandle>()
  const ui = (props: Partial<ScrollAreaProps>) => (
    <ScrollArea ref={handle} direction="horizontal" className="w-[200px]" {...props}>
      <div style={{ width: '600px', height: '80px' }} />
    </ScrollArea>
  )
  const screen = await render(ui({}), { container: host })
  const wrapper = {
    ...screen,
    setProps: (props: Partial<ScrollAreaProps>) => screen.rerender(ui(props)),
  }
  wrappers.push(wrapper)
  await vi.waitFor(() => expect(handle.current?.instance).toBeDefined())
  return { wrapper, viewport: handle.current!.viewport!, host }
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
