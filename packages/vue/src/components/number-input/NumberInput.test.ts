import { describe, expect, it, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import NumberInput from './NumberInput.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('渲染与受控', () => {
  it('根是 role=group 的输入面容器，内部是 spinbutton 输入框，attrs 透传到输入框', () => {
    const w = mount(NumberInput, { attrs: { placeholder: '数量', id: 'qty' } })
    expect(w.attributes('role')).toBe('group')
    expect(w.attributes('data-hn-number-input')).toBe('')
    const input = w.find('input')
    expect(input.attributes('role')).toBe('spinbutton')
    expect(input.attributes('placeholder')).toBe('数量')
    expect(input.attributes('id')).toBe('qty')
    expect(input.attributes('inputmode')).toBe('decimal')
  })

  it('v-model 在失焦时解析并回写数值', async () => {
    const w = mount(NumberInput, {
      props: {
        modelValue: null,
        'onUpdate:modelValue': (v?: number | null) => w.setProps({ modelValue: v }),
      },
    })
    const input = w.find('input')
    await input.setValue('12')
    await input.trigger('blur')
    await vi.waitFor(() => expect(w.props('modelValue')).toBe(12))
  })

  it('默认值走非受控路径，按 formatOptions 与语言包的语言显示', () => {
    const w = mount(NumberInput, {
      props: { defaultValue: 1234.5, formatOptions: { style: 'currency', currency: 'CNY' } },
    })
    expect((w.find('input').element as HTMLInputElement).value).toBe('¥1,234.50')
    expect(w.find('input').attributes('inputmode')).toBe('decimal')
  })

  it('双形态与档位类与 Input 同源', () => {
    const primary = mount(NumberInput)
    expect(primary.classes()).toContain('hn-field')
    expect(primary.classes()).toContain('[--hn-field-shadow:var(--hn-shadow-sm)]')
    expect(mount(NumberInput, { props: { variant: 'secondary' } }).classes()).toContain(
      'border-transparent',
    )
    expect(
      mount(NumberInput, { props: { size: 'sm' } })
        .classes()
        .join(' '),
    ).toContain('control-h-sm')
    expect(
      mount(NumberInput, { props: { size: 'lg' } })
        .classes()
        .join(' '),
    ).toContain('control-h-lg')
  })
})

describe('步进按钮', () => {
  it('两枚步进钮带本地化名称、不进 Tab 序列；controls 关掉后不渲染', () => {
    const w = mount(NumberInput)
    const buttons = w.findAll('button')
    expect(buttons.map(b => b.attributes('aria-label'))).toEqual(['增加', '减少'])
    expect(buttons.map(b => b.attributes('tabindex'))).toEqual(['-1', '-1'])
    expect(mount(NumberInput, { props: { controls: false } }).findAll('button')).toHaveLength(0)
  })
})

describe('状态语义', () => {
  it('invalid 落根的 data-invalid 与输入框的 aria-invalid；disabled、readonly 落到根与输入框', () => {
    const invalid = mount(NumberInput, { props: { invalid: true } })
    expect(invalid.attributes('data-invalid')).toBe('')
    expect(invalid.find('input').attributes('aria-invalid')).toBe('true')
    expect(mount(NumberInput).find('input').attributes('aria-invalid')).toBeUndefined()

    const disabled = mount(NumberInput, { props: { disabled: true } })
    expect(disabled.attributes('data-disabled')).toBe('')
    expect((disabled.find('input').element as HTMLInputElement).disabled).toBe(true)
    expect(disabled.findAll('button').every(b => b.attributes('disabled') === '')).toBe(true)

    const readonly = mount(NumberInput, { props: { readonly: true } })
    expect(readonly.attributes('data-readonly')).toBe('')
    expect((readonly.find('input').element as HTMLInputElement).readOnly).toBe(true)
  })

  it('无 a11y 违规', async () => {
    const w = mount(NumberInput, { attrs: { 'aria-label': '数量' }, attachTo: document.body })
    await expectNoA11yViolations(w.element)
  })
})
