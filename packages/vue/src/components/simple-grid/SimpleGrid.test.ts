import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import SimpleGrid from './SimpleGrid.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('渲染', () => {
  it('默认 auto-fill + min 经 CSS 变量注入', () => {
    const w = mount(SimpleGrid)
    expect(w.classes()).toContain(
      'grid-cols-[repeat(auto-fill,minmax(var(--hn-simple-grid-min),1fr))]',
    )
    expect((w.element as HTMLElement).style.getPropertyValue('--hn-simple-grid-min')).toBe('14rem')
  })

  it('fit 切 auto-fit,min 可覆写', () => {
    const w = mount(SimpleGrid, { props: { fit: true, min: '10rem' } })
    expect(w.classes()).toContain(
      'grid-cols-[repeat(auto-fit,minmax(var(--hn-simple-grid-min),1fr))]',
    )
    expect((w.element as HTMLElement).style.getPropertyValue('--hn-simple-grid-min')).toBe('10rem')
  })

  it('md 档双轴密度间距,as 换标签', () => {
    expect(mount(SimpleGrid).classes()).toContain('gap-y-[var(--hn-stack-gap)]')
    expect(mount(SimpleGrid, { props: { as: 'ul' } }).element.tagName).toBe('UL')
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const w = mount(SimpleGrid, {
      slots: { default: () => [h('p', '甲'), h('p', '乙')] },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element as HTMLElement)
  })
})
