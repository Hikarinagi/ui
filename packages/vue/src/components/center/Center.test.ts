import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Center from './Center.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('渲染', () => {
  it('默认块级 flex 双轴居中', () => {
    const w = mount(Center)
    expect(w.classes()).toContain('flex')
    expect(w.classes()).toContain('items-center')
    expect(w.classes()).toContain('justify-center')
    expect(w.classes()).not.toContain('inline-flex')
  })

  it('inline 切 inline-flex,as 换语义标签', () => {
    expect(mount(Center, { props: { inline: true } }).classes()).toContain('inline-flex')
    expect(mount(Center, { props: { as: 'figure' } }).element.tagName).toBe('FIGURE')
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const w = mount(Center, {
      slots: { default: () => h('p', '居中内容') },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element as HTMLElement)
  })
})
