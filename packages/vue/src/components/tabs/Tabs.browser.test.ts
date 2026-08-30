import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { defineComponent, h } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import Tabs from './Tabs.vue'
import TabsList from './TabsList.vue'
import TabsTrigger from './TabsTrigger.vue'
import TabsContent from './TabsContent.vue'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

function mountTabs(extra: Record<string, unknown> = {}) {
  const host = document.createElement('div')
  host.style.cssText = 'width: 480px'
  document.body.appendChild(host)
  const App = defineComponent({
    render: () =>
      h(Tabs, { defaultValue: 'preview', ...extra }, () => [
        h(TabsList, { label: '示例区' }, () => [
          h(TabsTrigger, { value: 'preview' }, () => '预览'),
          h(TabsTrigger, { value: 'code' }, () => '代码'),
          h(TabsTrigger, { value: 'locked', disabled: true }, () => '锁定'),
        ]),
        h(TabsContent, { value: 'preview' }, () => h('p', '预览内容')),
        h(TabsContent, { value: 'code' }, () => h('p', '代码内容')),
      ]),
  })
  const w = mount(App, { attachTo: host })
  mounted.push(w)
  return w
}

const triggers = () => [...document.querySelectorAll('[role="tab"]')] as HTMLElement[]
const indicator = () =>
  document.querySelector('[role="tablist"] > [aria-hidden="true"]') as HTMLElement | null

describe('tabs · 分页签', () => {
  it('默认选中 defaultValue,点击切换内容与 aria 状态', async () => {
    mountTabs()
    const [preview, code] = triggers()
    expect(preview!.getAttribute('aria-selected')).toBe('true')
    expect(document.body.textContent).toContain('预览内容')
    expect(document.body.textContent).not.toContain('代码内容')

    await userEvent.click(code!)
    expect(code!.getAttribute('aria-selected')).toBe('true')
    expect(document.body.textContent).toContain('代码内容')
    expect(document.body.textContent).not.toContain('预览内容')
  })

  it('滑块走 Highlight 原语:单实例、Motion 布局动画收敛到目标页签', async () => {
    mountTabs()
    await vi.waitFor(() => expect(indicator()).not.toBeNull())
    const ind = indicator()!
    const [, code] = triggers()
    const before = ind.offsetLeft

    await userEvent.click(code!)
    await vi.waitFor(
      () => {
        expect(Math.abs(ind.offsetLeft - code!.offsetLeft)).toBeLessThan(2)
        expect(Math.abs(ind.offsetWidth - code!.offsetWidth)).toBeLessThan(2)
      },
      { timeout: 1500 },
    )
    expect(ind.offsetLeft).toBeGreaterThan(before)
    expect(document.querySelectorAll('[role="tablist"] > [aria-hidden="true"]').length).toBe(1)
  })

  it('选中项与未选中项的交互墨同色相,不混出灰青两套', async () => {
    mountTabs()
    const [selected, idle] = triggers()
    const inkOf = (el: HTMLElement) => getComputedStyle(el, '::after').backgroundColor
    expect(selected!.getAttribute('aria-selected')).toBe('true')
    expect(inkOf(selected!)).toBe(inkOf(idle!))
  })

  it('波纹色随变体分道:underline 取 accent 预示选中,soft 保持中性', async () => {
    mountTabs()
    mountTabs({ variant: 'soft' })
    const rippleInk = (root: number) => {
      const trigger = [...document.querySelectorAll('[role="tablist"]')][root]!.querySelector(
        '[role="tab"]',
      ) as HTMLElement
      const surface = trigger.querySelector('.hn-ripple-surface') as HTMLElement
      return getComputedStyle(surface, '::after').backgroundImage
    }
    const underlineInk = rippleInk(0)
    const softInk = rippleInk(1)
    expect(underlineInk).not.toBe(softInk)

    const [a, b] = [...document.querySelectorAll('[role="tablist"]')][0]!.querySelectorAll(
      '[role="tab"]',
    ) as NodeListOf<HTMLElement>
    expect(
      getComputedStyle(a!.querySelector('.hn-ripple-surface')!, '::after').backgroundImage,
    ).toBe(getComputedStyle(b!.querySelector('.hn-ripple-surface')!, '::after').backgroundImage)
  })

  it('soft 变体:滑块整高圆角、在文字下层;trigger 分档更矮', async () => {
    mountTabs({ variant: 'soft', size: 'sm' })
    await vi.waitFor(() => expect(indicator()).not.toBeNull())
    const ind = indicator()!
    const list = document.querySelector('[role="tablist"]') as HTMLElement
    const cs = getComputedStyle(ind)
    expect(cs.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(parseFloat(cs.height)).toBeGreaterThan(20)
    expect(getComputedStyle(list).borderBottomWidth).toBe('0px')
    const trigger = triggers()[0]!
    expect(trigger.offsetHeight).toBe(28)
    expect(getComputedStyle(trigger).zIndex).toBe('1')
  })

  it('页签溢出时 List 可横向滚动', async () => {
    const host = document.createElement('div')
    host.style.cssText = 'width: 220px'
    document.body.appendChild(host)
    const App = defineComponent({
      render: () =>
        h(Tabs, { defaultValue: 't0' }, () => [
          h(TabsList, null, () =>
            Array.from({ length: 8 }, (_, i) =>
              h(TabsTrigger, { value: `t${i}` }, () => `很长的页签${i}`),
            ),
          ),
          h(TabsContent, { value: 't0' }, () => h('p', '内容')),
        ]),
    })
    const w = mount(App, { attachTo: host })
    mounted.push(w)
    await vi.waitFor(() => {
      const viewport = document.querySelector(
        '[data-overlayscrollbars-viewport]',
      ) as HTMLElement | null
      expect(viewport).not.toBeNull()
      expect(viewport!.scrollWidth).toBeGreaterThan(viewport!.clientWidth)
    })
    for (const bar of document.querySelectorAll('.os-scrollbar')) {
      expect(getComputedStyle(bar).visibility).toBe('hidden')
    }
  })

  it('竖排:aria-orientation 换轴、上下键循焦、滑块沿 y 追随', async () => {
    const host = document.createElement('div')
    host.style.cssText = 'width: 480px'
    document.body.appendChild(host)
    const App = defineComponent({
      render: () =>
        h(Tabs, { defaultValue: 'a', orientation: 'vertical' }, () => [
          h(TabsList, { label: '竖排' }, () => [
            h(TabsTrigger, { value: 'a' }, () => '甲'),
            h(TabsTrigger, { value: 'b' }, () => '乙'),
            h(TabsTrigger, { value: 'c' }, () => '丙'),
          ]),
          h(TabsContent, { value: 'a' }, () => h('p', '甲内容')),
          h(TabsContent, { value: 'b' }, () => h('p', '乙内容')),
        ]),
    })
    const w = mount(App, { attachTo: host })
    mounted.push(w)

    const list = document.querySelector('[role="tablist"]') as HTMLElement
    expect(list.getAttribute('aria-orientation')).toBe('vertical')

    const [a, b] = triggers()
    expect(b!.getBoundingClientRect().top).toBeGreaterThan(a!.getBoundingClientRect().top)

    a!.focus()
    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(b)
    expect(b!.getAttribute('aria-selected')).toBe('true')

    await vi.waitFor(() => expect(indicator()).not.toBeNull())
    const ind = indicator()!
    await vi.waitFor(
      () => {
        expect(Math.abs(ind.offsetTop - b!.offsetTop)).toBeLessThan(2)
        expect(Math.abs(ind.offsetHeight - b!.offsetHeight)).toBeLessThan(2)
      },
      { timeout: 1500 },
    )
  })

  it('键盘左右在页签间移动并激活;禁用页签被跳过', async () => {
    mountTabs()
    const [preview, code, locked] = triggers()
    preview!.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(code)
    expect(code!.getAttribute('aria-selected')).toBe('true')

    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement).not.toBe(locked)
    expect(locked!.hasAttribute('disabled')).toBe(true)
  })
})
