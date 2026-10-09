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
        default: () => [h('dt', '原名'), h('dd', '狼と香辛料'), h('dt', '作者'), h('dd', '未知')],
      },
      attachTo: attach(),
    })
    const prose = mount(Prose, {
      slots: { default: '<dl><dt>原名</dt><dd>狼と香辛料</dd><dt>作者</dt><dd>未知</dd></dl>' },
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
        default: () => [h('dt', '原名'), h('dd', '狼と香辛料'), h('dt', '作者'), h('dd', '未知')],
      },
      attachTo: attach(),
    })
    const wrapped = mount(DescriptionList, {
      slots: {
        default: () => [
          h(DescriptionTerm, () => '原名'),
          h(DescriptionDetails, () => '狼と香辛料'),
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

describe('横向布局', () => {
  function horizontal(style?: string) {
    return mount(DescriptionList, {
      props: { orientation: 'horizontal' },
      attrs: { style: `width: 400px; ${style ?? ''}` },
      slots: {
        default: () => [
          h(DescriptionTerm, () => '原名'),
          h(DescriptionDetails, () => '狼と香辛料'),
          h(DescriptionTerm, () => '作者与插画'),
          h(DescriptionDetails, () => '支倉凍砂'),
          h(DescriptionDetails, () => '文倉十'),
        ],
      },
      attachTo: attach(),
    })
  }
  const boxes = (root: Element, selector: string) =>
    [...root.querySelectorAll(selector)].map(node => node.getBoundingClientRect())

  it('名称一列、取值一列,同一条目的名称与取值在同一行', () => {
    const w = horizontal()
    const terms = boxes(w.element, 'dt')
    const details = boxes(w.element, 'dd')
    expect(terms[0]!.left).toBe(terms[1]!.left)
    expect(new Set(details.map(box => box.left)).size).toBe(1)
    expect(details[0]!.left).toBeGreaterThan(Math.max(...terms.map(box => box.right)))
    expect(details[0]!.top).toBeLessThan(terms[0]!.bottom)
    expect(details[1]!.top).toBeLessThan(terms[1]!.bottom)
    expect(details[2]!.top).toBeGreaterThanOrEqual(details[1]!.bottom)
  })

  it('名称列按最长的名称定宽,--hn-dl-term-width 可以改成固定宽度', () => {
    const auto = horizontal()
    const terms = boxes(auto.element, 'dt')
    expect(terms[0]!.width).toBe(terms[1]!.width)
    const fixed = horizontal('--hn-dl-term-width: 160px')
    expect(boxes(fixed.element, 'dt').map(box => box.width)).toEqual([160, 160])
  })
})
