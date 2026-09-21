import { afterEach, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick, shallowReactive } from 'vue'
import { renderToString } from 'vue/server-renderer'
import axe from 'axe-core'
import Affix from './Affix.vue'
import ScrollArea from '../scroll-area/ScrollArea.vue'
import type { AffixProps } from './types'
import '../../../test/browser.css'

const wrappers: VueWrapper[] = []
afterEach(() => {
  wrappers.splice(0).forEach(w => w.unmount())
  document.body.innerHTML = ''
  document.body.style.cssText = ''
  window.scrollTo(0, 0)
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
async function settle() {
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
}
function setup(initial: Partial<AffixProps> = {}, scrollArea = false) {
  const props = shallowReactive<AffixProps>({ offset: 12, ...initial })
  const change = vi.fn()
  const content = () =>
    h('div', { class: 'region', style: 'height:700px;display:flow-root' }, [
      h('div', { style: 'height:80px' }, 'Before'),
      h(
        Affix,
        { ...props, onChange: change },
        { default: () => h('button', { style: 'display:block;height:40px;width:100%' }, 'Save') },
      ),
      h('div', { class: 'after', style: 'height:580px' }, 'Content'),
    ])
  const w = mount(
    {
      render: () =>
        scrollArea
          ? h(ScrollArea, { class: 'h-60 w-80', shadow: false }, { default: content })
          : h(
              'div',
              {
                class: 'scroller',
                style: 'height:240px;width:320px;overflow:auto;border:2px solid;padding:0',
              },
              [content(), h('div', { style: 'height:400px' }, 'Next region')],
            ),
    },
    { attachTo: document.body },
  )
  wrappers.push(w)
  const component = w.getComponent(Affix)
  return {
    w,
    props,
    change,
    component,
    element: () => component.element as HTMLElement,
    viewport: () =>
      scrollArea
        ? (w.getComponent(ScrollArea).vm as unknown as { viewport: HTMLElement }).viewport
        : (w.get('.scroller').element as HTMLElement),
  }
}
async function scroll(s: ReturnType<typeof setup>, y: number) {
  s.viewport().scrollTop = y
  await settle()
}

it('sticks to the scrollport with an offset while preserving flow, width, DOM and focus', async () => {
  const s = setup()
  await settle()
  const button = s.w.get('button').element as HTMLButtonElement
  button.focus({ preventScroll: true })
  const initialAfter = s.w.get('.after').element.getBoundingClientRect().top
  const initialWidth = s.element().getBoundingClientRect().width
  await scroll(s, 160)
  await vi.waitFor(() => expect(s.element().hasAttribute('data-affixed')).toBe(true))
  expect(s.element().getBoundingClientRect().top).toBeCloseTo(
    s.viewport().getBoundingClientRect().top + 14,
    1,
  )
  expect(s.w.get('.after').element.getBoundingClientRect().top).toBeCloseTo(initialAfter - 160, 1)
  expect(s.element().getBoundingClientRect().width).toBe(initialWidth)
  expect(s.w.get('button').element).toBe(button)
  expect(document.activeElement).toBe(button)
  await scroll(s, 0)
  await vi.waitFor(() => expect(s.element().hasAttribute('data-affixed')).toBe(false))
  expect(s.change.mock.calls.map(args => args[0])).toEqual([true, false])
})

it('lets the parent boundary push the affix away without covering the next region', async () => {
  const s = setup()
  await scroll(s, 650)
  await vi.waitFor(() =>
    expect(s.element().getBoundingClientRect().bottom).toBeLessThanOrEqual(
      s.w.get('.region').element.getBoundingClientRect().bottom + 1,
    ),
  )
  await scroll(s, 760)
  expect(s.element().hasAttribute('data-affixed')).toBe(false)
  expect(s.element().getBoundingClientRect().bottom).toBeLessThan(
    s.viewport().getBoundingClientRect().top,
  )
})

it('supports bottom placement and releases the bar when its natural position enters view', async () => {
  const s = setup({ position: 'bottom' })
  s.w.get('.region').element.insertBefore(s.w.get('.after').element, s.element())
  await settle()
  await vi.waitFor(() => expect(s.element().hasAttribute('data-affixed')).toBe(true))
  const bottom = s.viewport().getBoundingClientRect().bottom - s.viewport().clientTop - 12
  expect(s.element().getBoundingClientRect().bottom).toBeCloseTo(bottom, 1)
  await scroll(s, 650)
  await vi.waitFor(() => expect(s.element().hasAttribute('data-affixed')).toBe(false))
})

it('supports window scrolling without a scroll container', async () => {
  document.body.style.cssText = 'margin:0'
  const w = mount(
    {
      render: () =>
        h('div', { style: 'height:2400px' }, [
          h('div', { style: 'height:120px' }),
          h(Affix, { offset: 24 }, () => h('button', { style: 'height:40px' }, 'Save')),
        ]),
    },
    { attachTo: document.body },
  )
  wrappers.push(w)
  window.scrollTo(0, 300)
  await vi.waitFor(() =>
    expect(w.getComponent(Affix).element.getBoundingClientRect().top).toBeCloseTo(24, 1),
  )
  await vi.waitFor(() => expect(w.getComponent(Affix).attributes('data-affixed')).toBe(''))
})

it('integrates with ScrollArea initialization and keeps keyboard interactions intact', async () => {
  const s = setup({}, true)
  await vi.waitFor(() => expect(s.viewport()).toBeInstanceOf(HTMLElement))
  await scroll(s, 180)
  await vi.waitFor(() => expect(s.element().hasAttribute('data-affixed')).toBe(true))
  expect(s.element().getBoundingClientRect().top).toBeCloseTo(
    s.viewport().getBoundingClientRect().top + 12,
    1,
  )
  await userEvent.click(s.w.get('button').element)
  expect(document.activeElement).toBe(s.w.get('button').element)
  const results = await axe.run(s.w.element, {
    rules: { region: { enabled: false }, 'color-contrast': { enabled: false } },
  })
  expect(results.violations).toEqual([])
})

it('updates disabled state, offset and size without changing content identity', async () => {
  const s = setup()
  await scroll(s, 160)
  s.props.offset = 32
  await vi.waitFor(() =>
    expect(s.element().getBoundingClientRect().top).toBeCloseTo(
      s.viewport().getBoundingClientRect().top + 34,
      1,
    ),
  )
  s.viewport().style.width = '220px'
  await settle()
  expect(s.element().getBoundingClientRect().width).toBe(216)
  s.props.disabled = true
  await vi.waitFor(() => expect(getComputedStyle(s.element()).position).toBe('relative'))
  expect(s.element().hasAttribute('data-affixed')).toBe(false)
  expect(s.element().getBoundingClientRect().top).toBeLessThan(
    s.viewport().getBoundingClientRect().top,
  )
  s.props.disabled = false
  await vi.waitFor(() => expect(s.element().hasAttribute('data-affixed')).toBe(true))
})

it('follows RTL, scaled containers and dynamic child height', async () => {
  const s = setup()
  s.viewport().dir = 'rtl'
  s.viewport().style.transformOrigin = '0 0'
  s.viewport().style.transform = 'scale(0.75)'
  await scroll(s, 160)
  await vi.waitFor(() => expect(s.element().hasAttribute('data-affixed')).toBe(true))
  const button = s.w.get('button').element as HTMLElement
  button.style.height = '80px'
  await settle()
  expect(s.element().getBoundingClientRect().height).toBe(60)
  expect(s.element().getBoundingClientRect().top).toBeCloseTo(
    s.viewport().getBoundingClientRect().top + 14 * 0.75,
    1,
  )
})

it('does not write positioning styles while scrolling or emit duplicate state changes', async () => {
  const s = setup()
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
  const app = defineComponent({
    render: () =>
      h('div', { style: 'overflow:auto;height:160px' }, [
        h('div', { style: 'height:600px' }, [
          h('div', { style: 'height:80px' }),
          h(Affix, { offset: 8 }, () => h('button', 'Save')),
        ]),
      ]),
  })
  const host = document.createElement('div')
  host.innerHTML = await renderToString(createSSRApp(app))
  document.body.append(host)
  const scroller = host.firstElementChild as HTMLElement
  scroller.scrollTop = 180
  const before = host.querySelector('button')!
  const el = host.querySelector('[data-hn-affix]')!
  expect(el.getBoundingClientRect().top).toBeCloseTo(scroller.getBoundingClientRect().top + 8, 1)
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  const client = createSSRApp(app)
  try {
    client.mount(host)
    await nextTick()
    await settle()
    expect(host.querySelector('button')).toBe(before)
    expect(warn.mock.calls.filter(args => String(args[0]).includes('Hydration'))).toEqual([])
  } finally {
    client.unmount()
  }
})

it('supports negative offsets and scrolling without observer APIs', async () => {
  vi.stubGlobal('ResizeObserver', undefined)
  vi.stubGlobal('IntersectionObserver', undefined)
  const s = setup({ offset: -8 })
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
  const s = setup()
  const button = s.w.get('button').element
  s.viewport().style.display = 'none'
  await settle()
  expect(s.element().hasAttribute('data-affixed')).toBe(false)
  s.viewport().style.display = 'block'
  await scroll(s, 160)
  await vi.waitFor(() => expect(s.component.vm.affixed).toBe(true))
  expect(s.component.vm.element).toBe(s.element())
  s.component.vm.update()
  await settle()
  expect(s.w.get('button').element).toBe(button)
})

it('disconnects listeners and observers on unmount', async () => {
  const disconnect = vi.spyOn(ResizeObserver.prototype, 'disconnect')
  const s = setup()
  await settle()
  s.w.unmount()
  wrappers.splice(wrappers.indexOf(s.w), 1)
  const count = s.change.mock.calls.length
  document.dispatchEvent(new Event('scroll'))
  window.dispatchEvent(new Event('resize'))
  await settle()
  expect(disconnect).toHaveBeenCalled()
  expect(s.change).toHaveBeenCalledTimes(count)
})
