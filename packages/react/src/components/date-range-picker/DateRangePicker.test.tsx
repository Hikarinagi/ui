import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { useState } from 'react'
import { DateRangePicker, type DateRangePickerProps } from './DateRangePicker'
import type { DateRangeValue } from '../../../../shared/src/lib/date'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

const range = { start: '2026-09-04', end: '2026-09-10' }

const dayOf = (date: string) =>
  document.querySelector(`[data-hn-range-calendar] [data-value="${date}"]`) as HTMLElement

function mountPicker(props: DateRangePickerProps = {}, model = false) {
  const changes = vi.fn()
  const opens = vi.fn()
  const clears = vi.fn()
  function Harness() {
    const [value, setValue] = useState<DateRangeValue | null | undefined>(props.value)
    const [open, setOpen] = useState(props.open)
    return (
      <DateRangePicker
        {...props}
        value={value}
        open={open}
        onValueChange={next => {
          changes(next)
          if (model) setValue(next)
        }}
        onOpenChange={next => {
          opens(next)
          if (model) setOpen(next)
        }}
        onClear={clears}
      />
    )
  }
  const { container } = render(<Harness />)
  return { container, changes, opens, clears }
}

describe('结构', () => {
  it('宿主是输入面，里面是嵌入的起止日期段与打开日历的按钮；attrs 落在段的组元素上', () => {
    const w = mountPicker({ value: range, className: 'w-96', 'aria-label': '活动期间' })
    const host = w.container.querySelector('[data-hn-date-range-picker]')!
    expect(host.classList).toContain('hn-field')
    expect(host.classList).toContain('w-96')
    expect(w.container.querySelector('[data-hn-date-range-field]')!.classList).not.toContain(
      'hn-field',
    )
    expect(w.container.querySelector('[role="group"]')!.getAttribute('aria-label')).toBe('活动期间')
    expect(
      Array.from(w.container.querySelectorAll('[role="spinbutton"]')).map(s =>
        s.getAttribute('aria-valuenow'),
      ),
    ).toEqual(['2026', '9', '4', '2026', '9', '10'])
    expect(
      w.container.querySelector('button[aria-label="打开日历"]')!.getAttribute('aria-expanded'),
    ).toBe('false')
  })

  it('disabled 与 invalid 落在宿主并传给段与按钮', () => {
    const w = mountPicker({ value: range, disabled: true, invalid: true })
    expect(
      w.container.querySelector('[data-hn-date-range-picker]')!.getAttribute('data-invalid'),
    ).toBe('')
    expect(
      w.container.querySelector('button[aria-label="打开日历"]')!.hasAttribute('disabled'),
    ).toBe(true)
    expect(w.container.querySelector('[role="group"]')!.getAttribute('aria-invalid')).toBe('true')
    expect(
      Array.from(w.container.querySelectorAll('[role="spinbutton"]')).every(
        s => s.getAttribute('data-disabled') === '',
      ),
    ).toBe(true)
  })
})

describe('交互', () => {
  it('点按钮打开日历，选起点后浮层保持打开，选终点后写回并关闭；v-model:open 同步', async () => {
    const w = mountPicker({ value: range }, true)
    fireEvent.click(w.container.querySelector('button[aria-label="打开日历"]')!)
    expect(w.opens.mock.calls[0]).toEqual([true])
    await vi.waitFor(() => expect(dayOf('2026-09-07')).not.toBeNull())
    expect(dayOf('2026-09-07').getAttribute('data-selected')).toBe('true')
    await act(async () => dayOf('2026-09-20').click())
    expect(w.changes.mock.calls.at(-1)).toEqual([{ start: '2026-09-20', end: null }])
    expect(w.opens).toHaveBeenCalledTimes(1)
    await act(async () => {
      dayOf('2026-09-25').dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
      dayOf('2026-09-25').dispatchEvent(new MouseEvent('mouseenter'))
    })
    await act(async () => dayOf('2026-09-25').click())
    expect(w.changes.mock.calls.at(-1)).toEqual([{ start: '2026-09-20', end: '2026-09-25' }])
    expect(w.opens.mock.calls[1]).toEqual([false])
  })

  it('清除钮清空值并发 clear，日历不打开', () => {
    const w = mountPicker({ value: range, clearable: true })
    fireEvent.click(w.container.querySelector('button[aria-label="清除"]')!)
    expect(w.changes.mock.calls[0]).toEqual([null])
    expect(w.clears).toHaveBeenCalledTimes(1)
    expect(w.opens).not.toHaveBeenCalled()
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const w = mountPicker({ value: range, clearable: true, 'aria-label': '活动期间' })
    await expectNoA11yViolations(w.container.firstElementChild!)
  })
})
