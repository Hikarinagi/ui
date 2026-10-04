import { act, createRef } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render, type RenderResult } from 'vitest-browser-react'
import axe from 'axe-core'
import { Affix } from './Affix'
import { ScrollArea, type ScrollAreaHandle } from '../scroll-area/ScrollArea'
import type { AffixExpose, AffixProps } from './types'
import '../../../test/browser.css'

const screens: RenderResult[] = []
afterEach(async () => {
  for (const screen of screens.splice(0)) await screen.unmount()
  document.body.innerHTML = ''
  document.body.style.cssText = ''
  window.scrollTo(0, 0)
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
async function settle() {
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
}
async function setup(initial: Partial<AffixProps> = {}, scrollArea = false) {
  let props: Partial<AffixProps> = { offset: 12, ...initial }
  const change = vi.fn()
  const handle = createRef<AffixExpose>()
  const area = createRef<ScrollAreaHandle>()
  const ui = () => {
    const content = (
      <div className="region" style={{ height: '700px', display: 'flow-root' }}>
        <div style={{ height: '80px' }}>Before</div>
        <Affix {...props} ref={handle} onChange={change}>
          <button style={{ display: 'block', height: '40px', width: '100%' }}>Save</button>
        </Affix>
        <div className="after" style={{ height: '580px' }}>
          Content
        </div>
      </div>
    )
    return scrollArea ? (
      <ScrollArea ref={area} className="h-60 w-80" shadow={false}>
        {content}
      </ScrollArea>
    ) : (
      <div
        className="scroller"
        style={{
          height: '240px',
          width: '320px',
          overflow: 'auto',
          border: '2px solid',
          padding: 0,
        }}
      >
        {content}
        <div style={{ height: '400px' }}>Next region</div>
      </div>
    )
  }
  const w = await render(ui())
  screens.push(w)
  const get = (selector: string) => w.container.querySelector(selector) as HTMLElement
  return {
    w,
    root: () => w.container.firstElementChild as HTMLElement,
    get,
    change,
    component: handle,
    setProps: async (next: Partial<AffixProps>) => {
      props = { ...props, ...next }
      await w.rerender(ui())
    },
    element: () => get('[data-hn-affix]'),
    viewport: () => (scrollArea ? area.current!.viewport! : get('.scroller')),
  }
}
async function scroll(s: Awaited<ReturnType<typeof setup>>, y: number) {
  s.viewport().scrollTop = y
  await settle()
}

it('sticks to the scrollport with an offset while preserving flow, width, DOM and focus', async () => {
  const s = await setup()
  await settle()
  const button = s.get('button') as HTMLButtonElement
  button.focus({ preventScroll: true })
  const initialAfter = s.get('.after').getBoundingClientRect().top
  const initialWidth = s.element().getBoundingClientRect().width
  await scroll(s, 160)
  await vi.waitFor(() => expect(s.element().hasAttribute('data-affixed')).toBe(true))
  expect(s.element().getBoundingClientRect().top).toBeCloseTo(
    s.viewport().getBoundingClientRect().top + 14,
    1,
  )
  expect(s.get('.after').getBoundingClientRect().top).toBeCloseTo(initialAfter - 160, 1)
  expect(s.element().getBoundingClientRect().width).toBe(initialWidth)
  expect(s.get('button')).toBe(button)
  expect(document.activeElement).toBe(button)
  await scroll(s, 0)
  await vi.waitFor(() => expect(s.element().hasAttribute('data-affixed')).toBe(false))
  expect(s.change.mock.calls.map(args => args[0])).toEqual([true, false])
})

it('lets the parent boundary push the affix away without covering the next region', async () => {
  const s = await setup()
  await scroll(s, 650)
  await vi.waitFor(() =>
    expect(s.element().getBoundingClientRect().bottom).toBeLessThanOrEqual(
      s.get('.region').getBoundingClientRect().bottom + 1,
    ),
  )
  await scroll(s, 760)
  expect(s.element().hasAttribute('data-affixed')).toBe(false)
  expect(s.element().getBoundingClientRect().bottom).toBeLessThan(
    s.viewport().getBoundingClientRect().top,
  )
})

it('supports bottom placement and releases the bar when its natural position enters view', async () => {
  const s = await setup({ position: 'bottom' })
  s.get('.region').insertBefore(s.get('.after'), s.element())
  await settle()
  await vi.waitFor(() => expect(s.element().hasAttribute('data-affixed')).toBe(true))
  const bottom = s.viewport().getBoundingClientRect().bottom - s.viewport().clientTop - 12
  expect(s.element().getBoundingClientRect().bottom).toBeCloseTo(bottom, 1)
  await scroll(s, 650)
  await vi.waitFor(() => expect(s.element().hasAttribute('data-affixed')).toBe(false))
})

it('supports window scrolling without a scroll container', async () => {
  document.body.style.cssText = 'margin:0'
  const w = await render(
    <div style={{ height: '2400px' }}>
      <div style={{ height: '120px' }} />
      <Affix offset={24}>
        <button style={{ height: '40px' }}>Save</button>
      </Affix>
    </div>,
  )
  screens.push(w)
  const affix = () => w.container.querySelector('[data-hn-affix]') as HTMLElement
  window.scrollTo(0, 300)
  await vi.waitFor(() => expect(affix().getBoundingClientRect().top).toBeCloseTo(24, 1))
  await vi.waitFor(() => expect(affix().getAttribute('data-affixed')).toBe(''))
})

it('integrates with ScrollArea initialization and keeps keyboard interactions intact', async () => {
  const s = await setup({}, true)
  await vi.waitFor(() => expect(s.viewport()).toBeInstanceOf(HTMLElement))
  await scroll(s, 180)
  await vi.waitFor(() => expect(s.element().hasAttribute('data-affixed')).toBe(true))
  expect(s.element().getBoundingClientRect().top).toBeCloseTo(
    s.viewport().getBoundingClientRect().top + 12,
    1,
  )
  await userEvent.click(s.get('button'))
  expect(document.activeElement).toBe(s.get('button'))
  const results = await axe.run(s.root(), {
    rules: { region: { enabled: false }, 'color-contrast': { enabled: false } },
  })
  expect(results.violations).toEqual([])
})

it('updates disabled state, offset and size without changing content identity', async () => {
  const s = await setup()
  await scroll(s, 160)
  await s.setProps({ offset: 32 })
  await vi.waitFor(() =>
    expect(s.element().getBoundingClientRect().top).toBeCloseTo(
      s.viewport().getBoundingClientRect().top + 34,
      1,
    ),
  )
  s.viewport().style.width = '220px'
  await settle()
  expect(s.element().getBoundingClientRect().width).toBe(216)
  await s.setProps({ disabled: true })
  await vi.waitFor(() => expect(getComputedStyle(s.element()).position).toBe('relative'))
  expect(s.element().hasAttribute('data-affixed')).toBe(false)
  expect(s.element().getBoundingClientRect().top).toBeLessThan(
    s.viewport().getBoundingClientRect().top,
  )
  await s.setProps({ disabled: false })
  await vi.waitFor(() => expect(s.element().hasAttribute('data-affixed')).toBe(true))
})

it('follows RTL, scaled containers and dynamic child height', async () => {
  const s = await setup()
  s.viewport().dir = 'rtl'
  s.viewport().style.transformOrigin = '0 0'
  s.viewport().style.transform = 'scale(0.75)'
  await scroll(s, 160)
  await vi.waitFor(() => expect(s.element().hasAttribute('data-affixed')).toBe(true))
  const button = s.get('button')
  button.style.height = '80px'
  await settle()
  expect(s.element().getBoundingClientRect().height).toBe(60)
  expect(s.element().getBoundingClientRect().top).toBeCloseTo(
    s.viewport().getBoundingClientRect().top + 14 * 0.75,
    1,
  )
})

it('does not write positioning styles while scrolling or emit duplicate state changes', async () => {
  const s = await setup()
  await scroll(s, 160)
  await vi.waitFor(() => expect(s.change).toHaveBeenCalledOnce())
  const records: MutationRecord[] = []
  const observer = new MutationObserver(events => records.push(...events))
  observer.observe(s.element(), { attributes: true, subtree: true })
  await scroll(s, 180)
  await scroll(s, 210)
  expect(s.change).toHaveBeenCalledOnce()
  expect(records).toEqual([])
  observer.disconnect()
})

it('hydrates the same already-sticky SSR nodes', async () => {
  const App = () => (
    <div style={{ overflow: 'auto', height: '160px' }}>
      <div style={{ height: '600px' }}>
        <div style={{ height: '80px' }} />
        <Affix offset={8}>
          <button>Save</button>
        </Affix>
      </div>
    </div>
  )
  const host = document.createElement('div')
  host.innerHTML = renderToString(<App />)
  document.body.append(host)
  const scroller = host.firstElementChild as HTMLElement
  scroller.scrollTop = 180
  const before = host.querySelector('button')!
  const el = host.querySelector('[data-hn-affix]')!
  expect(el.getBoundingClientRect().top).toBeCloseTo(scroller.getBoundingClientRect().top + 8, 1)
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  const error = vi.spyOn(console, 'error').mockImplementation(() => {})
  const active = Reflect.get(globalThis, 'IS_REACT_ACT_ENVIRONMENT')
  Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
  let client!: ReturnType<typeof hydrateRoot>
  try {
    await act(async () => {
      client = hydrateRoot(host, <App />, { onRecoverableError: e => console.error(e) })
    })
    await settle()
    expect(host.querySelector('button')).toBe(before)
    expect(
      [...warn.mock.calls, ...error.mock.calls].filter(args => /hydrat/i.test(String(args[0]))),
    ).toEqual([])
  } finally {
    await act(async () => client.unmount())
    Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', active)
  }
})

it('supports negative offsets and scrolling without observer APIs', async () => {
  vi.stubGlobal('ResizeObserver', undefined)
  vi.stubGlobal('IntersectionObserver', undefined)
  const s = await setup({ offset: -8 })
  await scroll(s, 160)
  await vi.waitFor(() => expect(s.element().hasAttribute('data-affixed')).toBe(true))
  expect(s.element().getBoundingClientRect().top).toBeCloseTo(
    s.viewport().getBoundingClientRect().top - 6,
    1,
  )
  await scroll(s, 0)
  await vi.waitFor(() => expect(s.element().hasAttribute('data-affixed')).toBe(false))
})

it('refreshes hidden layouts and exposes state without remounting content', async () => {
  const s = await setup()
  const button = s.get('button')
  s.viewport().style.display = 'none'
  await settle()
  expect(s.element().hasAttribute('data-affixed')).toBe(false)
  s.viewport().style.display = 'block'
  await scroll(s, 160)
  await vi.waitFor(() => expect(s.component.current!.affixed).toBe(true))
  expect(s.component.current!.element).toBe(s.element())
  s.component.current!.update()
  await settle()
  expect(s.get('button')).toBe(button)
})

it('disconnects listeners and observers on unmount', async () => {
  const disconnect = vi.spyOn(ResizeObserver.prototype, 'disconnect')
  const s = await setup()
  await settle()
  await s.w.unmount()
  screens.splice(screens.indexOf(s.w), 1)
  const count = s.change.mock.calls.length
  document.dispatchEvent(new Event('scroll'))
  window.dispatchEvent(new Event('resize'))
  await settle()
  expect(disconnect).toHaveBeenCalled()
  expect(s.change).toHaveBeenCalledTimes(count)
})
