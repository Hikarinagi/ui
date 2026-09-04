import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, reactive } from 'vue'
import DateRangeField from './DateRangeField.vue'
import Input from '../input/Input.vue'
import type { DateRangeValue } from '../../lib/date'
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
  host.style.cssText = 'width: 420px; padding: 40px'
  document.body.appendChild(host)
  return host
}

interface State {
  modelValue: DateRangeValue | null
  size?: 'sm' | 'md' | 'lg'
  max?: string
}

function mountRange(props: Partial<State> = {}) {
  const state = reactive<State>({ modelValue: null, ...props })
  const w = mount(
    defineComponent({
      render: () =>
        h(DateRangeField, {
          ...state,
          'aria-label': '活动期间',
          'onUpdate:modelValue': (value: DateRangeValue | null) => (state.modelValue = value),
        }),
    }),
    { attachTo: attach(), global: { stubs: { transition: false } } },
  )
  mounted.push(w)
  const host = w.find('[data-hn-date-range-field]').element as HTMLElement
  return {
    state,
    host,
    spins: () => Array.from(host.querySelectorAll('[role="spinbutton"]')) as HTMLElement[],
  }
}

describe('date-range-field · 输入', () => {
  it('从开始年段起连续输入，段满自动前进，越过分隔进入结束侧，v-model 得到起止两端', async () => {
    const { state, spins } = mountRange()
    await userEvent.click(spins()[0]!)
    await userEvent.keyboard('20260901')
    await vi.waitFor(() => expect(state.modelValue).toEqual({ start: '2026-09-01', end: null }))
    expect(document.activeElement).toBe(spins()[3])
    await userEvent.keyboard('20260930')
    await vi.waitFor(() =>
      expect(state.modelValue).toEqual({ start: '2026-09-01', end: '2026-09-30' }),
    )
  })

  it('点宿主空白处即聚焦第一个空段：开始侧填满时落到结束侧的年', async () => {
    const { host, spins } = mountRange({ modelValue: { start: '2026-09-01', end: null } })
    await userEvent.click(host, { position: { x: 4, y: Math.round(host.offsetHeight / 2) } })
    await vi.waitFor(() => expect(document.activeElement).toBe(spins()[3]))
  })
})

describe('date-range-field · 与 Input 同一副输入面', () => {
  it('任一段聚焦时宿主亮聚焦环，与聚焦的 Input 逐字节相同；三档宿主高度与 Input 逐档相等', async () => {
    const input = mount(Input, {
      attrs: { 'aria-label': '对照' },
      attachTo: attach(),
    })
    mounted.push(input)
    const inputHost = input.element as HTMLElement
    const { host, spins } = mountRange({ modelValue: { start: '2026-09-01', end: '2026-09-30' } })
    ;(inputHost.querySelector('input') as HTMLInputElement).focus()
    await vi.waitFor(() =>
      expect(getComputedStyle(inputHost).boxShadow).toContain('0px 0px 0px 2px'),
    )
    const ringed = getComputedStyle(inputHost).boxShadow
    spins()[4]!.focus()
    await vi.waitFor(() => expect(getComputedStyle(host).boxShadow).toBe(ringed))
    for (const size of ['sm', 'md', 'lg'] as const) {
      const sized = mount(Input, {
        props: { size },
        attrs: { 'aria-label': size },
        attachTo: attach(),
      })
      mounted.push(sized)
      const range = mountRange({ size, modelValue: { start: '2026-09-01', end: '2026-09-30' } })
      expect(range.host.offsetHeight).toBe((sized.element as HTMLElement).offsetHeight)
    }
  })

  it('结束早于开始时宿主带 data-invalid，聚焦环取警示色', async () => {
    const { host, spins } = mountRange({ modelValue: { start: '2026-09-30', end: '2026-09-01' } })
    expect(host.getAttribute('data-invalid')).toBe('')
    const border = getComputedStyle(host).borderColor
    spins()[0]!.focus()
    await vi.waitFor(() => expect(getComputedStyle(host).boxShadow).toContain(border))
  })
})
