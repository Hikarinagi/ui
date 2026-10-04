import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { useState, type ReactNode } from 'react'
import { RadioGroup } from './RadioGroup'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

const options = [
  { value: 'wish', label: '想看' },
  { value: 'doing', label: '在看', description: '正在追' },
  { value: 'done', label: '看过', disabled: true },
]

function mount(ui: ReactNode) {
  const element = render(ui).container.firstElementChild as HTMLElement
  return {
    element,
    classes: () => [...element.classList],
    findAll: (selector: string) => [...element.querySelectorAll<HTMLElement>(selector)],
  }
}

const emitted = (fn: Mock) => (fn.mock.calls.length ? fn.mock.calls : undefined)

describe('结构', () => {
  it('根是 role=radiogroup，attrs 与 class 落在根上；每项是 label 包着 role=radio 的按钮', () => {
    const w = mount(<RadioGroup options={options} className="w-64" aria-label="状态" />)
    expect(w.element.getAttribute('role')).toBe('radiogroup')
    expect(w.element.getAttribute('data-hn-radio-group')).toBe('')
    expect(w.element.getAttribute('aria-label')).toBe('状态')
    expect(w.classes()).toContain('w-64')
    expect(w.classes()).toContain('flex-col')
    const items = w.findAll('[data-hn-radio]')
    expect(items.map(i => i.tagName)).toEqual(['LABEL', 'LABEL', 'LABEL'])
    expect(items.every(i => i.getAttribute('data-hn-state-group') === '')).toBe(true)
    expect(items.map(i => i.textContent)).toEqual(['想看', '在看正在追', '看过'])
    const radios = w.findAll('[role="radio"]')
    expect(radios).toHaveLength(3)
    expect(radios[0]!.tagName).toBe('BUTTON')
    expect([...radios[0]!.classList]).toContain('rounded-full')
    expect(radios[2]!.getAttribute('disabled')).not.toBeNull()
    expect(items[2]!.getAttribute('data-disabled')).toBe('')
  })

  it('已选项带 aria-checked、data-state 与圆点；其余没有圆点', () => {
    const w = mount(<RadioGroup options={options} value="doing" />)
    const radios = w.findAll('[role="radio"]')
    expect(radios.map(r => r.getAttribute('aria-checked'))).toEqual(['false', 'true', 'false'])
    expect(radios[1]!.getAttribute('data-state')).toBe('checked')
    expect(radios[1]!.querySelector('span')).not.toBeNull()
    expect(radios[0]!.querySelector('span')).toBeNull()
  })

  it('horizontal 横排；size 下发到每项；disabled 整组禁用；invalid 落到每个圆', () => {
    const horizontal = mount(<RadioGroup options={options} orientation="horizontal" />)
    expect(horizontal.classes()).toContain('flex-row')
    const sized = mount(<RadioGroup options={options} size="lg" />)
    expect(sized.findAll('[data-hn-radio]').every(i => i.classList.contains('text-md'))).toBe(true)
    const disabled = mount(<RadioGroup options={options} disabled />)
    expect(disabled.element.getAttribute('data-disabled')).toBe('')
    expect(disabled.findAll('[role="radio"]').every(r => r.getAttribute('disabled') !== null)).toBe(
      true,
    )
    expect(
      disabled.findAll('[data-hn-radio]').every(i => i.getAttribute('data-disabled') === ''),
    ).toBe(true)
    const invalid = mount(<RadioGroup options={options} invalid />)
    expect(
      invalid.findAll('[role="radio"]').every(r => r.getAttribute('data-invalid') === ''),
    ).toBe(true)
    expect(
      invalid.findAll('[role="radio"]').every(r => r.getAttribute('aria-invalid') === 'true'),
    ).toBe(true)
  })

  it('option 插槽定制每一项的文字', () => {
    const w = mount(
      <RadioGroup options={options} renderOption={({ option }) => `[${option.label}]`} />,
    )
    expect(w.findAll('[data-hn-radio]')[0]!.textContent).toBe('[想看]')
  })
})

describe('交互', () => {
  it('点选写回该项的值；禁用项不响应', () => {
    const onModel = vi.fn()
    function Harness() {
      const [value, setValue] = useState<string | number | null | undefined>('wish')
      return (
        <RadioGroup
          options={options}
          value={value}
          onValueChange={next => {
            onModel(next)
            setValue(next)
          }}
        />
      )
    }
    const w = mount(<Harness />)
    const radios = () => w.findAll('[role="radio"]')
    fireEvent.click(radios()[1]!)
    expect(emitted(onModel)?.[0]).toEqual(['doing'])
    fireEvent.click(radios()[2]!)
    expect(emitted(onModel)).toHaveLength(1)
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const w = mount(<RadioGroup options={options} value="wish" aria-label="状态" />)
    await expectNoA11yViolations(w.element)
  })
})
