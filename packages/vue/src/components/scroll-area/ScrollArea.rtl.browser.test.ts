import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h } from 'vue'
import ScrollArea from './ScrollArea.vue'
import '../../../test/browser.css'

const wrappers: VueWrapper[] = []
afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
})

async function create(dir: 'ltr' | 'rtl', inherited: boolean) {
  const host = document.createElement('div')
  host.dir = inherited ? dir : dir === 'ltr' ? 'rtl' : 'ltr'
  document.body.append(host)
  const wrapper = mount(ScrollArea, {
    attachTo: host,
    props: { direction: 'horizontal', class: 'w-[200px]', ...(inherited ? {} : { dir }) },
    slots: { default: () => h('div', { style: { width: '600px', height: '80px' } }) },
  })
  wrappers.push(wrapper)
  await vi.waitFor(() => expect(wrapper.vm.instance).toBeDefined())
  return { wrapper, viewport: wrapper.vm.viewport!, host }
}

describe('ScrollArea direction and shadows', () => {
  for (const dir of ['ltr', 'rtl'] as const) {
    it.each([true, false])(
      `keeps the ${dir} viewport and edge gradients consistent (inherited=%s)`,
      async inherited => {
        const { wrapper, viewport } = await create(dir, inherited)
        const root = wrapper.element
        const start = wrapper.get<HTMLElement>('[data-side="x-start"]').element
        const end = wrapper.get<HTMLElement>('[data-side="x-end"]').element
        expect(getComputedStyle(viewport).direction).toBe(dir)
        expect(getComputedStyle(start).direction).toBe(dir)
        expect(getComputedStyle(end).backgroundImage).toContain(
          dir === 'rtl' ? 'to right' : 'to left',
        )
        expect(getComputedStyle(start).backgroundImage).toContain(
          dir === 'rtl' ? 'to left' : 'to right',
        )
        expect(start.getBoundingClientRect()[dir === 'rtl' ? 'right' : 'left']).toBe(
          root.getBoundingClientRect()[dir === 'rtl' ? 'right' : 'left'],
        )
        expect(end.getBoundingClientRect()[dir === 'rtl' ? 'left' : 'right']).toBe(
          root.getBoundingClientRect()[dir === 'rtl' ? 'left' : 'right'],
        )
        await vi.waitFor(() => expect(end.hasAttribute('data-visible')).toBe(true))
        expect(start.hasAttribute('data-visible')).toBe(false)
        viewport.scrollLeft = dir === 'rtl' ? -200 : 200
        viewport.dispatchEvent(new Event('scroll'))
        await vi.waitFor(() => expect(start.hasAttribute('data-visible')).toBe(true))
        expect(end.hasAttribute('data-visible')).toBe(true)
        viewport.scrollLeft =
          (viewport.scrollWidth - viewport.clientWidth) * (dir === 'rtl' ? -1 : 1)
        viewport.dispatchEvent(new Event('scroll'))
        await vi.waitFor(() => expect(end.hasAttribute('data-visible')).toBe(false))
        expect(start.hasAttribute('data-visible')).toBe(true)
      },
    )
  }

  it('updates inherited gradients when an ancestor switches direction', async () => {
    const { wrapper, viewport, host } = await create('rtl', true)
    host.dir = 'ltr'
    const end = wrapper.get<HTMLElement>('[data-side="x-end"]').element
    await vi.waitFor(() => expect(getComputedStyle(end).backgroundImage).toContain('to left'))
    expect(getComputedStyle(viewport).direction).toBe('ltr')
  })
})
