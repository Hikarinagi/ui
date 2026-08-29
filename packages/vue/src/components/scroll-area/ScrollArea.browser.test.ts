import { describe, expect, it, vi } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref, shallowRef } from 'vue'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { autoUpdate, computePosition } from '@floating-ui/dom'
import { OverlayScrollbars } from 'overlayscrollbars'
import ScrollArea from './ScrollArea.vue'
import Button from '../button/Button.vue'
import '../../../test/browser.css'

function attach() {
  const host = document.createElement('div')
  document.body.appendChild(host)
  return host
}

async function settle(frames = 3) {
  for (let i = 0; i < frames; i++) {
    await new Promise(r => requestAnimationFrame(() => r(null)))
  }
  await nextTick()
}

type Exposed = { viewport?: { value?: HTMLElement }; instance?: { value?: unknown } }

function exposedOf(wrapper: { vm: { $: { exposed: unknown } }; element: Element }) {
  const exposed = wrapper.vm.$.exposed as Exposed | null
  const viewport = exposed?.viewport?.value
  expect(exposed, 'ScrollArea 未通过 defineExpose 暴露任何东西').toBeTruthy()
  expect(viewport, 'ScrollArea 未暴露 viewport').toBeTruthy()
  expect(exposed?.instance?.value, 'OverlayScrollbars 未初始化').toBeTruthy()
  expect(viewport, '滚动元素应是 OverlayScrollbars 的内部视口,而不是宿主本身').not.toBe(
    wrapper.element,
  )
  return viewport as HTMLElement
}

function viewportOf(wrapper: { vm: { $: { exposed: unknown } }; element: Element }) {
  return exposedOf(wrapper)
}

describe('渐进增强:JS 到位之前也能滚', () => {
  it('未初始化的宿主由 OverlayScrollbars 自带样式给出原生滚动', async () => {
    const host = document.createElement('div')
    host.setAttribute('data-overlayscrollbars-initialize', '')
    host.style.cssText = 'height: 80px; width: 120px'
    host.innerHTML = '<div style="height: 400px"></div>'
    document.body.appendChild(host)
    await settle()

    expect(getComputedStyle(host).overflow).toBe('auto')
    host.scrollTop = 120
    expect(host.scrollTop).toBeGreaterThan(0)
  })

  it('初始化后宿主让位给内部视口,不构成嵌套滚动容器', async () => {
    const w = mount(ScrollArea, {
      attrs: { style: 'height: 80px; width: 120px' },
      slots: { default: () => h('div', { style: 'height: 400px' }) },
      attachTo: attach(),
    })
    await settle()

    const host = w.element as HTMLElement
    const viewport = viewportOf(w)

    expect(host.hasAttribute('data-overlayscrollbars')).toBe(true)
    expect(getComputedStyle(host).overflow).not.toBe('auto')
    expect(getComputedStyle(viewport).overflowY).toBe('scroll')
  })

  it('接管时保留已有的滚动位置', async () => {
    const host = document.createElement('div')
    host.setAttribute('data-overlayscrollbars-initialize', '')
    host.style.cssText = 'height: 80px; width: 120px'
    host.innerHTML = '<div style="height: 600px"></div>'
    document.body.appendChild(host)
    await settle()

    host.scrollTop = 200
    expect(host.scrollTop).toBe(200)

    const os = OverlayScrollbars(host, {})
    await settle()

    expect(os.elements().viewport.scrollTop).toBe(200)
    os.destroy()
  })
})

describe('direction 落到视口的实际 overflow', () => {
  const cases = [
    ['vertical', 'hidden', 'scroll'],
    ['horizontal', 'scroll', 'hidden'],
    ['both', 'scroll', 'scroll'],
  ] as const

  for (const [direction, x, y] of cases) {
    it(`${direction} → overflow-x ${x} / overflow-y ${y}`, async () => {
      const w = mount(ScrollArea, {
        props: { direction },
        attrs: { style: 'height: 80px; width: 120px' },
        slots: { default: () => h('div', { style: 'width: 400px; height: 400px' }) },
        attachTo: attach(),
      })
      await settle()
      const style = getComputedStyle(viewportOf(w))
      expect(style.overflowX).toBe(x)
      expect(style.overflowY).toBe(y)
    })
  }
})

describe('spike 1 · 键盘导航的滚动跟随', () => {
  it('聚焦视口外的条目时,自定义视口会滚动到可见', async () => {
    const w = mount(
      defineComponent({
        components: { ScrollArea, Button },
        setup: () => () =>
          h(ScrollArea, { style: 'height: 120px; width: 240px' }, () =>
            Array.from({ length: 40 }, (_, i) =>
              h(Button, { variant: 'ghost', tone: 'neutral', block: true }, () => `项目 ${i}`),
            ),
          ),
      }),
      { attachTo: attach() },
    )
    await settle()

    const viewport = viewportOf(w.findComponent(ScrollArea))
    expect(viewport.scrollTop).toBe(0)

    const buttons = w.findAll('button')
    const far = buttons[30]!.element as HTMLElement
    far.focus()
    await settle()

    expect(document.activeElement).toBe(far)
    expect(viewport.scrollTop).toBeGreaterThan(0)

    const box = far.getBoundingClientRect()
    const vp = viewport.getBoundingClientRect()
    expect(box.top).toBeGreaterThanOrEqual(vp.top - 1)
    expect(box.bottom).toBeLessThanOrEqual(vp.bottom + 1)
  })

  it('Tab 逐项前进时视口持续跟随', async () => {
    const w = mount(
      defineComponent({
        components: { ScrollArea, Button },
        setup: () => () =>
          h(ScrollArea, { style: 'height: 100px; width: 240px' }, () =>
            Array.from({ length: 20 }, (_, i) =>
              h(Button, { variant: 'ghost', tone: 'neutral', block: true }, () => `行 ${i}`),
            ),
          ),
      }),
      { attachTo: attach() },
    )
    await settle()
    const viewport = viewportOf(w.findComponent(ScrollArea))

    for (let i = 0; i < 12; i++) await userEvent.tab()
    await settle()

    expect(viewport.scrollTop).toBeGreaterThan(0)
  })
})

describe('spike 2 · 虚拟滚动绑定自定义视口', () => {
  it('虚拟化器绑到 viewport 后,滚动能推进渲染窗口', async () => {
    const scroller = shallowRef<HTMLElement>()
    const rows = ref<number[]>([])

    const Harness = defineComponent({
      setup() {
        const areaRef = ref<InstanceType<typeof ScrollArea>>()
        const virtualizer = useVirtualizer({
          count: 2000,
          getScrollElement: () => scroller.value ?? null,
          estimateSize: () => 24,
          overscan: 2,
        })
        return () =>
          h(ScrollArea, { ref: areaRef, style: 'height: 200px; width: 240px' }, () => [
            h(
              'div',
              { style: { height: `${virtualizer.value.getTotalSize()}px`, position: 'relative' } },
              virtualizer.value.getVirtualItems().map(item => {
                rows.value = virtualizer.value.getVirtualItems().map(i => i.index)
                return h(
                  'div',
                  {
                    key: String(item.key),
                    style: {
                      position: 'absolute',
                      top: 0,
                      insetInlineStart: 0,
                      width: '100%',
                      height: `${item.size}px`,
                      transform: `translateY(${item.start}px)`,
                    },
                  },
                  `第 ${item.index} 行`,
                )
              }),
            ),
          ])
      },
    })

    const w = mount(Harness, { attachTo: attach() })
    await settle()
    scroller.value = viewportOf(w.findComponent(ScrollArea))
    await settle(5)

    const first = rows.value[0]!
    expect(rows.value.length).toBeGreaterThan(0)
    expect(first).toBe(0)

    scroller.value.scrollTop = 12000
    scroller.value.dispatchEvent(new Event('scroll'))
    await settle(5)

    expect(rows.value[0]!).toBeGreaterThan(400)
    expect(w.text()).toContain('第 500 行')
  })
})

describe('spike 3 · 浮层在滚动容器内的跟随定位', () => {
  it('滚动容器时 autoUpdate 会重新定位浮层', async () => {
    const anchor = shallowRef<HTMLElement>()
    const floating = shallowRef<HTMLElement>()

    const w = mount(
      defineComponent({
        setup: () => () =>
          h('div', [
            h(ScrollArea, { style: 'height: 120px; width: 240px' }, () => [
              h('div', { style: 'height: 300px' }),
              h('div', { ref: anchor, style: 'height: 24px; background: #ccc' }, '锚点'),
              h('div', { style: 'height: 300px' }),
            ]),
            h('div', { ref: floating, style: 'position: absolute; top: 0; left: 0' }, '浮层'),
          ]),
      }),
      { attachTo: attach() },
    )
    await settle()

    const viewport = viewportOf(w.findComponent(ScrollArea))
    const positions: number[] = []
    const stop = autoUpdate(anchor.value!, floating.value!, () => {
      void computePosition(anchor.value!, floating.value!, { placement: 'bottom' }).then(
        ({ y }) => {
          floating.value!.style.top = `${y}px`
          positions.push(Math.round(y))
        },
      )
    })

    await settle(5)
    const before = positions.at(-1)

    viewport.scrollTop = 200
    viewport.dispatchEvent(new Event('scroll'))
    await settle(5)
    await vi.waitFor(() => expect(positions.at(-1)).not.toBe(before))

    stop()
    expect(positions.length).toBeGreaterThan(1)
  })
})
