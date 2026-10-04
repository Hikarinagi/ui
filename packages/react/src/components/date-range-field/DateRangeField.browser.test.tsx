import { beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { useState, type ReactNode } from 'react'
import { DateRangeField } from './DateRangeField'
import { Input } from '../input/Input'
import type { DateRangeValue } from '../../../../shared/src/lib/date'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

function attach() {
  const host = document.createElement('div')
  host.style.cssText = 'width: 420px; padding: 40px'
  document.body.appendChild(host)
  return host
}

async function mountIn(ui: ReactNode) {
  const host = attach()
  await render(ui, { container: host })
  return host.firstElementChild as HTMLElement
}

interface State {
  modelValue: DateRangeValue | null
  size?: 'sm' | 'md' | 'lg'
  max?: string
}

async function mountRange(props: Partial<State> = {}) {
  const state: State = { modelValue: null, ...props }
  function Harness() {
    const [value, setValue] = useState(state.modelValue)
    const { modelValue: _, ...rest } = state
    return (
      <DateRangeField
        {...rest}
        value={value}
        aria-label="活动期间"
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

describe('date-range-field · 输入', () => {
  it('从开始年段起连续输入，段满自动前进，越过分隔进入结束侧，v-model 得到起止两端', async () => {
    const { state, spins } = await mountRange()
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
    const { host, spins } = await mountRange({ modelValue: { start: '2026-09-01', end: null } })
    await userEvent.click(host, { position: { x: 4, y: Math.round(host.offsetHeight / 2) } })
    await vi.waitFor(() => expect(document.activeElement).toBe(spins()[3]))
  })
})

describe('date-range-field · 与 Input 同一副输入面', () => {
  it('任一段聚焦时宿主亮聚焦环，与聚焦的 Input 逐字节相同；三档宿主高度与 Input 逐档相等', async () => {
    const inputHost = await mountIn(<Input aria-label="对照" />)
    const { host, spins } = await mountRange({
      modelValue: { start: '2026-09-01', end: '2026-09-30' },
    })
    ;(inputHost.querySelector('input') as HTMLInputElement).focus()
    await vi.waitFor(() =>
      expect(getComputedStyle(inputHost).boxShadow).toContain('0px 0px 0px 2px'),
    )
    const ringed = getComputedStyle(inputHost).boxShadow
    spins()[4]!.focus()
    await vi.waitFor(() => expect(getComputedStyle(host).boxShadow).toBe(ringed))
    for (const size of ['sm', 'md', 'lg'] as const) {
      const sized = await mountIn(<Input size={size} aria-label={size} />)
      const range = await mountRange({
        size,
        modelValue: { start: '2026-09-01', end: '2026-09-30' },
      })
      expect(range.host.offsetHeight).toBe(sized.offsetHeight)
    }
  })

  it('结束早于开始时宿主带 data-invalid，聚焦环取警示色', async () => {
    const { host, spins } = await mountRange({
      modelValue: { start: '2026-09-30', end: '2026-09-01' },
    })
    expect(host.getAttribute('data-invalid')).toBe('')
    const border = getComputedStyle(host).borderColor
    spins()[0]!.focus()
    await vi.waitFor(() => expect(getComputedStyle(host).boxShadow).toContain(border))
  })
})
