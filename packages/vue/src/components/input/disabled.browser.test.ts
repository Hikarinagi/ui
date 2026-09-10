import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h, type Component } from 'vue'
import Input from './Input.vue'
import InputGroup from '../input-group/InputGroup.vue'
import Button from '../button/Button.vue'
import SearchInput from '../search-input/SearchInput.vue'
import PasswordInput from '../password-input/PasswordInput.vue'
import NumberInput from '../number-input/NumberInput.vue'
import Textarea from '../textarea/Textarea.vue'
import Select from '../select/Select.vue'
import MultiSelect from '../multi-select/MultiSelect.vue'
import Combobox from '../combobox/Combobox.vue'
import MultiCombobox from '../multi-combobox/MultiCombobox.vue'
import TreeSelect from '../tree-select/TreeSelect.vue'
import TagsInput from '../tags-input/TagsInput.vue'
import DateField from '../date-field/DateField.vue'
import DateRangeField from '../date-range-field/DateRangeField.vue'
import TimeField from '../time-field/TimeField.vue'
import DatePicker from '../date-picker/DatePicker.vue'
import DateRangePicker from '../date-range-picker/DateRangePicker.vue'
import DateTimePicker from '../date-time-picker/DateTimePicker.vue'
import FormField from '../form-field/FormField.vue'
import '../../../test/browser.css'

const mounted: VueWrapper[] = []
const options = [
  { value: 'a', label: '可用' },
  { value: 'b', label: '不可用', disabled: true },
]
const fields: Array<[string, Component, Record<string, unknown>]> = [
  ['Input', Input, {}],
  ['SearchInput', SearchInput, {}],
  ['PasswordInput', PasswordInput, {}],
  ['NumberInput', NumberInput, { modelValue: 5, min: 0, max: 10 }],
  ['Textarea', Textarea, {}],
  ['Select', Select, { options }],
  ['MultiSelect', MultiSelect, { options }],
  ['Combobox', Combobox, { options }],
  ['MultiCombobox', MultiCombobox, { options }],
  ['TreeSelect', TreeSelect, { items: options }],
  ['TagsInput', TagsInput, { modelValue: ['a'] }],
  ['DateField', DateField, {}],
  ['DateRangeField', DateRangeField, {}],
  ['TimeField', TimeField, {}],
  ['DatePicker', DatePicker, {}],
  ['DateRangePicker', DateRangePicker, {}],
  ['DateTimePicker', DateTimePicker, {}],
]

function render(
  component: Component,
  props: Record<string, unknown> = {},
  slots: Record<string, () => unknown> = {},
) {
  const host = document.createElement('div')
  host.style.cssText = 'width:360px;padding:24px'
  document.body.appendChild(host)
  const w = mount(component, { props, slots, attrs: { 'aria-label': '控件' }, attachTo: host })
  mounted.push(w)
  return { w, root: host.querySelector<HTMLElement>('.hn-field')! }
}

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted.length = 0
  document.body.innerHTML = ''
})

describe('禁用外观只取决于当前控件', () => {
  it.each([0, 10])('NumberInput 到达边界 %s 时仍可操作，不变淡', async modelValue => {
    const { w, root } = render(NumberInput, { modelValue, min: 0, max: 10 })
    const input = root.querySelector('input')!
    expect(input.disabled).toBe(false)
    expect(root.querySelectorAll('button:disabled')).toHaveLength(1)
    expect(getComputedStyle(root).opacity).toBe('1')
    expect(getComputedStyle(root).cursor).toBe('text')
    await userEvent.click(root.querySelector<HTMLButtonElement>('button:not(:disabled)')!)
    expect(w.emitted('update:modelValue')?.[0]).toEqual([modelValue === 0 ? 1 : 9])
  })

  it('NumberInput readonly 与关闭步进按钮时保持相同外观', async () => {
    const { w, root } = render(NumberInput, { modelValue: 5, readonly: true })
    expect(root.querySelector('input')!.readOnly).toBe(true)
    expect(root.querySelectorAll('button:disabled')).toHaveLength(2)
    expect(getComputedStyle(root).opacity).toBe('1')
    expect(getComputedStyle(root).cursor).toBe('text')
    await w.setProps({ controls: false })
    expect(getComputedStyle(root).opacity).toBe('1')
  })

  it.each([false, true])('局部按钮禁用不取消 hover，invalid=%s', async invalid => {
    const { root } = render(NumberInput, { modelValue: 0, min: 0, invalid })
    const resting = getComputedStyle(root).backgroundColor
    await userEvent.hover(root.querySelector('input')!)
    await vi.waitFor(() => expect(getComputedStyle(root).backgroundColor).not.toBe(resting))
  })

  it.each([
    ['Input', Input],
    ['DateField', DateField],
    ['DateRangeField', DateRangeField],
    ['TimeField', TimeField],
  ] as const)('%s 的深层插槽按钮禁用不影响输入外壳', (_name, component) => {
    const { root } = render(
      component,
      {},
      {
        trailing: () => h('span', [h(Button, { disabled: true }, () => '操作')]),
      },
    )
    expect(root.querySelector('button:disabled')).not.toBeNull()
    expect(getComputedStyle(root).opacity).toBe('1')
    expect(getComputedStyle(root).cursor).toBe('text')
  })

  it('InputGroup 中禁用提交按钮不影响仍可编辑的输入框', async () => {
    const { root } = render(
      InputGroup,
      {},
      {
        default: () => [h(Input), h(Button, { disabled: true }, () => '提交')],
      },
    )
    expect(getComputedStyle(root).opacity).toBe('1')
    expect(getComputedStyle(root).cursor).toBe('text')
    const input = root.querySelector('input')!
    await userEvent.fill(input, '仍可编辑')
    expect(input.value).toBe('仍可编辑')
  })

  it.each([
    ['Input', Input, {}, '[data-hn-input]'],
    ['NumberInput', NumberInput, {}, '[data-hn-number-input]'],
    ['Select', Select, { options }, '[data-hn-select]'],
    ['DatePicker', DatePicker, {}, '[data-hn-date-picker]'],
  ] as const)('InputGroup 局部禁用 %s 只淡化该输入区', (_name, component, props, selector) => {
    const { root } = render(
      InputGroup,
      {},
      {
        default: () => [h(component as Component, { ...props, disabled: true }), h(Input)],
      },
    )
    const local = root.querySelector<HTMLElement>(selector)!
    const inputs = root.querySelectorAll('input:not([type=hidden])')
    expect((inputs[inputs.length - 1] as HTMLInputElement).disabled).toBe(false)
    expect(getComputedStyle(root).opacity).toBe('1')
    expect(getComputedStyle(local).opacity).toBe('0.5')
    if (component === DatePicker) {
      expect(getComputedStyle(local.querySelector('[data-hn-date-field]')!).opacity).toBe('1')
    }
  })

  it.each(fields)(
    '%s 自身 disabled 可动态切换，禁用时无 hover',
    async (_name, component, props) => {
      const { w, root } = render(component, { ...props, disabled: true })
      expect(getComputedStyle(root).opacity).toBe('0.5')
      expect(getComputedStyle(root).cursor).toBe('not-allowed')
      const resting = getComputedStyle(root).backgroundColor
      await userEvent.hover(root)
      await new Promise(resolve => setTimeout(resolve, 250))
      expect(getComputedStyle(root).backgroundColor).toBe(resting)
      await w.setProps({ disabled: false })
      await vi.waitFor(() => expect(getComputedStyle(root).opacity).toBe('1'))
    },
  )

  it.each(fields)(
    '%s 从 FormField 继承禁用，不把表单包装层当作淡化层',
    (_name, component, props) => {
      const { root } = render(
        FormField,
        { disabled: true, label: '字段' },
        {
          default: () => h(component, props),
        },
      )
      expect(getComputedStyle(root).opacity).toBe('0.5')
      expect(getComputedStyle(root).cursor).toBe('not-allowed')
    },
  )

  it.each([false, true])('整组禁用只淡化一次，来自 FormField=%s', inherited => {
    const children = () => [h(Input), h(NumberInput), h(Select, { options }), h(DatePicker)]
    const { root } = inherited
      ? render(
          FormField,
          { disabled: true },
          {
            default: () => h(InputGroup, {}, { default: children }),
          },
        )
      : render(InputGroup, { disabled: true }, { default: children })
    expect(root.matches('[data-hn-input-group]')).toBe(true)
    expect(getComputedStyle(root).opacity).toBe('0.5')
    for (const field of root.querySelectorAll(
      '[data-hn-input], [data-hn-number-input], [data-hn-select], [data-hn-date-picker], [data-hn-date-field]',
    )) {
      expect(getComputedStyle(field).opacity).toBe('1')
    }
    for (const input of root.querySelectorAll('input')) expect(input.disabled).toBe(true)
  })

  it('Select 的禁用选项留在 Portal 中，不影响可用触发器', async () => {
    const { root } = render(Select, { options, open: true })
    await vi.waitFor(() =>
      expect(document.querySelector('[role=option][data-disabled]')).not.toBeNull(),
    )
    expect(root.contains(document.querySelector('[role=option][data-disabled]'))).toBe(false)
    expect(getComputedStyle(root).opacity).toBe('1')
  })
})
