import { describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { useState, type ReactNode } from 'react'
import { NumberInput, type NumberInputProps } from './NumberInput'
import { Input } from '../input/Input'
import '../../../test/browser.css'

function attach() {
  const host = document.createElement('div')
  host.style.width = '240px'
  document.body.appendChild(host)
  return host
}

async function mountIn(ui: ReactNode) {
  const host = attach()
  await render(ui, { container: host })
  return host.firstElementChild as HTMLElement
}

async function mountField(props: NumberInputProps = {}) {
  const value: { current: number | null | undefined } = { current: props.value }
  function Harness() {
    const [model, setModel] = useState<number | null | undefined>(props.value)
    return (
      <NumberInput
        aria-label="数量"
        {...props}
        value={model}
        onValueChange={next => {
          value.current = next
          setModel(next)
        }}
      />
    )
  }
  const root = await mountIn(<Harness />)
  const input = root.querySelector('input') as HTMLInputElement
  const [up, down] = Array.from(root.querySelectorAll('button')) as HTMLButtonElement[]
  return { root, input, up: up!, down: down!, value }
}

describe('number-input · 步进与键盘', () => {
  it('单击步进按 step 增减、到边界后禁用、焦点回到输入框', async () => {
    const { input, up, down, value } = await mountField({ value: 9, min: 0, max: 10, step: 0.5 })
    await userEvent.click(up)
    await vi.waitFor(() => expect(value.current).toBe(9.5))
    expect(document.activeElement).toBe(input)
    await userEvent.click(up)
    await vi.waitFor(() => expect(value.current).toBe(10))
    await vi.waitFor(() => expect(up.disabled).toBe(true))
    await userEvent.click(down)
    await vi.waitFor(() => expect(value.current).toBe(9.5))
    expect(up.disabled).toBe(false)
  })

  it('方向键步进，Home / End 跳到 min / max', async () => {
    const { input, value } = await mountField({ value: 5, min: 1, max: 9 })
    await userEvent.click(input)
    await userEvent.keyboard('{ArrowUp}{ArrowUp}')
    await vi.waitFor(() => expect(value.current).toBe(7))
    await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(() => expect(value.current).toBe(6))
    await userEvent.keyboard('{Home}')
    await vi.waitFor(() => expect(value.current).toBe(1))
    await userEvent.keyboard('{End}')
    await vi.waitFor(() => expect(value.current).toBe(9))
  })

  it('输入后按 Enter 解析并钳到范围内，非数字字符被拒', async () => {
    const { input, value } = await mountField({ min: 0, max: 10 })
    await userEvent.click(input)
    await userEvent.keyboard('a')
    expect(input.value).toBe('')
    await userEvent.keyboard('99{Enter}')
    await vi.waitFor(() => expect(value.current).toBe(10))
    expect(input.value).toBe('10')
  })

  it('formatOptions 与 locale 决定显示文本', async () => {
    const { input } = await mountField({
      value: 1234.5,
      locale: 'de-DE',
      formatOptions: { style: 'currency', currency: 'EUR' },
    })
    expect(input.value).toBe('1.234,50 €')
  })
})

describe('number-input · 与 Input 同一副输入面', () => {
  it('三档高度与 Input 逐档相等', async () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const input = await mountIn(<Input size={size} aria-label={size} />)
      const { root } = await mountField({ size })
      expect(root.offsetHeight).toBe(input.offsetHeight)
    }
  })

  it('聚焦时 accent 环落在容器上，与 Input 同一条规则', async () => {
    const reference = await mountIn(<Input aria-label="input" />)
    await userEvent.click(reference)
    await vi.waitFor(() =>
      expect(getComputedStyle(reference).boxShadow).toContain('0px 0px 0px 2px'),
    )
    const focused = getComputedStyle(reference).boxShadow

    const { root, input } = await mountField()
    await userEvent.click(input)
    await vi.waitFor(() => expect(getComputedStyle(root).boxShadow).toBe(focused))
  })

  it('步进钮 hover 落薄墨，自身不改填充、容器边框不动', async () => {
    const { root, up } = await mountField()
    const restBorder = getComputedStyle(root).borderColor
    await userEvent.hover(up)
    await vi.waitFor(() =>
      expect(parseFloat(getComputedStyle(up, '::after').opacity)).toBeGreaterThan(0),
    )
    expect(getComputedStyle(up).backgroundColor).toBe('rgba(0, 0, 0, 0)')
    expect(getComputedStyle(root).borderColor).toBe(restBorder)
  })
})
