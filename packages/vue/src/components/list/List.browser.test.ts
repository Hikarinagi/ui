import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import List from './List.vue'
import ListItem from './ListItem.vue'
import Prose from '../prose/Prose.vue'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

function attach() {
  const host = document.createElement('div')
  document.body.appendChild(host)
  return host
}

describe('list 与 prose 列表同源', () => {
  it('无序与有序的缩进、记号、项距、marker 色全部一致 —— hn-list 是唯一来源', () => {
    const items = () => [h('li', '甲'), h('li', '乙')]
    const ul = mount(List, { slots: { default: items }, attachTo: attach() })
    const ol = mount(List, {
      props: { ordered: true },
      slots: { default: items },
      attachTo: attach(),
    })
    const prose = mount(Prose, {
      slots: { default: '<ul><li>甲</li><li>乙</li></ul><ol><li>甲</li><li>乙</li></ol>' },
      attachTo: attach(),
    })

    const pairs = [
      [ul.element, prose.find('ul').element],
      [ol.element, prose.find('ol').element],
    ] as const
    for (const [mine, ref] of pairs) {
      const a = getComputedStyle(mine)
      const b = getComputedStyle(ref)
      expect(a.paddingInlineStart).toBe(b.paddingInlineStart)
      expect(a.listStyleType).toBe(b.listStyleType)

      const secondA = mine.querySelectorAll('li')[1]!
      const secondB = ref.querySelectorAll('li')[1]!
      expect(getComputedStyle(secondA).marginBlockStart).toBe(
        getComputedStyle(secondB).marginBlockStart,
      )
      expect(getComputedStyle(secondA, '::marker').color).toBe(
        getComputedStyle(secondB, '::marker').color,
      )
    }
    expect(getComputedStyle(ul.element).listStyleType).toBe('disc')
    expect(getComputedStyle(ol.element).listStyleType).toBe('decimal')
    expect(getComputedStyle(ul.element.querySelector('li')!, '::marker').color).not.toBe(
      getComputedStyle(ul.element.querySelector('li')!).color,
    )
  })

  it('ListItem 与裸 li 在同一容器下计算样式完全一致 —— 替换是等价的', () => {
    const raw = mount(List, {
      slots: { default: () => [h('li', '甲'), h('li', '乙')] },
      attachTo: attach(),
    })
    const wrapped = mount(List, {
      slots: { default: () => [h(ListItem, () => '甲'), h(ListItem, () => '乙')] },
      attachTo: attach(),
    })

    const secondRaw = raw.element.querySelectorAll('li')[1]!
    const secondWrapped = wrapped.element.querySelectorAll('li')[1]!
    expect(secondWrapped.tagName).toBe('LI')
    expect(getComputedStyle(secondWrapped).marginBlockStart).toBe(
      getComputedStyle(secondRaw).marginBlockStart,
    )
    expect(getComputedStyle(secondWrapped, '::marker').color).toBe(
      getComputedStyle(secondRaw, '::marker').color,
    )
    expect(getComputedStyle(secondWrapped, '::marker').color).not.toBe(
      getComputedStyle(secondWrapped).color,
    )
  })
})
