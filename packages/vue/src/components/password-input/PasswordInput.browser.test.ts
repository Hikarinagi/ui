import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import PasswordInput from './PasswordInput.vue'
import Input from '../input/Input.vue'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

function attach() {
  const host = document.createElement('div')
  host.style.width = '240px'
  document.body.appendChild(host)
  return host
}

function mountField(props: Record<string, unknown> = {}) {
  const w = mount(PasswordInput, {
    props,
    attrs: { 'aria-label': '密码' },
    attachTo: attach(),
    global: { stubs: { transition: false } },
  })
  mounted.push(w)
  const root = w.element as HTMLElement
  return {
    root,
    input: root.querySelector('input') as HTMLInputElement,
    toggle: root.querySelector('button') as HTMLButtonElement,
  }
}

describe('password-input · 与 Input 同一副输入面', () => {
  it('三档高度与 Input 逐档相等', () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const input = mount(Input, {
        props: { size },
        attrs: { 'aria-label': size },
        attachTo: attach(),
      })
      mounted.push(input)
      const { root } = mountField({ size })
      expect(root.offsetHeight).toBe((input.element as HTMLElement).offsetHeight)
    }
  })

  it('输入区聚焦时环落在容器上；键盘聚焦到切换钮时容器不亮环', async () => {
    const reference = mount(Input, { attrs: { 'aria-label': 'input' }, attachTo: attach() })
    mounted.push(reference)
    const rest = getComputedStyle(reference.element as HTMLElement).boxShadow
    await userEvent.click(reference.element as HTMLElement)
    await vi.waitFor(() =>
      expect(getComputedStyle(reference.element as HTMLElement).boxShadow).toContain(
        '0px 0px 0px 2px',
      ),
    )
    const focused = getComputedStyle(reference.element as HTMLElement).boxShadow

    const { root, input, toggle } = mountField()
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
    const { input, toggle } = mountField({ modelValue: 'hina' })
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
