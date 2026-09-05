import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import FormField from './FormField.vue'
import Input from '../input/Input.vue'
import RadioGroup from '../radio-group/RadioGroup.vue'
import CheckboxGroup from '../checkbox-group/CheckboxGroup.vue'

function build(props: Record<string, unknown> = {}, control = () => h(Input)) {
  return mount(FormField, { props, slots: { default: control } })
}

describe('FormField', () => {
  it('标签通过 for 指向控件', () => {
    const wrapper = build({ label: '名称' })
    const label = wrapper.find('label')
    const input = wrapper.find('input')
    expect(input.attributes('id')).toBeTruthy()
    expect(label.attributes('for')).toBe(input.attributes('id'))
  })

  it('控件自带的 id 优先', async () => {
    const wrapper = build({ label: '名称' }, () => h(Input, { id: 'custom' }))
    await nextTick()
    expect(wrapper.find('input').attributes('id')).toBe('custom')
    expect(wrapper.find('label').attributes('for')).toBe('custom')
  })

  it('必填时显示标记并给读屏器提供文字', () => {
    const wrapper = build({ label: '名称', required: true })
    expect(wrapper.find('label [aria-hidden="true"]').text()).toBe('*')
    expect(wrapper.find('label').text()).toContain('必填')
  })

  it('说明文字通过 aria-describedby 关联到控件', () => {
    const wrapper = build({ label: '名称', description: '公开显示' })
    const description = wrapper.find('p')
    expect(description.text()).toBe('公开显示')
    expect(wrapper.find('input').attributes('aria-describedby')).toBe(description.attributes('id'))
  })

  it('error 直接显示错误并把控件标为无效', () => {
    const wrapper = build({ label: '名称', error: '不能为空' })
    const message = wrapper.find('p[aria-live]')
    expect(message.text()).toBe('不能为空')
    expect(wrapper.attributes('data-invalid')).toBe('')
    const input = wrapper.find('input')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toBe(message.attributes('id'))
  })

  it('disabled 传递给控件', () => {
    const wrapper = build({ label: '名称', disabled: true })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    expect(wrapper.attributes('data-disabled')).toBe('')
  })

  it('成组控件通过 aria-labelledby 关联标签', () => {
    const wrapper = build({ label: '类型', error: '请选择' }, () =>
      h(RadioGroup, { options: [{ label: '甲', value: 'a' }] }),
    )
    const root = wrapper.find('[data-hn-radio-group]')
    expect(root.attributes('aria-labelledby')).toBe(wrapper.find('label').attributes('id'))
    expect(root.attributes('aria-invalid')).toBe('true')
  })

  it('复选框组内的复选框不会重复领取字段 id', () => {
    const wrapper = build({ label: '标签' }, () =>
      h(CheckboxGroup, {
        options: [
          { label: '甲', value: 'a' },
          { label: '乙', value: 'b' },
        ],
      }),
    )
    const ids = wrapper.findAll('button').map(button => button.attributes('id'))
    expect(ids.every(id => id === undefined)).toBe(true)
  })
})
