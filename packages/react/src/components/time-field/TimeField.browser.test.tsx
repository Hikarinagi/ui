import { beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { useState, type ReactNode } from 'react'
import { TimeField } from './TimeField'
import { DateField } from '../date-field/DateField'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

function attach() {
  const host = document.createElement('div')
  host.style.cssText = 'width: 240px; padding: 40px'
  document.body.appendChild(host)
  return host
}

async function mountIn(ui: ReactNode) {
  const host = attach()
  await render(ui, { container: host })
  return host.firstElementChild as HTMLElement
}

interface State {
  modelValue: string | null
  size?: 'sm' | 'md' | 'lg'
  minuteStep?: number
}

async function mountTime(props: Partial<State> = {}) {
  const state: State = { modelValue: null, ...props }
  function Harness() {
    const [value, setValue] = useState(state.modelValue)
    const { modelValue: _, ...rest } = state
    return (
      <TimeField
        {...rest}
        value={value}
        aria-label="开播时间"
        onValueChange={next => {
          state.modelValue = next
          setValue(next)
        }}
      />
    )
  }
  const host = await mountIn(<Harness />)
  return {
    state,
    host,
    spins: () => Array.from(host.querySelectorAll('[role="spinbutton"]')) as HTMLElement[],
  }
}

describe('time-field · 输入', () => {
  it('从时段起连续输入 0930，段满自动前进，v-model 得到 09:30；点宿主空白处即聚焦第一个空段', async () => {
    const { state, host, spins } = await mountTime()
    await userEvent.click(host, { position: { x: 4, y: Math.round(host.offsetHeight / 2) } })
    await vi.waitFor(() => expect(document.activeElement).toBe(spins()[0]))
    await userEvent.keyboard('0930')
    await vi.waitFor(() => expect(state.modelValue).toBe('09:30'))
    expect(document.activeElement).toBe(spins()[1])
  })

  it('minuteStep 下键入的分钟吸附到步长', async () => {
    const { state, spins } = await mountTime({ modelValue: '09:00', minuteStep: 15 })
    await userEvent.click(spins()[1]!)
    await userEvent.keyboard('{ArrowUp}{ArrowUp}')
    await vi.waitFor(() => expect(state.modelValue).toBe('09:30'))
  })
})

describe('time-field · 与 DateField 同一副输入面', () => {
  it('三档宿主高度与 DateField 逐档相等；任一段聚焦时宿主亮聚焦环', async () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const date = await mountIn(<DateField size={size} value="2026-09-04" aria-label={size} />)
      const { host } = await mountTime({ size, modelValue: '09:30' })
      expect(host.offsetHeight).toBe(date.offsetHeight)
    }
    const { host, spins } = await mountTime({ modelValue: '09:30' })
    const idle = getComputedStyle(host).boxShadow
    spins()[1]!.focus()
    await vi.waitFor(() => expect(getComputedStyle(host).boxShadow).not.toBe(idle))
  })
})
