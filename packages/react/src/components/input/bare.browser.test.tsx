import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import type { ComponentType, ReactNode } from 'react'
import { Input } from './Input'
import { Textarea } from '../textarea/Textarea'
import { SearchInput } from '../search-input/SearchInput'
import { PasswordInput } from '../password-input/PasswordInput'
import { NumberInput } from '../number-input/NumberInput'
import { InputGroup } from '../input-group/InputGroup'
import { InputGroupAddon } from '../input-group/InputGroupAddon'
import { FormField } from '../form-field/FormField'
import '../../../test/browser.css'

type Props = Record<string, unknown>
type AnyComponent = ComponentType<Props>

const fields: Array<[string, AnyComponent, Props]> = [
  ['Input', Input as AnyComponent, { clearable: true, defaultValue: 'hina' }],
  ['Textarea', Textarea as AnyComponent, { defaultValue: 'hina' }],
  ['SearchInput', SearchInput as AnyComponent, { defaultValue: 'hina' }],
  ['PasswordInput', PasswordInput as AnyComponent, { defaultValue: 'hina' }],
  ['NumberInput', NumberInput as AnyComponent, { value: 5, min: 0, max: 10 }],
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
    root: host.firstElementChild as HTMLElement,
    setProps: async (patch: Props) => {
      current = { ...current, ...patch }
      await screen.rerender(ui(current))
    },
  }
}

function expectBare(root: HTMLElement) {
  const style = getComputedStyle(root)
  expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)')
  expect(style.borderTopWidth).toBe('0px')
  expect(style.borderRightWidth).toBe('0px')
  expect(style.borderBottomWidth).toBe('0px')
  expect(style.borderLeftWidth).toBe('0px')
  if (style.boxShadow !== 'none') {
    for (const shadow of style.boxShadow.split(/,\s*(?![^()]*\))/)) {
      expect(shadow).toBe('rgba(0, 0, 0, 0) 0px 0px 0px 0px')
    }
  }
  expect(style.outlineStyle).toBe('none')
}

afterEach(() => {
  document.body.innerHTML = ''
  delete document.body.dataset.density
  document.body.removeAttribute('dir')
})

describe('bare 输入外观与交互', () => {
  it.each(fields)('%s 在 hover、聚焦、错误与禁用时保持透明无框', async (_, component, props) => {
    const w = await draw(component, { ...props, variant: 'bare' })
    const root = w.root
    const field = root.querySelector<HTMLInputElement | HTMLTextAreaElement>('input,textarea')!
    expectBare(root)
    await userEvent.hover(field)
    expectBare(root)
    await userEvent.click(field)
    expect(document.activeElement).toBe(field)
    expectBare(root)
    await userEvent.keyboard('{ArrowRight}')
    expectBare(root)

    await w.setProps({ invalid: true })
    expect(field.getAttribute('aria-invalid')).toBe('true')
    expectBare(root)
    field.blur()
    await userEvent.hover(field)
    expectBare(root)

    await w.setProps({ disabled: true })
    expect(field.disabled).toBe(true)
    expect(getComputedStyle(root).opacity).toBe('0.5')
    expect(getComputedStyle(root).cursor).toBe('not-allowed')
    expectBare(root)
  })

  it.each(fields)('%s 保留 FormField 的错误信息、标签与说明关联', async (_, component, props) => {
    const Control = component
    const { root } = await draw(
      FormField as AnyComponent,
      { label: '内容', description: '说明', error: '请输入有效内容' },
      <Control {...props} variant="bare" />,
    )
    const field = root.querySelector<HTMLInputElement | HTMLTextAreaElement>('input,textarea')!
    expect(root.querySelector('label')!.htmlFor).toBe(field.id)
    expect(field.getAttribute('aria-invalid')).toBe('true')
    const descriptions = field.getAttribute('aria-describedby')!.split(' ')
    expect(descriptions.map(id => document.getElementById(id)?.textContent)).toEqual([
      '说明',
      '请输入有效内容',
    ])
    expect(getComputedStyle(root.querySelector('[aria-live]')!).color).not.toBe(
      getComputedStyle(field).color,
    )
    await userEvent.click(root.querySelector('label')!)
    expect(document.activeElement).toBe(field)
  })

  it.each([
    ['Input', Input as AnyComponent],
    ['SearchInput', SearchInput as AnyComponent],
    ['PasswordInput', PasswordInput as AnyComponent],
  ] as const)('%s 的附属按钮仍有 hover 与键盘焦点反馈并可操作', async (_, component) => {
    const { root } = await draw(component, {
      variant: 'bare',
      defaultValue: 'hina',
      ...(component === (PasswordInput as AnyComponent) ? {} : { clearable: true }),
    })
    const field = root.querySelector('input')!
    const button = root.querySelector('button')!
    await userEvent.hover(button)
    await vi.waitFor(() =>
      expect(parseFloat(getComputedStyle(button, '::after').opacity)).toBeGreaterThan(0),
    )
    expectBare(root)
    await userEvent.click(field)
    await userEvent.tab()
    expect(document.activeElement).toBe(button)
    expect(getComputedStyle(button).outlineStyle).toBe('solid')
    expect(parseFloat(getComputedStyle(button).outlineWidth)).toBeGreaterThan(0)
    expectBare(root)
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() => {
      if (component === (PasswordInput as AnyComponent)) expect(field.type).toBe('text')
      else expect(field.value).toBe('')
    })
  })

  it('NumberInput 去掉分隔线后仍能通过步进按钮和键盘调整', async () => {
    const onValueChange = vi.fn()
    const { root } = await draw(NumberInput as AnyComponent, {
      variant: 'bare',
      defaultValue: 5,
      onValueChange,
    })
    const field = root.querySelector('input')!
    const buttons = root.querySelectorAll('button')
    expect(getComputedStyle(buttons[0]!.parentElement!).borderInlineStartWidth).toBe('0px')
    expect(getComputedStyle(buttons[1]!).borderTopWidth).toBe('0px')
    await userEvent.click(buttons[0]!)
    expect(field.value).toBe('6')
    await userEvent.click(field)
    await userEvent.keyboard('{ArrowDown}')
    expect(field.value).toBe('5')
    await vi.waitFor(() => expect(onValueChange.mock.calls).toEqual([[6], [5]]))
    expectBare(root)
  })

  it.each(['ltr', 'rtl'])('InputGroup 在 %s 下隐藏分隔线，并把形态传给数字步进器', async dir => {
    document.body.dir = dir
    const w = await draw(
      InputGroup as AnyComponent,
      { variant: 'bare' },
      <>
        <InputGroupAddon>@</InputGroupAddon>
        <Input aria-label="文本" />
        <NumberInput defaultValue={5} aria-label="数字" />
      </>,
    )
    const root = w.root
    const field = root.querySelector('input')!
    const number = root.querySelector('[data-hn-number-input]')!
    const buttons = number.querySelectorAll('button')
    const checkDividers = (width: string) => {
      for (const child of Array.from(root.children).slice(1)) {
        expect(getComputedStyle(child).borderInlineStartWidth).toBe(width)
      }
      expect(getComputedStyle(buttons[0]!.parentElement!).borderInlineStartWidth).toBe(width)
      expect(getComputedStyle(buttons[1]!).borderTopWidth).toBe(width)
    }
    expectBare(root)
    checkDividers('0px')
    await userEvent.click(
      root.querySelector('[data-hn-input-group-addon]') ?? root.firstElementChild!,
    )
    expect(document.activeElement).toBe(field)
    expectBare(root)
    await w.setProps({ invalid: true, disabled: true })
    expect(Array.from(root.querySelectorAll('input')).every(i => i.disabled)).toBe(true)
    expect(
      Array.from(root.querySelectorAll('input')).every(
        i => i.getAttribute('aria-invalid') === 'true',
      ),
    ).toBe(true)
    expectBare(root)
    checkDividers('0px')

    await w.setProps({ variant: 'primary', disabled: false, invalid: false })
    expect(getComputedStyle(root).borderTopWidth).toBe('1px')
    checkDividers('1px')
    await userEvent.click(field)
    await vi.waitFor(() => expect(getComputedStyle(root).boxShadow).toContain('0px 0px 0px 2px'))
    await w.setProps({ variant: 'bare' })
    expectBare(root)
    checkDividers('0px')
  })

  it('bare 保留尺寸、密度与横向内边距，Textarea 单行自动高度与 Input 一致', async () => {
    for (const density of ['comfortable', 'compact']) {
      document.body.dataset.density = density
      for (const size of ['sm', 'md', 'lg']) {
        const normal = await draw(Input as AnyComponent, { size })
        const bare = await draw(Input as AnyComponent, { variant: 'bare', size })
        const area = await draw(Textarea as AnyComponent, {
          variant: 'bare',
          size,
          autosize: { minRows: 1 },
        })
        const input = bare.root.querySelector('input')!
        const field = area.root.querySelector('textarea')!
        await vi.waitFor(() => expect(field.offsetHeight).toBe(bare.root.offsetHeight))
        expect(area.root.offsetHeight).toBe(bare.root.offsetHeight)
        expect(normal.root.offsetHeight).toBe(bare.root.offsetHeight)
        expect(getComputedStyle(input).paddingInlineStart).toBe(
          getComputedStyle(normal.root.querySelector('input')!).paddingInlineStart,
        )
        expect(getComputedStyle(field).paddingInlineStart).toBe(
          getComputedStyle(input).paddingInlineStart,
        )
      }
    }
  })

  it('Textarea 在聚焦时切换形态会重新计算高度，保留内容与光标', async () => {
    const w = await draw(Textarea as AnyComponent, {
      autosize: true,
      rows: 1,
      defaultValue: '一\n二\n三',
    })
    const root = w.root
    const field = root.querySelector('textarea')!
    await userEvent.click(field)
    field.setSelectionRange(2, 2)
    const height = root.offsetHeight
    const contentHeight = field.offsetHeight
    await w.setProps({ variant: 'bare' })
    await vi.waitFor(() => expect(field.offsetHeight).toBe(contentHeight + 2))
    expect(root.offsetHeight).toBe(height)
    expect(field.value).toBe('一\n二\n三')
    expect(field.selectionStart).toBe(2)
    expect(document.activeElement).toBe(field)
    expectBare(root)
    await w.setProps({ variant: 'secondary' })
    await vi.waitFor(() => expect(field.offsetHeight).toBe(contentHeight))
    expect(root.offsetHeight).toBe(height)
    expect(document.activeElement).toBe(field)
    await vi.waitFor(() => expect(getComputedStyle(root).boxShadow).toContain('0px 0px 0px 2px'))
  })
})
