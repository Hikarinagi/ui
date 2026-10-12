import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { useState } from 'react'
import { PinInput, type PinInputProps } from './PinInput'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

function mount(props: PinInputProps = {}) {
  const screen = render(<PinInput {...props} />)
  const element = screen.container.firstElementChild as HTMLElement
  return {
    ...screen,
    element,
    root: () => screen.container.querySelector('[data-hn-pin-input]') as HTMLElement,
    native: () => screen.container.querySelector('input') as HTMLInputElement,
    cells: () => Array.from(screen.container.querySelectorAll<HTMLElement>('[data-hn-pin-cell]')),
  }
}

describe('结构', () => {
  it('根承接 class 与其余属性；默认六格；值按字符落到各格；名称与 id 落在唯一的输入框上', () => {
    const w = mount({
      value: '12',
      className: 'mt-2',
      'aria-label': '验证码',
      id: 'code',
      'data-test': 'pin',
    })
    expect(w.root().classList).toContain('mt-2')
    expect(w.root().getAttribute('data-test')).toBe('pin')
    expect(w.root().getAttribute('aria-label')).toBeNull()
    expect(w.root().getAttribute('id')).toBeNull()
    expect(w.container.querySelectorAll('input')).toHaveLength(1)
    expect(w.native().getAttribute('aria-label')).toBe('验证码')
    expect(w.native().id).toBe('code')
    expect(w.native().value).toBe('12')
    expect(w.cells()).toHaveLength(6)
    expect(w.cells().map(cell => cell.textContent)).toEqual(['1', '2', '', '', '', ''])
    expect(w.cells().every(cell => cell.getAttribute('aria-hidden') === 'true')).toBe(true)
    expect(w.cells().map(cell => cell.getAttribute('data-filled'))).toEqual([
      '',
      '',
      null,
      null,
      null,
      null,
    ])
  })

  it('length、mask、otp、placeholder、name、size 与 variant 各落其位', () => {
    const w = mount({
      length: 4,
      mask: true,
      otp: true,
      placeholder: '○',
      name: 'code',
      size: 'lg',
      variant: 'secondary',
      value: '7',
    })
    expect(w.cells()).toHaveLength(4)
    expect(w.cells().map(cell => cell.textContent)).toEqual(['•', '○', '○', '○'])
    expect(w.native().type).toBe('password')
    expect(w.native().getAttribute('autocomplete')).toBe('one-time-code')
    expect(w.native().name).toBe('code')
    expect(w.native().value).toBe('7')
    expect(w.root().classList).toContain('[--hn-pin-size:var(--hn-control-h-lg)]')
    expect(w.cells()[0]!.classList).toContain('border-transparent')
  })

  it('数字模式给输入框数字键盘,默认关闭自动填充', () => {
    const w = mount({ type: 'number' })
    expect(w.native().getAttribute('inputmode')).toBe('numeric')
    expect(w.native().getAttribute('pattern')).toBe('[0-9]*')
    expect(w.native().getAttribute('autocomplete')).toBe('off')
    expect(w.native().hasAttribute('maxlength')).toBe(false)
  })

  it('disabled 与 invalid 落到根、每一格与输入框', () => {
    const w = mount({ disabled: true, invalid: true })
    expect(w.native().disabled).toBe(true)
    expect(w.native().getAttribute('aria-invalid')).toBe('true')
    expect(w.cells().every(cell => cell.getAttribute('data-invalid') === '')).toBe(true)
    expect(w.cells().every(cell => cell.getAttribute('data-disabled') === '')).toBe(true)
    expect(w.root().getAttribute('data-invalid')).toBe('')
    expect(w.root().getAttribute('data-disabled')).toBe('')
  })
})

describe('交互', () => {
  function harness(props: PinInputProps) {
    const updates: string[] = []
    const completes: string[] = []
    function Harness() {
      const [value, setValue] = useState('')
      return (
        <PinInput
          {...props}
          value={value}
          onValueChange={next => {
            updates.push(next)
            setValue(next)
          }}
          onComplete={next => completes.push(next)}
        />
      )
    }
    const screen = render(<Harness />)
    return {
      updates,
      completes,
      root: screen.container.querySelector('[data-hn-pin-input]') as HTMLElement,
      native: screen.container.querySelector('input') as HTMLInputElement,
    }
  }

  it('输入写回字符串；填满时发 complete', async () => {
    const w = harness({ length: 3 })
    for (const value of ['7', '78', '789']) {
      await act(async () => {
        fireEvent.input(w.native, { target: { value } })
      })
    }
    expect(w.updates).toEqual(['7', '78', '789'])
    expect(w.completes).toEqual(['789'])
    expect(w.root.getAttribute('data-complete')).toBe('')
  })

  it('一次写入整段时清洗并截到格数', async () => {
    const w = harness({ length: 4, type: 'number' })
    await act(async () => {
      fireEvent.input(w.native, { target: { value: '验证码 １２-345 6' } })
    })
    expect(w.updates).toEqual(['1234'])
    expect(w.native.value).toBe('1234')
  })

  it('外部改值时格子与输入框同步,不触发 onValueChange', async () => {
    const updates: string[] = []
    const completes: string[] = []
    const props = {
      length: 4,
      onValueChange: (next: string) => updates.push(next),
      onComplete: (next: string) => completes.push(next),
    }
    const w = mount({ ...props, value: '' })
    w.rerender(<PinInput {...props} value="2468" />)
    expect(w.cells().map(cell => cell.textContent)).toEqual(['2', '4', '6', '8'])
    expect(w.native().value).toBe('2468')
    expect(updates).toEqual([])
    expect(completes).toEqual(['2468'])
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const w = mount({ value: '12', 'aria-label': '验证码' })
    await expectNoA11yViolations(w.element)
  })
})
