import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import InputGroup from './InputGroup.vue'
import InputGroupAddon from './InputGroupAddon.vue'
import Input from '../input/Input.vue'
import NumberInput from '../number-input/NumberInput.vue'
import Button from '../button/Button.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

function group(props: Record<string, unknown>, children: () => unknown[]) {
  return mount(InputGroup, { props, slots: { default: children as () => never } })
}

describe('一副输入面', () => {
  it('组根就是 hn-field 宿主，边框、阴影与档位落在组上；组内输入框退壳', () => {
    const w = group({}, () => [
      h(InputGroupAddon, () => 'https://'),
      h(Input, { 'aria-label': '域名' }),
      h(Button, () => '确定'),
    ])
    expect(w.attributes('data-hn-input-group')).toBe('')
    expect(w.classes()).toContain('hn-field')
    expect(w.classes()).toContain('[--hn-field-shadow:var(--hn-shadow-sm)]')
    expect(w.classes().join(' ')).toContain('control-h-md')
    const field = w.find('[data-hn-input]')
    expect(field.classes()).not.toContain('hn-field')
    expect(field.classes()).toContain('flex-1')
    expect(w.classes()).toContain('[&>*+*]:border-s')
    expect(w.classes()).toContain('[&>button]:rounded-none')
  })

  it('尺寸与形态设置在组上，组内输入框的附属件按组的档位取尺寸', () => {
    const w = mount(InputGroup, {
      props: { size: 'lg', variant: 'secondary' },
      slots: {
        default: () => h(Input, { 'aria-label': '关键词', clearable: true, modelValue: '星见' }),
      },
      global: { stubs: { transition: false } },
    })
    expect(w.classes().join(' ')).toContain('control-h-lg')
    expect(w.classes()).toContain('border-transparent')
    expect(w.classes().join(' ')).toContain('--hn-input-icon:1.125rem')
    expect(w.find('[data-hn-input] > span').classes().join(' ')).toContain('var(--hn-input-icon)')
  })

  it('disabled 与 invalid 下发到组内的每个输入框', () => {
    const w = group({ disabled: true, invalid: true }, () => [
      h(Input, { 'aria-label': '域名' }),
      h(NumberInput, { 'aria-label': '数量' }),
    ])
    expect(w.attributes('data-invalid')).toBe('')
    const inputs = w.findAll('input')
    expect(inputs).toHaveLength(2)
    expect(inputs.every(i => (i.element as HTMLInputElement).disabled)).toBe(true)
    expect(inputs.every(i => i.attributes('aria-invalid') === 'true')).toBe(true)
    expect(w.find('[data-hn-number-input]').classes()).not.toContain('hn-field')
  })

  it('附属段不带自己的底色，只靠分隔线与 muted 字区分', () => {
    const addon = mount(InputGroupAddon, { slots: { default: () => 'kg' } })
    expect(addon.classes()).toContain('text-muted')
    expect(addon.classes().join(' ')).not.toContain('bg-')
    expect(addon.classes().join(' ')).not.toContain('border')
  })

  it('无 a11y 违规', async () => {
    const w = mount(InputGroup, {
      slots: {
        default: () => [
          h(InputGroupAddon, () => 'https://'),
          h(Input, { 'aria-label': '域名' }),
          h(Button, () => '确定'),
        ],
      },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element)
  })
})
