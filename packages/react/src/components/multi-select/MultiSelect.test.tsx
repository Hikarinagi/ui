import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { useState, type ReactNode } from 'react'
import { MultiSelect, type MultiSelectProps } from './MultiSelect'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: '轻小说' },
  { value: 'manga', label: '漫画' },
  { value: 'anime', label: '动画' },
]

function mount(ui: ReactNode) {
  return render(ui).container
}

const triggerOf = (element: Element) =>
  element.querySelector('[data-hn-multi-select]') as HTMLElement

describe('触发器', () => {
  it('触发器是可聚焦的 div 宿主（内部要放按钮），role=combobox，无值时显示占位', () => {
    const trigger = triggerOf(mount(<MultiSelect options={options} aria-label="类型" />))
    expect(trigger.tagName).toBe('DIV')
    expect(trigger.getAttribute('role')).toBe('combobox')
    expect(trigger.getAttribute('tabindex')).toBe('0')
    expect(trigger.getAttribute('aria-label')).toBe('类型')
    expect([...trigger.classList]).toContain('hn-field')
    expect(trigger.textContent).toBe('请选择')
    expect(trigger.getAttribute('data-placeholder')).toBe('')
    expect(trigger.querySelector('button')).toBeNull()
  })

  it('已选项以 Chip 显示，超过 maxVisible 折成 +N；每个 Chip 可移除，清除钮清空并发出 clear', () => {
    let model: Array<string | number> = ['gal', 'ln', 'manga']
    let cleared = 0
    function Harness(props: Partial<MultiSelectProps>) {
      const [value, setValue] = useState(model)
      return (
        <MultiSelect
          options={options}
          clearable
          {...props}
          value={value}
          onValueChange={next => {
            model = next
            setValue(next)
          }}
          onClear={() => cleared++}
        />
      )
    }
    const trigger = triggerOf(mount(<Harness />))
    const chips = [...trigger.querySelectorAll('[data-hn-chip]')]
    expect(chips.map(c => c.textContent)).toEqual(['Galgame', '轻小说', '+1'])
    expect(trigger.getAttribute('data-placeholder')).toBeNull()

    fireEvent.click(chips[0]!.querySelector('button')!)
    expect(model).toEqual(['ln', 'manga'])

    const clear = trigger.querySelector('button[aria-label="清除"]')!
    expect(clear).not.toBeNull()
    fireEvent.click(clear)
    expect(model).toEqual([])
    expect(cleared).toBe(1)
  })

  it('maxVisible 可调；默认没有整体清除钮，Chip 各有移除钮', () => {
    const trigger = triggerOf(
      mount(<MultiSelect options={options} value={['gal', 'ln', 'manga']} maxVisible={3} />),
    )
    expect(trigger.querySelectorAll('[data-hn-chip]')).toHaveLength(3)
    expect(trigger.querySelectorAll('[data-hn-chip] button')).toHaveLength(3)
    expect(trigger.querySelector('button[aria-label="清除"]')).toBeNull()
  })

  it('invalid 与 disabled：禁用后退出 Tab 序列、带 aria-disabled，清除钮不渲染，Chip 的移除钮也禁用', () => {
    const invalid = triggerOf(mount(<MultiSelect options={options} invalid />))
    expect(invalid.getAttribute('data-invalid')).toBe('')
    expect(invalid.getAttribute('aria-invalid')).toBe('true')
    const disabled = triggerOf(mount(<MultiSelect options={options} disabled value={['gal']} />))
    expect(disabled.getAttribute('tabindex')).toBe('-1')
    expect(disabled.getAttribute('aria-disabled')).toBe('true')
    expect(disabled.querySelector('button[aria-label="清除"]')).toBeNull()
    const changes: unknown[] = []
    const chips = mount(
      <MultiSelect
        options={options}
        disabled
        clearable
        value={['gal', 'ln']}
        onValueChange={value => changes.push(value)}
      />,
    )
    const removes = [...chips.querySelectorAll('[data-hn-chip] button')]
    expect(removes.length).toBeGreaterThan(0)
    expect(removes.every(b => b.getAttribute('disabled') !== null)).toBe(true)
    expect(
      [...chips.querySelectorAll('[data-hn-chip]')].every(
        c => c.getAttribute('data-disabled') === '',
      ),
    ).toBe(true)
    fireEvent.click(removes[0]!)
    expect(changes).toEqual([])
    expect(chips.querySelector('[data-hn-multi-select-clear]')).toBeNull()
  })

  it('无 a11y 违规', async () => {
    const w = mount(<MultiSelect options={options} value={['gal', 'ln']} aria-label="类型" />)
    await expectNoA11yViolations(w.firstElementChild!)
  })
})
