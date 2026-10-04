import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { act, cleanup, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Select, type SelectProps } from './Select'
import { flattenOptions, isOptionGroup } from './types'
import { signal } from '../../../test/signal'
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
  return render(ui).container.firstElementChild as HTMLElement
}

const triggerOf = (element: Element) =>
  element.querySelector('[data-hn-select-trigger]') as HTMLButtonElement

describe('触发器', () => {
  it('触发器就是输入面宿主，role=combobox，attrs 透传到触发器', () => {
    const w = triggerOf(mount(<Select options={options} aria-label="类型" />))
    expect(w.getAttribute('data-hn-select-trigger')).toBe('')
    expect(w.getAttribute('role')).toBe('combobox')
    expect(w.getAttribute('aria-label')).toBe('类型')
    expect(w.parentElement!.classList.contains('hn-field')).toBe(true)
    expect([...w.classList]).toContain('group/hn-disclosure')
    expect(w.parentElement!.className).toContain('control-h-md')
  })

  it('无值时显示占位并标 data-placeholder，默认占位来自语言包；有值时显示选项文字', async () => {
    const props = signal<Partial<SelectProps>>({})
    function Harness() {
      return <Select options={options} {...props.use()} />
    }
    const w = mount(<Harness />)
    expect(triggerOf(w).textContent).toBe('请选择')
    expect(triggerOf(w).getAttribute('data-placeholder')).toBe('')
    await act(() => {
      props.value = { placeholder: '选择类型' }
    })
    expect(triggerOf(w).textContent).toBe('选择类型')
    await act(() => {
      props.value = { placeholder: '选择类型', value: 'ln' }
    })
    expect(triggerOf(w).textContent).toBe('轻小说')
    expect(triggerOf(w).getAttribute('data-placeholder')).toBeNull()
  })

  it('value 插槽定制触发器里的内容', () => {
    const w = mount(
      <Select
        options={options}
        value="gal"
        renderValue={({ option }) => `已选：${option.label}`}
      />,
    )
    expect(triggerOf(w).textContent).toBe('已选：Galgame')
  })

  it('双形态与档位类与 Input 同源', () => {
    const host = (ui: ReactNode) => [...mount(ui).classList]
    expect(host(<Select options={options} />)).toContain('[--hn-field-shadow:var(--hn-shadow-sm)]')
    expect(host(<Select options={options} variant="secondary" />)).toContain('border-transparent')
    expect(host(<Select options={options} size="lg" />).join(' ')).toContain('control-h-lg')
  })

  it('invalid 落 data-invalid 与 aria-invalid；disabled 禁用触发器', () => {
    const invalid = triggerOf(mount(<Select options={options} invalid />))
    expect(invalid.parentElement!.hasAttribute('data-invalid')).toBe(true)
    expect(invalid.getAttribute('aria-invalid')).toBe('true')
    const disabled = triggerOf(mount(<Select options={options} disabled />))
    expect(disabled.disabled).toBe(true)
  })

  it('无 a11y 违规', async () => {
    const w = mount(<Select options={options} value="gal" aria-label="类型" />)
    await expectNoA11yViolations(w)
  })
})

describe('选项数据', () => {
  it('分组与平铺混排时能拉平，分组判定看 options 字段', () => {
    const items = [
      { value: 'a', label: 'A' },
      { label: '组', options: [{ value: 'b', label: 'B' }] },
    ]
    expect(isOptionGroup(items[1]!)).toBe(true)
    expect(flattenOptions(items).map(o => o.value)).toEqual(['a', 'b'])
  })
})
