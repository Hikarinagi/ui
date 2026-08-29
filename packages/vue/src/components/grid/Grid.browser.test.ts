import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Grid from './Grid.vue'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('grid 的 md 档双轴各吃各的密度 token', () => {
  it('列间 inline-gap、行间 stack-gap,compact 同步收紧', () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const w = mount(Grid, {
      props: { cols: 2 },
      slots: { default: () => [h('p', '甲'), h('p', '乙'), h('p', '丙'), h('p', '丁')] },
      attachTo: host,
    })

    expect(getComputedStyle(w.element).columnGap).toBe('12px')
    expect(getComputedStyle(w.element).rowGap).toBe('16px')

    host.setAttribute('data-density', 'compact')
    expect(getComputedStyle(w.element).columnGap).toBe('8px')
    expect(getComputedStyle(w.element).rowGap).toBe('12px')
  })
})
