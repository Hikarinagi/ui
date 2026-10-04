import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { createRef, useState, type ReactNode } from 'react'
import { SearchInput, type SearchInputProps } from './SearchInput'
import { expectNoA11yViolations } from '../../../test/axe'
import type { InputHandle } from '../input/Input'

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
    button: () => element.querySelector('button'),
  }
}

function Controlled(
  props: SearchInputProps & { initial: string; onModel: (value: string) => void },
) {
  const { initial, onModel, ...rest } = props
  const [value, setValue] = useState(initial)
  return (
    <SearchInput
      {...rest}
      value={value}
      onValueChange={next => {
        setValue(next)
        onModel(next)
      }}
    />
  )
}

describe('渲染与受控', () => {
  it('根是输入面容器，前置搜索图标，内部是 search 输入框，attrs 透传到输入框', () => {
    const w = mount(<SearchInput placeholder="搜索作品" autoComplete="off" />)
    expect(w.element.getAttribute('data-hn-input')).toBe('')
    expect(w.classes()).toContain('hn-field')
    expect(w.element.querySelector('svg')).not.toBeNull()
    expect(w.input().getAttribute('type')).toBe('search')
    expect(w.input().getAttribute('enterkeyhint')).toBe('search')
    expect(w.input().getAttribute('placeholder')).toBe('搜索作品')
    expect(w.input().getAttribute('autocomplete')).toBe('off')
  })

  it('v-model 双向绑定；空值时没有清除钮，有值后出现', () => {
    const onModel = vi.fn()
    const w = mount(<Controlled initial="" onModel={onModel} />)
    expect(w.button()).toBeNull()
    fireEvent.change(w.input(), { target: { value: '星见' } })
    expect(onModel).toHaveBeenLastCalledWith('星见')
    expect(w.button()!.getAttribute('aria-label')).toBe('清除')
  })

  it('清除钮清空值并发出 clear；clearable 关闭后不渲染', () => {
    const onModel = vi.fn()
    const onClear = vi.fn()
    const w = mount(<Controlled initial="星见" onModel={onModel} onClear={onClear} />)
    fireEvent.click(w.button()!)
    expect(onModel).toHaveBeenLastCalledWith('')
    expect(onClear).toHaveBeenCalledTimes(1)

    const fixed = mount(<SearchInput value="星见" clearable={false} />)
    expect(fixed.button()).toBeNull()
  })

  it('Enter 发出 search 并带当前值；Esc 清空', () => {
    const onModel = vi.fn()
    const onSearch = vi.fn()
    const onClear = vi.fn()
    const w = mount(
      <Controlled initial="星见" onModel={onModel} onSearch={onSearch} onClear={onClear} />,
    )
    fireEvent.keyDown(w.input(), { key: 'Enter' })
    expect(onSearch.mock.calls).toEqual([['星见']])
    fireEvent.keyDown(w.input(), { key: 'Escape' })
    expect(onModel).toHaveBeenLastCalledWith('')
    expect(onClear).toHaveBeenCalledTimes(1)
  })

  it('loading 时前置图标换成加载环，根带 aria-busy', () => {
    const w = mount(<SearchInput loading />)
    expect(w.element.getAttribute('aria-busy')).toBe('true')
    expect(w.element.querySelector('[role="status"]')).not.toBeNull()
    expect(mount(<SearchInput />).element.querySelector('[role="status"]')).toBeNull()
  })

  it('双形态与档位类与 Input 同源', () => {
    expect(mount(<SearchInput />).classes()).toContain('[--hn-field-shadow:var(--hn-shadow-sm)]')
    expect(mount(<SearchInput variant="secondary" />).classes()).toContain('border-transparent')
    expect(
      mount(<SearchInput size="sm" />)
        .classes()
        .join(' '),
    ).toContain('control-h-sm')
  })
})

describe('状态语义', () => {
  it('disabled 禁用输入框并隐藏清除钮', () => {
    const w = mount(<SearchInput value="星见" disabled />)
    expect(w.input().disabled).toBe(true)
    expect(w.button()).toBeNull()
  })

  it('无 a11y 违规', async () => {
    const w = mount(<SearchInput value="星见" aria-label="搜索" />)
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
        <SearchInput
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
