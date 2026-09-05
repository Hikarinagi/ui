import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, reactive } from 'vue'
import TimeField from './TimeField.vue'
import DateField from '../date-field/DateField.vue'
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
  host.style.cssText = 'width: 240px; padding: 40px'
  document.body.appendChild(host)
  return host
}

interface State {
  modelValue: string | null
  size?: 'sm' | 'md' | 'lg'
  minuteStep?: number
}

function mountTime(props: Partial<State> = {}) {
  const state = reactive<State>({ modelValue: null, ...props })
  const w = mount(
    defineComponent({
      render: () =>
        h(TimeField, {
          ...state,
          'aria-label': '开播时间',
          'onUpdate:modelValue': (value: string | null) => (state.modelValue = value),
        }),
    }),
    { attachTo: attach(), global: { stubs: { transition: false } } },
  )
  mounted.push(w)
  const host = w.find('[data-hn-time-field]').element as HTMLElement
  return {
    state,
    host,
    spins: () => Array.from(host.querySelectorAll('[role="spinbutton"]')) as HTMLElement[],
  }
}

describe('time-field · 输入', () => {
  it('从时段起连续输入 0930，段满自动前进，v-model 得到 09:30；点宿主空白处即聚焦第一个空段', async () => {
    const { state, host, spins } = mountTime()
    await userEvent.click(host, { position: { x: 4, y: Math.round(host.offsetHeight / 2) } })
    await vi.waitFor(() => expect(document.activeElement).toBe(spins()[0]))
    await userEvent.keyboard('0930')
    await vi.waitFor(() => expect(state.modelValue).toBe('09:30'))
    expect(document.activeElement).toBe(spins()[1])
  })

  it('minuteStep 下键入的分钟吸附到步长', async () => {
    const { state, spins } = mountTime({ modelValue: '09:00', minuteStep: 15 })
    await userEvent.click(spins()[1]!)
    await userEvent.keyboard('{ArrowUp}{ArrowUp}')
    await vi.waitFor(() => expect(state.modelValue).toBe('09:30'))
  })
})

describe('time-field · 与 DateField 同一副输入面', () => {
  it('三档宿主高度与 DateField 逐档相等；任一段聚焦时宿主亮聚焦环', async () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const date = mount(DateField, {
        props: { size, modelValue: '2026-09-04' },
        attrs: { 'aria-label': size },
        attachTo: attach(),
      })
      mounted.push(date)
      const { host } = mountTime({ size, modelValue: '09:30' })
      expect(host.offsetHeight).toBe((date.element as HTMLElement).offsetHeight)
    }
    const { host, spins } = mountTime({ modelValue: '09:30' })
    const idle = getComputedStyle(host).boxShadow
    spins()[1]!.focus()
    await vi.waitFor(() => expect(getComputedStyle(host).boxShadow).not.toBe(idle))
  })
})
