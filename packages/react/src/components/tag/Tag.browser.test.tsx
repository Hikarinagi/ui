import { describe, expect, it } from 'vitest'
import { Tag, type TagProps } from './Tag'
import { mount } from '../../../test/mount'
import '../../../test/browser.css'

async function mountTag(props: TagProps = {}, text = '连载中') {
  const w = await mount(<Tag {...props}>{text}</Tag>)
  return w.element
}

describe('tag · 静态标注', () => {
  it('默认 neutral soft sm:span 元素、subtle 底、透明 border 占位', async () => {
    const el = await mountTag()
    expect(el.tagName).toBe('SPAN')
    const cs = getComputedStyle(el)
    expect(cs.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(cs.borderTopWidth).toBe('1px')
    expect(cs.borderTopColor).toMatch(/rgba\(.*0\)$/)
    expect(el.offsetHeight).toBe(20)
  })

  it('语义 tone 各着各色;soft 与 outline 同尺寸', async () => {
    const success = await mountTag({ tone: 'success' })
    const danger = await mountTag({ tone: 'danger' })
    expect(getComputedStyle(success).color).not.toBe(getComputedStyle(danger).color)
    expect(getComputedStyle(success).backgroundColor).not.toBe(
      getComputedStyle(danger).backgroundColor,
    )

    const outline = await mountTag({ tone: 'success', variant: 'outline' })
    const ocs = getComputedStyle(outline)
    expect(ocs.backgroundColor).toBe('rgba(0, 0, 0, 0)')
    expect(ocs.borderTopColor).not.toMatch(/rgba\(.*0\)$/)
    expect(outline.offsetHeight).toBe(success.offsetHeight)

    const soft = await mountTag({ tone: 'danger' })
    const solid = await mountTag({ tone: 'danger', variant: 'solid' })
    const scs = getComputedStyle(solid)
    expect(scs.backgroundColor).not.toBe(getComputedStyle(soft).backgroundColor)
    expect(scs.color).not.toBe(getComputedStyle(soft).color)
    expect(solid.offsetHeight).toBe(soft.offsetHeight)
  })

  it('md 升档、pill 全圆', async () => {
    const md = await mountTag({ size: 'md' })
    expect(md.offsetHeight).toBe(24)
    const pill = await mountTag({ pill: true })
    expect(parseFloat(getComputedStyle(pill).borderTopLeftRadius)).toBeGreaterThan(8)
  })

  it('as 换语义标签,尺寸与不可聚焦不变', async () => {
    const w = await mount(<Tag as="li">科幻</Tag>)
    const el = w.element
    expect(el.tagName).toBe('LI')
    expect(el.offsetHeight).toBe(20)
    expect(el.tabIndex).toBe(-1)
  })
})
