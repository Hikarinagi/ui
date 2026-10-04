import { describe, expect, it } from 'vitest'
import { Blockquote } from './Blockquote'
import { mount } from '../../../test/mount'
import '../../../test/browser.css'

describe('Blockquote', () => {
  it('起始侧 2px 竖线 · muted 文字 · cite 落款更淡', async () => {
    const w = await mount(
      <Blockquote cite="夏目漱石">书页翻动的声音,是图书馆唯一允许的喧哗。</Blockquote>,
    )
    const el = w.element
    const style = getComputedStyle(el)

    expect(el.tagName).toBe('BLOCKQUOTE')
    expect(Number.parseFloat(style.borderInlineStartWidth)).toBe(2)
    expect(Number.parseFloat(style.borderInlineEndWidth)).toBe(0)

    const footer = el.querySelector('footer')!
    expect(footer.textContent).toContain('夏目漱石')
    expect(getComputedStyle(footer).color).not.toBe(style.color)
  })
})
