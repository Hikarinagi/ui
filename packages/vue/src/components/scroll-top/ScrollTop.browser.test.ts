import { afterEach, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref, shallowRef } from 'vue'
import { TooltipProvider } from 'reka-ui'
import ScrollTop from './ScrollTop.vue'
import ScrollArea from '../scroll-area/ScrollArea.vue'
import type { ScrollTopProps } from './types'
import '../../../test/browser.css'

const mounted: VueWrapper[] = []
afterEach(() => {
  mounted.splice(0).forEach(w => w.unmount())
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})
function setup(props: ScrollTopProps = {}) {
  const target = shallowRef<HTMLElement | null>(null)
  const scroller = document.createElement('div')
  scroller.style.cssText = 'width:300px;height:200px;overflow:auto'
  const content = document.createElement('div')
  content.style.cssText = 'width:600px;height:1800px'
  scroller.append(content)
  document.body.append(scroller)
  target.value = scroller
  const onClick = vi.fn()
  const wrapper = mount(
    defineComponent({
      setup: () => () =>
        h(
          TooltipProvider,
          { delayDuration: 0 },
          {
            default: () =>
              h(ScrollTop, {
                target: () => target.value,
                position: 'static',
                behavior: 'instant',
                ...props,
                onClick,
              }),
          },
        ),
    }),
    { attachTo: document.body, global: { stubs: { transition: false } } },
  )
  mounted.push(wrapper)
  return {
    wrapper,
    target,
    scroller,
    content,
    onClick,
    component: wrapper.getComponent(ScrollTop),
    button: () => document.querySelector<HTMLButtonElement>('[data-hn-scroll-top]'),
  }
}
async function scroll(s: ReturnType<typeof setup>, top: number) {
  s.scroller.scrollTop = top
  s.scroller.dispatchEvent(new Event('scroll'))
  await nextTick()
}

it('shows only beyond the threshold and resets vertical scroll without moving horizontally', async () => {
  const s = setup({ threshold: 100 })
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
  const s = setup({ threshold: 100 })
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
  const s = setup({ threshold: 100 })
  await scroll(s, 500)
  await vi.waitFor(() => expect(s.component.vm.visible).toBe(true))
  const remove = vi.spyOn(s.scroller, 'removeEventListener')
  s.target.value = null
  await nextTick()
  expect(s.component.vm.visible).toBe(false)
  expect(remove).toHaveBeenCalledWith('scroll', expect.any(Function))
  const pageScroll = vi.spyOn(window, 'scrollTo')
  s.component.vm.scrollToTop()
  expect(pageScroll).not.toHaveBeenCalled()
  s.target.value = s.scroller
  await vi.waitFor(() => expect(s.component.vm.visible).toBe(true))
})

it('returns focus to an explicit destination without another scroll jump', async () => {
  const heading = document.createElement('h2')
  heading.tabIndex = -1
  heading.textContent = 'Title'
  document.body.append(heading)
  const s = setup({ threshold: 100, focusTarget: () => heading })
  await scroll(s, 300)
  await userEvent.click(s.button()!)
  expect(document.activeElement).toBe(heading)
  expect(s.scroller.scrollTop).toBe(0)
})

it.each(['disabled', 'loading'] as const)(
  'does not scroll when %s, including through expose',
  async state => {
    const s = setup({ [state]: true, threshold: 100 })
    await scroll(s, 300)
    expect(s.button()!.disabled).toBe(true)
    s.button()!.click()
    s.component.vm.scrollToTop()
    expect(s.scroller.scrollTop).toBe(300)
  },
)

it('lets callers cancel the scroll request', async () => {
  const s = setup({ threshold: 100 })
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
  const s = setup({ threshold: 100, behavior: 'smooth' })
  await scroll(s, 300)
  const method = vi.spyOn(s.scroller, 'scrollTo')
  s.component.vm.scrollToTop()
  expect(method).toHaveBeenCalledWith({ top: 0, behavior: 'instant' })
})

it('works with the asynchronously exposed ScrollArea viewport', async () => {
  const area = ref<InstanceType<typeof ScrollArea>>()
  const wrapper = mount(
    defineComponent({
      setup: () => () =>
        h('div', [
          h(ScrollArea, { ref: area, style: 'height:200px;width:300px' }, () =>
            h('div', { style: 'height:1800px' }, 'Content'),
          ),
          h(ScrollTop, {
            target: () => area.value?.viewport,
            threshold: 100,
            position: 'static',
            behavior: 'instant',
          }),
        ]),
    }),
    { attachTo: document.body },
  )
  mounted.push(wrapper)
  await vi.waitFor(() => expect(area.value?.viewport).toBeInstanceOf(HTMLElement))
  area.value!.viewport!.scrollTop = 500
  await vi.waitFor(() => expect(document.querySelector('[data-hn-scroll-top]')).not.toBeNull())
  await userEvent.click(document.querySelector<HTMLButtonElement>('[data-hn-scroll-top]')!)
  await vi.waitFor(() => expect(area.value!.viewport!.scrollTop).toBe(0))
})

it('renders a real enter/leave transition with a TooltipProvider', async () => {
  const warn = vi.spyOn(console, 'warn')
  const s = setup({ threshold: 100 })
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
  const wrapper = mount(ScrollTop, {
    props: { threshold: 100, behavior: 'instant' },
    attachTo: document.body,
    global: { stubs: { transition: false } },
  })
  mounted.push(wrapper)
  const method = vi.spyOn(window, 'removeEventListener')
  window.scrollTo({ top: 500, behavior: 'instant' })
  await vi.waitFor(() => expect(wrapper.vm.visible).toBe(true))
  wrapper.vm.scrollToTop()
  await vi.waitFor(() => expect(window.scrollY).toBe(0))
  wrapper.unmount()
  mounted.splice(mounted.indexOf(wrapper), 1)
  expect(method).toHaveBeenCalledWith('scroll', expect.any(Function))
})
