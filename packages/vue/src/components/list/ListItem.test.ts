import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import List from './List.vue'
import ListItem from './ListItem.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('渲染', () => {
  it('渲染为 li', () => {
    expect(mount(ListItem).element.tagName).toBe('LI')
  })

  it('插槽内容原样渲染', () => {
    expect(mount(ListItem, { slots: { default: () => '甲' } }).text()).toBe('甲')
  })

  it('class 追加到根元素', () => {
    const w = mount(ListItem, { props: { class: 'font-medium' } })
    expect(w.classes()).toContain('font-medium')
  })

  it('原生 li 属性透传', () => {
    const w = mount(ListItem, { attrs: { value: 3 } })
    expect(w.attributes('value')).toBe('3')
  })
})

describe('与容器组合', () => {
  it('作为 List 的直接子元素落成 li,可被 hn-list 的 > li 选中', () => {
    const w = mount(List, {
      slots: { default: () => [h(ListItem, () => '甲'), h(ListItem, () => '乙')] },
    })
    expect(w.element.tagName).toBe('UL')
    expect(w.findAll(':scope > li').map(li => li.text())).toEqual(['甲', '乙'])
  })

  it('可嵌套子列表', () => {
    const w = mount(List, {
      slots: {
        default: () => [h(ListItem, () => ['甲', h(List, () => [h(ListItem, () => '甲一')])])],
      },
    })
    expect(w.findAll('li li').map(li => li.text())).toEqual(['甲一'])
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const w = mount(List, {
      slots: { default: () => [h(ListItem, () => '甲'), h(ListItem, () => '乙')] },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element as HTMLElement)
  })
})
