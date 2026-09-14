import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, ref, shallowRef } from 'vue'
import HoverCard from './HoverCard.vue'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []

beforeEach(async () => {
  document.body.innerHTML = ''
  await page.viewport(1000, 700)
  const park = document.createElement('div')
  park.style.cssText = 'position:fixed;inset:0 auto auto 0;width:1px;height:1px'
  document.body.appendChild(park)
  await userEvent.hover(park)
  park.remove()
})

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

function render(external: boolean, openDelay = 300, closeDelay = 80) {
  const open = ref(false)
  const anchor = shallowRef<HTMLElement | null>(null)
  const trigger = () =>
    h(
      'a',
      {
        href: '#',
        'data-trigger': '',
        style: 'position:absolute;left:180px;top:160px;width:80px;height:36px',
        onPointerenter: external
          ? (event: PointerEvent) => {
              anchor.value = event.currentTarget as HTMLElement
              open.value = true
            }
          : undefined,
      },
      'Trigger',
    )
  const w = mount(
    defineComponent({
      setup: () => () =>
        h('div', { style: 'width:1000px;height:700px' }, [
          external ? trigger() : null,
          h(
            'button',
            {
              'data-outside': '',
              style: 'position:absolute;left:900px;top:600px',
            },
            'Outside',
          ),
          h(
            HoverCard,
            {
              open: open.value,
              anchor: anchor.value,
              openDelay,
              closeDelay,
              'onUpdate:open': (value: boolean | undefined) => {
                open.value = !!value
              },
            },
            {
              ...(external ? {} : { default: trigger }),
              content: () =>
                h(
                  'div',
                  {
                    style: 'width:180px;height:80px;pointer-events:auto',
                    'data-content': '',
                  },
                  'Content',
                ),
            },
          ),
        ]),
    }),
    { attachTo: document.body },
  )
  mounted.push(w)
  return {
    open,
    trigger: w.get('[data-trigger]').element,
    outside: w.get('[data-outside]').element,
  }
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
  return panel()!
}

async function pauseExit() {
  await vi.waitFor(() => expect(panel()?.dataset.state).toBe('closed'), { interval: 5 })
  const card = panel()!
  const animations = card.getAnimations()
  expect(animations.length).toBeGreaterThan(0)
  animations.forEach(animation => animation.pause())
  return { card, animations }
}

async function hoverArea(element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  const body = document.body.getBoundingClientRect()
  const x = rect.left + rect.width / 2,
    y = rect.top + rect.height / 2
  await userEvent.hover(document.body, {
    force: true,
    position: { x: x - body.left, y: y - body.top },
  })
  return document.elementFromPoint(x, y)
}

describe.each([false, true])('HoverCard exit with external anchor %s', external => {
  it('ignores the exiting content area and stays closed after the opening delay', async () => {
    const { trigger, outside, open } = render(external)
    await userEvent.hover(trigger)
    await visible()
    await userEvent.hover(panel()!)
    await settle(350)
    await userEvent.hover(outside)
    const { card, animations } = await pauseExit()
    const enter = vi.fn()
    card.addEventListener('pointerenter', enter)
    const target = await hoverArea(card.querySelector<HTMLElement>('[data-content]')!)
    animations.forEach(animation => animation.play())
    await settle(450)
    expect(open.value).toBe(false)
    expect(panel()).toBeNull()
    expect(card.contains(target)).toBe(false)
    expect(enter).not.toHaveBeenCalled()
  })

  it('keeps the card open when returning during the close delay', async () => {
    const { trigger, outside, open } = render(external, 60, 300)
    await userEvent.hover(trigger)
    const card = await visible()
    await userEvent.hover(card)
    await userEvent.hover(outside)
    await settle(40)
    expect(open.value).toBe(true)
    await userEvent.hover(card)
    await settle(400)
    expect(open.value).toBe(true)
    expect(panel()).toBe(card)
  })

  it('can reopen from the trigger during exit and interact with the card again', async () => {
    const { trigger, outside, open } = render(external, 60)
    await userEvent.hover(trigger)
    await visible()
    await userEvent.hover(panel()!)
    await settle(100)
    await userEvent.hover(outside)
    await pauseExit()
    await userEvent.hover(trigger)
    const card = await visible()
    const target = await hoverArea(card.querySelector<HTMLElement>('[data-content]')!)
    await settle(200)
    expect(open.value).toBe(true)
    expect(card.contains(target)).toBe(true)
  })
})
