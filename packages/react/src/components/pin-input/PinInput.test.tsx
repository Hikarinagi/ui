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
    find: (selector: string) => screen.container.querySelector(selector) as HTMLElement | null,
    inputs: () =>
      Array.from(screen.container.querySelectorAll<HTMLInputElement>('input:not([tabindex="-1"])')),
  }
}

describe('结构', () => {
  it('根是 role=group 承接 attrs；默认六格，每格带语言包给的名称；值按字符落到各格', () => {
    const w = mount({ value: '12', className: 'mt-2', 'aria-label': '验证码' })
    const root = w.find('[data-hn-pin-input]')!
    expect(root.getAttribute('role')).toBe('group')
    expect(root.getAttribute('aria-label')).toBe('验证码')
    expect(root.classList).toContain('mt-2')
    expect(w.inputs()).toHaveLength(6)
    expect(w.inputs().map(i => i.value)).toEqual(['1', '2', '', '', '', ''])
    expect(w.inputs()[0]!.getAttribute('aria-label')).toBe('第 1 位，共 6 位')
    expect(w.inputs()[5]!.getAttribute('aria-label')).toBe('第 6 位，共 6 位')
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
    })
    expect(w.inputs()).toHaveLength(4)
    const cell = w.inputs()[0]!
    expect(cell.getAttribute('type')).toBe('password')
    expect(cell.getAttribute('autocomplete')).toBe('one-time-code')
    expect(cell.getAttribute('placeholder')).toBe('○')
    expect(cell.classList).toContain('size-[var(--hn-control-h-lg)]')
    expect(cell.classList).toContain('border-transparent')
    expect(w.find('input[name="code"]')).not.toBeNull()
  })

  it('disabled 与 invalid 落到每一格', () => {
    const w = mount({ disabled: true, invalid: true })
    expect(w.inputs().every(i => i.getAttribute('disabled') !== null)).toBe(true)
    expect(w.inputs().every(i => i.getAttribute('aria-invalid') === 'true')).toBe(true)
    expect(w.inputs().every(i => i.getAttribute('data-invalid') === '')).toBe(true)
    expect(w.find('[data-hn-pin-input]')!.getAttribute('data-invalid')).toBe('')
  })
})

describe('交互', () => {
  it('逐格输入写回字符串；填满时发 complete', async () => {
    const updates: string[] = []
    const completes: string[] = []
    function Harness() {
      const [value, setValue] = useState('')
      return (
        <PinInput
          length={3}
          value={value}
          onValueChange={next => {
            updates.push(next)
            setValue(next)
          }}
          onComplete={next => completes.push(next)}
        />
      )
    }
    const { container } = render(<Harness />)
    const cell = (at: number) =>
      container.querySelectorAll<HTMLInputElement>('input:not([tabindex="-1"])')[at]!
    for (const [at, char] of ['7', '8', '9'].entries()) {
      await act(async () => {
        fireEvent.input(cell(at), { target: { value: char } })
      })
    }
    expect(updates).toEqual(['7', '78', '789'])
    expect(completes[0]).toEqual('789')
  })

  it('外部改值时各格同步', async () => {
    const w = mount({ length: 4, value: '' })
    w.rerender(<PinInput length={4} value="2468" />)
    expect(w.inputs().map(i => i.value)).toEqual(['2', '4', '6', '8'])
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const w = mount({ value: '12', 'aria-label': '验证码' })
    await expectNoA11yViolations(w.element)
  })
})
