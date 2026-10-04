import { createRef } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, type RenderResult } from 'vitest-browser-react'
import { ScrollArea, type ScrollAreaHandle } from './ScrollArea'
import '../../../test/browser.css'

const wrappers: RenderResult[] = []
afterEach(async () => {
  for (const wrapper of wrappers.splice(0)) await wrapper.unmount()
  document.body.innerHTML = ''
})

async function create(dir: 'ltr' | 'rtl', inherited: boolean) {
  const host = document.createElement('div')
  host.dir = inherited ? dir : dir === 'ltr' ? 'rtl' : 'ltr'
  document.body.append(host)
  const handle = createRef<ScrollAreaHandle>()
  const wrapper = await render(
    <ScrollArea
      ref={handle}
      direction="horizontal"
      className="w-[200px]"
      {...(inherited ? {} : { dir })}
    >
      <div style={{ width: '600px', height: '80px' }} />
    </ScrollArea>,
    { container: host },
  )
  wrappers.push(wrapper)
  await vi.waitFor(() => expect(handle.current?.instance).toBeDefined())
  return {
    wrapper,
    element: host.firstElementChild as HTMLElement,
    viewport: handle.current!.viewport!,
    host,
  }
}

describe('ScrollArea direction and shadows', () => {
  for (const dir of ['ltr', 'rtl'] as const) {
    it.each([true, false])(
      `keeps the ${dir} viewport and edge gradients consistent (inherited=%s)`,
      async inherited => {
        const { element, viewport } = await create(dir, inherited)
        const root = element
        const start = root.querySelector<HTMLElement>('[data-side="x-start"]')!
        const end = root.querySelector<HTMLElement>('[data-side="x-end"]')!
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
    const { element, viewport, host } = await create('rtl', true)
    host.dir = 'ltr'
    const end = element.querySelector<HTMLElement>('[data-side="x-end"]')!
    await vi.waitFor(() => expect(getComputedStyle(end).backgroundImage).toContain('to left'))
    expect(getComputedStyle(viewport).direction).toBe('ltr')
  })
})
