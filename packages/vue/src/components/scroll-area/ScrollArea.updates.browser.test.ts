import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref, shallowRef } from 'vue'
import { provideLayoutTransition } from '../../lib/layout-stability'
import ScrollArea from './ScrollArea.vue'
import '../../../test/browser.css'

const mounted: VueWrapper[] = []

afterEach(() => {
  mounted.splice(0).forEach(wrapper => wrapper.unmount())
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

async function harness() {
  const transitioning = ref(false)
  const height = ref(400)
  const area = shallowRef<InstanceType<typeof ScrollArea>>()
  const wrapper = mount(
    defineComponent({
      setup() {
        provideLayoutTransition(transitioning)
        return () =>
          h(ScrollArea, { ref: area, class: 'h-40 w-60' }, () =>
            h('div', { 'data-content': '', style: { height: `${height.value}px` } }),
          )
      },
    }),
    { attachTo: document.body },
  )
  mounted.push(wrapper)
  await vi.waitFor(() => expect(area.value?.instance).toBeTruthy())
  const instance = area.value!.instance!
  await vi.waitFor(() => expect(instance.state().overflowAmount.y).toBe(240))
  await new Promise(resolve => setTimeout(resolve, 60))
  return { transitioning, height, instance, viewport: area.value!.viewport! }
}

describe('ScrollArea measurement updates', () => {
  it.each([
    ['natural', '', 400],
    ['fixed', 'height: 160px', 160],
    ['maximum', 'max-height: 160px', 160],
  ])('preserves %s height and overflow before and after enhancement', async (_, style, height) => {
    const wrapper = mount(ScrollArea, {
      attrs: { class: 'w-60', style },
      slots: { default: () => h('div', { style: 'height: 400px' }) },
      attachTo: document.body,
    })
    mounted.push(wrapper)
    const host = (wrapper.element as HTMLElement).querySelector<HTMLElement>(
      '[data-overlayscrollbars-initialize]',
    )!
    expect(host.clientHeight).toBe(height)
    await vi.waitFor(() => expect(wrapper.vm.instance).toBeTruthy())
    const viewport = wrapper.vm.viewport!
    expect(viewport.clientHeight).toBe(height)
    expect(viewport.scrollHeight).toBe(400)
  })

  it('does not write identical viewport attributes during forced updates', async () => {
    const { instance, viewport } = await harness()
    const identical: string[] = []
    const setAttribute = viewport.setAttribute.bind(viewport)
    vi.spyOn(viewport, 'setAttribute').mockImplementation((name, value) => {
      if (viewport.getAttribute(name) === value) identical.push(name)
      setAttribute(name, value)
    })
    viewport.scrollTop = 80
    for (let i = 0; i < 3; i++) instance.update(true)
    expect(identical).toEqual([])
    expect(viewport.scrollTop).toBe(80)
    expect(instance.state().overflowAmount.y).toBe(240)
  })

  it('coalesces bubbled animation and transition completions into one update', async () => {
    const { instance, viewport } = await harness()
    const update = vi.spyOn(instance, 'update')
    const child = viewport.querySelector('[data-content]')!
    for (let i = 0; i < 20; i++) {
      child.dispatchEvent(new Event('transitionend', { bubbles: true }))
      child.dispatchEvent(new Event('animationend', { bubbles: true }))
    }
    expect(update).not.toHaveBeenCalled()
    await new Promise(requestAnimationFrame)
    expect(update).toHaveBeenCalledTimes(1)
  })

  it('defers content measurements during a layout transition and catches up when it ends', async () => {
    const { instance, transitioning, height, viewport } = await harness()
    const updates = vi.fn()
    instance.on('updated', updates)
    transitioning.value = true
    expect(instance.state().sleeping).toBe(true)
    const scrollHeight = vi.spyOn(viewport, 'scrollHeight', 'get')
    const geometry = vi.spyOn(viewport, 'getBoundingClientRect')
    height.value = 700
    await nextTick()
    viewport
      .querySelector('[data-content]')!
      .dispatchEvent(new Event('transitionend', { bubbles: true }))
    await new Promise(requestAnimationFrame)
    await new Promise(requestAnimationFrame)
    expect(updates).not.toHaveBeenCalled()
    expect(scrollHeight).not.toHaveBeenCalled()
    expect(geometry).not.toHaveBeenCalled()
    viewport.scrollTop = 120
    transitioning.value = false
    await vi.waitFor(() => expect(instance.state().overflowAmount.y).toBe(540))
    expect(instance.state().sleeping).toBe(false)
    expect(viewport.scrollTop).toBe(120)
  })

  it('waits for both nested layout transitions before resuming measurements', async () => {
    const outer = ref(false)
    const inner = ref(false)
    const area = shallowRef<InstanceType<typeof ScrollArea>>()
    const Inner = defineComponent({
      setup() {
        provideLayoutTransition(inner)
        return () =>
          h(ScrollArea, { ref: area, class: 'h-40 w-60' }, () =>
            h('div', { style: 'height: 400px' }),
          )
      },
    })
    const wrapper = mount(
      defineComponent({
        setup() {
          provideLayoutTransition(outer)
          return () => h(Inner)
        },
      }),
      { attachTo: document.body },
    )
    mounted.push(wrapper)
    await vi.waitFor(() => expect(area.value?.instance).toBeTruthy())
    const instance = area.value!.instance!
    outer.value = true
    expect(instance.state().sleeping).toBe(true)
    inner.value = true
    outer.value = false
    expect(instance.state().sleeping).toBe(true)
    inner.value = false
    expect(instance.state().sleeping).toBe(false)
  })
})
