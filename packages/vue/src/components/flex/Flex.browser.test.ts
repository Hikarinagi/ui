import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Flex from './Flex.vue'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('flex 的 md 档随方向与密度双重决定', () => {
  it('row 取 inline-gap、col 取 stack-gap,compact 下同步收紧', () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const kids = () => [h('span', '甲'), h('span', '乙')]
    const row = mount(Flex, { props: { gap: 'md' }, slots: { default: kids }, attachTo: host })
    const col = mount(Flex, {
      props: { gap: 'md', direction: 'col' },
      slots: { default: kids },
      attachTo: host,
    })

    expect(getComputedStyle(row.element).columnGap).toBe('12px')
    expect(getComputedStyle(col.element).rowGap).toBe('16px')

    host.setAttribute('data-density', 'compact')
    expect(getComputedStyle(row.element).columnGap).toBe('8px')
    expect(getComputedStyle(col.element).rowGap).toBe('12px')
  })
})
