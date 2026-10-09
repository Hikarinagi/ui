import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick, ref, type App } from 'vue'
import { renderToString } from 'vue/server-renderer'
import axe from 'axe-core'
import LineClamp from './LineClamp.vue'
import Text from '../text/Text.vue'
import { enUS, provideUiLocale } from '../../locale'
import '../../../test/browser.css'

const long = '这是一段很长的简介，用来验证按行折叠。'.repeat(30)
const mounted: VueWrapper[] = []
const mountedApps: App[] = []
afterEach(() => {
  mounted.splice(0).forEach(w => w.unmount())
  mountedApps.splice(0).forEach(app => app.unmount())
  document.body.innerHTML = ''
})

async function settled(content: HTMLElement) {
  await vi.waitFor(() => {
    expect(content.hasAttribute('data-animating')).toBe(false)
    expect(content.style.maxHeight).toBe('')
  })
}

const frame = () => new Promise<void>(done => requestAnimationFrame(() => done()))

function painted(element: Element) {
  return new Promise<void>(done => {
    const observer = new IntersectionObserver(() => {
      observer.disconnect()
      done()
    })
    observer.observe(element)
  })
}

function setup(props: Record<string, unknown> = {}, slot: () => unknown = () => long, width = 320) {
  const host = document.createElement('div')
  host.style.width = `${width}px`
  document.body.append(host)
  const w = mount(LineClamp, { props, slots: { default: slot }, attachTo: host })
  mounted.push(w)
  const content = () => w.element.firstElementChild as HTMLElement
  return {
    w,
    host,
    content,
    settled: () => settled(content()),
    toggle: () => (w.element as HTMLElement).querySelector<HTMLElement>('.hn-line-clamp-toggle'),
    button: () => {
      const button = (w.element as HTMLElement).querySelector('button')
      return button?.checkVisibility({ visibilityProperty: true }) ? button : null
    },
    lines: () => {
      const target = (content().querySelector('p') ?? content()) as HTMLElement
      return content().clientHeight / parseFloat(getComputedStyle(target).lineHeight)
    },
  }
}

describe('LineClamp', () => {
  it('超过行数时折叠并显示「展开全部」,展开后显示全部并可收起', async () => {
    const s = setup()
    await nextTick()
    expect(s.lines()).toBe(3)
    expect(s.content().scrollHeight).toBeGreaterThan(s.content().clientHeight)
    const button = s.button()!
    expect(button.textContent?.trim()).toBe('展开全部')
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(button.getAttribute('aria-controls')).toBe(s.content().id)

    await userEvent.click(button)
    expect(s.button()!.textContent?.trim()).toBe('收起')
    expect(s.button()!.getAttribute('aria-expanded')).toBe('true')
    expect(s.w.emitted('update:expanded')).toEqual([[true]])
    await s.settled()
    expect(s.content().scrollHeight).toBe(s.content().clientHeight)
    expect(s.lines()).toBeGreaterThan(3)

    await userEvent.click(s.button()!)
    expect(s.button()!.textContent?.trim()).toBe('展开全部')
    await s.settled()
    expect(s.lines()).toBe(3)
  })

  it('内容不超过行数时不显示按钮', async () => {
    const s = setup({}, () => '只有一行。')
    await nextTick()
    expect(s.button()).toBeNull()
    expect(s.lines()).toBe(1)
    expect(getComputedStyle(s.content()).maskImage).toBe('none')
  })

  it('折叠时底部渐隐,展开稳定后移除遮罩', async () => {
    const s = setup()
    await nextTick()
    const style = () => getComputedStyle(s.content())
    expect(style().maskImage).toContain('linear-gradient')
    expect(style().getPropertyValue('--hn-line-clamp-fade')).toBe('1')

    await userEvent.click(s.button()!)
    await s.settled()
    expect(style().maskImage).toBe('none')
    expect(style().getPropertyValue('--hn-line-clamp-fade')).toBe('0')
  })

  it('按钮在内容下方占一行,折叠与展开时位置关系不变', async () => {
    const s = setup()
    await nextTick()
    const box = (element: Element) => element.getBoundingClientRect()
    const lineHeight = parseFloat(getComputedStyle(s.content()).lineHeight)
    expect(box(s.content()).height).toBe(3 * lineHeight)
    expect(box(s.toggle()!).top).toBe(box(s.content()).bottom + 4)
    expect(box(s.w.element).height).toBe(3 * lineHeight + 4 + lineHeight)

    await userEvent.click(s.button()!)
    await s.settled()
    expect(box(s.toggle()!).top).toBe(box(s.content()).bottom + 4)
    expect(box(s.toggle()!).bottom).toBe(box(s.w.element).bottom)
  })

  describe('服务端输出', () => {
    async function server(slot: () => unknown) {
      const App = defineComponent({
        setup: () => () => [
          h(LineClamp, { lines: 2 }, slot),
          h('p', { 'data-after': '' }, '后面的内容'),
        ],
      })
      const host = document.createElement('div')
      host.style.width = '320px'
      document.body.append(host)
      host.innerHTML = await renderToString(createSSRApp(App))
      await painted(host)
      const root = () => host.firstElementChild as HTMLElement
      const content = () => root().firstElementChild as HTMLElement
      const snapshot = () => ({
        height: root().getBoundingClientRect().height,
        content: content().getBoundingClientRect().height,
        after: host.querySelector('[data-after]')!.getBoundingClientRect().top,
        button: host.querySelector('button')!.checkVisibility({ visibilityProperty: true }),
        fade: getComputedStyle(content()).getPropertyValue('--hn-line-clamp-fade'),
        mask: getComputedStyle(content()).maskImage === 'none' ? 'none' : 'fade',
      })
      const hydrate = async () => {
        const app = createSSRApp(App)
        app.mount(host)
        mountedApps.push(app)
        await vi.waitFor(() => expect(root().hasAttribute('data-truncated')).toBe(true))
        await frame()
      }
      return { root, snapshot, hydrate }
    }

    it('浏览器支持按溢出状态驱动样式', () => {
      expect(CSS.supports('animation-timeline: scroll()')).toBe(true)
      expect(CSS.supports('timeline-scope: --hn-line-clamp')).toBe(true)
    })

    it('内容超出时,激活前就显示按钮与渐隐,激活后布局与外观都不变', async () => {
      const warn = vi.spyOn(console, 'warn')
      const s = await server(() => [
        h(Text, { size: 'sm' }, () => '第一段只有一行。'),
        h(Text, { size: 'sm' }, () => long),
      ])
      const before = s.snapshot()
      expect(before.content).toBeCloseTo(2 * 22, 0)
      expect(before.height).toBeCloseTo(2 * 22 + 4 + 24, 0)
      expect(before).toMatchObject({ button: true, fade: '1', mask: 'fade' })

      await s.hydrate()
      expect(s.root().dataset.truncated).toBe('true')
      expect(s.snapshot()).toEqual(before)
      expect(warn).not.toHaveBeenCalled()
      warn.mockRestore()
    })

    it.skipIf(!PerformanceObserver.supportedEntryTypes.includes('layout-shift'))(
      '从服务端输出到激活完成,浏览器没有记录到布局位移',
      async () => {
        const entries: PerformanceEntry[] = []
        const observer = new PerformanceObserver(list => entries.push(...list.getEntries()))
        observer.observe({ type: 'layout-shift' })
        const s = await server(() => long)
        await s.hydrate()
        await frame()
        await frame()
        entries.push(...observer.takeRecords())
        expect(entries).toEqual([])

        const spacer = document.createElement('div')
        spacer.style.height = '28px'
        document.body.prepend(spacer)
        await vi.waitFor(() => {
          entries.push(...observer.takeRecords())
          expect(entries.length).toBeGreaterThan(0)
        })
        observer.disconnect()
      },
    )

    it('内容不超出时,激活前后都没有按钮与渐隐,高度等于内容高度', async () => {
      const warn = vi.spyOn(console, 'warn')
      const s = await server(() => '只有一行。')
      const before = s.snapshot()
      expect(before.height).toBe(before.content)
      expect(before).toMatchObject({ button: false, fade: '0' })

      await s.hydrate()
      expect(s.root().dataset.truncated).toBe('false')
      const after = s.snapshot()
      expect(after).toMatchObject({
        height: before.height,
        content: before.content,
        after: before.after,
        button: false,
        fade: '0',
      })
      expect(warn).not.toHaveBeenCalled()
      warn.mockRestore()
    })
  })

  it('展开与收起经过高度过渡,渐隐随之淡出与淡入', async () => {
    const s = setup()
    await nextTick()
    const collapsed = s.content().clientHeight
    const full = s.content().scrollHeight
    async function sample() {
      const heights: number[] = []
      const fades: number[] = []
      while (s.content().hasAttribute('data-animating')) {
        heights.push(s.content().getBoundingClientRect().height)
        fades.push(
          parseFloat(getComputedStyle(s.content()).getPropertyValue('--hn-line-clamp-fade')),
        )
        await frame()
      }
      return { heights, fades }
    }
    const between = (value: number, low: number, high: number) =>
      value > low + 1 && value < high - 1

    await userEvent.click(s.button()!)
    expect(s.content().hasAttribute('data-animating')).toBe(true)
    const opening = await sample()
    expect(opening.heights.some(height => between(height, collapsed, full))).toBe(true)
    expect(opening.fades.some(fade => fade > 0.02 && fade < 0.98)).toBe(true)
    expect(getComputedStyle(s.content()).maskImage).toBe('none')
    expect(s.content().clientHeight).toBe(full)

    await userEvent.click(s.button()!)
    expect(s.content().hasAttribute('data-animating')).toBe(true)
    const closing = await sample()
    expect(closing.heights.some(height => between(height, collapsed, full))).toBe(true)
    expect(closing.fades.some(fade => fade > 0.02 && fade < 0.98)).toBe(true)
    expect(s.content().clientHeight).toBe(collapsed)
    expect(getComputedStyle(s.content()).maskImage).toContain('linear-gradient')
  })

  it('过渡途中再次点击,从当前高度折回并停在折叠状态', async () => {
    const s = setup()
    await nextTick()
    const collapsed = s.content().clientHeight
    await userEvent.click(s.button()!)
    await vi.waitFor(() =>
      expect(s.content().getBoundingClientRect().height).toBeGreaterThan(collapsed + 20),
    )
    const turning = s.content().getBoundingClientRect().height
    expect(s.content().hasAttribute('data-animating')).toBe(true)
    s.button()!.click()
    await nextTick()
    const heights: number[] = []
    while (s.content().hasAttribute('data-animating')) {
      heights.push(s.content().getBoundingClientRect().height)
      await frame()
    }
    expect(Math.max(...heights)).toBeLessThanOrEqual(turning + 60)
    expect(heights.at(-1)).toBeLessThan(heights[0]!)
    expect(s.button()!.textContent?.trim()).toBe('展开全部')
    await s.settled()
    expect(s.content().clientHeight).toBe(collapsed)
    expect(s.content().hasAttribute('data-expanded')).toBe(false)
  })

  it('包住 Text 等块级内容时按内部的行高折叠', async () => {
    const s = setup({ lines: 2 }, () => [
      h(Text, { size: 'sm' }, () => '第一段只有一行。'),
      h(Text, { size: 'sm' }, () => long),
    ])
    await nextTick()
    expect(s.lines()).toBe(2)
    expect(s.button()).not.toBeNull()
  })

  it('行数改变后重新判断是否超出', async () => {
    const s = setup({ lines: 2 })
    await nextTick()
    expect(s.lines()).toBe(2)
    await s.w.setProps({ lines: 200 })
    await vi.waitFor(() => expect(s.button()).toBeNull())
    await s.w.setProps({ lines: 4 })
    await vi.waitFor(() => expect(s.button()).not.toBeNull())
    expect(s.lines()).toBe(4)
  })

  it('容器变宽到放得下时按钮消失,变窄后恢复', async () => {
    const s = setup({}, () => '这一段在窄容器里会折成很多行，在宽容器里只有一行。'.repeat(2), 120)
    await nextTick()
    expect(s.button()).not.toBeNull()
    s.host.style.width = '2400px'
    await vi.waitFor(() => expect(s.button()).toBeNull())
    s.host.style.width = '120px'
    await vi.waitFor(() => expect(s.button()).not.toBeNull())
  })

  it('展开状态下容器变宽到放得下时「收起」也消失', async () => {
    const s = setup(
      { expanded: true },
      () => '这一段在窄容器里会折成很多行，在宽容器里只有一行。'.repeat(2),
      120,
    )
    await nextTick()
    expect(s.button()!.textContent?.trim()).toBe('收起')
    expect(s.content().scrollHeight).toBe(s.content().clientHeight)
    s.host.style.width = '2400px'
    await vi.waitFor(() => expect(s.button()).toBeNull())
  })

  it('v-model:expanded 受控', async () => {
    const expanded = ref(false)
    const host = document.createElement('div')
    host.style.width = '320px'
    document.body.append(host)
    const w = mount(
      defineComponent({
        setup: () => () =>
          h(
            LineClamp,
            {
              expanded: expanded.value,
              'onUpdate:expanded': (value: boolean) => (expanded.value = value),
            },
            () => long,
          ),
      }),
      { attachTo: host },
    )
    mounted.push(w)
    await nextTick()
    const content = w.element.firstElementChild as HTMLElement
    expanded.value = true
    await nextTick()
    await settled(content)
    expect(content.scrollHeight).toBe(content.clientHeight)
    await userEvent.click(w.get('button').element)
    expect(expanded.value).toBe(false)
    await settled(content)
    expect(content.scrollHeight).toBeGreaterThan(content.clientHeight)
  })

  it('按钮文案可以自定义,默认取自界面语言', async () => {
    const custom = setup({ expandLabel: '查看全文', collapseLabel: '收起全文' })
    await nextTick()
    expect(custom.button()!.textContent?.trim()).toBe('查看全文')
    await userEvent.click(custom.button()!)
    expect(custom.button()!.textContent?.trim()).toBe('收起全文')

    const host = document.createElement('div')
    host.style.width = '320px'
    document.body.append(host)
    const english = mount(
      defineComponent({
        setup() {
          provideUiLocale(enUS)
          return () => h(LineClamp, null, () => long)
        },
      }),
      { attachTo: host },
    )
    mounted.push(english)
    await nextTick()
    expect(english.get('button').text()).toBe('Show all')
  })

  it('收起后把组件滚回可视范围', async () => {
    const spacer = document.createElement('div')
    spacer.style.height = '600px'
    document.body.append(spacer)
    const s = setup({ expanded: true }, () => long.repeat(4))
    const tail = document.createElement('div')
    tail.style.height = '2000px'
    document.body.append(tail)
    await nextTick()
    s.button()!.scrollIntoView({ block: 'end' })
    expect(s.w.element.getBoundingClientRect().top).toBeLessThan(0)
    await userEvent.click(s.button()!)
    await vi.waitFor(() =>
      expect(s.w.element.getBoundingClientRect().top).toBeGreaterThanOrEqual(0),
    )
    expect(s.w.element.getBoundingClientRect().bottom).toBeLessThanOrEqual(innerHeight)
  })

  it('折叠与展开两种状态都没有 a11y 违规', async () => {
    const s = setup()
    await nextTick()
    const rules = { region: { enabled: false }, 'color-contrast': { enabled: false } }
    expect((await axe.run(s.host, { rules })).violations).toEqual([])
    await userEvent.click(s.button()!)
    await s.settled()
    expect((await axe.run(s.host, { rules })).violations).toEqual([])
  })
})
