import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import Pagination from './Pagination.vue'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []

beforeEach(async () => {
  document.body.innerHTML = ''
  await page.viewport(1100, 720)
  window.scrollTo(0, 0)
  const park = document.createElement('div')
  park.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px'
  document.body.append(park)
  await userEvent.hover(park)
  park.remove()
})

afterEach(() => {
  mounted.forEach(wrapper => wrapper.unmount())
  mounted = []
  window.scrollTo(0, 0)
})

const popup = () => document.querySelector<HTMLElement>('[data-hn-pagination-popup]')
const settle = (delay: number) => new Promise(resolve => setTimeout(resolve, delay))

async function render(target: 'page' | 'container') {
  const w = mount(Pagination, {
    props: { total: 250, modelValue: 10 },
    attachTo: document.body,
  })
  mounted.push(w)
  const host = w.element as HTMLElement
  host.style.cssText = 'padding:180px 120px 1000px'
  let scroller = document.documentElement
  if (target === 'container') {
    scroller = document.createElement('div')
    scroller.style.cssText = 'height:500px;width:900px;overflow:auto;margin:40px'
    document.body.append(scroller)
    scroller.append(host)
  }
  const source = w.get('[data-hn-pagination-ellipsis][data-side="prev"]').element as HTMLElement
  await userEvent.hover(source)
  await vi.waitFor(() => expect(popup()?.dataset.state).toBe('open'))
  const panel = popup()!
  await Promise.all(panel.getAnimations().map(animation => animation.finished))
  const positioner = panel.parentElement!
  await aligned(positioner, source)
  await userEvent.keyboard('{Escape}')
  expect(panel.dataset.state).toBe('closed')
  const animations = panel.getAnimations()
  expect(animations.length).toBeGreaterThan(0)
  animations.forEach(animation => animation.pause())
  return { w, source, host, scroller, panel, positioner, animations }
}

async function aligned(positioner: HTMLElement, source: HTMLElement) {
  await vi.waitFor(() => {
    const a = source.getBoundingClientRect()
    const b = positioner.getBoundingClientRect()
    expect(Math.abs(a.x + a.width / 2 - b.x - b.width / 2)).toBeLessThan(1)
    expect(Math.abs(b.top - a.bottom - 8)).toBeLessThan(1)
  })
}

describe('Pagination ellipsis exit positioning', () => {
  it.each(['page', 'container'] as const)(
    'follows the trigger while the %s scrolls until the exit finishes',
    async target => {
      const { source, host, scroller, panel, positioner, animations } = await render(target)
      const before = positioner.getBoundingClientRect()
      scroller.scrollTop = 40
      await aligned(positioner, source)
      expect(positioner.getBoundingClientRect().top).toBeLessThan(before.top - 35)
      scroller.scrollTop = 80
      host.style.paddingInlineStart = '180px'
      await aligned(positioner, source)
      expect(positioner.getBoundingClientRect().left).toBeGreaterThan(before.left + 55)
      expect(popup()).toBe(panel)
      expect(panel.dataset.state).toBe('closed')
      expect(panel.inert).toBe(true)
      expect(source.getAttribute('aria-expanded')).toBe('false')
      animations.forEach(animation => animation.play())
      await vi.waitFor(() => expect(popup()).toBeNull())
      const measure = vi.spyOn(source, 'getBoundingClientRect')
      await settle(80)
      expect(measure).not.toHaveBeenCalled()
      measure.mockRestore()
    },
  )

  it('retains the latest geometry if the trigger is removed during exit', async () => {
    const { w, source, scroller, panel, positioner, animations } = await render('container')
    scroller.scrollTop = 60
    await aligned(positioner, source)
    const transform = getComputedStyle(positioner).transform
    const choices = panel.textContent
    await w.setProps({ modelValue: 2 })
    expect(source.isConnected).toBe(false)
    scroller.scrollTop = 100
    await settle(80)
    expect(getComputedStyle(positioner).transform).toBe(transform)
    expect(panel.textContent).toBe(choices)
    expect(panel.inert).toBe(true)
    animations.forEach(animation => animation.play())
    await vi.waitFor(() => expect(popup()).toBeNull())
    expect(document.activeElement).toBe(w.get('[aria-current="page"]').element)
  })
})
