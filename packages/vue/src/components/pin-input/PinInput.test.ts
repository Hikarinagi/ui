import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import PinInput from './PinInput.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

const cells = (w: ReturnType<typeof mount>) => w.findAll('[data-hn-pin-cell]')
const native = (w: ReturnType<typeof mount>) => w.find('input').element as HTMLInputElement

describe('结构', () => {
  it('根承接 class 与其余属性；默认六格；值按字符落到各格；名称与 id 落在唯一的输入框上', () => {
    const w = mount(PinInput, {
      props: { modelValue: '12', class: 'mt-2' },
      attrs: { 'aria-label': '验证码', id: 'code', 'data-test': 'pin' },
    })
    const root = w.find('[data-hn-pin-input]')
    expect(root.classes()).toContain('mt-2')
    expect(root.attributes('data-test')).toBe('pin')
    expect(root.attributes('aria-label')).toBeUndefined()
    expect(root.attributes('id')).toBeUndefined()
    expect(w.findAll('input')).toHaveLength(1)
    expect(native(w).getAttribute('aria-label')).toBe('验证码')
    expect(native(w).id).toBe('code')
    expect(native(w).value).toBe('12')
    expect(cells(w)).toHaveLength(6)
    expect(cells(w).map(cell => cell.text())).toEqual(['1', '2', '', '', '', ''])
    expect(cells(w).every(cell => cell.attributes('aria-hidden') === 'true')).toBe(true)
    expect(cells(w).map(cell => cell.attributes('data-filled'))).toEqual([
      '',
      '',
      undefined,
      undefined,
      undefined,
      undefined,
    ])
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
        modelValue: '7',
      },
    })
    expect(cells(w)).toHaveLength(4)
    expect(cells(w).map(cell => cell.text())).toEqual(['•', '○', '○', '○'])
    expect(native(w).type).toBe('password')
    expect(native(w).getAttribute('autocomplete')).toBe('one-time-code')
    expect(native(w).name).toBe('code')
    expect(native(w).value).toBe('7')
    expect(w.find('[data-hn-pin-input]').classes()).toContain(
      '[--hn-pin-size:var(--hn-control-h-lg)]',
    )
    expect(cells(w)[0]!.classes()).toContain('border-transparent')
  })

  it('数字模式给输入框数字键盘,默认关闭自动填充', () => {
    const w = mount(PinInput, { props: { type: 'number' } })
    expect(native(w).getAttribute('inputmode')).toBe('numeric')
    expect(native(w).getAttribute('pattern')).toBe('[0-9]*')
    expect(native(w).getAttribute('autocomplete')).toBe('off')
    expect(native(w).hasAttribute('maxlength')).toBe(false)
  })

  it('disabled 与 invalid 落到根、每一格与输入框', () => {
    const w = mount(PinInput, { props: { disabled: true, invalid: true } })
    expect(native(w).disabled).toBe(true)
    expect(native(w).getAttribute('aria-invalid')).toBe('true')
    expect(cells(w).every(cell => cell.attributes('data-invalid') === '')).toBe(true)
    expect(cells(w).every(cell => cell.attributes('data-disabled') === '')).toBe(true)
    expect(w.find('[data-hn-pin-input]').attributes('data-invalid')).toBe('')
    expect(w.find('[data-hn-pin-input]').attributes('data-disabled')).toBe('')
  })
})

describe('交互', () => {
  it('输入写回字符串；填满时发 complete', async () => {
    const w = mount(PinInput, {
      props: {
        length: 3,
        modelValue: '',
        'onUpdate:modelValue': (value: string) => w.setProps({ modelValue: value }),
      },
      attachTo: document.body,
    })
    for (const value of ['7', '78', '789']) {
      native(w).value = value
      await w.find('input').trigger('input')
      await nextTick()
    }
    expect(w.emitted('update:modelValue')?.map(e => e[0])).toEqual(['7', '78', '789'])
    expect(w.emitted('complete')).toEqual([['789']])
    expect(w.find('[data-hn-pin-input]').attributes('data-complete')).toBe('')
  })

  it('一次写入整段时清洗并截到格数', async () => {
    const w = mount(PinInput, {
      props: {
        length: 4,
        type: 'number' as const,
        modelValue: '',
        'onUpdate:modelValue': (value: string) => w.setProps({ modelValue: value }),
      },
      attachTo: document.body,
    })
    native(w).value = '验证码 １２-345 6'
    await w.find('input').trigger('input')
    await nextTick()
    expect(w.emitted('update:modelValue')?.map(e => e[0])).toEqual(['1234'])
    expect(native(w).value).toBe('1234')
  })

  it('外部改值时格子与输入框同步,不触发 update', async () => {
    const w = mount(PinInput, { props: { length: 4, modelValue: '' } })
    await w.setProps({ modelValue: '2468' })
    expect(cells(w).map(cell => cell.text())).toEqual(['2', '4', '6', '8'])
    expect(native(w).value).toBe('2468')
    expect(w.emitted('update:modelValue')).toBeUndefined()
    expect(w.emitted('complete')).toEqual([['2468']])
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
