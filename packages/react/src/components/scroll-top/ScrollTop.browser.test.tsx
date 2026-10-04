import { afterEach, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render, type RenderResult } from 'vitest-browser-react'
import { act, createRef } from 'react'
import { TooltipProvider } from '../tooltip/TooltipProvider'
import { ScrollTop } from './ScrollTop'
import { ScrollArea, type ScrollAreaHandle } from '../scroll-area/ScrollArea'
import type { ScrollTopExpose, ScrollTopProps } from './types'
import { signal } from '../../../test/signal'
import '../../../test/browser.css'

const mounted: RenderResult[] = []
afterEach(async () => {
  for (const w of mounted.splice(0)) await w.unmount()
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

async function flush(change: () => void) {
  const active = Reflect.get(globalThis, 'IS_REACT_ACT_ENVIRONMENT')
  Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
  try {
    await act(async () => change())
  } finally {
    Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', active)
  }
}

async function setup(props: ScrollTopProps = {}) {
  const target = signal<HTMLElement | null>(null)
  const scroller = document.createElement('div')
  scroller.style.cssText = 'width:300px;height:200px;overflow:auto'
  const content = document.createElement('div')
  content.style.cssText = 'width:600px;height:1800px'
  scroller.append(content)
  document.body.append(scroller)
  target.value = scroller
  const onClick = vi.fn()
  const component = createRef<ScrollTopExpose>()
  const host = document.createElement('div')
  document.body.append(host)
  function App() {
    const current = target.use()
    return (
      <TooltipProvider delayDuration={0}>
        <ScrollTop
          ref={component}
          target={() => current}
          position="static"
          behavior="instant"
          {...props}
          onClick={onClick}
        />
      </TooltipProvider>
    )
  }
  const wrapper = await render(<App />, { container: host })
  mounted.push(wrapper)
  return {
    wrapper,
    target,
    scroller,
    content,
    onClick,
    component,
    button: () => document.querySelector<HTMLButtonElement>('[data-hn-scroll-top]'),
  }
}
async function scroll(s: Awaited<ReturnType<typeof setup>>, top: number) {
  await flush(() => {
    s.scroller.scrollTop = top
    s.scroller.dispatchEvent(new Event('scroll'))
  })
}

it('shows only beyond the threshold and resets vertical scroll without moving horizontally', async () => {
  const s = await setup({ threshold: 100 })
  expect(s.button()).toBeNull()
  await scroll(s, 100)
  expect(s.button()).toBeNull()
  s.scroller.scrollLeft = 80
  await scroll(s, 101)
  await vi.waitFor(() => expect(s.button()).not.toBeNull())
  await userEvent.click(s.button()!)
  await vi.waitFor(() => expect(s.scroller.scrollTop).toBe(0))
  expect(s.scroller.scrollLeft).toBe(80)
  expect(s.onClick).toHaveBeenCalledOnce()
  await vi.waitFor(() => expect(s.button()).toBeNull())
})

it('retains a keyboard user’s focused button until focus leaves after returning to the top', async () => {
  const s = await setup({ threshold: 100 })
  await scroll(s, 300)
  await userEvent.keyboard('{Tab}')
  s.button()!.focus()
  await userEvent.keyboard('{Enter}')
  await vi.waitFor(() => expect(s.scroller.scrollTop).toBe(0))
  expect(s.button()).toBe(document.activeElement)
  const outside = document.createElement('button')
  outside.textContent = 'Next'
  document.body.append(outside)
  outside.focus()
  await vi.waitFor(() => expect(s.button()).toBeNull())
})

it('accepts a delayed target, detaches old listeners and does not fall back to the page', async () => {
  const s = await setup({ threshold: 100 })
  await scroll(s, 500)
  await vi.waitFor(() => expect(s.component.current!.visible).toBe(true))
  const remove = vi.spyOn(s.scroller, 'removeEventListener')
  await flush(() => {
    s.target.value = null
  })
  expect(s.component.current!.visible).toBe(false)
  expect(remove).toHaveBeenCalledWith('scroll', expect.any(Function))
  const pageScroll = vi.spyOn(window, 'scrollTo')
  s.component.current!.scrollToTop()
  expect(pageScroll).not.toHaveBeenCalled()
  s.target.value = s.scroller
  await vi.waitFor(() => expect(s.component.current!.visible).toBe(true))
})

it('returns focus to an explicit destination without another scroll jump', async () => {
  const heading = document.createElement('h2')
  heading.tabIndex = -1
  heading.textContent = 'Title'
  document.body.append(heading)
  const s = await setup({ threshold: 100, focusTarget: () => heading })
  await scroll(s, 300)
  await userEvent.click(s.button()!)
  expect(document.activeElement).toBe(heading)
  expect(s.scroller.scrollTop).toBe(0)
})

it.each(['disabled', 'loading'] as const)(
  'does not scroll when %s, including through expose',
  async state => {
    const s = await setup({
      threshold: 100,
      ...(state === 'disabled' ? { disabled: true } : { loading: true }),
    })
    await scroll(s, 300)
    expect(s.button()!.disabled).toBe(true)
    s.button()!.click()
    s.component.current!.scrollToTop()
    expect(s.scroller.scrollTop).toBe(300)
  },
)

it('lets callers cancel the scroll request', async () => {
  const s = await setup({ threshold: 100 })
  s.onClick.mockImplementation((event: MouseEvent) => event.preventDefault())
  await scroll(s, 300)
  await userEvent.click(s.button()!)
  expect(s.scroller.scrollTop).toBe(300)
})

it('respects reduced motion even when smooth scrolling is requested', async () => {
  const native = window.matchMedia.bind(window)
  vi.spyOn(window, 'matchMedia').mockImplementation(query =>
    query.includes('prefers-reduced-motion')
      ? Object.defineProperty(native(query), 'matches', { value: true })
      : native(query),
  )
  const s = await setup({ threshold: 100, behavior: 'smooth' })
  await scroll(s, 300)
  const method = vi.spyOn(s.scroller, 'scrollTo')
  s.component.current!.scrollToTop()
  expect(method).toHaveBeenCalledWith({ top: 0, behavior: 'instant' })
})

it('works with the asynchronously exposed ScrollArea viewport', async () => {
  const area = createRef<ScrollAreaHandle>()
  const wrapper = await render(
    <div>
      <ScrollArea ref={area} style={{ height: '200px', width: '300px' }}>
        <div style={{ height: '1800px' }}>Content</div>
      </ScrollArea>
      <ScrollTop
        target={() => area.current?.viewport}
        threshold={100}
        position="static"
        behavior="instant"
      />
    </div>,
  )
  mounted.push(wrapper)
  await vi.waitFor(() => expect(area.current?.viewport).toBeInstanceOf(HTMLElement))
  area.current!.viewport!.scrollTop = 500
  await vi.waitFor(() => expect(document.querySelector('[data-hn-scroll-top]')).not.toBeNull())
  await userEvent.click(document.querySelector<HTMLButtonElement>('[data-hn-scroll-top]')!)
  await vi.waitFor(() => expect(area.current!.viewport!.scrollTop).toBe(0))
})

it('renders a real enter/leave transition with a TooltipProvider', async () => {
  const warn = vi.spyOn(console, 'warn')
  const s = await setup({ threshold: 100 })
  await scroll(s, 300)
  await vi.waitFor(() => expect(s.button()).not.toBeNull())
  expect(warn.mock.calls.flat().join(' ')).not.toMatch(/non-element root|cannot be animated/)
  await scroll(s, 0)
  await vi.waitFor(() => expect(s.button()).toBeNull())
})

it('defaults to the page and removes its listener on unmount', async () => {
  const spacer = document.createElement('div')
  spacer.style.height = '3000px'
  document.body.append(spacer)
  const component = createRef<ScrollTopExpose>()
  const host = document.createElement('div')
  document.body.append(host)
  const wrapper = await render(<ScrollTop ref={component} threshold={100} behavior="instant" />, {
    container: host,
  })
  const method = vi.spyOn(window, 'removeEventListener')
  window.scrollTo({ top: 500, behavior: 'instant' })
  await vi.waitFor(() => expect(component.current!.visible).toBe(true))
  component.current!.scrollToTop()
  await vi.waitFor(() => expect(window.scrollY).toBe(0))
  await wrapper.unmount()
  expect(method).toHaveBeenCalledWith('scroll', expect.any(Function))
})
