import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { useState } from 'react'
import { DateTimePicker, type DateTimePickerProps } from './DateTimePicker'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

const dayOf = (date: string) =>
  document.querySelector(`[data-hn-calendar] [data-value="${date}"]`) as HTMLElement
const popoverSpins = () =>
  Array.from(
    document.querySelectorAll('[data-hn-date-time-picker-time] [role="spinbutton"]'),
  ) as HTMLElement[]

function mountPicker(modelValue: string | null, extra: DateTimePickerProps = {}) {
  const changes = vi.fn()
  const opens = vi.fn()
  const clears = vi.fn()
  function Harness() {
    const [value, setValue] = useState<string | null>(modelValue)
    const [open, setOpen] = useState<boolean | undefined>(undefined)
    return (
      <DateTimePicker
        aria-label="发布时间"
        {...extra}
        value={value}
        open={open}
        onValueChange={next => {
          changes(next)
          setValue(next)
        }}
        onOpenChange={next => {
          opens(next)
          setOpen(next)
        }}
        onClear={clears}
      />
    )
  }
  const screen = render(<Harness />)
  return { ...screen, changes, opens, clears }
}

describe('结构', () => {
  it('宿主是输入面，里面是到分的日期段与打开按钮；attrs 落在段的组元素上', () => {
    const w = mountPicker('2026-09-04T20:30', { className: 'w-80' })
    const host = w.container.querySelector('[data-hn-date-time-picker]')!
    expect(host.classList).toContain('hn-field')
    expect(host.classList).toContain('w-80')
    expect(w.container.querySelector('[data-hn-date-field]')!.classList).not.toContain('hn-field')
    expect(w.container.querySelector('[role="group"]')!.getAttribute('aria-label')).toBe('发布时间')
    expect(
      Array.from(w.container.querySelectorAll('[role="spinbutton"]')).map(s =>
        s.getAttribute('aria-valuenow'),
      ),
    ).toEqual(['2026', '9', '4', '20', '30'])
    expect(
      w.container.querySelector('button[aria-label="打开日历"]')!.getAttribute('aria-expanded'),
    ).toBe('false')
  })

  it('granularity 为 second 时段与值都到秒', () => {
    const w = mountPicker('2026-09-04T20:30:15', { granularity: 'second' })
    expect(w.container.querySelectorAll('[role="spinbutton"]')).toHaveLength(6)
  })
})

describe('交互', () => {
  it('打开后选一天：日期写回、时间沿用原值、浮层保持打开；改浮层里的时间段即写回；确定关闭', async () => {
    const w = mountPicker('2026-09-04T20:30')
    fireEvent.click(w.container.querySelector('button[aria-label="打开日历"]')!)
    expect(w.opens.mock.calls[0]).toEqual([true])
    await vi.waitFor(() => expect(dayOf('2026-09-10')).not.toBeNull())
    await act(async () => dayOf('2026-09-10').click())
    expect(w.changes.mock.calls.at(-1)).toEqual(['2026-09-10T20:30'])
    expect(w.opens).toHaveBeenCalledTimes(1)
    const time = document.querySelector('[data-hn-calendar] ~ div [data-hn-time-field]')
    expect(time).not.toBeNull()
    const minute = time!.querySelectorAll('[role="spinbutton"]')[1] as HTMLElement
    await act(async () => {
      minute.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
    })
    expect(w.changes.mock.calls.at(-1)).toEqual(['2026-09-10T20:31'])
    const done = Array.from(document.querySelectorAll('button')).find(
      b => b.textContent?.trim() === '确定',
    )!
    await act(async () => done.click())
    expect(w.opens.mock.calls.at(-1)).toEqual([false])
  })

  it('空值时选一天，时间取占位的时间部分，没有占位则取零点', async () => {
    const plain = mountPicker(null, { placeholder: '2026-09-01T09:00' })
    fireEvent.click(plain.container.querySelector('button[aria-label="打开日历"]')!)
    await vi.waitFor(() => expect(dayOf('2026-09-10')).not.toBeNull())
    await act(async () => dayOf('2026-09-10').click())
    expect(plain.changes.mock.calls.at(-1)).toEqual(['2026-09-10T09:00'])
    plain.unmount()
    document.body.innerHTML = ''
    const bare = mountPicker(null, { placeholder: '2026-09-01' })
    fireEvent.click(bare.container.querySelector('button[aria-label="打开日历"]')!)
    await vi.waitFor(() => expect(dayOf('2026-09-10')).not.toBeNull())
    await act(async () => dayOf('2026-09-10').click())
    expect(bare.changes.mock.calls.at(-1)).toEqual(['2026-09-10T00:00'])
  })

  it('清除钮清空值并发 clear，日历不打开', () => {
    const w = mountPicker('2026-09-04T20:30', { clearable: true })
    fireEvent.click(w.container.querySelector('button[aria-label="清除"]')!)
    expect(w.changes.mock.calls[0]).toEqual([null])
    expect(w.clears).toHaveBeenCalledTimes(1)
    expect(w.opens).not.toHaveBeenCalled()
    expect(popoverSpins()).toHaveLength(0)
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const w = mountPicker('2026-09-04T20:30', { clearable: true })
    await expectNoA11yViolations(w.container.firstElementChild!)
  })
})
