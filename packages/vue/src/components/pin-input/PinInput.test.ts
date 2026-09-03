import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import PinInput from './PinInput.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

const inputs = (w: ReturnType<typeof mount>) => w.findAll('input:not([tabindex="-1"])')

describe('结构', () => {
  it('根是 role=group 承接 attrs；默认六格，每格带语言包给的名称；值按字符落到各格', () => {
    const w = mount(PinInput, {
      props: { modelValue: '12', class: 'mt-2' },
      attrs: { 'aria-label': '验证码' },
    })
    const root = w.find('[data-hn-pin-input]')
    expect(root.attributes('role')).toBe('group')
    expect(root.attributes('aria-label')).toBe('验证码')
    expect(root.classes()).toContain('mt-2')
    expect(inputs(w)).toHaveLength(6)
    expect(inputs(w).map(i => (i.element as HTMLInputElement).value)).toEqual([
      '1',
      '2',
      '',
      '',
      '',
      '',
    ])
    expect(inputs(w)[0]!.attributes('aria-label')).toBe('第 1 位，共 6 位')
    expect(inputs(w)[5]!.attributes('aria-label')).toBe('第 6 位，共 6 位')
  })

  it('length、mask、otp、placeholder、name、size 与 variant 各落其位', () => {
    const w = mount(PinInput, {
      props: {
        length: 4,
        mask: true,
        otp: true,
        placeholder: '○',
        name: 'code',
        size: 'lg',
        variant: 'secondary',
      },
    })
    expect(inputs(w)).toHaveLength(4)
    const cell = inputs(w)[0]!
    expect(cell.attributes('type')).toBe('password')
    expect(cell.attributes('autocomplete')).toBe('one-time-code')
    expect(cell.attributes('placeholder')).toBe('○')
    expect(cell.classes()).toContain('size-[var(--hn-control-h-lg)]')
    expect(cell.classes()).toContain('border-transparent')
    expect(w.find('input[name="code"]').exists()).toBe(true)
  })

  it('disabled 与 invalid 落到每一格', () => {
    const w = mount(PinInput, { props: { disabled: true, invalid: true } })
    expect(inputs(w).every(i => i.attributes('disabled') !== undefined)).toBe(true)
    expect(inputs(w).every(i => i.attributes('aria-invalid') === 'true')).toBe(true)
    expect(inputs(w).every(i => i.attributes('data-invalid') === '')).toBe(true)
    expect(w.find('[data-hn-pin-input]').attributes('data-invalid')).toBe('')
  })
})

describe('交互', () => {
  it('逐格输入写回字符串；填满时发 complete', async () => {
    const w = mount(PinInput, {
      props: {
        length: 3,
        modelValue: '',
        'onUpdate:modelValue': (value: string) => w.setProps({ modelValue: value }),
      },
      attachTo: document.body,
    })
    const cell = (at: number) => inputs(w)[at]!.element as HTMLInputElement
    for (const [at, char] of ['7', '8', '9'].entries()) {
      cell(at).value = char
      await inputs(w)[at]!.trigger('input')
      await nextTick()
    }
    expect(w.emitted('update:modelValue')?.map(e => e[0])).toEqual(['7', '78', '789'])
    expect(w.emitted('complete')?.[0]).toEqual(['789'])
  })

  it('外部改值时各格同步', async () => {
    const w = mount(PinInput, { props: { length: 4, modelValue: '' } })
    await w.setProps({ modelValue: '2468' })
    expect(inputs(w).map(i => (i.element as HTMLInputElement).value)).toEqual(['2', '4', '6', '8'])
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const w = mount(PinInput, {
      props: { modelValue: '12' },
      attrs: { 'aria-label': '验证码' },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element)
  })
})
