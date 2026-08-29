import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Stack from './Stack.vue'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('stack 默认间距随密度翻转', () => {
  it('comfortable 16px,compact 12px —— 吃的是 --hn-stack-gap,不是写死的档', () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const w = mount(Stack, {
      slots: { default: () => [h('p', '甲'), h('p', '乙')] },
      attachTo: host,
    })

    expect(getComputedStyle(w.element).rowGap).toBe('16px')

    host.setAttribute('data-density', 'compact')
    expect(getComputedStyle(w.element).rowGap).toBe('12px')

    const fixed = mount(Stack, {
      props: { gap: 'sm' },
      slots: { default: () => [h('p', '甲')] },
      attachTo: host,
    })
    expect(getComputedStyle(fixed.element).rowGap).toBe('8px')
  })
})
