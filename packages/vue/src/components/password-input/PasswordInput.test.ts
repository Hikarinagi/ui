import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PasswordInput from './PasswordInput.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('渲染与受控', () => {
  it('根是输入面容器，内部是 password 输入框与切换钮，attrs 透传到输入框', () => {
    const w = mount(PasswordInput, {
      attrs: { autocomplete: 'current-password', placeholder: '密码' },
    })
    expect(w.attributes('data-hn-input')).toBe('')
    expect(w.classes()).toContain('hn-field')
    const input = w.find('input')
    expect(input.attributes('type')).toBe('password')
    expect(input.attributes('autocomplete')).toBe('current-password')
    expect(input.attributes('placeholder')).toBe('密码')
    expect(w.find('button').attributes('aria-label')).toBe('显示密码')
  })

  it('点击切换钮在明文与密文之间切换，名称随之变化，并发出 update:visible', async () => {
    const w = mount(PasswordInput)
    await w.find('button').trigger('click')
    expect(w.find('input').attributes('type')).toBe('text')
    expect(w.find('button').attributes('aria-label')).toBe('隐藏密码')
    expect(w.emitted('update:visible')).toEqual([[true]])
    await w.find('button').trigger('click')
    expect(w.find('input').attributes('type')).toBe('password')
  })

  it('visible 可受控', async () => {
    const w = mount(PasswordInput, { props: { visible: true } })
    expect(w.find('input').attributes('type')).toBe('text')
    await w.setProps({ visible: false })
    expect(w.find('input').attributes('type')).toBe('password')
  })

  it('v-model 双向绑定', async () => {
    const w = mount(PasswordInput, {
      props: {
        modelValue: '',
        'onUpdate:modelValue': (v?: string) => w.setProps({ modelValue: v }),
      },
    })
    await w.find('input').setValue('hina')
    expect(w.props('modelValue')).toBe('hina')
  })

  it('双形态与档位类与 Input 同源', () => {
    expect(mount(PasswordInput).classes()).toContain('[--hn-field-shadow:var(--hn-shadow-sm)]')
    expect(mount(PasswordInput, { props: { variant: 'secondary' } }).classes()).toContain(
      'border-transparent',
    )
    expect(
      mount(PasswordInput, { props: { size: 'lg' } })
        .classes()
        .join(' '),
    ).toContain('control-h-lg')
  })
})

describe('状态语义', () => {
  it('invalid 落根的 data-invalid 与输入框的 aria-invalid；disabled 同时禁用输入框与切换钮', () => {
    const invalid = mount(PasswordInput, { props: { invalid: true } })
    expect(invalid.attributes('data-invalid')).toBe('')
    expect(invalid.find('input').attributes('aria-invalid')).toBe('true')

    const disabled = mount(PasswordInput, { props: { disabled: true } })
    expect((disabled.find('input').element as HTMLInputElement).disabled).toBe(true)
    expect((disabled.find('button').element as HTMLButtonElement).disabled).toBe(true)
  })

  it('无 a11y 违规', async () => {
    const w = mount(PasswordInput, { attrs: { 'aria-label': '密码' }, attachTo: document.body })
    await expectNoA11yViolations(w.element)
  })
})
