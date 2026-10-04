import { describe, expect, it, vi, beforeEach } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { useState } from 'react'
import { RangeCalendar } from './RangeCalendar'
import { Calendar } from '../calendar/Calendar'
import type { DateRangeValue } from '../../../../shared/src/lib/date'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

function attach() {
  const host = document.createElement('div')
  host.style.cssText = 'padding: 40px'
  document.body.appendChild(host)
  return host
}

interface State {
  modelValue: DateRangeValue | null
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  maximumDays?: number
}

async function mountRange(props: Partial<State> = {}) {
  const state: State = { modelValue: null, ...props }
  function Harness() {
    const [value, setValue] = useState<DateRangeValue | null>(state.modelValue)
    return (
      <RangeCalendar
        value={value}
        placeholder={state.placeholder}
        size={state.size}
        maximumDays={state.maximumDays}
        onValueChange={next => {
          state.modelValue = next
          setValue(next)
        }}
      />
    )
  }
  const host = attach()
  await render(<Harness />, { container: host })
  const root = host.querySelector('[data-hn-range-calendar]') as HTMLElement
  return {
    state,
    root,
    day: (date: string) =>
      root.querySelector(`[data-radix-calendar-cell-trigger][data-value="${date}"]`) as HTMLElement,
    cell: (date: string) =>
      root.querySelector(`[data-radix-calendar-cell-trigger][data-value="${date}"]`)!
        .parentElement as HTMLElement,
  }
}

const NONE = 'rgba(0, 0, 0, 0)'

describe('range-calendar · 选区', () => {
  it('点两格得到区间：两端是实心格，中间是连成一条的浅色带，带外的格没有底色', async () => {
    const { state, day, cell } = await mountRange({ placeholder: '2026-09-01' })
    await userEvent.click(day('2026-09-04'))
    await userEvent.click(day('2026-09-10'))
    await vi.waitFor(() =>
      expect(state.modelValue).toEqual({ start: '2026-09-04', end: '2026-09-10' }),
    )
    await vi.waitFor(() => {
      expect(getComputedStyle(day('2026-09-04')).backgroundColor).toMatch(/^rgb\(/)
      expect(getComputedStyle(day('2026-09-10')).backgroundColor).toMatch(/^rgb\(/)
    })
    const start = getComputedStyle(day('2026-09-04')).backgroundColor
    expect(getComputedStyle(day('2026-09-10')).backgroundColor).toBe(start)
    const band = getComputedStyle(cell('2026-09-07')).backgroundColor
    expect(band).not.toBe(NONE)
    expect(band).not.toBe(start)
    expect(getComputedStyle(day('2026-09-07')).backgroundColor).toBe(NONE)
    expect(getComputedStyle(cell('2026-09-04')).backgroundColor).toBe(band)
    expect(getComputedStyle(cell('2026-09-11')).backgroundColor).toBe(NONE)
    expect(cell('2026-09-08').getBoundingClientRect().left).toBe(
      cell('2026-09-07').getBoundingClientRect().right,
    )
    const gap =
      cell('2026-09-13').getBoundingClientRect().top -
      cell('2026-09-06').getBoundingClientRect().bottom
    expect(gap).toBeGreaterThan(0)
    expect(gap).toBeLessThan(day('2026-09-06').offsetHeight / 4)
    expect(parseFloat(getComputedStyle(cell('2026-09-08')).borderTopLeftRadius)).toBe(0)
    expect(parseFloat(getComputedStyle(cell('2026-09-08')).borderTopRightRadius)).toBe(0)
    expect(parseFloat(getComputedStyle(cell('2026-09-04')).borderTopLeftRadius)).toBeGreaterThan(0)
    expect(parseFloat(getComputedStyle(cell('2026-09-10')).borderTopRightRadius)).toBeGreaterThan(0)
    expect(parseFloat(getComputedStyle(cell('2026-09-06')).borderTopRightRadius)).toBeGreaterThan(0)
    expect(parseFloat(getComputedStyle(cell('2026-09-07')).borderTopLeftRadius)).toBeGreaterThan(0)
    await vi.waitFor(() => {
      expect(getComputedStyle(day('2026-09-07'), '::after').opacity).toBe('0')
      expect(getComputedStyle(day('2026-09-04'), '::after').opacity).toBe('0')
    })
  })

  it('选了起点后悬停到另一格，中间的格先亮出预览带', async () => {
    const { day, cell } = await mountRange({ placeholder: '2026-09-01' })
    await userEvent.click(day('2026-09-04'))
    await userEvent.hover(day('2026-09-08'))
    await vi.waitFor(() =>
      expect(getComputedStyle(cell('2026-09-06')).backgroundColor).not.toBe(NONE),
    )
    expect(getComputedStyle(cell('2026-09-09')).backgroundColor).toBe(NONE)
    await vi.waitFor(() => {
      expect(getComputedStyle(day('2026-09-06'), '::after').opacity).toBe('0')
      expect(parseFloat(getComputedStyle(day('2026-09-08'), '::after').opacity)).toBeGreaterThan(0)
    })
  })

  it('maximumDays 下预览带仍然跟着指针，超出天数的日期禁用', async () => {
    const { day, cell } = await mountRange({ placeholder: '2026-09-01', maximumDays: 7 })
    await userEvent.click(day('2026-09-08'))
    await userEvent.hover(day('2026-09-10'))
    await vi.waitFor(() =>
      expect(getComputedStyle(cell('2026-09-09')).backgroundColor).not.toBe(NONE),
    )
    expect(getComputedStyle(cell('2026-09-11')).backgroundColor).toBe(NONE)
    expect(day('2026-09-14').hasAttribute('data-disabled')).toBe(false)
    expect(day('2026-09-15').hasAttribute('data-disabled')).toBe(true)
  })
})

describe('range-calendar · 与 Calendar 同一副', () => {
  it('三档日格与 Calendar 逐档等大，标题按钮也能进入月份视图', async () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const host = attach()
      await render(<Calendar size={size} defaultValue="2026-09-04" />, { container: host })
      const reference = host.querySelector('[data-value="2026-09-04"]') as HTMLElement
      const { day } = await mountRange({
        size,
        modelValue: { start: '2026-09-04', end: '2026-09-10' },
      })
      expect(day('2026-09-04').offsetWidth).toBe(reference.offsetWidth)
      expect(day('2026-09-04').offsetHeight).toBe(reference.offsetHeight)
    }
    const { root } = await mountRange({ modelValue: { start: '2026-09-04', end: '2026-09-10' } })
    await userEvent.click(root.querySelector('button[aria-label="选择月份"]')!)
    await vi.waitFor(() =>
      expect(root.querySelector('[data-radix-month-picker-cell-trigger]')).not.toBeNull(),
    )
  })
})
