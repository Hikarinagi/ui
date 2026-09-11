import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h } from 'vue'
import CodeBlock from './CodeBlock.vue'
import Prose from '../prose/Prose.vue'
import '../../../test/browser.css'

const mounted: VueWrapper[] = []
const source = Array.from(
  { length: 40 },
  (_, i) => 'const value' + i + ' = "' + 'code'.repeat(40) + '"',
).join('\n')

afterEach(() => {
  mounted.forEach(wrapper => wrapper.unmount())
  mounted.length = 0
  document.body.innerHTML = ''
})

function block(attrs: Record<string, unknown> = {}, code = source) {
  const wrapper = mount(CodeBlock, {
    props: { code, label: '代码' },
    attrs: { style: 'width:288px', ...attrs },
    attachTo: document.body,
  })
  mounted.push(wrapper)
  return wrapper
}

async function viewportOf(wrapper: Pick<VueWrapper, 'get'>) {
  const viewport = wrapper.get('[data-overlayscrollbars-contents]').element as HTMLElement
  await vi.waitFor(() =>
    expect(viewport.hasAttribute('data-overlayscrollbars-viewport')).toBe(true),
  )
  return viewport
}

describe('CodeBlock 尺寸与滚动', () => {
  it.each([
    ['height class', { class: 'h-40' }],
    ['max-height class', { class: 'max-h-40' }],
    ['height style', { style: 'width:288px;height:160px' }],
    ['max-height style', { style: 'width:288px;max-height:160px' }],
  ])('%s 约束实际视口，两轴可滚动且控件保持固定', async (_name, attrs) => {
    const wrapper = block(attrs)
    const viewport = await viewportOf(wrapper)
    expect(wrapper.element.getBoundingClientRect().height).toBeCloseTo(160, 0)
    expect(viewport.getBoundingClientRect().height).toBeCloseTo(160, 0)
    expect(getComputedStyle(viewport).overflowY).toBe('scroll')
    expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight)
    expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth)
    const before = wrapper.get('button').element.getBoundingClientRect()
    viewport.scrollTo(100, 100)
    await vi.waitFor(() => {
      expect(viewport.scrollTop).toBeGreaterThan(0)
      expect(viewport.scrollLeft).toBeGreaterThan(0)
    })
    const after = wrapper.get('button').element.getBoundingClientRect()
    expect(after.x).toBe(before.x)
    expect(after.y).toBe(before.y)
  })

  it('max-height 下短内容保持自然高度，内容增长和缩短会重新计算溢出', async () => {
    const wrapper = block({ class: 'max-h-40' }, 'short')
    const viewport = await viewportOf(wrapper)
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
    const wrapper = block()
    const viewport = await viewportOf(wrapper)
    expect(viewport.scrollHeight).toBe(viewport.clientHeight)
    expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth)
    expect(wrapper.element.getBoundingClientRect().height).toBeGreaterThan(160)
  })

  it('视口铺满边框，阴影贴合裁切位置，内边距随内容滚动', async () => {
    const wrapper = block({ class: 'h-40' })
    const viewport = await viewportOf(wrapper)
    const frame = wrapper.get('.hn-pre').element.getBoundingClientRect()
    const view = viewport.getBoundingClientRect()
    for (const edge of ['left', 'right', 'top', 'bottom'] as const) {
      expect(view[edge]).toBeCloseTo(frame[edge], 0)
    }
    const pre = wrapper.get('pre').element as HTMLElement
    const padding = getComputedStyle(pre)
    expect(Number.parseFloat(padding.paddingInlineStart)).toBeGreaterThan(0)
    await vi.waitFor(() => {
      expect(wrapper.get('[data-side="x-end"]').attributes('data-visible')).toBe('')
      expect(wrapper.get('[data-side="y-end"]').attributes('data-visible')).toBe('')
    })
    expect(wrapper.get('[data-side="x-end"]').element.getBoundingClientRect().right).toBeCloseTo(
      view.right,
      0,
    )
    expect(wrapper.get('[data-side="y-end"]').element.getBoundingClientRect().bottom).toBeCloseTo(
      view.bottom,
      0,
    )
    viewport.scrollTo(viewport.scrollWidth, viewport.scrollHeight)
    await vi.waitFor(() => {
      expect(wrapper.get('[data-side="x-start"]').attributes('data-visible')).toBe('')
      expect(wrapper.get('[data-side="y-start"]').attributes('data-visible')).toBe('')
      expect(wrapper.get('[data-side="x-end"]').attributes('data-visible')).toBeUndefined()
      expect(wrapper.get('[data-side="y-end"]').attributes('data-visible')).toBeUndefined()
    })
    const text = document.createRange()
    text.selectNodeContents(wrapper.get('code').element)
    expect(view.right - text.getBoundingClientRect().right).toBeCloseTo(
      Number.parseFloat(padding.paddingRight),
      0,
    )
    expect(pre.getBoundingClientRect().bottom).toBeCloseTo(view.bottom, 0)
  })

  it('键盘可滚动指定高度的代码区', async () => {
    const wrapper = block({ class: 'h-40' })
    const viewport = await viewportOf(wrapper)
    ;(wrapper.get('[role="region"]').element as HTMLElement).focus()
    await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(0))
    expect(getComputedStyle(wrapper.get('.hn-pre').element).outlineStyle).toBe('solid')
  })

  it('嵌入 Prose 不增加第二层边距、底色或滚动区', async () => {
    const wrapper = mount(Prose, {
      slots: { default: () => h(CodeBlock, { code: source, class: 'h-40', style: 'width:288px' }) },
      attachTo: document.body,
    })
    mounted.push(wrapper)
    const codeBlock = wrapper.getComponent(CodeBlock)
    const viewport = await viewportOf(codeBlock)
    const pre = codeBlock.get('pre').element
    const css = getComputedStyle(pre)
    expect(css.marginTop).toBe('0px')
    expect(css.backgroundColor).toBe('rgba(0, 0, 0, 0)')
    expect(css.overflowX).toBe('visible')
    expect(viewport.getBoundingClientRect().height).toBeCloseTo(160, 0)
  })
})
