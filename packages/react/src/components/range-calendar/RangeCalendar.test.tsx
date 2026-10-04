import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { useState } from 'react'
import { RangeCalendar, type RangeCalendarProps } from './RangeCalendar'
import type { DateRangeValue } from '../../../../shared/src/lib/date'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

function mountRange(modelValue: DateRangeValue | null, extra: Partial<RangeCalendarProps> = {}) {
  const emitted: (DateRangeValue | null)[] = []
  function Harness() {
    const [value, setValue] = useState<DateRangeValue | null>(modelValue)
    return (
      <RangeCalendar
        value={value}
        {...extra}
        onValueChange={next => {
          emitted.push(next)
          setValue(next)
        }}
      />
    )
  }
  const container = render(<Harness />).container
  return {
    emitted,
    container,
    find: (selector: string) => container.querySelector(selector) as HTMLElement | null,
    findAll: (selector: string) => Array.from(container.querySelectorAll<HTMLElement>(selector)),
  }
}

type Wrapper = ReturnType<typeof mountRange>

const dayOf = (w: Wrapper, date: string) =>
  w.find(`[data-radix-calendar-cell-trigger][data-value="${date}"]`)!

describe('结构', () => {
  it('根带语言包名称与当前月份，固定六周共 42 格，翻页按钮与标题同 Calendar', () => {
    const w = mountRange({ start: '2026-09-04', end: '2026-09-10' })
    expect(w.find('[data-hn-range-calendar]')!.getAttribute('aria-label')).toBe('日历, 2026年9月')
    expect(w.findAll('[data-radix-calendar-cell-trigger]')).toHaveLength(42)
    expect(w.find('button[aria-label="上个月"]')).not.toBeNull()
    expect(w.find('button[aria-label="选择月份"]')!.textContent).toBe('2026年9月')
  })

  it('v-model 是 { start, end }：区间内的格都带 data-selected，两端另带起止标记；点两格交出新区间', () => {
    const w = mountRange({ start: '2026-09-04', end: '2026-09-10' })
    expect(dayOf(w, '2026-09-04').getAttribute('data-selection-start')).toBe('true')
    expect(dayOf(w, '2026-09-10').getAttribute('data-selection-end')).toBe('true')
    expect(dayOf(w, '2026-09-07').getAttribute('data-selected')).toBe('true')
    expect(dayOf(w, '2026-09-07').getAttribute('data-selection-start')).toBeNull()
    expect(dayOf(w, '2026-09-11').getAttribute('data-selected')).toBeNull()
    fireEvent.click(dayOf(w, '2026-09-20'))
    expect(w.emitted.at(-1)).toEqual({ start: '2026-09-20', end: null })
    fireEvent.mouseEnter(dayOf(w, '2026-09-25'))
    fireEvent.click(dayOf(w, '2026-09-25'))
    expect(w.emitted.at(-1)).toEqual({ start: '2026-09-20', end: '2026-09-25' })
    expect(dayOf(w, '2026-09-22').getAttribute('data-selected')).toBe('true')
  })

  it('min 与 max 之外的格禁用，unavailable 以 ISO 字符串判定', () => {
    const w = mountRange(null, {
      placeholder: '2026-09-01',
      min: '2026-09-07',
      max: '2026-09-25',
      unavailable: (date: string) => date === '2026-09-13',
    })
    expect(dayOf(w, '2026-09-06').getAttribute('data-disabled')).toBe('')
    expect(dayOf(w, '2026-09-26').getAttribute('data-disabled')).toBe('')
    expect(dayOf(w, '2026-09-13').getAttribute('data-unavailable')).toBe('')
    expect(dayOf(w, '2026-09-14').getAttribute('data-disabled')).toBeNull()
  })

  it('maximumDays 在选定开始日期后禁用超出天数的日期，区间完成后解除', () => {
    const pending = mountRange({ start: '2026-09-08', end: null }, { maximumDays: 7 })
    expect(dayOf(pending, '2026-09-14').getAttribute('data-disabled')).toBeNull()
    expect(dayOf(pending, '2026-09-15').getAttribute('data-disabled')).toBe('')
    expect(dayOf(pending, '2026-09-02').getAttribute('data-disabled')).toBeNull()
    expect(dayOf(pending, '2026-09-01').getAttribute('data-disabled')).toBe('')
    const done = mountRange({ start: '2026-09-08', end: '2026-09-10' }, { maximumDays: 7 })
    expect(done.find('[data-radix-calendar-cell-trigger][data-disabled]')).toBeNull()
  })

  it('readonly 时点击不改值；disabled 落在根上', () => {
    const still = mountRange({ start: '2026-09-04', end: '2026-09-10' }, { readonly: true })
    fireEvent.click(dayOf(still, '2026-09-20'))
    fireEvent.click(dayOf(still, '2026-09-25'))
    expect(still.emitted).toHaveLength(0)
    const off = mountRange(null, { placeholder: '2026-09-01', disabled: true })
    expect(off.find('[data-hn-range-calendar]')!.getAttribute('data-disabled')).toBe('')
  })
})

describe('服务端渲染', () => {
  it('首屏渲染出整月网格与区间', () => {
    const html = renderToString(
      <RangeCalendar value={{ start: '2026-09-04', end: '2026-09-10' }} />,
    )
    expect(html.match(/role="gridcell"/g)).toHaveLength(42)
    expect(html.match(/data-selected="true"/g)).toHaveLength(7)
    expect(html).toContain('data-selection-start="true"')
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const w = mountRange({ start: '2026-09-04', end: '2026-09-10' })
    await expectNoA11yViolations(w.container)
  })
})
