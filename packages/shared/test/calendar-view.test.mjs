import assert from 'node:assert/strict'
import { test } from 'node:test'
import { CalendarDate } from '@internationalized/date'
import {
  buildCalendarGrid,
  calendarArrowShift,
  calendarCellTabIndex,
  calendarHeading,
  calendarShiftCandidate,
  firstFocusableCalendarDate,
  isCalendarDateDisabled,
  isCalendarFocusedDate,
  isCalendarNextDisabled,
  isCalendarPrevDisabled,
  isCalendarSelectionInvalid,
  isOutsideCalendarView,
  turnCalendarPage,
} from '../src/primitives/date/calendar-view.ts'
import { createDateFormatter } from '../src/primitives/date/formatter.ts'

const options = { weekStartsOn: 0, locale: 'en', fixedWeeks: false, numberOfMonths: 1 }
const date = (year, month, day) => new CalendarDate(year, month, day)

test('paging moves by one month, or by the visible months with paged navigation', () => {
  const grid = buildCalendarGrid(date(2026, 9, 18), { ...options, numberOfMonths: 2 })
  const one = turnCalendarPage(1, grid, { ...options, numberOfMonths: 2, pagedNavigation: false })
  assert.equal(one.placeholder.toString(), '2026-10-01')
  const paged = turnCalendarPage(-1, grid, { ...options, numberOfMonths: 2, pagedNavigation: true })
  assert.equal(paged.placeholder.toString(), '2026-07-01')
  assert.equal(paged.grid.length, 2)
  const custom = turnCalendarPage(1, grid, { ...options, pagedNavigation: false }, value =>
    value.add({ years: 1 }),
  )
  assert.equal(custom.placeholder.toString(), '2027-09-18')
})

test('paging buttons disable at the bounds and while the calendar is disabled', () => {
  const grid = buildCalendarGrid(date(2026, 9, 18), options)
  const bounds = { minValue: date(2026, 9, 1), maxValue: date(2026, 9, 30), disabled: false }
  assert.equal(isCalendarNextDisabled(grid, bounds, undefined), true)
  assert.equal(isCalendarPrevDisabled(grid, bounds, undefined), true)
  assert.equal(
    isCalendarNextDisabled(grid, { ...bounds, maxValue: date(2026, 10, 1) }, undefined),
    false,
  )
  assert.equal(isCalendarPrevDisabled(grid, { ...bounds, minValue: undefined }, undefined), false)
  assert.equal(
    isCalendarNextDisabled(
      grid,
      { ...bounds, maxValue: date(2027, 1, 1), disabled: true },
      undefined,
    ),
    true,
  )
})

test('dates outside the bounds or matched by isDateDisabled are disabled', () => {
  const bounds = { minValue: date(2026, 9, 5), maxValue: date(2026, 9, 25), disabled: false }
  const weekend = value => value.day === 12
  assert.equal(isCalendarDateDisabled(date(2026, 9, 4), bounds, undefined), true)
  assert.equal(isCalendarDateDisabled(date(2026, 9, 26), bounds, undefined), true)
  assert.equal(isCalendarDateDisabled(date(2026, 9, 12), bounds, weekend), true)
  assert.equal(isCalendarDateDisabled(date(2026, 9, 13), bounds, weekend), false)
  assert.equal(isCalendarSelectionInvalid([date(2026, 9, 12)], weekend, undefined), true)
  assert.equal(isCalendarSelectionInvalid(undefined, weekend, undefined), false)
})

test('the heading names one month, or a range across months and years', () => {
  const formatter = createDateFormatter('en')
  const one = buildCalendarGrid(date(2026, 9, 1), options)
  assert.equal(calendarHeading(one, formatter, 'en', {}), 'September 2026')
  const two = buildCalendarGrid(date(2026, 12, 1), { ...options, numberOfMonths: 2 })
  assert.equal(calendarHeading(two, formatter, 'en', {}), 'December 2026 - January 2027')
  const same = buildCalendarGrid(date(2026, 9, 1), { ...options, numberOfMonths: 2 })
  assert.equal(calendarHeading(same, formatter, 'en', {}), 'September - October 2026')
})

test('focus lands on the placeholder, or on the first focusable date when nothing is selected', () => {
  const grid = buildCalendarGrid(date(2026, 9, 1), options)
  const base = {
    outsideView: false,
    disabled: false,
    rootDisabled: false,
    placeholderFocusable: true,
    placeholder: date(2026, 9, 10),
    hasSelectedDate: false,
    selectedDateDisabled: false,
    firstFocusableDate: date(2026, 9, 3),
  }
  assert.equal(isCalendarFocusedDate({ ...base, day: date(2026, 9, 10) }), true)
  assert.equal(isCalendarFocusedDate({ ...base, day: date(2026, 9, 3) }), false)
  assert.equal(
    isCalendarFocusedDate({ ...base, placeholderFocusable: false, day: date(2026, 9, 3) }),
    true,
  )
  assert.equal(isCalendarFocusedDate({ ...base, outsideView: true, day: date(2026, 9, 10) }), false)
  assert.equal(
    firstFocusableCalendarDate(grid, undefined, value => value.day < 4).toString(),
    '2026-09-04',
  )
  assert.equal(isOutsideCalendarView(grid, date(2026, 10, 1)), true)
  assert.equal(calendarCellTabIndex(true, false, false), 0)
  assert.equal(calendarCellTabIndex(false, true, false), undefined)
  assert.equal(calendarCellTabIndex(false, false, false), -1)
})

test('arrows move by a day or a week, mirrored in rtl, and stop at the bounds', () => {
  assert.equal(calendarArrowShift('ArrowRight', 'ltr'), 1)
  assert.equal(calendarArrowShift('ArrowRight', 'rtl'), -1)
  assert.equal(calendarArrowShift('ArrowUp', 'ltr'), -7)
  assert.equal(calendarArrowShift('Enter', 'ltr'), undefined)
  assert.equal(
    calendarShiftCandidate(date(2026, 9, 28), 7, undefined, undefined).toString(),
    '2026-10-05',
  )
  assert.equal(
    calendarShiftCandidate(date(2026, 9, 28), 7, undefined, date(2026, 10, 1)),
    undefined,
  )
  assert.equal(calendarShiftCandidate(date(2026, 9, 2), -7, date(2026, 9, 1), undefined), undefined)
})
