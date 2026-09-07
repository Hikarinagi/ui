import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MeterGroup from './MeterGroup.vue'
import { expectNoA11yViolations } from '../../../test/axe'

describe('MeterGroup', () => {
  it('按比例分段，图例列出标签与百分比，未指定色调时按序分配', async () => {
    const wrapper = mount(MeterGroup, {
      attachTo: document.body,
      props: {
        label: '存储空间',
        items: [
          { label: '文档', value: 40 },
          { label: '图片', value: 25, tone: 'warning' },
        ],
      },
    })
    const segments = wrapper.findAll('[role="meter"]')
    expect(segments).toHaveLength(2)
    expect(segments[0]!.attributes('style')).toContain('width: 40%')
    expect(segments[0]!.attributes('aria-valuenow')).toBe('40')
    expect(segments[0]!.attributes('aria-valuemax')).toBe('100')
    expect(segments[0]!.attributes('aria-label')).toBe('文档')
    expect(segments[0]!.classes()).toContain('bg-accent')
    expect(segments[1]!.classes()).toContain('bg-warning')
    expect(wrapper.find('[role="group"]').attributes('aria-label')).toBe('存储空间')
    expect(wrapper.text()).toContain('40%')
    expect(wrapper.text()).toContain('25%')
    expect(wrapper.text()).toContain('65%')
    await expectNoA11yViolations(wrapper.element)
    wrapper.unmount()
  })

  it('越界的值按端点处理，format 同时用于图例与 aria-valuetext', () => {
    const wrapper = mount(MeterGroup, {
      props: {
        max: 128,
        items: [{ label: '视频', value: 200 }],
        format: (value, max) => `${value} / ${max} GB`,
      },
    })
    const segment = wrapper.find('[role="meter"]')
    expect(segment.attributes('style')).toContain('width: 100%')
    expect(segment.attributes('aria-valuenow')).toBe('128')
    expect(segment.attributes('aria-valuetext')).toBe('128 / 128 GB')
    expect(wrapper.text()).toContain('128 / 128 GB')
  })

  it('legend 为 false 时不渲染图例，没有 label 时不渲染标题行', () => {
    const wrapper = mount(MeterGroup, {
      props: { legend: false, items: [{ label: '文档', value: 40 }] },
    })
    expect(wrapper.text()).toBe('')
    expect(wrapper.findAll('[role="meter"]')).toHaveLength(1)
  })
})
