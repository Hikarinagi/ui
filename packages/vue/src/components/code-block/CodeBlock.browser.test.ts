import { describe, expect, it, vi, beforeEach } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mount } from '@vue/test-utils'
import CodeBlock from './CodeBlock.vue'
import Prose from '../prose/Prose.vue'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

function attach() {
  const host = document.createElement('div')
  document.body.appendChild(host)
  return host
}

describe('codeblock 与 prose pre 同源', () => {
  it('组件的盒(ScrollArea host)与 prose pre 的盒计算样式一致 —— hn-pre 是唯一来源', () => {
    const block = mount(CodeBlock, {
      props: { code: 'const x = 1', copyable: false },
      attachTo: attach(),
    })
    const prose = mount(Prose, {
      slots: { default: '<pre><code>const x = 1</code></pre>' },
      attachTo: attach(),
    })

    const blockBox = getComputedStyle(block.find('.hn-pre').element)
    const proseBox = getComputedStyle(prose.find('pre').element)
    for (const p of ['backgroundColor', 'borderRadius', 'fontFamily'] as const) {
      expect(blockBox[p], p).toBe(proseBox[p])
    }

    const blockContent = getComputedStyle(block.find('pre').element)
    expect(blockContent.paddingTop).toBe(proseBox.paddingTop)
    expect(blockContent.paddingInlineStart).toBe(proseBox.paddingInlineStart)
    expect(blockBox.paddingTop).toBe('0px')

    const blockCode = getComputedStyle(block.find('code').element)
    const proseCode = getComputedStyle(prose.find('code').element)
    expect(blockCode.fontSize).toBe(proseCode.fontSize)
    expect(proseCode.backgroundColor).toBe('rgba(0, 0, 0, 0)')
    expect(blockCode.fontFamily).toBe(proseCode.fontFamily)
  })

  it('滚动区域聚焦有可见焦点环(焦点在内层宿主,环画在 hn-pre 盒上)', async () => {
    const w = mount(CodeBlock, { props: { code: 'x' }, attachTo: attach() })
    const host = w.find('[data-overlayscrollbars-initialize]').element as HTMLElement
    const box = w.find('.hn-pre').element as HTMLElement
    host.focus()
    await vi.waitFor(() => {
      const s = getComputedStyle(box)
      expect(s.outlineStyle).toBe('solid')
      expect(s.outlineColor).not.toBe('rgba(0, 0, 0, 0)')
    })
  })
})

describe('着色随主题翻转', () => {
  it('token 颜色浅色取 --shiki-light、.dark 下取 --shiki-dark', async () => {
    document.documentElement.classList.remove('dark')
    const w = mount(CodeBlock, {
      props: { code: 'const a = 1', lang: 'ts' },
      attachTo: attach(),
    })
    await vi.waitFor(() => expect(w.find('code span[style]').exists()).toBe(true), {
      timeout: 5000,
    })

    const span = w.find('code span[style]').element as HTMLElement
    const light = getComputedStyle(span).color
    const baseText = getComputedStyle(span.closest('code')!).color
    expect(light).not.toBe(baseText)

    document.documentElement.classList.add('dark')
    await vi.waitFor(() => {
      const dark = getComputedStyle(span).color
      expect(dark).not.toBe(light)
      expect(dark).not.toBe(getComputedStyle(span.closest('code')!).color)
    })
    document.documentElement.classList.remove('dark')
  })
})

describe('复制交互', () => {
  it('padding 对称;角落透明不遮滚动阴影', () => {
    const w = mount(CodeBlock, { props: { code: 'const x = 1', lang: 'ts' }, attachTo: attach() })
    const pre = w.find('pre').element
    const cs = getComputedStyle(pre)
    expect(cs.paddingRight).toBe(cs.paddingLeft)
    const corner = w.find('div.absolute.top-2').element
    expect(getComputedStyle(corner).backgroundColor).toBe('rgba(0, 0, 0, 0)')
  })

  it('点击复制:剪贴板收到原文,aria-label 切到已复制', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })

    const w = mount(CodeBlock, { props: { code: 'const x = 1' }, attachTo: attach() })
    const btn = w.find('button').element as HTMLElement
    await userEvent.click(btn)
    await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith('const x = 1'))
    await vi.waitFor(() => expect(btn.getAttribute('aria-label')).toBe('已复制'))
  })
})
