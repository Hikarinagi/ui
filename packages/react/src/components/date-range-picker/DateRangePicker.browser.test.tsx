import { beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { useState, type ReactNode } from 'react'
import { DateRangePicker, type DateRangePickerProps } from './DateRangePicker'
import { DatePicker } from '../date-picker/DatePicker'
import type { DateRangeValue } from '../../../../shared/src/lib/date'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

function attach() {
  const host = document.createElement('div')
  host.style.cssText = 'width: 480px; padding: 40px'
  document.body.appendChild(host)
  return host
}

async function mountIn(ui: ReactNode) {
  const host = attach()
  await render(ui, { container: host })
  return host
}

async function mountPicker(props: DateRangePickerProps = {}) {
  const state: { modelValue: DateRangeValue | null; open: boolean } = {
    modelValue: { start: '2026-09-04', end: '2026-09-10' },
    open: false,
  }
  function Harness() {
    const [value, setValue] = useState(state.modelValue)
    const [open, setOpen] = useState(state.open)
    return (
      <DateRangePicker
        value={value}
        open={open}
        {...props}
        aria-label="活动期间"
        onValueChange={next => {
          state.modelValue = next
          setValue(next)
        }}
        onOpenChange={next => {
          state.open = next
          setOpen(next)
        }}
      />
    )
  }
  const wrapper = await mountIn(<Harness />)
  const host = wrapper.querySelector('[data-hn-date-range-picker]') as HTMLElement
  return {
    state,
    host,
    toggle: host.querySelector('button[aria-label="打开日历"]') as HTMLButtonElement,
    calendar: () => document.querySelector('[data-hn-range-calendar]') as HTMLElement | null,
  }
}

describe('date-range-picker · 打开与选择', () => {
  it('点按钮打开，焦点落在区间的起点；键盘选出新区间后关闭并把焦点还给按钮；日历左缘与输入面左缘对齐', async () => {
    const { state, host, toggle, calendar } = await mountPicker()
    await userEvent.click(toggle)
    await vi.waitFor(() => expect(calendar()).not.toBeNull())
    expect(document.body.style.overflow).toBe('hidden')
    await vi.waitFor(() =>
      expect(document.activeElement).toBe(calendar()!.querySelector('[data-value="2026-09-04"]')),
    )
    await vi.waitFor(() =>
      expect(
        Math.abs(
          calendar()!.closest('[role="dialog"]')!.getBoundingClientRect().left -
            host.getBoundingClientRect().left,
        ),
      ).toBeLessThan(1),
    )
    await userEvent.keyboard('{ArrowRight}{Enter}')
    await vi.waitFor(() => expect(state.modelValue).toEqual({ start: '2026-09-05', end: null }))
    expect(calendar()).not.toBeNull()
    await userEvent.keyboard('{ArrowRight}{ArrowRight}{Enter}')
    await vi.waitFor(() =>
      expect(state.modelValue).toEqual({ start: '2026-09-05', end: '2026-09-07' }),
    )
    await vi.waitFor(() => expect(calendar()).toBeNull())
    expect(document.activeElement).toBe(toggle)
    expect(document.body.style.overflow).toBe('')
  })

  it('日历是模态浮层：打开期间点输入面即关闭；Esc 关闭并把焦点还给按钮', async () => {
    const { host, toggle, calendar } = await mountPicker()
    await userEvent.click(toggle)
    await vi.waitFor(() => expect(calendar()).not.toBeNull())
    await userEvent.click(host.querySelector('[data-hn-segment]')!, { force: true })
    await vi.waitFor(() => expect(calendar()).toBeNull())
    await userEvent.click(toggle)
    await vi.waitFor(() => expect(calendar()).not.toBeNull())
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(calendar()).toBeNull())
    expect(document.activeElement).toBe(toggle)
  })

  it('三档宿主高度与 DatePicker 逐档相等，浮层里的日历同档', async () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const single = await mountIn(<DatePicker size={size} value="2026-09-04" aria-label={size} />)
      const { host, toggle, calendar } = await mountPicker({ size })
      expect(host.offsetHeight).toBe(
        (single.querySelector('[data-hn-date-picker]') as HTMLElement).offsetHeight,
      )
      await userEvent.click(toggle)
      await vi.waitFor(() => expect(calendar()).not.toBeNull())
      const cell = calendar()!.querySelector('[data-value="2026-09-04"]') as HTMLElement
      const raw = getComputedStyle(cell).getPropertyValue(`--hn-control-h-${size}`).trim()
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
      expect(cell.offsetHeight).toBe(raw.endsWith('rem') ? parseFloat(raw) * rem : parseFloat(raw))
      await userEvent.keyboard('{Escape}')
      await vi.waitFor(() => expect(calendar()).toBeNull())
    }
  })
})
