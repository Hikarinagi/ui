import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Inline from './Inline.vue'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('inline 默认间距随密度翻转', () => {
  it('comfortable 12px,compact 8px —— 吃的是 --hn-inline-gap', () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const w = mount(Inline, {
      slots: { default: () => [h('span', '甲'), h('span', '乙')] },
      attachTo: host,
    })

    expect(getComputedStyle(w.element).columnGap).toBe('12px')

    host.setAttribute('data-density', 'compact')
    expect(getComputedStyle(w.element).columnGap).toBe('8px')
  })
})
