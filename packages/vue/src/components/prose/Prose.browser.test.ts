import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Prose from './Prose.vue'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

function attach() {
  const host = document.createElement('div')
  document.body.appendChild(host)
  return host
}

const rich = `
  <h2>标题</h2>
  <p>段落里有 <a href="#">链接</a>、<strong>加粗</strong> 与 <code>行内代码</code>。</p>
  <blockquote><p>引用</p></blockquote>
  <pre><code>const x = 1</code></pre>
`

function mountProse() {
  return mount(Prose, {
    slots: { default: () => h('div', { innerHTML: rich }) },
    attachTo: attach(),
  })
}

describe('Prose 接管原生标签流', () => {
  it('h2 吃到 xl 字阶与 600 字重,收紧字距', () => {
    const el = mountProse().element.querySelector('h2')!
    const style = getComputedStyle(el)
    expect(style.fontSize).toBe('22px')
    expect(style.fontWeight).toBe('600')
    expect(Number.parseFloat(style.letterSpacing)).toBeLessThan(0)
  })

  it('链接是 accent 文字色 + 半透明下划线,hover 语义与 hn-link 同源', () => {
    const probe = document.createElement('span')
    probe.style.color = 'var(--hn-accent-text)'
    document.body.appendChild(probe)
    const accentText = getComputedStyle(probe).color

    const a = mountProse().element.querySelector('a')!
    const style = getComputedStyle(a)
    expect(style.color).toBe(accentText)
    expect(style.textDecorationLine).toBe('underline')
    expect(style.textDecorationColor).not.toBe(style.color)
    expect(style.transitionProperty).toContain('color')
  })

  it('行内代码与代码块共用 inset 底,代码块内不再套底色', () => {
    const w = mountProse()
    const inline = w.element.querySelector('p code')!
    const block = w.element.querySelector('pre code')!
    const pre = w.element.querySelector('pre')!
    expect(getComputedStyle(inline).backgroundColor).toBe(getComputedStyle(pre).backgroundColor)
    expect(getComputedStyle(block).backgroundColor).toBe('rgba(0, 0, 0, 0)')
    expect(getComputedStyle(inline).fontFamily).toContain('Mono')
  })

  it('强调用 600 不用 700,引用有起始侧竖线与 muted 文字', () => {
    const w = mountProse()
    expect(getComputedStyle(w.element.querySelector('strong')!).fontWeight).toBe('600')
    const quote = getComputedStyle(w.element.querySelector('blockquote')!)
    expect(Number.parseFloat(quote.borderInlineStartWidth)).toBeGreaterThan(0)
  })

  it('首元素顶距归零,节奏由容器统一', () => {
    const w = mount(Prose, {
      slots: { default: () => [h('p', '首段'), h('p', '次段')] },
      attachTo: attach(),
    })
    const ps = w.element.querySelectorAll('p')
    expect(getComputedStyle(ps[0]!).marginBlockStart).toBe('0px')
    expect(Number.parseFloat(getComputedStyle(ps[1]!).marginBlockStart)).toBeGreaterThan(0)
  })
})
