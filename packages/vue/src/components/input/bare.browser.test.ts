import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h, type Component } from 'vue'
import Input from './Input.vue'
import Textarea from '../textarea/Textarea.vue'
import SearchInput from '../search-input/SearchInput.vue'
import PasswordInput from '../password-input/PasswordInput.vue'
import NumberInput from '../number-input/NumberInput.vue'
import InputGroup from '../input-group/InputGroup.vue'
import InputGroupAddon from '../input-group/InputGroupAddon.vue'
import FormField from '../form-field/FormField.vue'
import '../../../test/browser.css'

const mounted: VueWrapper[] = []
const fields: Array<[string, Component, Record<string, unknown>]> = [
  ['Input', Input, { clearable: true, modelValue: 'hina' }],
  ['Textarea', Textarea, { modelValue: 'hina' }],
  ['SearchInput', SearchInput, { modelValue: 'hina' }],
  ['PasswordInput', PasswordInput, { modelValue: 'hina' }],
  ['NumberInput', NumberInput, { modelValue: 5, min: 0, max: 10 }],
]

function render(
  component: Component,
  props: Record<string, unknown> = {},
  slots: Record<string, () => unknown> = {},
) {
  const host = document.createElement('div')
  host.style.cssText = 'width:360px;padding:24px'
  document.body.appendChild(host)
  const w = mount(component, { props, slots, attrs: { 'aria-label': '控件' }, attachTo: host })
  mounted.push(w)
  return { w, root: w.element as HTMLElement }
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
  mounted.forEach(w => w.unmount())
  mounted.length = 0
  document.body.innerHTML = ''
  delete document.body.dataset.density
  document.body.removeAttribute('dir')
})

describe('bare 输入外观与交互', () => {
  it.each(fields)('%s 在 hover、聚焦、错误与禁用时保持透明无框', async (_, component, props) => {
    const { w, root } = render(component, { ...props, variant: 'bare' })
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
    const { root } = render(
      FormField,
      { label: '内容', description: '说明', error: '请输入有效内容' },
      { default: () => h(component, { ...props, variant: 'bare' }) },
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
    ['Input', Input],
    ['SearchInput', SearchInput],
    ['PasswordInput', PasswordInput],
  ] as const)('%s 的附属按钮仍有 hover 与键盘焦点反馈并可操作', async (_, component) => {
    const { root } = render(component, {
      variant: 'bare',
      modelValue: 'hina',
      clearable: component !== PasswordInput,
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
      if (component === PasswordInput) expect(field.type).toBe('text')
      else expect(field.value).toBe('')
    })
  })

  it('NumberInput 去掉分隔线后仍能通过步进按钮和键盘调整', async () => {
    const { w, root } = render(NumberInput, { variant: 'bare', defaultValue: 5 })
    const field = root.querySelector('input')!
    const buttons = root.querySelectorAll('button')
    expect(getComputedStyle(buttons[0]!.parentElement!).borderInlineStartWidth).toBe('0px')
    expect(getComputedStyle(buttons[1]!).borderTopWidth).toBe('0px')
    await userEvent.click(buttons[0]!)
    expect(field.value).toBe('6')
    await userEvent.click(field)
    await userEvent.keyboard('{ArrowDown}')
    expect(field.value).toBe('5')
    expect(w.emitted('update:modelValue')).toEqual([[6], [5]])
    expectBare(root)
  })

  it.each(['ltr', 'rtl'])('InputGroup 在 %s 下隐藏分隔线，并把形态传给数字步进器', async dir => {
    document.body.dir = dir
    const { w, root } = render(
      InputGroup,
      { variant: 'bare' },
      {
        default: () => [
          h(InputGroupAddon, () => '@'),
          h(Input, { 'aria-label': '文本' }),
          h(NumberInput, { defaultValue: 5, 'aria-label': '数字' }),
        ],
      },
    )
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
        const normal = render(Input, { size })
        const bare = render(Input, { variant: 'bare', size })
        const area = render(Textarea, { variant: 'bare', size, autosize: { minRows: 1 } })
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
    const { w, root } = render(Textarea, { autosize: true, rows: 1, modelValue: '一\n二\n三' })
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
