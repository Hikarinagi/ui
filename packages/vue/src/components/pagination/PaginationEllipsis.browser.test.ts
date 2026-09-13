import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import Pagination from './Pagination.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []
beforeEach(async () => {
  document.body.innerHTML = ''
  await page.viewport(1100, 720)
})
afterEach(() => {
  mounted.forEach(wrapper => wrapper.unmount())
  mounted = []
})

function render(props: Record<string, unknown> = {}) {
  const w = mount(Pagination, {
    props: {
      total: 250,
      modelValue: 10,
      ...props,
      'onUpdate:modelValue': (modelValue: number) => w.setProps({ modelValue }),
    },
    attachTo: document.body,
  })
  mounted.push(w)
  return w
}
const trigger = (w: VueWrapper, side = 'prev') =>
  w.get('[data-hn-pagination-ellipsis][data-side="' + side + '"]').element as HTMLButtonElement
const popup = () => document.querySelector<HTMLElement>('[data-hn-pagination-popup]')
const choice = (value: number) =>
  document.querySelector<HTMLButtonElement>('[data-hn-pagination-choice="' + value + '"]')!
const choices = () =>
  [...document.querySelectorAll<HTMLElement>('[data-hn-pagination-choice]')]
    .map(el => Number(el.dataset.hnPaginationChoice))
    .sort((a, b) => a - b)
const selected = (w: VueWrapper) => w.get('[aria-current="page"]').text()
async function hover(w: VueWrapper, side = 'prev') {
  await userEvent.hover(trigger(w, side))
  await vi.waitFor(() => expect(popup()?.dataset.state).toBe('open'))
}
async function closed() {
  await vi.waitFor(() => expect(popup()).toBeNull())
}

describe('Pagination ellipsis', () => {
  it('uses the updated hidden range after a click during the opening delay', async () => {
    const w = render()
    await userEvent.click(trigger(w))
    expect(selected(w)).toBe('7')
    expect(w.emitted('change')).toEqual([[{ page: 7, pageSize: 10 }]])
    await vi.waitFor(() => expect(choices()).toEqual([2, 3, 4, 5]))
  })

  it.each([
    { current: 1, side: 'next', first: 6, last: 24 },
    { current: 25, side: 'prev', first: 2, last: 20 },
  ])(
    'excludes all visible page numbers at boundary $current',
    async ({ current, side, first, last }) => {
      const w = render({ modelValue: current })
      await hover(w, side)
      expect(choices()[0]).toBe(first)
      trigger(w, side).focus()
      await userEvent.keyboard('{ArrowUp}')
      await vi.waitFor(() => expect(document.activeElement).toBe(choice(last)))
      const visible = w.findAll('[data-type="page"]').map(el => Number(el.text()))
      expect(choices().every(value => !visible.includes(value))).toBe(true)
    },
  )

  it('keeps one popup when switching sides and resets its scroll position', async () => {
    const w = render({ total: 10000, modelValue: 500 })
    await hover(w)
    const original = popup()
    trigger(w).focus()
    await userEvent.keyboard('{ArrowUp}')
    await vi.waitFor(() => expect(document.activeElement).toBe(choice(498)))
    await userEvent.hover(trigger(w, 'next'))
    expect(popup()).toBe(original)
    await vi.waitFor(() => expect(choices()[0]).toBe(502))
    const viewport = popup()!.querySelector<HTMLElement>('[data-overlayscrollbars-viewport]')!
    expect(viewport.scrollTop).toBe(0)
  })

  it('keeps the popup open and refreshes its range across repeated skips', async () => {
    const w = render()
    await hover(w)
    const original = popup()
    await userEvent.click(trigger(w))
    expect(selected(w)).toBe('7')
    expect(popup()).toBe(original)
    await vi.waitFor(() => expect(choices()).toEqual([2, 3, 4, 5]))
    await userEvent.click(trigger(w, 'next'))
    expect(selected(w)).toBe('10')
    expect(popup()).toBe(original)
    expect(trigger(w, 'next').getAttribute('aria-expanded')).toBe('true')
  })

  it('lets keyboard users enter the list, navigate and escape back to the trigger', async () => {
    const w = render()
    const source = trigger(w)
    source.focus()
    await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(() => expect(document.activeElement).toBe(choice(2)))
    await userEvent.keyboard('{End}')
    expect(document.activeElement).toBe(choice(8))
    await userEvent.keyboard('{Home}{ArrowDown}')
    expect(document.activeElement).toBe(choice(3))
    expect(popup()?.dataset.state).toBe('open')
    await expectNoA11yViolations(popup()!)
    await userEvent.keyboard('{Escape}')
    await closed()
    expect(document.activeElement).toBe(source)
    expect(w.emitted('change')).toBeUndefined()
  })

  it.each([false, true])(
    'leaves the popup in logical tab order, backwards: %s',
    async backwards => {
      const w = render()
      trigger(w).focus()
      await userEvent.keyboard('{ArrowDown}')
      await vi.waitFor(() => expect(document.activeElement).toBe(choice(2)))
      await userEvent.tab({ shift: backwards })
      await closed()
      expect(document.activeElement).toBe(
        w.get('[data-type="page"][aria-label="第 ' + (backwards ? 1 : 9) + ' 页"]').element,
      )
    },
  )

  it('keeps Enter and Space as one group skip each', async () => {
    const w = render()
    trigger(w).focus()
    await userEvent.keyboard('{Enter}')
    expect(selected(w)).toBe('7')
    await userEvent.keyboard(' ')
    expect(selected(w)).toBe('4')
    expect(w.emitted('change')).toEqual([[{ page: 7, pageSize: 10 }], [{ page: 4, pageSize: 10 }]])
  })

  it('freezes content and anchor for exit when choosing a page removes the trigger', async () => {
    const w = render()
    await hover(w)
    const panel = popup()!
    await Promise.all(panel.getAnimations().map(animation => animation.finished))
    const positioner = panel.parentElement!
    const transform = getComputedStyle(positioner).transform
    const before = choices()
    await userEvent.click(choice(2))
    expect(selected(w)).toBe('2')
    expect(w.find('[data-side="prev"]').exists()).toBe(false)
    expect(panel.dataset.state).toBe('closed')
    expect(panel.inert).toBe(true)
    expect(getComputedStyle(positioner).transform).toBe(transform)
    expect(choices()).toEqual(before)
    await closed()
    expect(document.activeElement).toBe(w.get('[aria-current="page"]').element)
  })

  it('reopens during exit without retaining stale content', async () => {
    const w = render()
    await hover(w)
    await userEvent.keyboard('{Escape}')
    await userEvent.hover(trigger(w, 'next'))
    await vi.waitFor(() => expect(popup()?.dataset.state).toBe('open'))
    expect(choices()[0]).toBe(12)
    expect(popup()?.inert).toBe(false)
  })

  it('follows the trigger when the responsive layout moves', async () => {
    const w = render({ align: 'center' })
    await hover(w)
    const center = () => {
      const a = trigger(w).getBoundingClientRect()
      const b = popup()!.getBoundingClientRect()
      return Math.abs(a.x + a.width / 2 - b.x - b.width / 2)
    }
    await vi.waitFor(() => expect(center()).toBeLessThan(2))
    await page.viewport(500, 720)
    await vi.waitFor(() => expect(center()).toBeLessThan(2))
    expect(popup()?.dataset.state).toBe('open')
  })

  it('allows a slow mouse crossing of the trigger-to-popup gap', async () => {
    const w = render()
    await hover(w)
    await Promise.all(
      popup()!
        .getAnimations()
        .map(animation => animation.finished),
    )
    const a = trigger(w).getBoundingClientRect()
    const b = popup()!.getBoundingClientRect()
    const x = a.x + a.width / 2
    const y = (a.bottom + b.top) / 2
    trigger(w).dispatchEvent(
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
    await new Promise(resolve => setTimeout(resolve, 200))
    expect(popup()?.dataset.state).toBe('open')
    await userEvent.hover(choice(3))
    await userEvent.click(choice(3))
    expect(selected(w)).toBe('3')
  })

  it('closes when the pointer leaves the safe region', async () => {
    const w = render()
    await hover(w)
    document.body.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        pointerType: 'mouse',
        clientX: 1000,
        clientY: 600,
      }),
    )
    await closed()
  })

  it('bounds the choice DOM for ten thousand pages and can reach the last hidden page', async () => {
    const w = render({ total: 100000, modelValue: 5000 })
    trigger(w).focus()
    await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(() => expect(document.activeElement).toBe(choice(2)))
    await userEvent.keyboard('{End}')
    await vi.waitFor(() => expect(document.activeElement).toBe(choice(4998)))
    expect(choices().length).toBeLessThan(24)
    await userEvent.keyboard('{Enter}')
    expect(selected(w)).toBe('4998')
    expect(w.emitted('change')).toEqual([[{ page: 4998, pageSize: 10 }]])
  })

  it('opens on touch without skipping pages', async () => {
    const w = render()
    const source = trigger(w)
    source.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch' }))
    source.click()
    await nextTick()
    await vi.waitFor(() => expect(popup()?.dataset.state).toBe('open'))
    expect(selected(w)).toBe('10')
    expect(w.emitted('change')).toBeUndefined()
    await userEvent.click(choice(3))
    expect(selected(w)).toBe('3')
  })

  it('disables the open portal immediately when loading starts', async () => {
    const w = render()
    await hover(w)
    const button = choice(3)
    await w.setProps({ pending: true })
    expect(popup()?.inert).toBe(true)
    button.click()
    expect(w.emitted('change')).toBeUndefined()
    await closed()
    await w.setProps({ pending: false })
    await userEvent.click(trigger(w))
    expect(selected(w)).toBe('7')
  })
})
