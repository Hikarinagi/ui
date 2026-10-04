import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { HoverCard } from './HoverCard'
import { mount } from '../../../test/mount'
import { signal, tick } from '../../../test/signal'
import '../../../test/browser.css'

type Mounted = Awaited<ReturnType<typeof mount>>

let mounted: Mounted[] = []
beforeEach(async () => {
  document.body.innerHTML = ''
  await page.viewport(1000, 700)
  window.scrollTo(0, 0)
})
afterEach(async () => {
  for (const w of mounted) await w.unmount()
  mounted = []
  vi.restoreAllMocks()
})

async function render(closeDelay = 100) {
  const open = signal(false)
  const anchor = signal<HTMLElement | null>(null)
  const update = vi.fn()
  const title = signal('A')
  function Harness() {
    const currentOpen = open.use()
    const currentAnchor = anchor.use()
    const currentTitle = title.use()
    return (
      <div>
        {['A', 'B'].map((name, index) => (
          <button
            key={name}
            type="button"
            data-anchor={name}
            style={{
              position: 'absolute',
              left: 180 + index * 380 + 'px',
              top: '160px',
              width: '80px',
              height: '36px',
            }}
            onPointerEnter={event => {
              if (event.pointerType === 'touch') return
              anchor.value = event.currentTarget
              title.value = name
              open.value = true
            }}
            onFocus={event => {
              anchor.value = event.currentTarget
              title.value = name
              open.value = true
            }}
          >
            {name}
          </button>
        ))}
        <button
          type="button"
          data-outside=""
          style={{ position: 'absolute', left: '900px', top: '600px' }}
        >
          Outside
        </button>
        <HoverCard
          open={currentOpen}
          anchor={currentAnchor}
          openDelay={300}
          closeDelay={closeDelay}
          onOpenChange={value => {
            open.value = !!value
            update(value)
          }}
          content={<div style={{ width: '160px' }}>{currentTitle}</div>}
        />
      </div>
    )
  }
  const w = await mount(<Harness />)
  mounted.push(w)
  const a = w.container.querySelector('[data-anchor="A"]') as HTMLElement
  const b = w.container.querySelector('[data-anchor="B"]') as HTMLElement
  const outside = w.container.querySelector('[data-outside]') as HTMLElement
  return { w, a, b, outside, open, anchor, title, update }
}
const panel = () => document.querySelector<HTMLElement>('[data-hn-hover-card]')
const settle = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
async function visible() {
  await vi.waitFor(() => expect(panel()?.dataset.state).toBe('open'))
  await Promise.allSettled(
    panel()!
      .getAnimations()
      .map(animation => animation.finished),
  )
}
const center = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect()
  return rect.left + rect.width / 2
}

function scrollable(w: Mounted, target: 'page' | 'container') {
  const root = w.element
  if (target === 'page') {
    root.style.height = '1600px'
    return document.documentElement
  }
  root.style.cssText = 'position:relative;width:1000px;height:500px;overflow:auto'
  const spacer = document.createElement('div')
  spacer.style.height = '1600px'
  root.appendChild(spacer)
  return root
}

async function pauseExit() {
  await vi.waitFor(() => expect(panel()?.dataset.state).toBe('closed'), { interval: 5 })
  const card = panel()!
  const animations = card.getAnimations()
  expect(animations.length).toBeGreaterThan(0)
  animations.forEach(animation => animation.pause())
  return { card, positioner: card.parentElement!, animations }
}

async function aligned(positioner: HTMLElement, anchor: HTMLElement) {
  await vi.waitFor(() =>
    expect(
      Math.abs(positioner.getBoundingClientRect().top - anchor.getBoundingClientRect().bottom - 8),
    ).toBeLessThan(1),
  )
}

describe('HoverCard external anchor', () => {
  it('requires explicit open and positions one panel against successive elements', async () => {
    const { a, b, anchor, open, title, w } = await render()
    anchor.value = a
    await tick()
    expect(panel()).toBeNull()
    open.value = true
    await visible()
    const card = panel()!
    expect(Math.abs(center(card) - center(a))).toBeLessThan(1)
    anchor.value = b
    title.value = 'B'
    await tick()
    await vi.waitFor(() => expect(Math.abs(center(card) - center(b))).toBeLessThan(1))
    expect(panel()).toBe(card)
    expect(card.textContent).toBe('B')
    expect(w.container.querySelectorAll('button')).toHaveLength(3)
    expect(document.body.style.pointerEvents).toBe('')
    expect(document.body.style.overflow).toBe('')
  })

  it('keeps the card open while moving between its anchor and content, then closes after the delay', async () => {
    const { a, outside, open } = await render(200)
    await userEvent.hover(a)
    await visible()
    await userEvent.hover(panel()!)
    await settle(250)
    expect(open.value).toBe(true)
    await userEvent.hover(a)
    await settle(250)
    expect(open.value).toBe(true)
    await userEvent.hover(outside)
    await settle(60)
    expect(open.value).toBe(true)
    await vi.waitFor(() => expect(open.value).toBe(false))
    await vi.waitFor(() => expect(panel()).toBeNull())
  })

  it.each([160, 630])(
    'allows slow pointer movement through the gap with anchor top %s',
    async top => {
      const { a, open } = await render(60)
      a.style.top = top + 'px'
      await userEvent.hover(a)
      await visible()
      const source = a.getBoundingClientRect(),
        card = panel()!.getBoundingClientRect()
      const x = center(a),
        y =
          card.bottom <= source.top
            ? (card.bottom + source.top) / 2
            : (source.bottom + card.top) / 2
      a.dispatchEvent(
        new PointerEvent('pointerleave', { pointerType: 'mouse', clientX: x, clientY: y }),
      )
      document.body.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          pointerType: 'mouse',
          clientX: x,
          clientY: y,
        }),
      )
      await settle(180)
      expect(open.value).toBe(true)
      await userEvent.hover(panel()!)
      expect(open.value).toBe(true)
    },
  )

  it('cancels an old close timer when switching to another anchor', async () => {
    const { a, b, outside, open } = await render(250)
    await userEvent.hover(a)
    await visible()
    const card = panel()
    await userEvent.hover(outside)
    await settle(40)
    await userEvent.hover(b)
    await settle(350)
    expect(open.value).toBe(true)
    expect(panel()).toBe(card)
    expect(panel()?.textContent).toBe('B')
  })

  it('detaches listeners from replaced anchors and clears them on unmount', async () => {
    const { w, a, b, open } = await render(60)
    const aAdd = vi.spyOn(a, 'addEventListener'),
      aRemove = vi.spyOn(a, 'removeEventListener')
    const bAdd = vi.spyOn(b, 'addEventListener'),
      bRemove = vi.spyOn(b, 'removeEventListener')
    await userEvent.hover(a)
    await visible()
    await userEvent.hover(b)
    await tick()
    const leaves = aAdd.mock.calls.filter(call => call[0] === 'pointerleave')
    expect(leaves).toHaveLength(1)
    expect(
      aRemove.mock.calls.some(call => call[0] === 'pointerleave' && call[1] === leaves[0]![1]),
    ).toBe(true)
    a.dispatchEvent(
      new PointerEvent('pointerleave', { pointerType: 'mouse', clientX: 950, clientY: 650 }),
    )
    await settle(100)
    expect(open.value).toBe(true)
    const bLeaves = bAdd.mock.calls.filter(call => call[0] === 'pointerleave')
    await w.unmount()
    mounted = []
    expect(
      bRemove.mock.calls.some(call => call[0] === 'pointerleave' && call[1] === bLeaves[0]![1]),
    ).toBe(true)
  })

  it('discards pending closes after unmount', async () => {
    const { w, a, outside, update } = await render(250)
    await userEvent.hover(a)
    await visible()
    await userEvent.hover(outside)
    await w.unmount()
    mounted = []
    const calls = update.mock.calls.length
    await settle(350)
    expect(update).toHaveBeenCalledTimes(calls)
  })

  it.each(['clear', 'remove'])(
    'closes when the anchor is invalidated by %s and retains exit geometry',
    async kind => {
      const { a, anchor, open } = await render()
      await userEvent.hover(a)
      await visible()
      const card = panel()!,
        positioner = card.parentElement!
      const transform = getComputedStyle(positioner).transform
      if (kind === 'clear') anchor.value = null
      else a.remove()
      await vi.waitFor(() => expect(open.value).toBe(false))
      expect(card.dataset.state).toBe('closed')
      expect(getComputedStyle(positioner).transform).toBe(transform)
      await vi.waitFor(() => expect(panel()).toBeNull())
    },
  )

  it('does not display an unanchored card for an initially open model', async () => {
    const { open } = await render()
    open.value = true
    await tick()
    expect(open.value).toBe(false)
    expect(panel()).toBeNull()
  })

  it('supports keyboard activation and focus departure without taking focus', async () => {
    const { a, b, outside, open } = await render(100)
    a.focus()
    await visible()
    expect(document.activeElement).toBe(a)
    await userEvent.tab()
    expect(document.activeElement).toBe(b)
    await settle(150)
    expect(open.value).toBe(true)
    expect(panel()?.textContent).toBe('B')
    await userEvent.tab()
    expect(document.activeElement).toBe(outside)
    await vi.waitFor(() => expect(open.value).toBe(false))
  })

  it('closes on Escape and outside click without later reopening', async () => {
    const { a, outside, open, update } = await render()
    await userEvent.hover(a)
    await visible()
    await userEvent.hover(panel()!)
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(open.value).toBe(false))
    await settle(350)
    expect(open.value).toBe(false)
    expect(update.mock.calls).toEqual([[false]])
    await userEvent.hover(a)
    await visible()
    await userEvent.click(outside)
    await vi.waitFor(() => expect(open.value).toBe(false))
  })

  it('closes when an ancestor scrolls', async () => {
    const { a, open } = await render()
    await userEvent.hover(a)
    await visible()
    document.dispatchEvent(new Event('scroll'))
    await vi.waitFor(() => expect(open.value).toBe(false))
  })

  it.each(['page', 'container'] as const)(
    'follows the connected anchor throughout exit while the %s scrolls',
    async target => {
      const { w, a, anchor, open, update } = await render()
      const scroller = scrollable(w, target)
      anchor.value = a
      open.value = true
      await visible()
      scroller.scrollTop = 40
      const { card, positioner, animations } = await pauseExit()
      expect(open.value).toBe(false)
      expect(card.inert).toBe(true)
      await aligned(positioner, a)
      scroller.scrollTop = 80
      await aligned(positioner, a)
      expect(panel()).toBe(card)
      expect(update.mock.calls).toEqual([[false]])
      animations.forEach(animation => animation.play())
      await vi.waitFor(() => expect(panel()).toBeNull())
      const measure = vi.spyOn(a, 'getBoundingClientRect')
      await settle(80)
      expect(measure).not.toHaveBeenCalled()
    },
  )

  it.each(['clear', 'remove'])(
    'retains the latest position when the anchor is invalidated by %s during exit',
    async kind => {
      const { w, a, anchor, open } = await render()
      const scroller = scrollable(w, 'container')
      anchor.value = a
      open.value = true
      await visible()
      scroller.scrollTop = 40
      const { positioner, animations } = await pauseExit()
      await aligned(positioner, a)
      scroller.scrollTop = 80
      await aligned(positioner, a)
      await settle(40)
      const transform = getComputedStyle(positioner).transform
      if (kind === 'clear') anchor.value = null
      else a.remove()
      await settle(60)
      expect(getComputedStyle(positioner).transform).toBe(transform)
      expect(open.value).toBe(false)
      animations.forEach(animation => animation.play())
      await vi.waitFor(() => expect(panel()).toBeNull())
    },
  )

  it('retains the slotted trigger when an anchor is also supplied', async () => {
    const { b } = await render()
    const w = await mount(
      <HoverCard anchor={b} openDelay={0} content={<div style={{ width: '100px' }}>Slotted</div>}>
        <button type="button" style={{ position: 'absolute', left: '200px', top: '350px' }}>
          Trigger
        </button>
      </HoverCard>,
    )
    mounted.push(w)
    const trigger = w.container.querySelector('button') as HTMLElement
    await userEvent.hover(trigger)
    await visible()
    await vi.waitFor(() => expect(Math.abs(center(panel()!) - center(trigger))).toBeLessThan(1))
  })
})
