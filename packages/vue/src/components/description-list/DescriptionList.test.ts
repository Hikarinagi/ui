import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import DescriptionList from './DescriptionList.vue'
import DescriptionTerm from './DescriptionTerm.vue'
import DescriptionDetails from './DescriptionDetails.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

const pairs = () => [h('dt', '原名'), h('dd', '星之航路'), h('dt', '作者'), h('dd', '未知')]

describe('渲染', () => {
  it('渲染 dl,插槽的 dt / dd 原样进入', () => {
    const w = mount(DescriptionList, { slots: { default: pairs } })
    expect(w.element.tagName).toBe('DL')
    expect(w.findAll('dt').map(n => n.text())).toEqual(['原名', '作者'])
    expect(w.findAll('dd').map(n => n.text())).toEqual(['星之航路', '未知'])
  })
})

const wrapped = () => [
  h(DescriptionTerm, () => '原名'),
  h(DescriptionDetails, () => '星之航路'),
  h(DescriptionTerm, () => '作者'),
  h(DescriptionDetails, () => '未知'),
]

describe('条目件', () => {
  it('分别渲染为 dt 与 dd', () => {
    expect(mount(DescriptionTerm).element.tagName).toBe('DT')
    expect(mount(DescriptionDetails).element.tagName).toBe('DD')
  })

  it('插槽内容原样渲染', () => {
    expect(mount(DescriptionTerm, { slots: { default: () => '原名' } }).text()).toBe('原名')
    expect(mount(DescriptionDetails, { slots: { default: () => '星之航路' } }).text()).toBe(
      '星之航路',
    )
  })

  it('class 追加到根元素', () => {
    expect(mount(DescriptionTerm, { props: { class: 'text-muted' } }).classes()).toContain(
      'text-muted',
    )
    expect(mount(DescriptionDetails, { props: { class: 'tabular' } }).classes()).toContain(
      'tabular',
    )
  })

  it('作为容器的直接子元素落成 dt / dd,可被 hn-dl 的 > dt 与 > dd 选中', () => {
    const w = mount(DescriptionList, { slots: { default: wrapped } })
    expect(w.findAll(':scope > dt').map(n => n.text())).toEqual(['原名', '作者'])
    expect(w.findAll(':scope > dd').map(n => n.text())).toEqual(['星之航路', '未知'])
  })

  it('一个术语可配多条描述,不强制成对', () => {
    const w = mount(DescriptionList, {
      slots: {
        default: () => [
          h(DescriptionTerm, () => '作者'),
          h(DescriptionDetails, () => '星见书音'),
          h(DescriptionDetails, () => '光凪编辑部'),
        ],
      },
    })
    expect(w.findAll('dt')).toHaveLength(1)
    expect(w.findAll('dd').map(n => n.text())).toEqual(['星见书音', '光凪编辑部'])
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const w = mount(DescriptionList, { slots: { default: pairs }, attachTo: document.body })
    await expectNoA11yViolations(w.element as HTMLElement)
  })

  it('用条目件组装同样无 a11y 违规', async () => {
    const w = mount(DescriptionList, { slots: { default: wrapped }, attachTo: document.body })
    await expectNoA11yViolations(w.element as HTMLElement)
  })
})
