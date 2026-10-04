import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render, type RenderResult } from 'vitest-browser-react'
import type { CSSProperties, ReactNode } from 'react'
import { CodeBlock, type CodeBlockProps } from './CodeBlock'
import { Prose } from '../prose/Prose'
import '../../../test/browser.css'

const mounted: RenderResult[] = []
const source = Array.from(
  { length: 40 },
  (_, i) => 'const value' + i + ' = "' + 'code'.repeat(40) + '"',
).join('\n')

afterEach(async () => {
  for (const wrapper of mounted) await wrapper.unmount()
  mounted.length = 0
  document.body.innerHTML = ''
})

async function mount(ui: ReactNode) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const screen = await render(ui, { container: host })
  mounted.push(screen)
  return screen
}

type Attrs = { className?: string; style?: CSSProperties }

async function block(attrs: Attrs = {}, code = source) {
  const ui = (props: Partial<CodeBlockProps>) => (
    <CodeBlock code={code} label="代码" style={{ width: '288px' }} {...attrs} {...props} />
  )
  const screen = await mount(ui({}))
  return {
    element: screen.container.firstElementChild as HTMLElement,
    setProps: (props: Partial<CodeBlockProps>) => screen.rerender(ui(props)),
    get: (selector: string) => screen.container.querySelector<HTMLElement>(selector)!,
    findAll: (selector: string) => [...screen.container.querySelectorAll<HTMLElement>(selector)],
  }
}

async function viewportOf(root: ParentNode) {
  const viewport = root.querySelector<HTMLElement>('[data-overlayscrollbars-contents]')!
  await vi.waitFor(() =>
    expect(viewport.hasAttribute('data-overlayscrollbars-viewport')).toBe(true),
  )
  return viewport
}

describe('CodeBlock 尺寸与滚动', () => {
  it.each([
    ['height class', { className: 'h-40' }],
    ['max-height class', { className: 'max-h-40' }],
    ['height style', { style: { width: '288px', height: '160px' } }],
    ['max-height style', { style: { width: '288px', maxHeight: '160px' } }],
  ] as [string, Attrs][])('%s 约束实际视口，两轴可滚动且控件保持固定', async (_name, attrs) => {
    const wrapper = await block(attrs)
    const viewport = await viewportOf(wrapper.element)
    expect(wrapper.element.getBoundingClientRect().height).toBeCloseTo(160, 0)
    expect(viewport.getBoundingClientRect().height).toBeCloseTo(160, 0)
    expect(getComputedStyle(viewport).overflowY).toBe('scroll')
    expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight)
    expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth)
    const before = wrapper.get('button').getBoundingClientRect()
    viewport.scrollTo(100, 100)
    await vi.waitFor(() => {
      expect(viewport.scrollTop).toBeGreaterThan(0)
      expect(viewport.scrollLeft).toBeGreaterThan(0)
    })
    const after = wrapper.get('button').getBoundingClientRect()
    expect(after.x).toBe(before.x)
    expect(after.y).toBe(before.y)
  })

  it('max-height 下短内容保持自然高度，内容增长和缩短会重新计算溢出', async () => {
    const wrapper = await block({ className: 'max-h-40' }, 'short')
    const viewport = await viewportOf(wrapper.element)
    expect(wrapper.element.getBoundingClientRect().height).toBeLessThan(160)
    await wrapper.setProps({ code: source })
    await vi.waitFor(() => expect(viewport.clientHeight).toBe(160))
    viewport.scrollTop = 100
    await wrapper.setProps({ code: 'short' })
    await vi.waitFor(() => {
      expect(wrapper.element.getBoundingClientRect().height).toBeLessThan(160)
      expect(viewport.scrollTop).toBe(0)
      expect(wrapper.findAll('.hn-scroll-shadow[data-visible]')).toHaveLength(0)
    })
  })

  it('未设高度时自然展开，只有长行在内部滚动', async () => {
    const wrapper = await block()
    const viewport = await viewportOf(wrapper.element)
    expect(viewport.scrollHeight).toBe(viewport.clientHeight)
    expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth)
    expect(wrapper.element.getBoundingClientRect().height).toBeGreaterThan(160)
  })

  it('视口铺满边框，阴影贴合裁切位置，内边距随内容滚动', async () => {
    const wrapper = await block({ className: 'h-40' })
    const viewport = await viewportOf(wrapper.element)
    const frame = wrapper.get('.hn-pre').getBoundingClientRect()
    const view = viewport.getBoundingClientRect()
    for (const edge of ['left', 'right', 'top', 'bottom'] as const) {
      expect(view[edge]).toBeCloseTo(frame[edge], 0)
    }
    const pre = wrapper.get('pre')
    const padding = getComputedStyle(pre)
    expect(Number.parseFloat(padding.paddingInlineStart)).toBeGreaterThan(0)
    await vi.waitFor(() => {
      expect(wrapper.get('[data-side="x-end"]').getAttribute('data-visible')).toBe('')
      expect(wrapper.get('[data-side="y-end"]').getAttribute('data-visible')).toBe('')
    })
    expect(wrapper.get('[data-side="x-end"]').getBoundingClientRect().right).toBeCloseTo(
      view.right,
      0,
    )
    expect(wrapper.get('[data-side="y-end"]').getBoundingClientRect().bottom).toBeCloseTo(
      view.bottom,
      0,
    )
    viewport.scrollTo(viewport.scrollWidth, viewport.scrollHeight)
    await vi.waitFor(() => {
      expect(wrapper.get('[data-side="x-start"]').getAttribute('data-visible')).toBe('')
      expect(wrapper.get('[data-side="y-start"]').getAttribute('data-visible')).toBe('')
      expect(wrapper.get('[data-side="x-end"]').getAttribute('data-visible')).toBeNull()
      expect(wrapper.get('[data-side="y-end"]').getAttribute('data-visible')).toBeNull()
    })
    const text = document.createRange()
    text.selectNodeContents(wrapper.get('code'))
    expect(view.right - text.getBoundingClientRect().right).toBeCloseTo(
      Number.parseFloat(padding.paddingRight),
      0,
    )
    expect(pre.getBoundingClientRect().bottom).toBeCloseTo(view.bottom, 0)
  })

  it('键盘可滚动指定高度的代码区', async () => {
    const wrapper = await block({ className: 'h-40' })
    const viewport = await viewportOf(wrapper.element)
    wrapper.get('[role="region"]').focus()
    await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(0))
    expect(getComputedStyle(wrapper.get('.hn-pre')).outlineStyle).toBe('solid')
  })

  it('嵌入 Prose 不增加第二层边距、底色或滚动区', async () => {
    const screen = await mount(
      <Prose>
        <CodeBlock code={source} className="h-40" style={{ width: '288px' }} />
      </Prose>,
    )
    const codeBlock = screen.container.querySelector<HTMLElement>('.hn-prose > div')!
    const viewport = await viewportOf(codeBlock)
    const pre = codeBlock.querySelector('pre')!
    const css = getComputedStyle(pre)
    expect(css.marginTop).toBe('0px')
    expect(css.backgroundColor).toBe('rgba(0, 0, 0, 0)')
    expect(css.overflowX).toBe('visible')
    expect(viewport.getBoundingClientRect().height).toBeCloseTo(160, 0)
  })
})
