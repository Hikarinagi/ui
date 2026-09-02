import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { ref } from 'vue'
import NumberInput from './NumberInput.vue'
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
  const value = ref<number | null | undefined>(props.modelValue as number | undefined)
  const w = mount(NumberInput, {
    props: {
      ...props,
      modelValue: value.value,
      'onUpdate:modelValue': (v?: number | null) => {
        value.value = v
        w.setProps({ modelValue: v })
      },
    },
    attrs: { 'aria-label': '数量' },
    attachTo: attach(),
  })
  mounted.push(w)
  const root = w.element as HTMLElement
  const input = root.querySelector('input') as HTMLInputElement
  const [up, down] = Array.from(root.querySelectorAll('button')) as HTMLButtonElement[]
  return { root, input, up, down, value }
}

describe('number-input · 步进与键盘', () => {
  it('单击步进按 step 增减、到边界后禁用、焦点回到输入框', async () => {
    const { input, up, down, value } = mountField({ modelValue: 9, min: 0, max: 10, step: 0.5 })
    await userEvent.click(up)
    await vi.waitFor(() => expect(value.value).toBe(9.5))
    expect(document.activeElement).toBe(input)
    await userEvent.click(up)
    await vi.waitFor(() => expect(value.value).toBe(10))
    await vi.waitFor(() => expect(up.disabled).toBe(true))
    await userEvent.click(down)
    await vi.waitFor(() => expect(value.value).toBe(9.5))
    expect(up.disabled).toBe(false)
  })

  it('方向键步进，Home / End 跳到 min / max', async () => {
    const { input, value } = mountField({ modelValue: 5, min: 1, max: 9 })
    await userEvent.click(input)
    await userEvent.keyboard('{ArrowUp}{ArrowUp}')
    await vi.waitFor(() => expect(value.value).toBe(7))
    await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(() => expect(value.value).toBe(6))
    await userEvent.keyboard('{Home}')
    await vi.waitFor(() => expect(value.value).toBe(1))
    await userEvent.keyboard('{End}')
    await vi.waitFor(() => expect(value.value).toBe(9))
  })

  it('输入后按 Enter 解析并钳到范围内，非数字字符被拒', async () => {
    const { input, value } = mountField({ min: 0, max: 10 })
    await userEvent.click(input)
    await userEvent.keyboard('a')
    expect(input.value).toBe('')
    await userEvent.keyboard('99{Enter}')
    await vi.waitFor(() => expect(value.value).toBe(10))
    expect(input.value).toBe('10')
  })

  it('formatOptions 与 locale 决定显示文本', async () => {
    const { input } = mountField({
      modelValue: 1234.5,
      locale: 'de-DE',
      formatOptions: { style: 'currency', currency: 'EUR' },
    })
    expect(input.value).toBe('1.234,50\u00a0€')
  })
})

describe('number-input · 与 Input 同一副输入面', () => {
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

  it('聚焦时 accent 环落在容器上，与 Input 同一条规则', async () => {
    const reference = mount(Input, { attrs: { 'aria-label': 'input' }, attachTo: attach() })
    mounted.push(reference)
    await userEvent.click(reference.element as HTMLElement)
    await vi.waitFor(() =>
      expect(getComputedStyle(reference.element as HTMLElement).boxShadow).toContain(
        '0px 0px 0px 2px',
      ),
    )
    const focused = getComputedStyle(reference.element as HTMLElement).boxShadow

    const { root, input } = mountField()
    await userEvent.click(input)
    await vi.waitFor(() => expect(getComputedStyle(root).boxShadow).toBe(focused))
  })

  it('步进钮 hover 落薄墨，自身不改填充、容器边框不动', async () => {
    const { root, up } = mountField()
    const restBorder = getComputedStyle(root).borderColor
    await userEvent.hover(up)
    await vi.waitFor(() =>
      expect(parseFloat(getComputedStyle(up, '::after').opacity)).toBeGreaterThan(0),
    )
    expect(getComputedStyle(up).backgroundColor).toBe('rgba(0, 0, 0, 0)')
    expect(getComputedStyle(root).borderColor).toBe(restBorder)
  })
})
