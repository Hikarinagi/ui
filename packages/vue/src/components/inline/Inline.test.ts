import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Inline from './Inline.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('渲染', () => {
  it('默认横排 + 换行 + 居中对齐,间距吃密度 token', () => {
    const w = mount(Inline)
    expect(w.classes()).toContain('flex')
    expect(w.classes()).toContain('flex-wrap')
    expect(w.classes()).toContain('items-center')
    expect(w.classes()).toContain('gap-[var(--hn-inline-gap)]')
    expect(w.classes()).not.toContain('flex-col')
  })

  it('wrap=false 换 nowrap,align 与 gap 码可覆写', () => {
    expect(mount(Inline, { props: { wrap: false } }).classes()).toContain('flex-nowrap')
    expect(mount(Inline, { props: { align: 'baseline' } }).classes()).toContain('items-baseline')
    expect(mount(Inline, { props: { gap: 'xs' } }).classes()).toContain('gap-1')
  })

  it('justify 落对应类,不传时不出现', () => {
    expect(mount(Inline, { props: { justify: 'between' } }).classes()).toContain('justify-between')
    expect(mount(Inline, { props: { justify: 'evenly' } }).classes()).toContain('justify-evenly')
    expect(mount(Inline).classes().join(' ')).not.toContain('justify-')
  })

  it('as 换语义标签', () => {
    expect(mount(Inline, { props: { as: 'nav' } }).element.tagName).toBe('NAV')
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const w = mount(Inline, {
      slots: { default: () => [h('span', '甲'), h('span', '乙')] },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element as HTMLElement)
  })
})
