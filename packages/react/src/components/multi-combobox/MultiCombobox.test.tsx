import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { useState, type ReactNode } from 'react'
import { MultiCombobox, type MultiComboboxProps } from './MultiCombobox'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

const options = [
  { value: 1, label: 'Key' },
  { value: 2, label: 'Type-Moon' },
  { value: 3, label: 'Nitroplus' },
]

function mount(ui: ReactNode) {
  return render(ui)
}

const hostOf = (element: Element) =>
  element.querySelector('[data-hn-multi-combobox]') as HTMLElement
const inputOf = (element: Element) =>
  element.querySelector('input[role="combobox"]') as HTMLInputElement
const chipsOf = (element: Element) =>
  [...element.querySelectorAll('[data-hn-chip]')].map(chip => chip.textContent?.trim())

describe('结构', () => {
  it('宿主是输入面，class 落宿主、attrs 落文本输入；已选项以 Chip 排在输入区前面；无值时才显示占位', () => {
    const { container } = mount(
      <MultiCombobox options={options} value={[1, 2]} className="w-72" aria-label="制作公司" />,
    )
    expect([...hostOf(container).classList]).toContain('hn-field')
    expect([...hostOf(container).classList]).toContain('w-72')
    expect(inputOf(container).getAttribute('aria-label')).toBe('制作公司')
    expect(inputOf(container).getAttribute('placeholder')).toBeNull()
    expect(chipsOf(container)).toEqual(['Key', 'Type-Moon'])
    expect(container.querySelector('button[aria-label="展开选项"]')).not.toBeNull()

    const empty = mount(<MultiCombobox options={options} />).container
    expect(inputOf(empty).getAttribute('placeholder')).toBe('输入或选择')
    expect(chipsOf(empty)).toEqual([])
  })

  it('组件记住见过的选项名称：结果列表换掉后已选 Chip 仍有名称，没见过的值显示值本身', () => {
    const { container, rerender } = mount(<MultiCombobox options={options} value={[1, 3]} />)
    rerender(<MultiCombobox options={[{ value: 9, label: '别的结果' }]} value={[1, 3]} />)
    expect(chipsOf(container)).toEqual(['Key', 'Nitroplus'])
    rerender(<MultiCombobox options={[{ value: 9, label: '别的结果' }]} value={[1, 3, 42]} />)
    expect(chipsOf(container)).toEqual(['Key', 'Nitroplus', '42'])
  })

  it('disabled 与 invalid：输入区禁用、Chip 的移除钮禁用、清除钮不渲染；invalid 落在宿主与输入区', () => {
    const { container } = mount(
      <MultiCombobox options={options} value={[1]} disabled clearable invalid />,
    )
    expect(inputOf(container).hasAttribute('disabled')).toBe(true)
    expect(inputOf(container).getAttribute('aria-invalid')).toBe('true')
    expect(hostOf(container).getAttribute('data-invalid')).toBe('')
    expect(container.querySelector('[data-hn-chip] button')!.hasAttribute('disabled')).toBe(true)
    expect(container.querySelector('[data-hn-multi-combobox-clear]')).toBeNull()
  })
})

describe('交互', () => {
  it('点 Chip 的移除钮移除该项；空输入时退格移除最后一项；清除钮清空并发 clear', async () => {
    const emitted: Array<Array<string | number>> = []
    let cleared = 0
    function Harness(props: Partial<MultiComboboxProps>) {
      const [value, setValue] = useState<Array<string | number>>([1, 2, 3])
      return (
        <MultiCombobox
          options={options}
          clearable
          {...props}
          value={value}
          onValueChange={next => {
            emitted.push(next)
            setValue(next)
          }}
          onClear={() => cleared++}
        />
      )
    }
    const { container } = mount(<Harness />)
    await act(async () => {
      fireEvent.click(container.querySelector('[data-hn-chip] button')!)
    })
    expect(emitted[0]).toEqual([2, 3])

    await act(async () => {
      fireEvent.keyDown(inputOf(container), { key: 'Backspace' })
    })
    expect(emitted[1]).toEqual([2])

    await act(async () => {
      fireEvent.click(container.querySelector('[data-hn-multi-combobox-clear] button')!)
    })
    expect(emitted[2]).toEqual([])
    expect(cleared).toBe(1)
  })

  it('输入区有文字时退格不动已选项', async () => {
    const emitted: Array<Array<string | number>> = []
    const { container } = mount(
      <MultiCombobox
        options={options}
        value={[1]}
        search="ni"
        onValueChange={next => emitted.push(next)}
      />,
    )
    inputOf(container).value = 'ni'
    await act(async () => {
      fireEvent.keyDown(inputOf(container), { key: 'Backspace' })
    })
    expect(emitted).toEqual([])
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const { container } = mount(
      <MultiCombobox options={options} value={[1, 2]} aria-label="制作公司" />,
    )
    await expectNoA11yViolations(container.firstElementChild!)
  })
})

describe('回填资料', () => {
  it('按 value 区分数字与字符串，支持异步资料且不改变外部选中值', () => {
    const emitted: unknown[] = []
    const { container, rerender, unmount } = mount(
      <MultiCombobox options={[]} value={[0, '0']} onValueChange={next => emitted.push(next)} />,
    )
    expect(chipsOf(container)).toEqual(['0', '0'])
    const selectedOptions = [
      { value: 0, label: 'Number' },
      { value: '0', label: 'String' },
      { value: 9, label: 'Unselected' },
    ]
    rerender(
      <MultiCombobox
        options={[]}
        value={[0, '0']}
        selectedOptions={selectedOptions}
        onValueChange={next => emitted.push(next)}
      />,
    )
    expect(chipsOf(container)).toEqual(['Number', 'String'])
    expect(emitted).toEqual([])
    rerender(
      <MultiCombobox
        options={[]}
        value={['0']}
        selectedOptions={selectedOptions}
        onValueChange={next => emitted.push(next)}
      />,
    )
    expect(chipsOf(container)).toEqual(['String'])
    unmount()
    const remounted = mount(
      <MultiCombobox options={[]} value={[0]} selectedOptions={[{ value: 0, label: 'Number' }]} />,
    )
    expect(chipsOf(remounted.container)).toEqual(['Number'])
    remounted.unmount()
  })
})
