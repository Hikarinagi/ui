import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, reactive } from 'vue'
import FormLayout from './FormLayout.vue'
import Form from '../form/Form.vue'
import type { FormErrors, FormValidator } from '../form/standard-schema'
import FormField from '../form-field/FormField.vue'
import Input from '../input/Input.vue'
import { expectNoA11yViolations } from '../../../test/axe'

function field(name: string) {
  return h(FormField, { name, label: name }, () => h(Input))
}

describe('FormLayout', () => {
  it('渲染 fieldset 与 legend，说明文字关联到 fieldset', async () => {
    const wrapper = mount(FormLayout, {
      attachTo: document.body,
      props: { legend: '联系方式', description: '用于接收通知' },
      slots: { default: () => [field('email'), field('phone')] },
    })
    const fieldset = wrapper.find('fieldset')
    expect(fieldset.exists()).toBe(true)
    expect(wrapper.find('legend').text()).toBe('联系方式')
    const description = wrapper.find('p')
    expect(description.text()).toBe('用于接收通知')
    expect(fieldset.attributes('aria-describedby')).toBe(description.attributes('id'))
    await expectNoA11yViolations(wrapper.element)
    wrapper.unmount()
  })

  it('没有标题时不渲染 legend，栅格不留顶部间距', () => {
    const wrapper = mount(FormLayout, { slots: { default: () => field('email') } })
    expect(wrapper.find('legend').exists()).toBe(false)
    expect(wrapper.find('fieldset > div').classes()).not.toContain('mt-4')
  })

  it('columns 决定栅格列数，窄屏收成一列', () => {
    const wrapper = mount(FormLayout, {
      props: { columns: 2 },
      slots: { default: () => field('email') },
    })
    const grid = wrapper.find('fieldset > div')
    expect(grid.classes()).toContain('grid-cols-1')
    expect(grid.classes()).toContain('sm:grid-cols-2')
  })

  it('disabled 禁用 fieldset 与其中的字段', () => {
    const wrapper = mount(FormLayout, {
      props: { disabled: true },
      slots: { default: () => field('email') },
    })
    expect(wrapper.find('fieldset').attributes('disabled')).toBeDefined()
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    expect(wrapper.find('[data-hn-form-field]').attributes('data-disabled')).toBe('')
  })

  it('放在 Form 里时字段仍能取得错误，表单禁用时整组禁用', async () => {
    const values = reactive({ email: '' })
    const rules: FormValidator = () => {
      const errors: FormErrors = {}
      if (!values.email) errors.email = '请输入邮箱'
      return errors
    }
    const wrapper = mount(Form, {
      props: { values, rules },
      slots: { default: () => h(FormLayout, { legend: '联系方式' }, () => field('email')) },
    })
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(wrapper.find('[data-hn-form-field] p[aria-live]').text()).toBe('请输入邮箱')
    await wrapper.setProps({ disabled: true })
    expect(wrapper.find('fieldset').attributes('disabled')).toBeDefined()
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })
})
