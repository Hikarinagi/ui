import { describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import type { ReactNode } from 'react'
import { PasswordInput, type PasswordInputProps } from './PasswordInput'
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

async function mountField(props: PasswordInputProps = {}) {
  const root = await mountIn(<PasswordInput aria-label="密码" {...props} />)
  return {
    root,
    input: root.querySelector('input') as HTMLInputElement,
    toggle: root.querySelector('button') as HTMLButtonElement,
  }
}

describe('password-input · 与 Input 同一副输入面', () => {
  it('三档高度与 Input 逐档相等', async () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const input = await mountIn(<Input size={size} aria-label={size} />)
      const { root } = await mountField({ size })
      expect(root.offsetHeight).toBe(input.offsetHeight)
    }
  })

  it('输入区聚焦时环落在容器上；键盘聚焦到切换钮时容器不亮环', async () => {
    const reference = await mountIn(<Input aria-label="input" />)
    const rest = getComputedStyle(reference).boxShadow
    await userEvent.click(reference)
    await vi.waitFor(() =>
      expect(getComputedStyle(reference).boxShadow).toContain('0px 0px 0px 2px'),
    )
    const focused = getComputedStyle(reference).boxShadow

    const { root, input, toggle } = await mountField()
    await userEvent.click(input)
    await vi.waitFor(() => expect(getComputedStyle(root).boxShadow).toBe(focused))

    await userEvent.keyboard('{Tab}')
    expect(document.activeElement).toBe(toggle)
    await vi.waitFor(() => expect(getComputedStyle(root).boxShadow).toBe(rest))
    expect(getComputedStyle(toggle).outlineStyle).toBe('solid')
  })
})

describe('password-input · 切换', () => {
  it('点击切换钮不抢输入区焦点，只改显示不改值', async () => {
    const { input, toggle } = await mountField({ defaultValue: 'hina' })
    await userEvent.click(input)
    await userEvent.click(toggle)
    expect(document.activeElement).toBe(input)
    expect(input.type).toBe('text')
    expect(input.value).toBe('hina')
    await userEvent.click(toggle)
    expect(input.type).toBe('password')
    expect(document.activeElement).toBe(input)
  })
})
