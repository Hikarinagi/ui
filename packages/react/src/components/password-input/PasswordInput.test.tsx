import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { createRef, useState, type ReactNode } from 'react'
import { PasswordInput } from './PasswordInput'
import { expectNoA11yViolations } from '../../../test/axe'
import type { InputHandle } from '../input/Input'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

function mount(ui: ReactNode) {
  const screen = render(ui)
  const element = screen.container.firstElementChild as HTMLElement
  return {
    ...screen,
    element,
    classes: () => [...element.classList],
    input: () => element.querySelector('input') as HTMLInputElement,
    button: () => element.querySelector('button') as HTMLButtonElement,
  }
}

describe('渲染与受控', () => {
  it('根是输入面容器，内部是 password 输入框与切换钮，attrs 透传到输入框', () => {
    const w = mount(<PasswordInput autoComplete="current-password" placeholder="密码" />)
    expect(w.element.getAttribute('data-hn-input')).toBe('')
    expect(w.classes()).toContain('hn-field')
    expect(w.input().getAttribute('type')).toBe('password')
    expect(w.input().getAttribute('autocomplete')).toBe('current-password')
    expect(w.input().getAttribute('placeholder')).toBe('密码')
    expect(w.button().getAttribute('aria-label')).toBe('显示密码')
  })

  it('点击切换钮在明文与密文之间切换，名称随之变化，并发出 update:visible', async () => {
    const onVisibleChange = vi.fn()
    const w = mount(<PasswordInput onVisibleChange={onVisibleChange} />)
    fireEvent.click(w.button())
    expect(w.input().getAttribute('type')).toBe('text')
    expect(w.button().getAttribute('aria-label')).toBe('隐藏密码')
    await vi.waitFor(() => expect(onVisibleChange.mock.calls).toEqual([[true]]))
    fireEvent.click(w.button())
    expect(w.input().getAttribute('type')).toBe('password')
  })

  it('visible 可受控', () => {
    const w = mount(<PasswordInput visible />)
    expect(w.input().getAttribute('type')).toBe('text')
    w.rerender(<PasswordInput visible={false} />)
    expect(w.input().getAttribute('type')).toBe('password')
  })

  it('v-model 双向绑定', () => {
    const onModel = vi.fn()
    function Harness() {
      const [value, setValue] = useState('')
      return (
        <PasswordInput
          value={value}
          onValueChange={next => {
            setValue(next)
            onModel(next)
          }}
        />
      )
    }
    const w = mount(<Harness />)
    fireEvent.change(w.input(), { target: { value: 'hina' } })
    expect(onModel).toHaveBeenLastCalledWith('hina')
  })

  it('双形态与档位类与 Input 同源', () => {
    expect(mount(<PasswordInput />).classes()).toContain('[--hn-field-shadow:var(--hn-shadow-sm)]')
    expect(mount(<PasswordInput variant="secondary" />).classes()).toContain('border-transparent')
    expect(
      mount(<PasswordInput size="lg" />)
        .classes()
        .join(' '),
    ).toContain('control-h-lg')
  })
})

describe('状态语义', () => {
  it('invalid 落根的 data-invalid 与输入框的 aria-invalid；disabled 同时禁用输入框与切换钮', () => {
    const invalid = mount(<PasswordInput invalid />)
    expect(invalid.element.getAttribute('data-invalid')).toBe('')
    expect(invalid.input().getAttribute('aria-invalid')).toBe('true')

    const disabled = mount(<PasswordInput disabled />)
    expect(disabled.input().disabled).toBe(true)
    expect(disabled.button().disabled).toBe(true)
  })

  it('无 a11y 违规', async () => {
    const w = mount(<PasswordInput aria-label="密码" />)
    await expectNoA11yViolations(w.element)
  })
})

describe('实例方法', () => {
  it('与 Input 一样暴露 focus 与 clear', () => {
    const handle = createRef<InputHandle>()
    const changes: Array<string | undefined> = []
    function Harness() {
      const [value, setValue] = useState<string | undefined>('text')
      return (
        <PasswordInput
          ref={handle}
          value={value}
          onValueChange={next => {
            changes.push(next)
            setValue(next)
          }}
        />
      )
    }
    const { container } = render(<Harness />)
    act(() => handle.current!.focus())
    expect(document.activeElement).toBe(container.querySelector('input'))
    act(() => handle.current!.clear())
    expect(changes.at(-1)).toBe('')
  })
})
