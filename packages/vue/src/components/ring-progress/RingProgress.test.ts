import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import RingProgress from './RingProgress.vue'
import { expectNoA11yViolations } from '../../../test/axe'

describe('RingProgress', () => {
  it('弧长按比例绘制，中心显示百分比，标题在环下方', async () => {
    const wrapper = mount(RingProgress, {
      attachTo: document.body,
      props: { value: 72, label: '已完成', showValue: true },
    })
    const root = wrapper.find('[role="progressbar"]')
    expect(root.attributes('aria-valuenow')).toBe('72')
    expect(root.attributes('aria-label')).toBe('已完成')
    const arc = wrapper.findAll('circle')[1]!
    expect(arc.attributes('stroke-dashoffset')).toBe('28')
    expect(arc.attributes('stroke-linecap')).toBe('round')
    expect(wrapper.text()).toContain('72%')
    expect(wrapper.text()).toContain('已完成')
    await expectNoA11yViolations(wrapper.element)
    wrapper.unmount()
  })

  it('没有 value 时是未知进度，弧固定为四分之一，不显示数值', () => {
    const wrapper = mount(RingProgress, { props: { showValue: true } })
    expect(wrapper.find('[role="progressbar"]').attributes('data-state')).toBe('indeterminate')
    expect(wrapper.findAll('circle')[1]!.attributes('stroke-dashoffset')).toBe('75')
    expect(wrapper.text()).toBe('')
  })

  it('默认插槽替换中心内容；值为 0 时不画圆头', () => {
    const wrapper = mount(RingProgress, {
      props: { value: 0, showValue: true },
      slots: { default: () => h('span', '自定义') },
    })
    expect(wrapper.text()).toBe('自定义')
    const arc = wrapper.findAll('circle')[1]!
    expect(arc.attributes('stroke-dashoffset')).toBe('100')
    expect(arc.attributes('stroke-linecap')).toBeUndefined()
  })
})
