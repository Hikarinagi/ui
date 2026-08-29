import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Input from './Input.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('渲染与受控', () => {
  it('渲染原生 input 并透传 attrs', () => {
    const w = mount(Input, { attrs: { placeholder: '邮箱', type: 'email' } })
    expect(w.element.tagName).toBe('INPUT')
    expect(w.attributes('placeholder')).toBe('邮箱')
    expect(w.attributes('type')).toBe('email')
  })

  it('v-model 双向绑定', async () => {
    const w = mount(Input, {
      props: {
        modelValue: '',
        'onUpdate:modelValue': (v?: string) => w.setProps({ modelValue: v }),
      },
    })
    await w.find('input').setValue('hina')
    expect(w.props('modelValue')).toBe('hina')
  })

  it('双形态:primary 是带 surface 阴影的 surface 件,secondary 是扁平件', () => {
    const primary = mount(Input)
    expect(primary.classes()).toContain('shadow-sm')
    expect(primary.classes()).toContain('border-line')

    const secondary = mount(Input, { props: { variant: 'secondary' } })
    expect(secondary.classes()).toContain('shadow-none')
    expect(secondary.classes()).toContain('border-transparent')
    expect(secondary.classes()).not.toContain('shadow-sm')
  })

  it('size 档位切换高度类', () => {
    expect(
      mount(Input, { props: { size: 'sm' } })
        .classes()
        .join(' '),
    ).toContain('control-h-sm')
    expect(mount(Input).classes().join(' ')).toContain('control-h-md')
    expect(
      mount(Input, { props: { size: 'lg' } })
        .classes()
        .join(' '),
    ).toContain('control-h-lg')
  })
})

describe('状态语义', () => {
  it('invalid 同时落 data-invalid 与 aria-invalid', () => {
    const w = mount(Input, { props: { invalid: true } })
    expect(w.attributes('data-invalid')).toBe('')
    expect(w.attributes('aria-invalid')).toBe('true')

    const ok = mount(Input)
    expect(ok.attributes('data-invalid')).toBeUndefined()
    expect(ok.attributes('aria-invalid')).toBeUndefined()
  })

  it('disabled 生效且不可输入', () => {
    const w = mount(Input, { props: { disabled: true } })
    expect((w.element as HTMLInputElement).disabled).toBe(true)
  })

  it('无 a11y 违规', async () => {
    const w = mount(Input, {
      attrs: { 'aria-label': '邮箱' },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element)
  })
})
