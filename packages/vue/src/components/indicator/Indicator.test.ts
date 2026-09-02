import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Indicator from './Indicator.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('结构与语义', () => {
  it('默认渲染 span，没有 label 时对辅助技术隐藏', () => {
    const w = mount(Indicator)
    expect(w.element.tagName).toBe('SPAN')
    expect(w.attributes('aria-hidden')).toBe('true')
    expect(w.text()).toBe('')
  })

  it('label 经视觉隐藏给读屏，并取消隐藏', () => {
    const w = mount(Indicator, { props: { label: '在线' } })
    expect(w.attributes('aria-hidden')).toBeUndefined()
    expect(w.text()).toBe('在线')
  })

  it('pulse 才渲染扩散层，且对辅助技术隐藏', () => {
    const still = mount(Indicator)
    expect(still.find('.hn-ping').exists()).toBe(false)

    const pulsing = mount(Indicator, { props: { pulse: true } })
    const ping = pulsing.find('.hn-ping')
    expect(ping.exists()).toBe(true)
    expect(ping.attributes('aria-hidden')).toBe('true')
  })

  it('as 换语义标签', () => {
    const w = mount(Indicator, { props: { as: 'i' } })
    expect(w.element.tagName).toBe('I')
  })

  it('无障碍零违例', async () => {
    const w = mount(
      {
        render: () =>
          h('p', [h(Indicator, { tone: 'success', label: '在线' }), ' 星见书音', h(Indicator)]),
      },
      { attachTo: document.body },
    )
    await expectNoA11yViolations(w.element)
  })
})
