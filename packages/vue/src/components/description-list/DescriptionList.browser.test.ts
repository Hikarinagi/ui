import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import DescriptionList from './DescriptionList.vue'
import DescriptionTerm from './DescriptionTerm.vue'
import DescriptionDetails from './DescriptionDetails.vue'
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

describe('description list 与 prose dl 同源', () => {
  it('dt 字重、dd 缩进、对内对间距逐项一致 —— hn-dl 是唯一来源', () => {
    const w = mount(DescriptionList, {
      slots: {
        default: () => [h('dt', '原名'), h('dd', '星之航路'), h('dt', '作者'), h('dd', '未知')],
      },
      attachTo: attach(),
    })
    const prose = mount(Prose, {
      slots: { default: '<dl><dt>原名</dt><dd>星之航路</dd><dt>作者</dt><dd>未知</dd></dl>' },
      attachTo: attach(),
    })

    const mine = {
      dt: w.element.querySelectorAll('dt'),
      dd: w.element.querySelectorAll('dd'),
    }
    const ref = {
      dt: prose.find('dl').element.querySelectorAll('dt'),
      dd: prose.find('dl').element.querySelectorAll('dd'),
    }

    expect(getComputedStyle(mine.dt[0]!).fontWeight).toBe(getComputedStyle(ref.dt[0]!).fontWeight)
    expect(getComputedStyle(mine.dd[0]!).marginInlineStart).toBe(
      getComputedStyle(ref.dd[0]!).marginInlineStart,
    )
    expect(getComputedStyle(mine.dd[0]!).marginBlockStart).toBe(
      getComputedStyle(ref.dd[0]!).marginBlockStart,
    )
    expect(getComputedStyle(mine.dt[1]!).marginBlockStart).toBe(
      getComputedStyle(ref.dt[1]!).marginBlockStart,
    )

    expect(getComputedStyle(mine.dt[0]!).fontWeight).toBe('500')
    expect(getComputedStyle(mine.dd[0]!).fontWeight).toBe('400')
    expect(getComputedStyle(mine.dd[0]!).marginInlineStart).toBe('0px')
    expect(getComputedStyle(mine.dt[0]!).marginBlockStart).toBe('0px')
    expect(parseFloat(getComputedStyle(mine.dt[1]!).marginBlockStart)).toBeGreaterThan(
      parseFloat(getComputedStyle(mine.dd[0]!).marginBlockStart),
    )
  })

  it('条目件与裸 dt / dd 在同一容器下计算样式完全一致 —— 替换是等价的', () => {
    const raw = mount(DescriptionList, {
      slots: {
        default: () => [h('dt', '原名'), h('dd', '星之航路'), h('dt', '作者'), h('dd', '未知')],
      },
      attachTo: attach(),
    })
    const wrapped = mount(DescriptionList, {
      slots: {
        default: () => [
          h(DescriptionTerm, () => '原名'),
          h(DescriptionDetails, () => '星之航路'),
          h(DescriptionTerm, () => '作者'),
          h(DescriptionDetails, () => '未知'),
        ],
      },
      attachTo: attach(),
    })

    const pick = (el: Element) => {
      const s = getComputedStyle(el)
      return [el.tagName, s.fontWeight, s.marginInlineStart, s.marginBlockStart].join('|')
    }
    const shape = (root: Element) => [...root.querySelectorAll('dt, dd')].map(pick)

    expect(shape(wrapped.element)).toEqual(shape(raw.element))
    expect(shape(wrapped.element)[0]).toContain('DT')
    expect(shape(wrapped.element)[1]).toContain('DD')
  })
})
