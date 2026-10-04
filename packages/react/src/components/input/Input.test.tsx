import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { useState, type ReactNode } from 'react'
import { Mail } from 'lucide-react'
import { lucide } from '../../lib/icon'
import { Input, type InputProps } from './Input'
import { expectNoA11yViolations } from '../../../test/axe'

const MailIcon = lucide(Mail)

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
  }
}

function Controlled(props: InputProps & { initial?: string; onModel?: (value: string) => void }) {
  const { initial, onModel, ...rest } = props
  const [value, setValue] = useState(initial)
  return (
    <Input
      {...rest}
      value={value}
      onValueChange={next => {
        setValue(next)
        onModel?.(next)
      }}
    />
  )
}

describe('渲染与受控', () => {
  it('根是输入面容器，内部是原生 input，attrs 透传到 input', () => {
    const w = mount(<Input placeholder="邮箱" type="email" />)
    expect(w.element.tagName).toBe('DIV')
    expect(w.element.getAttribute('data-hn-input')).toBe('')
    expect(w.input().getAttribute('placeholder')).toBe('邮箱')
    expect(w.input().getAttribute('type')).toBe('email')
  })

  it('v-model 双向绑定', () => {
    const onModel = vi.fn()
    const w = mount(<Controlled initial="" onModel={onModel} />)
    fireEvent.change(w.input(), { target: { value: 'hina' } })
    expect(onModel).toHaveBeenLastCalledWith('hina')
    expect(w.input().value).toBe('hina')
  })

  it('双形态:primary 是带 surface 阴影的 surface 件,secondary 是扁平件', () => {
    const primary = mount(<Input />)
    expect(primary.classes()).toContain('hn-field')
    expect(primary.classes()).toContain('[--hn-field-shadow:var(--hn-shadow-sm)]')
    expect(primary.classes()).toContain('border-line')

    const secondary = mount(<Input variant="secondary" />)
    expect(secondary.classes()).toContain('border-transparent')
    expect(secondary.classes()).not.toContain('[--hn-field-shadow:var(--hn-shadow-sm)]')
  })

  it('size 档位切换高度类', () => {
    expect(
      mount(<Input size="sm" />)
        .classes()
        .join(' '),
    ).toContain('control-h-sm')
    expect(
      mount(<Input />)
        .classes()
        .join(' '),
    ).toContain('control-h-md')
    expect(
      mount(<Input size="lg" />)
        .classes()
        .join(' '),
    ).toContain('control-h-lg')
  })
})

describe('附属件', () => {
  it('leading / trailing 插槽各占一格，对应侧的输入区内边距归零', () => {
    const w = mount(<Input leading={<MailIcon />} trailing="kg" />)
    const boxes = w.element.querySelectorAll(':scope > span')
    expect(boxes).toHaveLength(2)
    expect(boxes[0]!.querySelector('svg')).not.toBeNull()
    expect(boxes[1]!.textContent).toBe('kg')
    expect(w.input().classList).toContain('ps-0')
    expect(w.input().classList).toContain('pe-0')

    const bare = mount(<Input />)
    expect(bare.element.querySelectorAll(':scope > span')).toHaveLength(0)
    expect(bare.input().classList).not.toContain('ps-0')
  })

  it('clearable 在有值且未禁用时出清除钮，点击清空并发出 clear', () => {
    const onClear = vi.fn()
    const onModel = vi.fn()
    const { container, rerender } = render(
      <Input clearable value="" onValueChange={onModel} onClear={onClear} />,
    )
    expect(container.querySelector('button')).toBeNull()
    rerender(<Input clearable value="星见" onValueChange={onModel} onClear={onClear} />)
    expect(container.querySelector('button')!.getAttribute('aria-label')).toBe('清除')
    fireEvent.click(container.querySelector('button')!)
    expect(onModel).toHaveBeenLastCalledWith('')
    expect(onClear).toHaveBeenCalledTimes(1)

    const disabled = mount(<Input clearable value="星见" disabled />)
    expect(disabled.element.querySelector('button')).toBeNull()
  })

  it('loading 有 leading 时顶替其中的图标，否则挂在末尾；根带 aria-busy', () => {
    const swapped = mount(<Input loading leading={<MailIcon />} />)
    expect(swapped.element.getAttribute('aria-busy')).toBe('true')
    const boxes = swapped.element.querySelectorAll(':scope > span')
    expect(boxes).toHaveLength(1)
    expect(boxes[0]!.querySelector('[role="status"]')).not.toBeNull()

    const trailing = mount(<Input loading />)
    const tail = trailing.element.querySelectorAll(':scope > span')
    expect(tail).toHaveLength(1)
    expect(tail[0]!.querySelector('[role="status"]')).not.toBeNull()
    expect(trailing.input().classList).toContain('pe-0')
  })
})

describe('状态语义', () => {
  it('invalid 落根的 data-invalid 与 input 的 aria-invalid', () => {
    const w = mount(<Input invalid />)
    expect(w.element.getAttribute('data-invalid')).toBe('')
    expect(w.input().getAttribute('aria-invalid')).toBe('true')

    const ok = mount(<Input />)
    expect(ok.element.getAttribute('data-invalid')).toBeNull()
    expect(ok.input().getAttribute('aria-invalid')).toBeNull()
  })

  it('disabled 生效且不可输入', () => {
    const w = mount(<Input disabled />)
    expect(w.input().disabled).toBe(true)
  })

  it('无 a11y 违规', async () => {
    const w = mount(<Input clearable value="星见" aria-label="邮箱" leading={<MailIcon />} />)
    await expectNoA11yViolations(w.element)
  })
})
