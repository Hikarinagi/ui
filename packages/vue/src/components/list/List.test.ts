import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import List from './List.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('渲染', () => {
  it('默认 ul,ordered 时 ol', () => {
    expect(mount(List).element.tagName).toBe('UL')
    expect(mount(List, { props: { ordered: true } }).element.tagName).toBe('OL')
  })

  it('插槽内容原样渲染', () => {
    const w = mount(List, { slots: { default: () => [h('li', '甲'), h('li', '乙')] } })
    expect(w.findAll('li').map(li => li.text())).toEqual(['甲', '乙'])
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const w = mount(List, {
      slots: { default: () => [h('li', '甲'), h('li', '乙')] },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element as HTMLElement)
  })
})
