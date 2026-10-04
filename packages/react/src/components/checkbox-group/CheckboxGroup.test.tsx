import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { useState, type ReactNode } from 'react'
import { CheckboxGroup } from './CheckboxGroup'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: '轻小说', description: '文库本' },
  { value: 'manga', label: '漫画', disabled: true },
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
  it('根是 role=group，attrs 与 class 落在根上；每个选项一枚 Checkbox，文字与描述照选项渲染', () => {
    const w = mount(<CheckboxGroup options={options} className="w-64" aria-label="类型" />)
    expect(w.element.getAttribute('role')).toBe('group')
    expect(w.element.getAttribute('data-hn-checkbox-group')).toBe('')
    expect(w.element.getAttribute('aria-label')).toBe('类型')
    expect(w.element.getAttribute('data-orientation')).toBe('vertical')
    expect(w.classes()).toContain('w-64')
    expect(w.classes()).toContain('flex-col')
    const items = w.findAll('[data-hn-checkbox]')
    expect(items.map(i => i.textContent)).toEqual(['Galgame', '轻小说文库本', '漫画'])
    expect(w.findAll('[role="checkbox"]')).toHaveLength(3)
    expect(w.findAll('[role="checkbox"]')[2]!.getAttribute('disabled')).not.toBeNull()
    expect(items[2]!.getAttribute('data-disabled')).toBe('')
  })

  it('已选项由数组决定：aria-checked、data-state 与勾', () => {
    const w = mount(<CheckboxGroup options={options} value={['ln']} />)
    const boxes = w.findAll('[role="checkbox"]')
    expect(boxes.map(b => b.getAttribute('aria-checked'))).toEqual(['false', 'true', 'false'])
    expect(boxes[1]!.getAttribute('data-state')).toBe('checked')
    expect(boxes[1]!.querySelector('svg.lucide-check')).not.toBeNull()
    expect(boxes[0]!.querySelector('svg')).toBeNull()
  })

  it('horizontal 横排；size 下发到每枚；disabled 整组禁用；invalid 落到每个盒', () => {
    const horizontal = mount(<CheckboxGroup options={options} orientation="horizontal" />)
    expect(horizontal.element.getAttribute('data-orientation')).toBe('horizontal')
    expect(horizontal.classes()).toContain('flex-row')
    const sized = mount(<CheckboxGroup options={options} size="sm" />)
    expect(sized.findAll('[data-hn-checkbox]').every(i => i.classList.contains('text-sm'))).toBe(
      true,
    )
    const disabled = mount(<CheckboxGroup options={options} disabled />)
    expect(disabled.element.getAttribute('data-disabled')).toBe('')
    expect(
      disabled.findAll('[role="checkbox"]').every(b => b.getAttribute('disabled') !== null),
    ).toBe(true)
    expect(
      disabled.findAll('[data-hn-checkbox]').every(i => i.getAttribute('data-disabled') === ''),
    ).toBe(true)
    const invalid = mount(<CheckboxGroup options={options} invalid />)
    expect(
      invalid.findAll('[role="checkbox"]').every(b => b.getAttribute('data-invalid') === ''),
    ).toBe(true)
  })

  it('option 插槽定制每一项的文字', () => {
    const w = mount(
      <CheckboxGroup options={options} renderOption={({ option }) => `[${option.label}]`} />,
    )
    expect(w.findAll('[data-hn-checkbox]')[0]!.textContent).toBe('[Galgame]')
  })
})

describe('交互', () => {
  it('点选加入数组，再点移除；禁用项不响应', () => {
    const onModel = vi.fn()
    function Harness() {
      const [value, setValue] = useState<Array<string | number>>(['gal'])
      return (
        <CheckboxGroup
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
    const boxes = () => w.findAll('[role="checkbox"]')
    fireEvent.click(boxes()[1]!)
    expect(emitted(onModel)?.[0]).toEqual([['gal', 'ln']])
    fireEvent.click(boxes()[0]!)
    expect(emitted(onModel)?.[1]).toEqual([['ln']])
    fireEvent.click(boxes()[2]!)
    expect(emitted(onModel)).toHaveLength(2)
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const w = mount(<CheckboxGroup options={options} value={['gal']} aria-label="类型" />)
    await expectNoA11yViolations(w.element)
  })
})
