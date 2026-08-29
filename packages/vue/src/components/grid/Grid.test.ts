import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Grid from './Grid.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('渲染', () => {
  it('默认单列 + md 双轴密度间距', () => {
    const w = mount(Grid)
    expect(w.classes()).toContain('grid')
    expect(w.classes()).toContain('grid-cols-1')
    expect(w.classes()).toContain('gap-x-[var(--hn-inline-gap)]')
    expect(w.classes()).toContain('gap-y-[var(--hn-stack-gap)]')
  })

  it('cols 与 gap 码切换', () => {
    expect(mount(Grid, { props: { cols: 3 } }).classes()).toContain('grid-cols-3')
    expect(mount(Grid, { props: { cols: 12 } }).classes()).toContain('grid-cols-12')
    expect(mount(Grid, { props: { gap: 'lg' } }).classes()).toContain('gap-6')
  })

  it('as 换语义标签', () => {
    expect(mount(Grid, { props: { as: 'ul' } }).element.tagName).toBe('UL')
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const w = mount(Grid, {
      props: { cols: 2 },
      slots: { default: () => [h('p', '甲'), h('p', '乙')] },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element as HTMLElement)
  })
})
