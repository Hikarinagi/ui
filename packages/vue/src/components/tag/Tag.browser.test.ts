import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import Tag from './Tag.vue'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

function attach() {
  const host = document.createElement('div')
  document.body.appendChild(host)
  return host
}

function mountTag(props: Record<string, unknown> = {}, text = '连载中') {
  const w = mount(Tag, { props, slots: { default: () => text }, attachTo: attach() })
  mounted.push(w)
  return w.find('span').element as HTMLElement
}

describe('tag · 静态标注', () => {
  it('默认 neutral soft sm:span 元素、subtle 底、透明 border 占位', () => {
    const el = mountTag()
    expect(el.tagName).toBe('SPAN')
    const cs = getComputedStyle(el)
    expect(cs.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(cs.borderTopWidth).toBe('1px')
    expect(cs.borderTopColor).toMatch(/rgba\(.*0\)$/)
    expect(el.offsetHeight).toBe(20)
  })

  it('语义 tone 各着各色;soft 与 outline 同尺寸', () => {
    const success = mountTag({ tone: 'success' })
    const danger = mountTag({ tone: 'danger' })
    expect(getComputedStyle(success).color).not.toBe(getComputedStyle(danger).color)
    expect(getComputedStyle(success).backgroundColor).not.toBe(
      getComputedStyle(danger).backgroundColor,
    )

    const outline = mountTag({ tone: 'success', variant: 'outline' })
    const ocs = getComputedStyle(outline)
    expect(ocs.backgroundColor).toBe('rgba(0, 0, 0, 0)')
    expect(ocs.borderTopColor).not.toMatch(/rgba\(.*0\)$/)
    expect(outline.offsetHeight).toBe(success.offsetHeight)

    const soft = mountTag({ tone: 'danger' })
    const solid = mountTag({ tone: 'danger', variant: 'solid' })
    const scs = getComputedStyle(solid)
    expect(scs.backgroundColor).not.toBe(getComputedStyle(soft).backgroundColor)
    expect(scs.color).not.toBe(getComputedStyle(soft).color)
    expect(solid.offsetHeight).toBe(soft.offsetHeight)
  })

  it('md 升档、pill 全圆', () => {
    const md = mountTag({ size: 'md' })
    expect(md.offsetHeight).toBe(24)
    const pill = mountTag({ pill: true })
    expect(parseFloat(getComputedStyle(pill).borderTopLeftRadius)).toBeGreaterThan(8)
  })

  it('as 换语义标签,尺寸与不可聚焦不变', () => {
    const w = mount(Tag, {
      props: { as: 'li' },
      slots: { default: () => '科幻' },
      attachTo: attach(),
    })
    mounted.push(w)
    const el = w.element as HTMLElement
    expect(el.tagName).toBe('LI')
    expect(el.offsetHeight).toBe(20)
    expect(el.tabIndex).toBe(-1)
  })
})
