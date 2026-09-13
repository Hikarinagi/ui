import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref, shallowRef } from 'vue'
import HoverCard from './HoverCard.vue'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []
beforeEach(async () => {
  document.body.innerHTML = ''
  await page.viewport(1000, 700)
})
afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
  vi.restoreAllMocks()
})

function render(closeDelay = 100) {
  const open = ref(false)
  const anchor = shallowRef<HTMLElement | null>(null)
  const update = vi.fn()
  const title = ref('A')
  const w = mount(
    defineComponent({
      setup: () => () =>
        h('div', [
          ...['A', 'B'].map((name, index) =>
            h(
              'button',
              {
                type: 'button',
                'data-anchor': name,
                style: {
                  position: 'absolute',
                  left: 180 + index * 380 + 'px',
                  top: '160px',
                  width: '80px',
                  height: '36px',
                },
                onPointerenter: (event: PointerEvent) => {
                  if (event.pointerType === 'touch') return
                  anchor.value = event.currentTarget as HTMLElement
                  title.value = name
                  open.value = true
                },
                onFocus: (event: FocusEvent) => {
                  anchor.value = event.currentTarget as HTMLElement
                  title.value = name
                  open.value = true
                },
              },
              name,
            ),
          ),
          h(
            'button',
            {
              type: 'button',
              'data-outside': '',
              style: { position: 'absolute', left: '900px', top: '600px' },
            },
            'Outside',
          ),
          h(
            HoverCard,
            {
              open: open.value,
              anchor: anchor.value,
              openDelay: 300,
              closeDelay,
              'onUpdate:open': (value: boolean | undefined) => {
                open.value = !!value
                update(value)
              },
            },
            { content: () => h('div', { style: { width: '160px' } }, title.value) },
          ),
        ]),
    }),
    { attachTo: document.body },
  )
  mounted.push(w)
  const a = w.get('[data-anchor="A"]').element as HTMLElement
  const b = w.get('[data-anchor="B"]').element as HTMLElement
  const outside = w.get('[data-outside]').element as HTMLElement
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

describe('HoverCard external anchor', () => {
  it('requires explicit open and positions one panel against successive elements', async () => {
    const { a, b, anchor, open, title, w } = render()
    anchor.value = a
    await nextTick()
    expect(panel()).toBeNull()
    open.value = true
    await visible()
    const card = panel()!
    expect(Math.abs(center(card) - center(a))).toBeLessThan(1)
    anchor.value = b
    title.value = 'B'
    await nextTick()
    await vi.waitFor(() => expect(Math.abs(center(card) - center(b))).toBeLessThan(1))
    expect(panel()).toBe(card)
    expect(card.textContent).toBe('B')
    expect(w.findAll('button')).toHaveLength(3)
    expect(document.body.style.pointerEvents).toBe('')
    expect(document.body.style.overflow).toBe('')
  })

  it('keeps the card open while moving between its anchor and content, then closes after the delay', async () => {
    const { a, outside, open } = render(200)
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
      const { a, open } = render(60)
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
    const { a, b, outside, open } = render(250)
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
    const { w, a, b, open } = render(60)
    const aAdd = vi.spyOn(a, 'addEventListener'),
      aRemove = vi.spyOn(a, 'removeEventListener')
    const bAdd = vi.spyOn(b, 'addEventListener'),
      bRemove = vi.spyOn(b, 'removeEventListener')
    await userEvent.hover(a)
    await visible()
    await userEvent.hover(b)
    await nextTick()
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
    w.unmount()
    mounted = []
    expect(
      bRemove.mock.calls.some(call => call[0] === 'pointerleave' && call[1] === bLeaves[0]![1]),
    ).toBe(true)
  })

  it('discards pending closes after unmount', async () => {
    const { w, a, outside, update } = render(250)
    await userEvent.hover(a)
    await visible()
    await userEvent.hover(outside)
    w.unmount()
    mounted = []
    const calls = update.mock.calls.length
    await settle(350)
    expect(update).toHaveBeenCalledTimes(calls)
  })

  it.each(['clear', 'remove'])(
    'closes when the anchor is invalidated by %s and retains exit geometry',
    async kind => {
      const { a, anchor, open } = render()
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
    const { open } = render()
    open.value = true
    await nextTick()
    expect(open.value).toBe(false)
    expect(panel()).toBeNull()
  })

  it('supports keyboard activation and focus departure without taking focus', async () => {
    const { a, b, outside, open } = render(100)
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
    const { a, outside, open, update } = render()
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
    const { a, open } = render()
    await userEvent.hover(a)
    await visible()
    document.dispatchEvent(new Event('scroll'))
    await vi.waitFor(() => expect(open.value).toBe(false))
  })

  it('retains the slotted trigger when an anchor is also supplied', async () => {
    const { b } = render()
    const w = mount(HoverCard, {
      props: { anchor: b, openDelay: 0 },
      slots: {
        default: () =>
          h(
            'button',
            { type: 'button', style: { position: 'absolute', left: '200px', top: '350px' } },
            'Trigger',
          ),
        content: () => h('div', { style: { width: '100px' } }, 'Slotted'),
      },
      attachTo: document.body,
    })
    mounted.push(w)
    const trigger = w.get('button').element as HTMLElement
    await userEvent.hover(trigger)
    await visible()
    await vi.waitFor(() => expect(Math.abs(center(panel()!) - center(trigger))).toBeLessThan(1))
  })
})
