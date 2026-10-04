import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { useState, type ReactNode } from 'react'
import { NumberInput } from './NumberInput'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

function mount(ui: ReactNode) {
  const element = render(ui).container.firstElementChild as HTMLElement
  return {
    element,
    classes: () => [...element.classList],
    input: () => element.querySelector('input') as HTMLInputElement,
    buttons: () => [...element.querySelectorAll('button')],
  }
}

describe('渲染与受控', () => {
  it('根是 role=group 的输入面容器，内部是 spinbutton 输入框，attrs 透传到输入框', () => {
    const w = mount(<NumberInput placeholder="数量" id="qty" />)
    expect(w.element.getAttribute('role')).toBe('group')
    expect(w.element.getAttribute('data-hn-number-input')).toBe('')
    expect(w.input().getAttribute('role')).toBe('spinbutton')
    expect(w.input().getAttribute('placeholder')).toBe('数量')
    expect(w.input().getAttribute('id')).toBe('qty')
    expect(w.input().getAttribute('inputmode')).toBe('decimal')
  })

  it('v-model 在失焦时解析并回写数值', async () => {
    const onModel = vi.fn()
    function Harness() {
      const [value, setValue] = useState<number | null | undefined>(null)
      return (
        <NumberInput
          value={value}
          onValueChange={next => {
            setValue(next)
            onModel(next)
          }}
        />
      )
    }
    const w = mount(<Harness />)
    fireEvent.change(w.input(), { target: { value: '12' } })
    fireEvent.blur(w.input())
    await vi.waitFor(() => expect(onModel).toHaveBeenLastCalledWith(12))
  })

  it('默认值走非受控路径，按 formatOptions 与语言包的语言显示', () => {
    const w = mount(
      <NumberInput defaultValue={1234.5} formatOptions={{ style: 'currency', currency: 'CNY' }} />,
    )
    expect(w.input().value).toBe('¥1,234.50')
    expect(w.input().getAttribute('inputmode')).toBe('decimal')
  })

  it('双形态与档位类与 Input 同源', () => {
    const primary = mount(<NumberInput />)
    expect(primary.classes()).toContain('hn-field')
    expect(primary.classes()).toContain('[--hn-field-shadow:var(--hn-shadow-sm)]')
    expect(mount(<NumberInput variant="secondary" />).classes()).toContain('border-transparent')
    expect(
      mount(<NumberInput size="sm" />)
        .classes()
        .join(' '),
    ).toContain('control-h-sm')
    expect(
      mount(<NumberInput size="lg" />)
        .classes()
        .join(' '),
    ).toContain('control-h-lg')
  })
})

describe('步进按钮', () => {
  it('两枚步进钮带本地化名称、不进 Tab 序列；controls 关掉后不渲染', () => {
    const w = mount(<NumberInput />)
    expect(w.buttons().map(b => b.getAttribute('aria-label'))).toEqual(['增加', '减少'])
    expect(w.buttons().map(b => b.getAttribute('tabindex'))).toEqual(['-1', '-1'])
    expect(mount(<NumberInput controls={false} />).buttons()).toHaveLength(0)
  })
})

describe('状态语义', () => {
  it('invalid 落根的 data-invalid 与输入框的 aria-invalid；disabled、readonly 落到根与输入框', () => {
    const invalid = mount(<NumberInput invalid />)
    expect(invalid.element.getAttribute('data-invalid')).toBe('')
    expect(invalid.input().getAttribute('aria-invalid')).toBe('true')
    expect(
      mount(<NumberInput />)
        .input()
        .getAttribute('aria-invalid'),
    ).toBeNull()

    const disabled = mount(<NumberInput disabled />)
    expect(disabled.element.getAttribute('data-disabled')).toBe('')
    expect(disabled.input().disabled).toBe(true)
    expect(disabled.buttons().every(b => b.getAttribute('disabled') === '')).toBe(true)

    const readonly = mount(<NumberInput readonly />)
    expect(readonly.element.getAttribute('data-readonly')).toBe('')
    expect(readonly.input().readOnly).toBe(true)
  })

  it('无 a11y 违规', async () => {
    const w = mount(<NumberInput aria-label="数量" />)
    await expectNoA11yViolations(w.element)
  })
})
