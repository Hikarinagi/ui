import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Progress from './Progress.vue'
import { expectNoA11yViolations } from '../../../test/axe'

describe('Progress', () => {
  it('按比例填充，标题与百分比文字可见', async () => {
    const wrapper = mount(Progress, {
      attachTo: document.body,
      props: { value: 45, label: '上传中', showValue: true },
    })
    const bar = wrapper.find('[role="progressbar"]')
    expect(bar.attributes('aria-valuenow')).toBe('45')
    expect(bar.attributes('aria-valuemax')).toBe('100')
    expect(bar.attributes('aria-label')).toBe('上传中')
    expect(bar.attributes('data-state')).toBe('loading')
    expect(wrapper.html()).toMatch(/--hn-progress-p:\s?0\.45/)
    expect(wrapper.text()).toContain('45%')
    await expectNoA11yViolations(wrapper.element)
    wrapper.unmount()
  })

  it('没有 value 时是未知进度，不显示数值，无障碍名取界面语言', () => {
    const wrapper = mount(Progress, { props: { showValue: true } })
    const bar = wrapper.find('[role="progressbar"]')
    expect(bar.attributes('data-state')).toBe('indeterminate')
    expect(bar.attributes('aria-valuenow')).toBeUndefined()
    expect(bar.attributes('aria-label')).toBe('加载中')
    expect(wrapper.text()).toBe('')
  })

  it('越界的值按端点处理；format 同时给出可见文字与 aria-valuetext', () => {
    const wrapper = mount(Progress, {
      props: { value: 12, max: 8, showValue: true, format: (v, m) => `${v} / ${m}` },
    })
    const bar = wrapper.find('[role="progressbar"]')
    expect(bar.attributes('aria-valuenow')).toBe('8')
    expect(bar.attributes('data-state')).toBe('complete')
    expect(bar.attributes('aria-valuetext')).toBe('8 / 8')
    expect(wrapper.text()).toContain('8 / 8')
  })
})
