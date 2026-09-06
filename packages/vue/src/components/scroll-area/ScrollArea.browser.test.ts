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
  await vi.waitFor(
    () => {
      const hosts = document.querySelectorAll(
        '[data-overlayscrollbars-initialize]:has([data-overlayscrollbars-contents])',
      )
      for (const host of hosts) expect(host.hasAttribute('data-overlayscrollbars')).toBe(true)
    },
    { timeout: 5000 },
  )
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

    const host = w.element.querySelector('[data-overlayscrollbars-initialize]') as HTMLElement
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

describe('滚动条用 OverlayScrollbars 原生样式', () => {
  it('原生尺寸结构,把手色走 fg 弱阶 token,.dark 自动翻转', async () => {
    const w = mount(
      defineComponent({
        render: () =>
          h(ScrollArea, { style: 'height: 100px' }, () =>
            h('div', { style: 'height: 400px' }, '很长的内容'),
          ),
      }),
      { attachTo: attach() },
    )
    await settle()

    const bar = w.element.querySelector('.os-scrollbar-vertical') as HTMLElement
    expect(bar).toBeTruthy()
    expect(getComputedStyle(bar).getPropertyValue('--os-size').trim()).toBe('6px')

    await userEvent.hover(w.element as HTMLElement)
    await vi.waitFor(() => expect(getComputedStyle(bar).visibility).toBe('visible'))

    const handle = bar.querySelector('.os-scrollbar-handle')!
    expect(getComputedStyle(handle).backgroundColor).toBe('rgb(163, 163, 163)')

    document.documentElement.classList.add('dark')
    await vi.waitFor(() => expect(getComputedStyle(handle).backgroundColor).toBe('rgb(82, 82, 82)'))
    document.documentElement.classList.remove('dark')
  })
})

describe('动画驱动的内容尺寸变化', () => {
  it('高度动画中拇指逐帧重算、可滚态即时进入 —— 不等下一次 DOM 变更', async () => {
    const w = mount(
      defineComponent({
        components: { ScrollArea },
        setup: () => () =>
          h(ScrollArea, { style: 'height: 150px' }, () => [
            h('div', { style: 'height: 100px' }, '常驻'),
            h('div', { id: 'growing', style: 'height: 0; overflow: hidden' }),
          ]),
      }),
      { attachTo: attach() },
    )
    await settle()
    const viewport = viewportOf(w.findComponent(ScrollArea))
    expect(viewport.scrollHeight).toBeLessThanOrEqual(viewport.clientHeight + 1)

    const growing = w.element.querySelector('#growing') as HTMLElement
    growing.style.transition = 'height 200ms linear'
    growing.style.height = '400px'

    await vi.waitFor(() => {
      const bar = w.element.querySelector('.os-scrollbar-vertical') as HTMLElement
      const handle = bar.querySelector('.os-scrollbar-handle') as HTMLElement
      const ratio = handle.getBoundingClientRect().height / bar.getBoundingClientRect().height
      const expected = viewport.clientHeight / viewport.scrollHeight
      expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight)
      expect(Math.abs(ratio - expected)).toBeLessThan(0.05)
    })
  })
})

describe('滚动提示 · 边缘投影覆盖层', () => {
  it('both 双轴区四缘独立检测:滚到双中段四影齐亮', async () => {
    const w = mount(
      defineComponent({
        render: () =>
          h(ScrollArea, { direction: 'both', class: 'h-[120px] w-[200px]' }, () =>
            h('div', { style: 'width: 600px; height: 500px' }),
          ),
      }),
      { attachTo: attach() },
    )
    await settle()
    const viewport = viewportOf(w.findComponent(ScrollArea))
    const shadows = () =>
      Object.fromEntries(
        [...w.element.querySelectorAll('.hn-scroll-shadow')].map(el => [
          el.getAttribute('data-side'),
          el.hasAttribute('data-visible'),
        ]),
      )
    expect(Object.keys(shadows()).sort()).toEqual(['x-end', 'x-start', 'y-end', 'y-start'])
    await vi.waitFor(() =>
      expect(shadows()).toEqual({
        'x-start': false,
        'x-end': true,
        'y-start': false,
        'y-end': true,
      }),
    )

    viewport.scrollLeft = 200
    viewport.scrollTop = 180
    viewport.dispatchEvent(new Event('scroll'))
    await vi.waitFor(() =>
      expect(shadows()).toEqual({ 'x-start': true, 'x-end': true, 'y-start': true, 'y-end': true }),
    )
  })

  it('起点亮末端影、中段双影、到底只剩起点影;显隐走 base+enter 的 opacity 过渡,内容不被遮罩', async () => {
    const w = mount(
      defineComponent({
        render: () =>
          h(ScrollArea, { direction: 'horizontal', class: 'w-[200px]' }, () =>
            h('div', { style: 'width: 600px; height: 20px' }),
          ),
      }),
      { attachTo: attach() },
    )
    await settle()
    const root = w.element as HTMLElement
    const viewport = viewportOf(w.findComponent(ScrollArea))
    const startShadow = root.querySelector('[data-side="x-start"]') as HTMLElement
    const endShadow = root.querySelector('[data-side="x-end"]') as HTMLElement
    expect(startShadow.getAttribute('aria-hidden')).toBe('true')
    expect(getComputedStyle(endShadow).transitionDuration).toBe('0.3s')
    expect(getComputedStyle(viewport).maskImage).toBe('none')

    await vi.waitFor(() => expect(endShadow.hasAttribute('data-visible')).toBe(true))
    expect(startShadow.hasAttribute('data-visible')).toBe(false)
    await vi.waitFor(() => expect(getComputedStyle(endShadow).opacity).toBe('1'))
    expect(getComputedStyle(startShadow).opacity).toBe('0')

    viewport.scrollLeft = 200
    viewport.dispatchEvent(new Event('scroll'))
    await vi.waitFor(() => expect(startShadow.hasAttribute('data-visible')).toBe(true))
    expect(endShadow.hasAttribute('data-visible')).toBe(true)

    viewport.scrollLeft = 400
    viewport.dispatchEvent(new Event('scroll'))
    await vi.waitFor(() => expect(endShadow.hasAttribute('data-visible')).toBe(false))
    expect(startShadow.hasAttribute('data-visible')).toBe(true)

    const fits = mount(
      defineComponent({
        render: () =>
          h(ScrollArea, { direction: 'horizontal', class: 'w-[200px]' }, () =>
            h('div', { style: 'width: 100px; height: 20px' }),
          ),
      }),
      { attachTo: attach() },
    )
    await settle()
    expect(fits.element.querySelectorAll('[data-visible]').length).toBe(0)

    const off = mount(
      defineComponent({
        render: () =>
          h(ScrollArea, { direction: 'horizontal', shadow: false, class: 'w-[200px]' }, () =>
            h('div', { style: 'width: 600px; height: 20px' }),
          ),
      }),
      { attachTo: attach() },
    )
    await settle()
    expect(off.element.querySelectorAll('.hn-scroll-shadow').length).toBe(0)
  })
})

describe('静止零抖动', () => {
  it('挂载稳定后一秒内无自激 DOM 变更', async () => {
    const host = attach()
    host.style.cssText = 'height: 120px; width: 200px'
    mount(ScrollArea, {
      slots: { default: () => h('div', { style: 'height: 400px' }, '内容') },
      attachTo: host,
    })
    await new Promise(r => setTimeout(r, 400))

    let count = 0
    const mo = new MutationObserver(list => {
      count += list.length
    })
    mo.observe(host, { attributes: true, childList: true, subtree: true })
    await new Promise(r => setTimeout(r, 1000))
    mo.disconnect()
    expect(count).toBeLessThan(5)
  })
})

describe('横向滚动区的滚轮重定向', () => {
  function mountHorizontal(width = 200) {
    const host = attach()
    const w = mount(
      defineComponent({
        render: () =>
          h(ScrollArea, { direction: 'horizontal', class: 'block' }, () =>
            h('div', { style: 'width: 800px; height: 40px' }, '很宽的内容'),
          ),
      }),
      { attachTo: host },
    )
    host.style.width = `${width}px`
    return w.findComponent(ScrollArea)
  }

  function wheel(el: HTMLElement, deltaY: number) {
    const event = new WheelEvent('wheel', { deltaY, bubbles: true, cancelable: true })
    const allowed = el.dispatchEvent(event)
    return { allowed, prevented: event.defaultPrevented }
  }

  it('垂直滚轮在横向区转为横滚,事件被拦截不透给页面', async () => {
    const area = mountHorizontal()
    await settle()
    const viewport = viewportOf(area)
    expect(viewport.scrollLeft).toBe(0)

    const { prevented } = wheel(viewport, 120)
    expect(prevented).toBe(true)
    expect(viewport.scrollLeft).toBe(120)
  })

  it('滚到两端后滚轮放行,不锁死页面滚动', async () => {
    const area = mountHorizontal()
    await settle()
    const viewport = viewportOf(area)

    const start = wheel(viewport, -120)
    expect(start.prevented).toBe(false)

    viewport.scrollLeft = viewport.scrollWidth - viewport.clientWidth
    const end = wheel(viewport, 120)
    expect(end.prevented).toBe(false)
  })

  it('横向手势(deltaX 主导)走原生,不被重定向拦截', async () => {
    const area = mountHorizontal()
    await settle()
    const viewport = viewportOf(area)
    const event = new WheelEvent('wheel', {
      deltaY: 10,
      deltaX: 80,
      bubbles: true,
      cancelable: true,
    })
    viewport.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
  })

  it('wheelRedirect 可关闭:关闭后垂直滚轮不再被拦截', async () => {
    const host = attach()
    const w = mount(
      defineComponent({
        render: () =>
          h(ScrollArea, { direction: 'horizontal', wheelRedirect: false, class: 'block' }, () =>
            h('div', { style: 'width: 800px; height: 40px' }, '很宽的内容'),
          ),
      }),
      { attachTo: host },
    )
    host.style.width = '200px'
    await settle()
    const viewport = viewportOf(w.findComponent(ScrollArea))
    const event = new WheelEvent('wheel', { deltaY: 120, bubbles: true, cancelable: true })
    viewport.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
    expect(viewport.scrollLeft).toBe(0)
  })

  it('纵向滚动区不受影响', async () => {
    const host = attach()
    const w = mount(
      defineComponent({
        render: () =>
          h(ScrollArea, { direction: 'vertical', style: 'height: 100px' }, () =>
            h('div', { style: 'height: 600px' }, '很高的内容'),
          ),
      }),
      { attachTo: host },
    )
    await settle()
    const viewport = viewportOf(w.findComponent(ScrollArea))
    const event = new WheelEvent('wheel', { deltaY: 120, bubbles: true, cancelable: true })
    viewport.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
  })
})

describe('插槽子树整体替换(路由切页):新内容必须仍在视口内', () => {
  it('替换后的根节点是视口的后代,视口滚动量随之更新', async () => {
    const host = attach()
    const which = ref<'a' | 'b'>('a')
    const PageA = defineComponent({
      render: () => h('div', { 'data-page': 'a', style: 'height: 600px' }, '第一页'),
    })
    const PageB = defineComponent({
      render: () => h('div', { 'data-page': 'b', style: 'height: 900px' }, '第二页'),
    })
    const w = mount(
      defineComponent({
        render: () =>
          h(ScrollArea, { style: 'height: 100px' }, () => h(which.value === 'a' ? PageA : PageB)),
      }),
      { attachTo: host },
    )
    await settle()
    const viewport = viewportOf(w.findComponent(ScrollArea))
    expect(viewport.contains(w.find('[data-page=a]').element)).toBe(true)
    viewport.scrollTop = 300

    which.value = 'b'
    await settle()
    const pageB = w.find('[data-page=b]').element
    expect(pageB, '替换后的页面没有渲染').toBeTruthy()
    expect(viewport.contains(pageB), '替换后的子树被插到了视口外面').toBe(true)
    expect(viewport.scrollHeight).toBeGreaterThanOrEqual(900)
  })
})
