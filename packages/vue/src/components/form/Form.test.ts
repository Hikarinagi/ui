import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, reactive } from 'vue'
import Form from './Form.vue'
import FormField from '../form-field/FormField.vue'
import Input from '../input/Input.vue'
import type { FormErrors, FormRules, FormValidator, StandardSchema } from './standard-schema'

interface Values {
  name: string
  email: string
}

const schema: StandardSchema = {
  '~standard': {
    version: 1,
    vendor: 'test',
    validate(value) {
      const values = value as Values
      const issues = []
      if (!values.name) issues.push({ message: '请输入名称', path: ['name'] })
      if (values.email && !values.email.includes('@')) {
        issues.push({ message: '邮箱格式不正确', path: [{ key: 'email' }] })
      }
      if (values.name === 'root') issues.push({ message: '整体不通过' })
      return issues.length ? { issues } : { value }
    },
  },
}

function build(props: Record<string, unknown> = {}, rules: FormRules = schema) {
  const values = reactive<Values>({ name: '', email: '' })
  const onSubmit = vi.fn()
  const wrapper = mount(Form, {
    attachTo: document.body,
    props: { values, rules, onSubmit, ...props },
    slots: {
      default: (slot: { error?: string }) => [
        h('p', { 'data-root': '' }, slot.error ?? ''),
        h(FormField, { name: 'name', label: '名称' }, () =>
          h(Input, {
            modelValue: values.name,
            'onUpdate:modelValue': (next: string | undefined) => (values.name = next ?? ''),
          }),
        ),
        h(FormField, { name: 'email', label: '邮箱' }, () =>
          h(Input, {
            modelValue: values.email,
            'onUpdate:modelValue': (next: string | undefined) => (values.email = next ?? ''),
          }),
        ),
      ],
    },
  })
  const inputs = () => wrapper.findAll('input')
  const messages = () => wrapper.findAll('[data-hn-form-field] p[aria-live]').map(p => p.text())
  return { wrapper, values, onSubmit, inputs, messages }
}

describe('Form', () => {
  it('提交时校验，失败则显示错误、聚焦第一个无效控件并且不调用提交函数', async () => {
    const { wrapper, onSubmit, inputs, messages } = build()
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(messages()).toEqual(['请输入名称'])
    expect(inputs()[0]!.attributes('aria-invalid')).toBe('true')
    expect(inputs()[1]!.attributes('aria-invalid')).toBeUndefined()
    expect(document.activeElement).toBe(inputs()[0]!.element)
    expect(onSubmit).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('通过校验后调用提交函数，等待期间表单处于忙碌状态', async () => {
    let finish!: () => void
    const { wrapper, values, onSubmit } = build()
    onSubmit.mockReturnValue(new Promise<void>(resolve => (finish = resolve)))
    values.name = '书音'
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(onSubmit).toHaveBeenCalledWith(values)
    expect(wrapper.find('form').attributes('aria-busy')).toBe('true')
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    finish()
    await flushPromises()
    expect(wrapper.find('form').attributes('aria-busy')).toBeUndefined()
    wrapper.unmount()
  })

  it('提交失败后，修改值即时重新校验', async () => {
    const { wrapper, values, messages } = build()
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(messages()).toEqual(['请输入名称'])
    values.name = '书音'
    await flushPromises()
    expect(messages()).toEqual([])
    wrapper.unmount()
  })

  it('validateOn 为 blur 时，字段失去焦点后才校验', async () => {
    const { wrapper, values, messages } = build({ validateOn: 'blur' })
    values.email = 'x'
    await flushPromises()
    expect(messages()).toEqual([])
    await wrapper.findAll('[data-hn-form-field]')[1]!.trigger('focusout')
    await flushPromises()
    expect(messages()).toEqual(['邮箱格式不正确'])
    wrapper.unmount()
  })

  it('validateOn 为 change 时随输入校验', async () => {
    const { values, messages, wrapper } = build({ validateOn: 'change' })
    values.email = 'x'
    await flushPromises()
    expect(messages()).toEqual(['邮箱格式不正确'])
    wrapper.unmount()
  })

  it('setErrors 显示外部错误，值改变后清除', async () => {
    const { wrapper, values, messages } = build()
    values.name = '书音'
    values.email = 'a@b.c'
    ;(wrapper.vm as unknown as { setErrors: (errors: Record<string, string>) => void }).setErrors({
      email: '邮箱已被使用',
    })
    await nextTick()
    expect(messages()).toEqual(['邮箱已被使用'])
    values.email = 'b@b.c'
    await flushPromises()
    expect(messages()).toEqual([])
    wrapper.unmount()
  })

  it('接受普通校验函数', async () => {
    const rules: FormValidator = values => {
      const errors: FormErrors = {}
      if (!values.name) errors.name = '必填'
      return errors
    }
    const { wrapper, messages } = build({}, rules)
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(messages()).toEqual(['必填'])
    wrapper.unmount()
  })

  it('没有路径的问题作为表单整体错误暴露给插槽', async () => {
    const { wrapper, values, messages } = build()
    values.name = 'root'
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(messages()).toEqual([])
    expect(wrapper.find('[data-root]').text()).toBe('整体不通过')
    wrapper.unmount()
  })

  it('reset 清空错误与提交状态', async () => {
    const { wrapper, values, messages } = build()
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(messages()).toEqual(['请输入名称'])
    ;(wrapper.vm as unknown as { reset: () => void }).reset()
    await nextTick()
    expect(messages()).toEqual([])
    values.name = 'a'
    await flushPromises()
    expect(messages()).toEqual([])
    wrapper.unmount()
  })

  it('disabled 使所有字段禁用', () => {
    const { wrapper, inputs } = build({ disabled: true })
    expect(inputs().every(input => input.attributes('disabled') !== undefined)).toBe(true)
    wrapper.unmount()
  })
})
