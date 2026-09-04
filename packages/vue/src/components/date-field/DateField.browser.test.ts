import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, reactive } from 'vue'
import DateField from './DateField.vue'
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
  host.style.cssText = 'width: 320px; padding: 40px'
  document.body.appendChild(host)
  return host
}

interface State {
  modelValue: string | null
  size?: 'sm' | 'md' | 'lg'
  granularity?: 'day' | 'minute'
  clearable?: boolean
  min?: string
  max?: string
}

function mountDate(props: Partial<State> = {}) {
  const state = reactive<State>({ modelValue: null, ...props })
  const w = mount(
    defineComponent({
      render: () =>
        h(DateField, {
          ...state,
          'aria-label': '发布日期',
          'onUpdate:modelValue': (value: string | null) => (state.modelValue = value),
        }),
    }),
    { attachTo: attach(), global: { stubs: { transition: false } } },
  )
  mounted.push(w)
  const host = w.find('[data-hn-date-field]').element as HTMLElement
  return {
    state,
    host,
    spins: () => Array.from(host.querySelectorAll('[role="spinbutton"]')) as HTMLElement[],
  }
}

describe('date-field · 输入', () => {
  it('从年段起连续输入 20260904，段满自动前进，v-model 得到 2026-09-04；清空一段后值为 null', async () => {
    const { state, spins } = mountDate()
    await userEvent.click(spins()[0]!)
    await userEvent.keyboard('20260904')
    await vi.waitFor(() => expect(state.modelValue).toBe('2026-09-04'))
    expect(document.activeElement).toBe(spins()[2])
    await userEvent.keyboard('{Backspace}')
    await vi.waitFor(() => expect(state.modelValue).toBeNull())
  })

  it('点宿主空白处即聚焦第一个空段；上下方向键增减，左右方向键在段间移动', async () => {
    const { state, host, spins } = mountDate({ modelValue: '2026-09-04' })
    await userEvent.click(host, { position: { x: 4, y: Math.round(host.offsetHeight / 2) } })
    await vi.waitFor(() => expect(document.activeElement).toBe(spins()[0]))
    await userEvent.keyboard('{ArrowUp}')
    await vi.waitFor(() => expect(state.modelValue).toBe('2027-09-04'))
    await userEvent.keyboard('{ArrowRight}')
    await vi.waitFor(() => expect(document.activeElement).toBe(spins()[1]))
    await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(() => expect(state.modelValue).toBe('2027-08-04'))
  })

  it('到分的精度：输入时与分，值到分', async () => {
    const { state, spins } = mountDate({ granularity: 'minute', modelValue: '2026-09-04T10:30' })
    await userEvent.click(spins()[3]!)
    await userEvent.keyboard('0915')
    await vi.waitFor(() => expect(state.modelValue).toBe('2026-09-04T09:15'))
  })
})

describe('date-field · 与 Input 同一副输入面', () => {
  it('任一段聚焦时宿主亮聚焦环，与聚焦的 Input 逐字节相同', async () => {
    const input = mount(Input, {
      attrs: { 'aria-label': '对照' },
      attachTo: attach(),
    })
    mounted.push(input)
    const inputHost = input.element as HTMLElement
    const { host, spins } = mountDate({ modelValue: '2026-09-04' })
    const idle = getComputedStyle(host).boxShadow
    expect(idle).toBe(getComputedStyle(inputHost).boxShadow)
    ;(inputHost.querySelector('input') as HTMLInputElement).focus()
    await vi.waitFor(() =>
      expect(getComputedStyle(inputHost).boxShadow).toContain('0px 0px 0px 2px'),
    )
    const ringed = getComputedStyle(inputHost).boxShadow
    spins()[1]!.focus()
    await vi.waitFor(() => expect(getComputedStyle(host).boxShadow).toBe(ringed))
  })

  it('三档宿主高度与 Input 逐档相等', () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const input = mount(Input, {
        props: { size },
        attrs: { 'aria-label': size },
        attachTo: attach(),
      })
      mounted.push(input)
      const { host } = mountDate({ size, modelValue: '2026-09-04' })
      expect(host.offsetHeight).toBe((input.element as HTMLElement).offsetHeight)
    }
  })

  it('超出范围的值：宿主带 data-invalid，聚焦环取警示色', async () => {
    const { host, spins } = mountDate({ modelValue: '2026-09-04', max: '2026-09-01' })
    expect(host.getAttribute('data-invalid')).toBe('')
    const border = getComputedStyle(host).borderColor
    spins()[0]!.focus()
    await vi.waitFor(() => expect(getComputedStyle(host).boxShadow).toContain(border))
  })
})
