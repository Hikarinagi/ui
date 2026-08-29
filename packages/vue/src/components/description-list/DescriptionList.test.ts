import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import DescriptionList from './DescriptionList.vue'
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

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const w = mount(DescriptionList, { slots: { default: pairs }, attachTo: document.body })
    await expectNoA11yViolations(w.element as HTMLElement)
  })
})
