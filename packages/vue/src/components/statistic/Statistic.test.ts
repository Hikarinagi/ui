import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Statistic from './Statistic.vue'
import { expectNoA11yViolations } from '../../../test/axe'

describe('Statistic', () => {
  it('标签在上、数字按区域格式化、前后缀在两侧，变化为正时是成功色并带上升图标', async () => {
    const wrapper = mount(Statistic, {
      attachTo: document.body,
      props: {
        label: '本月阅读',
        value: 12345,
        suffix: '页',
        delta: 0.124,
        deltaLabel: '较上月',
      },
      slots: { icon: () => h('svg') },
    })
    expect(wrapper.text()).toContain('本月阅读')
    expect(wrapper.text()).toContain('12,345')
    expect(wrapper.text()).toContain('页')
    expect(wrapper.text()).toContain('+12.4%')
    expect(wrapper.text()).toContain('较上月')
    const delta = wrapper.find('.text-success-text')
    expect(delta.exists()).toBe(true)
    expect(delta.find('svg').exists()).toBe(true)
    expect(wrapper.find('[aria-hidden="true"].bg-subtle svg').exists()).toBe(true)
    await expectNoA11yViolations(wrapper.element)
    wrapper.unmount()
  })

  it('变化为负时是危险色；invert 反转好坏；为零时中性且没有箭头', () => {
    const down = mount(Statistic, { props: { label: '退货', value: 3, delta: -0.2 } })
    expect(down.find('.text-danger-text').exists()).toBe(true)
    expect(down.text()).toContain('-20%')

    const inverted = mount(Statistic, {
      props: { label: '退货', value: 3, delta: -0.2, invert: true },
    })
    expect(inverted.find('.text-success-text').exists()).toBe(true)

    const flat = mount(Statistic, { props: { label: '退货', value: 3, delta: 0 } })
    const delta = flat.find('.text-muted.flex')
    expect(delta.exists()).toBe(true)
    expect(delta.find('svg').exists()).toBe(false)
    expect(flat.text()).toContain('0%')
  })

  it('字符串值原样显示，空值显示破折号，loading 时以骨架占位且不显示变化', () => {
    expect(mount(Statistic, { props: { label: '状态', value: '正常' } }).text()).toContain('正常')
    expect(mount(Statistic, { props: { label: '状态', value: null } }).text()).toContain('—')
    const loading = mount(Statistic, {
      props: { label: '状态', value: 12, delta: 0.1, loading: true },
    })
    expect(loading.find('.hn-skeleton').exists()).toBe(true)
    expect(loading.text()).not.toContain('12')
    expect(loading.text()).not.toContain('%')
  })
})
