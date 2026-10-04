import { describe, expect, it, beforeEach, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { Tabs, type TabsProps } from './Tabs'
import { TabsList } from './TabsList'
import { TabsTrigger } from './TabsTrigger'
import { TabsContent } from './TabsContent'
import { mount } from '../../../test/mount'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

function mountTabs(extra: Partial<TabsProps> = {}) {
  return mount(
    <div style={{ width: '480px' }}>
      <Tabs defaultValue="preview" {...extra}>
        <TabsList label="示例区">
          <TabsTrigger value="preview">预览</TabsTrigger>
          <TabsTrigger value="code">代码</TabsTrigger>
          <TabsTrigger value="locked" disabled>
            锁定
          </TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <p>预览内容</p>
        </TabsContent>
        <TabsContent value="code">
          <p>代码内容</p>
        </TabsContent>
      </Tabs>
    </div>,
  )
}

const triggers = () => [...document.querySelectorAll('[role="tab"]')] as HTMLElement[]
const indicator = () => document.querySelector('[data-hn-highlight]') as HTMLElement | null
const rect = (el: Element) => el.getBoundingClientRect()

describe('tabs · 分页签', () => {
  it('默认选中 defaultValue,点击切换内容与 aria 状态', async () => {
    await mountTabs()
    const [preview, code] = triggers()
    expect(preview!.getAttribute('aria-selected')).toBe('true')
    expect(document.body.textContent).toContain('预览内容')
    expect(document.body.textContent).not.toContain('代码内容')

    await userEvent.click(code!)
    expect(code!.getAttribute('aria-selected')).toBe('true')
    expect(document.body.textContent).toContain('代码内容')
    expect(document.body.textContent).not.toContain('预览内容')
  })

  it('滑块就地渲染在选中页签内；切换时以共享布局动画飞到新页签，中途位置介于两端，落定后逐像素贴合', async () => {
    await mountTabs()
    await vi.waitFor(() => expect(indicator()).not.toBeNull())
    const [preview, code] = triggers()
    expect(preview!.contains(indicator())).toBe(true)
    expect(Math.abs(rect(indicator()!).left - rect(preview!).left)).toBeLessThan(0.01)
    const from = rect(preview!).left
    const to = rect(code!).left

    await userEvent.click(code!)
    await vi.waitFor(() => expect(code!.contains(indicator())).toBe(true))
    await vi.waitFor(() => {
      const left = rect(indicator()!).left
      expect(left).toBeGreaterThan(from + 1)
      expect(left).toBeLessThan(to - 1)
    })
    await vi.waitFor(
      () => {
        expect(Math.abs(rect(indicator()!).left - to)).toBeLessThan(0.01)
        expect(Math.abs(rect(indicator()!).width - rect(code!).width)).toBeLessThan(0.01)
      },
      { timeout: 1500 },
    )
    expect(document.querySelectorAll('[data-hn-highlight]').length).toBe(1)
  })

  it('拉丁文页签的宽度带小数，滑块仍逐像素贴合页签盒', async () => {
    await mount(
      <div style={{ width: '480px' }}>
        <Tabs defaultValue="b">
          <TabsList>
            <TabsTrigger value="a">underline</TabsTrigger>
            <TabsTrigger value="b">Wireframe</TabsTrigger>
          </TabsList>
          <TabsContent value="b">
            <p>内容</p>
          </TabsContent>
        </Tabs>
      </div>,
    )
    await vi.waitFor(() => expect(indicator()).not.toBeNull())
    const tab = triggers()[1]!
    const box = tab.getBoundingClientRect()
    expect(box.width % 1).not.toBe(0)
    await vi.waitFor(() => {
      const ind = indicator()!.getBoundingClientRect()
      expect(Math.abs(ind.left - box.left)).toBeLessThan(0.01)
      expect(Math.abs(ind.width - box.width)).toBeLessThan(0.01)
    })
  })

  it('选中项与未选中项的交互墨同色相,不混出灰青两套', async () => {
    await mountTabs()
    const [selected, idle] = triggers()
    const inkOf = (el: HTMLElement) => getComputedStyle(el, '::after').backgroundColor
    expect(selected!.getAttribute('aria-selected')).toBe('true')
    expect(inkOf(selected!)).toBe(inkOf(idle!))
  })

  it('波纹色随变体分道:underline 取 accent 预示选中,soft 保持中性', async () => {
    await mountTabs()
    await mountTabs({ variant: 'soft' })
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
    await mountTabs({ variant: 'soft', size: 'sm' })
    await vi.waitFor(() => expect(indicator()).not.toBeNull())
    const ind = indicator()!
    const list = document.querySelector('[role="tablist"]') as HTMLElement
    const cs = getComputedStyle(ind)
    expect(cs.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(parseFloat(cs.height)).toBeGreaterThan(20)
    expect(getComputedStyle(list).borderBottomWidth).toBe('0px')
    const [active, idle] = triggers()
    expect(active!.offsetHeight).toBe(28)
    expect(getComputedStyle(active!).zIndex).toBe('0')
    expect(getComputedStyle(idle!).zIndex).toBe('1')
  })

  it('页签溢出时 List 可横向滚动', async () => {
    await mount(
      <div style={{ width: '220px' }}>
        <Tabs defaultValue="t0">
          <TabsList>
            {Array.from({ length: 8 }, (_, i) => (
              <TabsTrigger key={i} value={`t${i}`}>{`很长的页签${i}`}</TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="t0">
            <p>内容</p>
          </TabsContent>
        </Tabs>
      </div>,
    )
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
    await mount(
      <div style={{ width: '480px' }}>
        <Tabs defaultValue="a" orientation="vertical">
          <TabsList label="竖排">
            <TabsTrigger value="a">甲</TabsTrigger>
            <TabsTrigger value="b">乙</TabsTrigger>
            <TabsTrigger value="c">丙</TabsTrigger>
          </TabsList>
          <TabsContent value="a">
            <p>甲内容</p>
          </TabsContent>
          <TabsContent value="b">
            <p>乙内容</p>
          </TabsContent>
        </Tabs>
      </div>,
    )

    const list = document.querySelector('[role="tablist"]') as HTMLElement
    expect(list.getAttribute('aria-orientation')).toBe('vertical')

    const [a, b] = triggers()
    expect(b!.getBoundingClientRect().top).toBeGreaterThan(a!.getBoundingClientRect().top)

    a!.focus()
    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(b)
    expect(b!.getAttribute('aria-selected')).toBe('true')

    await vi.waitFor(() => expect(b!.contains(indicator())).toBe(true))
    await vi.waitFor(
      () => {
        expect(Math.abs(rect(indicator()!).top - rect(b!).top)).toBeLessThan(0.01)
        expect(Math.abs(rect(indicator()!).height - rect(b!).height)).toBeLessThan(0.01)
      },
      { timeout: 1500 },
    )
  })

  it('键盘左右在页签间移动并激活;禁用页签被跳过', async () => {
    await mountTabs()
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
