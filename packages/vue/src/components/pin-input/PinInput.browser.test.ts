import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, reactive } from 'vue'
import PinInput from './PinInput.vue'
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
  host.style.cssText = 'width: 360px; padding: 40px'
  document.body.appendChild(host)
  return host
}

interface State {
  modelValue?: string
  length?: number
  size?: 'sm' | 'md' | 'lg'
  type?: 'text' | 'number'
}

function mountPin(props: Partial<State> = {}) {
  const state = reactive<State>({ modelValue: '', ...props })
  const host = mount(
    defineComponent({
      render: () =>
        h(PinInput, {
          ...state,
          'aria-label': '验证码',
          'onUpdate:modelValue': (value: string) => (state.modelValue = value),
        }),
    }),
    { attachTo: attach() },
  )
  mounted.push(host)
  const root = host.find('[data-hn-pin-input]').element as HTMLElement
  return {
    state,
    root,
    cells: () =>
      Array.from(root.querySelectorAll('input:not([tabindex="-1"])')) as HTMLInputElement[],
  }
}

describe('pin-input · 输入', () => {
  it('输入一位后焦点自动进入下一格；填满后值完整；退格回到上一格并清掉', async () => {
    const { state, cells } = mountPin({ length: 4 })
    cells()[0]!.focus()
    await userEvent.keyboard('1')
    await vi.waitFor(() => expect(document.activeElement).toBe(cells()[1]))
    await userEvent.keyboard('234')
    await vi.waitFor(() => expect(state.modelValue).toBe('1234'))
    await userEvent.keyboard('{Backspace}')
    await vi.waitFor(() => expect(state.modelValue).toBe('123'))
    await userEvent.keyboard('{Backspace}')
    await vi.waitFor(() => expect(document.activeElement).toBe(cells()[2]))
    await vi.waitFor(() => expect(state.modelValue).toBe('12'))
  })

  it('粘贴整段验证码时按位分配', async () => {
    const { state, cells } = mountPin({ length: 6 })
    cells()[0]!.focus()
    const data = new DataTransfer()
    data.setData('text', '493215')
    cells()[0]!.dispatchEvent(new ClipboardEvent('paste', { clipboardData: data, bubbles: true }))
    await vi.waitFor(() => expect(state.modelValue).toBe('493215'))
    expect(cells().map(c => c.value)).toEqual(['4', '9', '3', '2', '1', '5'])
  })

  it('数字模式拒绝非数字字符', async () => {
    const { state, cells } = mountPin({ length: 4, type: 'number' })
    cells()[0]!.focus()
    await userEvent.keyboard('a7')
    await vi.waitFor(() => expect(state.modelValue).toBe('7'))
  })
})

describe('pin-input · 与输入面同一副尺寸', () => {
  it('三档格子的高度与 Input 逐档相等，格子是正方形', () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const input = mount(Input, {
        props: { size },
        attrs: { 'aria-label': size },
        attachTo: attach(),
      })
      mounted.push(input)
      const { cells } = mountPin({ size })
      expect(cells()[0]!.offsetHeight).toBe((input.element as HTMLElement).offsetHeight)
      expect(cells()[0]!.offsetWidth).toBe(cells()[0]!.offsetHeight)
    }
  })

  it('键盘聚焦时环长在格子自身上', async () => {
    const { cells } = mountPin({ length: 4 })
    const rest = getComputedStyle(cells()[0]!).boxShadow
    await userEvent.keyboard('{Tab}')
    await vi.waitFor(() => expect(document.activeElement).toBe(cells()[0]))
    await vi.waitFor(() =>
      expect(getComputedStyle(cells()[0]!).boxShadow).toBe(
        rest.replace('0px 0px 0px 0px', '0px 0px 0px 2px'),
      ),
    )
  })
})
