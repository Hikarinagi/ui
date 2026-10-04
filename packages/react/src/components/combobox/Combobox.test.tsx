import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { useState, type ReactNode } from 'react'
import { Combobox, type ComboboxProps, type ComboboxValue } from './Combobox'
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
  return render(ui).container
}

const hostOf = (element: Element) => element.querySelector('[data-hn-combobox]') as HTMLElement

describe('输入面', () => {
  it('宿主是输入面容器，内部是 role=combobox 的输入框，attrs 透传到输入框，末尾带展开钮', () => {
    const host = hostOf(mount(<Combobox options={options} aria-label="类型" />))
    expect([...host.classList]).toContain('hn-field')
    const input = host.querySelector('input')!
    expect(input.getAttribute('role')).toBe('combobox')
    expect(input.getAttribute('aria-autocomplete')).toBe('list')
    expect(input.getAttribute('aria-label')).toBe('类型')
    expect(input.getAttribute('placeholder')).toBe('输入或选择')
    const toggle = host.querySelector('button')!
    expect(toggle.getAttribute('aria-label')).toBe('展开选项')
    expect(toggle.getAttribute('tabindex')).toBe('-1')
  })

  it('有值时输入框显示选项文字；placeholder 可覆盖', async () => {
    const input = hostOf(
      mount(<Combobox options={options} value="ln" placeholder="找作品" />),
    ).querySelector('input')!
    await vi.waitFor(() => expect(input.value).toBe('轻小说'))
    expect(input.getAttribute('placeholder')).toBe('找作品')
  })

  it('clearable 且有值时出清除钮，点击清空值与搜索词并发出 clear；默认没有', async () => {
    let model: ComboboxValue = 'gal'
    let cleared = 0
    function Harness(props: Partial<ComboboxProps>) {
      const [value, setValue] = useState<ComboboxValue>(model)
      return (
        <Combobox
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
    const clear = hostOf(mount(<Harness />)).querySelector('button[aria-label="清除"]')!
    expect(clear).not.toBeNull()
    await act(async () => {
      fireEvent.click(clear)
    })
    expect(model).toBeNull()
    expect(cleared).toBe(1)

    expect(
      hostOf(mount(<Combobox options={options} value="gal" />)).querySelector(
        'button[aria-label="清除"]',
      ),
    ).toBeNull()
  })

  it('双形态与档位类与 Input 同源；invalid 与 disabled 落到宿主与输入框', () => {
    expect([...hostOf(mount(<Combobox options={options} />)).classList]).toContain(
      '[--hn-field-shadow:var(--hn-shadow-sm)]',
    )
    expect([
      ...hostOf(mount(<Combobox options={options} variant="secondary" />)).classList,
    ]).toContain('border-transparent')
    expect(hostOf(mount(<Combobox options={options} size="lg" />)).className).toContain(
      'control-h-lg',
    )
    const invalid = hostOf(mount(<Combobox options={options} invalid />))
    expect(invalid.getAttribute('data-invalid')).toBe('')
    expect(invalid.querySelector('input')!.getAttribute('aria-invalid')).toBe('true')
    const disabled = hostOf(mount(<Combobox options={options} disabled />))
    expect(disabled.querySelector('input')!.disabled).toBe(true)
  })

  it('无 a11y 违规', async () => {
    const element = mount(<Combobox options={options} value="gal" aria-label="类型" />)
    await expectNoA11yViolations(element.firstElementChild!)
  })
})
