import { beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { useState, type ReactNode } from 'react'
import { DateTimePicker, type DateTimePickerProps } from './DateTimePicker'
import { DatePicker } from '../date-picker/DatePicker'
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
  return host
}

async function mountPicker(props: DateTimePickerProps = {}) {
  const state: { modelValue: string | null; open: boolean } = {
    modelValue: '2026-09-04T20:30',
    open: false,
  }
  function Harness() {
    const [value, setValue] = useState(state.modelValue)
    const [open, setOpen] = useState(state.open)
    return (
      <DateTimePicker
        value={value}
        open={open}
        {...props}
        aria-label="发布时间"
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
  const host = wrapper.querySelector('[data-hn-date-time-picker]') as HTMLElement
  return {
    state,
    host,
    toggle: host.querySelector('button[aria-label="打开日历"]') as HTMLButtonElement,
    calendar: () => document.querySelector('[data-hn-calendar]') as HTMLElement | null,
    time: () =>
      document.querySelector('[role="dialog"] [data-hn-time-field]') as HTMLElement | null,
  }
}

describe('date-time-picker · 打开与选择', () => {
  it('点按钮打开，焦点落在选中的日；选一天后浮层仍开着；在时间段里键入即写回；确定关闭并把焦点还给按钮', async () => {
    const { state, host, toggle, calendar, time } = await mountPicker()
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
    await vi.waitFor(() => expect(state.modelValue).toBe('2026-09-05T20:30'))
    expect(calendar()).not.toBeNull()
    const hour = time()!.querySelector('[role="spinbutton"]') as HTMLElement
    await userEvent.click(hour)
    await userEvent.keyboard('0915')
    await vi.waitFor(() => expect(state.modelValue).toBe('2026-09-05T09:15'))
    const done = Array.from(document.querySelectorAll('[role="dialog"] button')).find(
      b => b.textContent?.trim() === '确定',
    ) as HTMLElement
    await userEvent.click(done)
    await vi.waitFor(() => expect(calendar()).toBeNull())
    expect(document.activeElement).toBe(toggle)
    expect(document.body.style.overflow).toBe('')
  })

  it('三档宿主高度与 DatePicker 逐档相等，浮层里的时间段与日历同档', async () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const single = await mountIn(<DatePicker size={size} value="2026-09-04" aria-label={size} />)
      const { host, toggle, calendar, time } = await mountPicker({ size })
      expect(host.offsetHeight).toBe(
        (single.querySelector('[data-hn-date-picker]') as HTMLElement).offsetHeight,
      )
      await userEvent.click(toggle)
      await vi.waitFor(() => expect(calendar()).not.toBeNull())
      const cell = calendar()!.querySelector('[data-value="2026-09-04"]') as HTMLElement
      expect(time()!.offsetHeight).toBe(cell.offsetHeight)
      await userEvent.keyboard('{Escape}')
      await vi.waitFor(() => expect(calendar()).toBeNull())
    }
  })
})
