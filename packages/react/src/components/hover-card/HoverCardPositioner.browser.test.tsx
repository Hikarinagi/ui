import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { HoverCard } from './HoverCard'
import { mount } from '../../../test/mount'
import { signal, tick } from '../../../test/signal'
import '../../../test/browser.css'

let mounted: Array<{ unmount: () => Promise<void> }> = []

beforeEach(async () => {
  document.body.innerHTML = ''
  await page.viewport(1000, 700)
  const park = document.createElement('div')
  park.style.cssText = 'position:fixed;inset:0 auto auto 0;width:1px;height:1px'
  document.body.appendChild(park)
  await userEvent.hover(park)
  park.remove()
})

afterEach(async () => {
  for (const w of mounted) await w.unmount()
  mounted = []
})

async function render(external: boolean) {
  const open = signal(false)
  const anchor = signal<HTMLElement | null>(null)
  const positionerClass = signal<string | undefined>(undefined)
  const trigger = (name: string, left: number) => (
    <a
      href="#"
      data-anchor={name}
      style={{
        position: 'absolute',
        left: `${left}px`,
        top: '180px',
        width: '80px',
        height: '36px',
      }}
    >
      {name}
    </a>
  )
  function Harness() {
    const currentOpen = open.use()
    const currentAnchor = anchor.use()
    const currentClass = positionerClass.use()
    return (
      <div>
        {external ? trigger('A', 180) : null}
        {trigger('B', 560)}
        <HoverCard
          open={currentOpen}
          anchor={external ? currentAnchor : undefined}
          className="content-only"
          positionerClass={currentClass}
          onOpenChange={value => {
            open.value = !!value
          }}
          content={<div style={{ width: '160px' }}>Content</div>}
        >
          {external ? undefined : trigger('A', 180)}
        </HoverCard>
      </div>
    )
  }
  const w = await mount(<Harness />)
  mounted.push(w)
  const a = w.container.querySelector('[data-anchor="A"]') as HTMLElement
  const b = w.container.querySelector('[data-anchor="B"]') as HTMLElement
  anchor.value = a
  return { w, a, b, open, anchor, positionerClass }
}

const panel = () => document.querySelector<HTMLElement>('[data-hn-hover-card]')

async function visible() {
  await vi.waitFor(() => expect(panel()?.dataset.state).toBe('open'))
  const card = panel()!
  await Promise.allSettled(card.getAnimations().map(animation => animation.finished))
  return { card, positioner: card.parentElement! }
}

const center = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect()
  return rect.left + rect.width / 2
}

describe.each([false, true])('HoverCard positioner with external anchor %s', external => {
  it('applies positionerClass to the positioning wrapper independently of content class', async () => {
    const { a, open, positionerClass } = await render(external)
    positionerClass.value = 'positioner-only'
    open.value = true
    const { card, positioner } = await visible()
    expect(positioner.hasAttribute('data-radix-popper-content-wrapper')).toBe(true)
    expect(positioner.classList.contains('positioner-only')).toBe(true)
    expect(positioner.classList.contains('content-only')).toBe(false)
    expect(card.classList.contains('content-only')).toBe(true)
    expect(card.classList.contains('positioner-only')).toBe(false)
    expect(a.hasAttribute('positionerclass')).toBe(false)
    expect(Math.abs(center(positioner) - center(a))).toBeLessThan(1)
  })

  it('updates and clears classes while preserving classes it does not own', async () => {
    const { open, positionerClass } = await render(external)
    open.value = true
    const { positioner } = await visible()
    positioner.classList.add('existing')
    positionerClass.value = 'existing before   shared'
    await tick()
    expect(positioner.classList.contains('before')).toBe(true)
    positionerClass.value = 'existing after shared'
    await tick()
    expect(positioner.classList.contains('before')).toBe(false)
    expect(positioner.classList.contains('after')).toBe(true)
    expect(positioner.classList.contains('shared')).toBe(true)
    positionerClass.value = undefined
    await tick()
    expect(positioner.classList.contains('after')).toBe(false)
    expect(positioner.classList.contains('shared')).toBe(false)
    expect(positioner.classList.contains('existing')).toBe(true)
  })

  it('retains classes through exit, cleans up on unmount and applies them on reopening', async () => {
    const { w, open, positionerClass } = await render(external)
    positionerClass.value = 'positioner-only'
    open.value = true
    const { card, positioner } = await visible()
    open.value = false
    await tick()
    expect(card.dataset.state).toBe('closed')
    expect(positioner.classList.contains('positioner-only')).toBe(true)
    await vi.waitFor(() => expect(panel()).toBeNull())
    expect(positioner.classList.contains('positioner-only')).toBe(false)
    open.value = true
    const next = await visible()
    expect(next.positioner).not.toBe(positioner)
    expect(next.positioner.classList.contains('positioner-only')).toBe(true)
    await w.unmount()
    mounted = []
    expect(next.positioner.classList.contains('positioner-only')).toBe(false)
  })
})

describe('HoverCard movement', () => {
  it('can transition between anchors on the same wrapper and disable the transition on close', async () => {
    const { a, b, open, anchor, positionerClass } = await render(true)
    open.value = true
    const { card, positioner } = await visible()
    expect(getComputedStyle(positioner).transitionDuration).toBe('0s')
    positionerClass.value = 'hn-transition-base motion-reduce:transition-none'
    await tick()
    expect(getComputedStyle(positioner).transitionProperty).toContain('transform')
    anchor.value = b
    const movement = () =>
      positioner
        .getAnimations()
        .find(
          animation =>
            animation instanceof CSSTransition && animation.transitionProperty === 'transform',
        )
    await vi.waitFor(() => expect(movement()).toBeTruthy(), { interval: 5 })
    const animation = movement()!
    animation.pause()
    animation.currentTime = Number(animation.effect!.getTiming().duration) / 2
    expect(center(positioner)).toBeGreaterThan(center(a))
    expect(center(positioner)).toBeLessThan(center(b))
    expect(panel()).toBe(card)
    animation.finish()
    await vi.waitFor(() => expect(Math.abs(center(positioner) - center(b))).toBeLessThan(1))
    positionerClass.value = undefined
    open.value = false
    await tick()
    expect(getComputedStyle(positioner).transitionDuration).toBe('0s')
    expect(card.inert).toBe(true)
    await vi.waitFor(() => expect(panel()).toBeNull())
  })
})
