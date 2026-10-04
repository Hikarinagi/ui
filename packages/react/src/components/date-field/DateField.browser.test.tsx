import { beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { useState, type ReactNode } from 'react'
import { DateField } from './DateField'
import { Input } from '../input/Input'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

function attach() {
  const host = document.createElement('div')
  host.style.cssText = 'width: 320px; padding: 40px'
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
  granularity?: 'day' | 'minute'
  clearable?: boolean
  min?: string
  max?: string
}

async function mountDate(props: Partial<State> = {}) {
  const state: State = { modelValue: null, ...props }
  function Harness() {
    const [value, setValue] = useState(state.modelValue)
    const { modelValue: _, ...rest } = state
    return (
      <DateField
        {...rest}
        value={value}
        aria-label="发布日期"
        onValueChange={next => {
          state.modelValue = next
          setValue(next)
        }}
      />
    )
  }
  const field = await mountIn(<Harness />)
  return {
    state,
    host: field,
    spins: () => Array.from(field.querySelectorAll('[role="spinbutton"]')) as HTMLElement[],
  }
}

describe('date-field · 输入', () => {
  it('从年段起连续输入 20260904，段满自动前进，v-model 得到 2026-09-04；清空一段后值为 null', async () => {
    const { state, spins } = await mountDate()
    await userEvent.click(spins()[0]!)
    await userEvent.keyboard('20260904')
    await vi.waitFor(() => expect(state.modelValue).toBe('2026-09-04'))
    expect(document.activeElement).toBe(spins()[2])
    await userEvent.keyboard('{Backspace}')
    await vi.waitFor(() => expect(state.modelValue).toBeNull())
  })

  it('点宿主空白处即聚焦第一个空段；上下方向键增减，左右方向键在段间移动', async () => {
    const { state, host, spins } = await mountDate({ modelValue: '2026-09-04' })
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
    const { state, spins } = await mountDate({
      granularity: 'minute',
      modelValue: '2026-09-04T10:30',
    })
    await userEvent.click(spins()[3]!)
    await userEvent.keyboard('0915')
    await vi.waitFor(() => expect(state.modelValue).toBe('2026-09-04T09:15'))
  })
})

describe('date-field · 与 Input 同一副输入面', () => {
  it('任一段聚焦时宿主亮聚焦环，与聚焦的 Input 逐字节相同', async () => {
    const inputHost = await mountIn(<Input aria-label="对照" />)
    const { host, spins } = await mountDate({ modelValue: '2026-09-04' })
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

  it('三档宿主高度与 Input 逐档相等', async () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const input = await mountIn(<Input size={size} aria-label={size} />)
      const { host } = await mountDate({ size, modelValue: '2026-09-04' })
      expect(host.offsetHeight).toBe(input.offsetHeight)
    }
  })

  it('超出范围的值：宿主带 data-invalid，聚焦环取警示色', async () => {
    const { host, spins } = await mountDate({ modelValue: '2026-09-04', max: '2026-09-01' })
    expect(host.getAttribute('data-invalid')).toBe('')
    const border = getComputedStyle(host).borderColor
    spins()[0]!.focus()
    await vi.waitFor(() => expect(getComputedStyle(host).boxShadow).toContain(border))
  })
})
