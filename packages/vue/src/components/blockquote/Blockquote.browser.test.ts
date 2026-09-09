import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Blockquote from './Blockquote.vue'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('Blockquote', () => {
  it('起始侧 2px 竖线 · muted 文字 · cite 落款更淡', () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const w = mount(Blockquote, {
      props: { cite: '夏目漱石' },
      slots: { default: () => '书页翻动的声音,是图书馆唯一允许的喧哗。' },
      attachTo: host,
    })
    const el = w.element as HTMLElement
    const style = getComputedStyle(el)

    expect(el.tagName).toBe('BLOCKQUOTE')
    expect(Number.parseFloat(style.borderInlineStartWidth)).toBe(2)
    expect(Number.parseFloat(style.borderInlineEndWidth)).toBe(0)

    const footer = el.querySelector('footer')!
    expect(footer.textContent).toContain('夏目漱石')
    expect(getComputedStyle(footer).color).not.toBe(style.color)
  })
})
