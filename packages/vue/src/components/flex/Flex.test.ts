import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Flex from './Flex.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('渲染', () => {
  it('默认 row,不带 gap / align / justify / wrap —— 裸金属保持 CSS 默认', () => {
    const w = mount(Flex)
    expect(w.classes()).toContain('flex')
    expect(w.classes()).toContain('flex-row')
    const joined = w.classes().join(' ')
    expect(joined).not.toContain('gap-')
    expect(joined).not.toContain('items-')
    expect(joined).not.toContain('justify-')
    expect(joined).not.toContain('flex-wrap')
  })

  it('全旋钮落对应类', () => {
    const w = mount(Flex, {
      props: { direction: 'col-reverse', align: 'end', justify: 'between', wrap: true, gap: 'lg' },
    })
    expect(w.classes()).toContain('flex-col-reverse')
    expect(w.classes()).toContain('items-end')
    expect(w.classes()).toContain('justify-between')
    expect(w.classes()).toContain('flex-wrap')
    expect(w.classes()).toContain('gap-6')
  })

  it('gap md 随方向取密度 token:横向 inline-gap,纵向 stack-gap', () => {
    expect(mount(Flex, { props: { gap: 'md' } }).classes()).toContain('gap-[var(--hn-inline-gap)]')
    expect(mount(Flex, { props: { gap: 'md', direction: 'col' } }).classes()).toContain(
      'gap-[var(--hn-stack-gap)]',
    )
    expect(mount(Flex, { props: { gap: 'md', direction: 'row-reverse' } }).classes()).toContain(
      'gap-[var(--hn-inline-gap)]',
    )
  })

  it('as 换语义标签', () => {
    expect(mount(Flex, { props: { as: 'header' } }).element.tagName).toBe('HEADER')
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const w = mount(Flex, {
      slots: { default: () => [h('span', '甲'), h('span', '乙')] },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element as HTMLElement)
  })
})
