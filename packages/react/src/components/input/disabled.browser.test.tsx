import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import type { ComponentType, ReactNode } from 'react'
import { Input } from './Input'
import { InputGroup } from '../input-group/InputGroup'
import { Button } from '../button/Button'
import { SearchInput } from '../search-input/SearchInput'
import { PasswordInput } from '../password-input/PasswordInput'
import { NumberInput } from '../number-input/NumberInput'
import { Textarea } from '../textarea/Textarea'
import { FormField } from '../form-field/FormField'
import '../../../test/browser.css'

type Props = Record<string, unknown>
type AnyComponent = ComponentType<Props>

const fields: Array<[string, AnyComponent, Props]> = [
  ['Input', Input as AnyComponent, {}],
  ['SearchInput', SearchInput as AnyComponent, {}],
  ['PasswordInput', PasswordInput as AnyComponent, {}],
  ['NumberInput', NumberInput as AnyComponent, { value: 5, min: 0, max: 10 }],
  ['Textarea', Textarea as AnyComponent, {}],
]

async function draw(component: AnyComponent, props: Props = {}, children?: ReactNode) {
  const host = document.createElement('div')
  host.style.cssText = 'width:360px;padding:24px'
  document.body.appendChild(host)
  const Component = component
  let current = props
  const ui = (next: Props) => (
    <Component aria-label="控件" {...next}>
      {children}
    </Component>
  )
  const screen = await render(ui(current), { container: host })
  return {
    root: host.querySelector<HTMLElement>('.hn-field')!,
    setProps: async (patch: Props) => {
      current = { ...current, ...patch }
      await screen.rerender(ui(current))
    },
  }
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('禁用外观只取决于当前控件', () => {
  it.each([0, 10])('NumberInput 到达边界 %s 时仍可操作，不变淡', async modelValue => {
    const onValueChange = vi.fn()
    const { root } = await draw(NumberInput as AnyComponent, {
      value: modelValue,
      min: 0,
      max: 10,
      onValueChange,
    })
    const input = root.querySelector('input')!
    expect(input.disabled).toBe(false)
    expect(root.querySelectorAll('button:disabled')).toHaveLength(1)
    expect(getComputedStyle(root).opacity).toBe('1')
    expect(getComputedStyle(root).cursor).toBe('text')
    await userEvent.click(root.querySelector<HTMLButtonElement>('button:not(:disabled)')!)
    expect(onValueChange.mock.calls[0]).toEqual([modelValue === 0 ? 1 : 9])
  })

  it('NumberInput readonly 与关闭步进按钮时保持相同外观', async () => {
    const w = await draw(NumberInput as AnyComponent, { value: 5, readonly: true })
    expect(w.root.querySelector('input')!.readOnly).toBe(true)
    expect(w.root.querySelectorAll('button:disabled')).toHaveLength(2)
    expect(getComputedStyle(w.root).opacity).toBe('1')
    expect(getComputedStyle(w.root).cursor).toBe('text')
    await w.setProps({ controls: false })
    expect(getComputedStyle(w.root).opacity).toBe('1')
  })

  it.each([false, true])('局部按钮禁用不取消 hover，invalid=%s', async invalid => {
    const { root } = await draw(NumberInput as AnyComponent, { value: 0, min: 0, invalid })
    const resting = getComputedStyle(root).backgroundColor
    await userEvent.hover(root.querySelector('input')!)
    await vi.waitFor(() => expect(getComputedStyle(root).backgroundColor).not.toBe(resting))
  })

  it.each([['Input', Input as AnyComponent]] as const)(
    '%s 的深层插槽按钮禁用不影响输入外壳',
    async (_name, component) => {
      const { root } = await draw(component, {
        trailing: (
          <span>
            <Button disabled>操作</Button>
          </span>
        ),
      })
      expect(root.querySelector('button:disabled')).not.toBeNull()
      expect(getComputedStyle(root).opacity).toBe('1')
      expect(getComputedStyle(root).cursor).toBe('text')
    },
  )

  it('InputGroup 中禁用提交按钮不影响仍可编辑的输入框', async () => {
    const { root } = await draw(
      InputGroup as AnyComponent,
      {},
      <>
        <Input />
        <Button disabled>提交</Button>
      </>,
    )
    expect(getComputedStyle(root).opacity).toBe('1')
    expect(getComputedStyle(root).cursor).toBe('text')
    const input = root.querySelector('input')!
    await userEvent.fill(input, '仍可编辑')
    expect(input.value).toBe('仍可编辑')
  })

  it.each([
    ['Input', Input as AnyComponent, {}, '[data-hn-input]'],
    ['NumberInput', NumberInput as AnyComponent, {}, '[data-hn-number-input]'],
  ] as const)(
    'InputGroup 局部禁用 %s 只淡化该输入区',
    async (_name, component, props, selector) => {
      const Local = component
      const { root } = await draw(
        InputGroup as AnyComponent,
        {},
        <>
          <Local {...props} disabled />
          <Input />
        </>,
      )
      const local = root.querySelector<HTMLElement>(selector)!
      const inputs = root.querySelectorAll('input:not([type=hidden])')
      expect((inputs[inputs.length - 1] as HTMLInputElement).disabled).toBe(false)
      expect(getComputedStyle(root).opacity).toBe('1')
      expect(getComputedStyle(local).opacity).toBe('0.5')
    },
  )

  it.each(fields)(
    '%s 自身 disabled 可动态切换，禁用时无 hover',
    async (_name, component, props) => {
      const w = await draw(component, { ...props, disabled: true })
      const root = w.root
      expect(getComputedStyle(root).opacity).toBe('0.5')
      expect(getComputedStyle(root).cursor).toBe('not-allowed')
      const resting = getComputedStyle(root).backgroundColor
      await userEvent.hover(root)
      await new Promise(resolve => setTimeout(resolve, 250))
      expect(getComputedStyle(root).backgroundColor).toBe(resting)
      await w.setProps({ disabled: false })
      await vi.waitFor(() => expect(getComputedStyle(root).opacity).toBe('1'))
    },
  )

  it.each(fields)(
    '%s 从 FormField 继承禁用，不把表单包装层当作淡化层',
    async (_name, component, props) => {
      const Control = component
      const { root } = await draw(
        FormField as AnyComponent,
        { disabled: true, label: '字段' },
        <Control {...props} />,
      )
      expect(getComputedStyle(root).opacity).toBe('0.5')
      expect(getComputedStyle(root).cursor).toBe('not-allowed')
    },
  )

  it.each([false, true])('整组禁用只淡化一次，来自 FormField=%s', async inherited => {
    const children = (
      <>
        <Input />
        <NumberInput />
      </>
    )
    const { root } = inherited
      ? await draw(
          FormField as AnyComponent,
          { disabled: true },
          <InputGroup>{children}</InputGroup>,
        )
      : await draw(InputGroup as AnyComponent, { disabled: true }, children)
    expect(root.matches('[data-hn-input-group]')).toBe(true)
    expect(getComputedStyle(root).opacity).toBe('0.5')
    for (const field of root.querySelectorAll(
      '[data-hn-input], [data-hn-number-input], [data-hn-select], [data-hn-date-picker], [data-hn-date-field]',
    )) {
      expect(getComputedStyle(field).opacity).toBe('1')
    }
    for (const input of root.querySelectorAll('input')) expect(input.disabled).toBe(true)
  })
})
