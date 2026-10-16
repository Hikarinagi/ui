import assert from 'node:assert/strict'
import { test } from 'node:test'
import { CalendarDate } from '@internationalized/date'
import {
  highlightedCalendarRange,
  isRangeDateDisabled,
  isRangeDateSelected,
  isRangeInvalid,
  nextRangeSelection,
  rangeSelectionFocus,
} from '../src/primitives/date/range-calendar-view.ts'

const date = (month, day) => new CalendarDate(2026, month, day)
const never = () => false
const base = {
  start: undefined,
  end: undefined,
  highlighted: false,
  lastPressed: undefined,
  preventDeselect: false,
  fixedDate: undefined,
}
const iso = change =>
  Object.fromEntries(
    Object.entries(change).map(([key, value]) => [
      key,
      value && typeof value === 'object' && 'value' in value
        ? value.value?.toString()
        : typeof value === 'object'
          ? value.toString()
          : value,
    ]),
  )

test('a range is selected between its ends and invalid when reversed or disabled', () => {
  const range = { start: date(9, 4), end: date(9, 10) }
  assert.equal(isRangeDateSelected(range, date(9, 7)), true)
  assert.equal(isRangeDateSelected(range, date(9, 11)), false)
  assert.equal(isRangeInvalid({ start: date(9, 10), end: date(9, 4) }, never), true)
  assert.equal(
    isRangeInvalid(range, value => value.day === 4),
    true,
  )
  assert.equal(isRangeInvalid(range, never), false)
})

test('maximumDays limits the days around the start', () => {
  const limits = { start: date(9, 10), end: undefined, fixedDate: undefined, maximumDays: 3 }
  assert.equal(isRangeDateDisabled(date(9, 12), limits, never), false)
  assert.equal(isRangeDateDisabled(date(9, 14), limits, never), true)
  assert.equal(isRangeDateDisabled(date(9, 6), limits, never), true)
})

test('the preview follows the focused day and stops at unavailable days', () => {
  const input = {
    start: date(9, 4),
    end: undefined,
    focused: date(9, 8),
    fixedDate: undefined,
    maximumDays: undefined,
    allowNonContiguousRanges: false,
    isDateUnavailable: value => value.day === 6,
    isDateDisabled: never,
  }
  assert.equal(highlightedCalendarRange(input), null)
  assert.deepEqual(
    Object.values(highlightedCalendarRange({ ...input, allowNonContiguousRanges: true })).map(
      String,
    ),
    ['2026-09-04', '2026-09-08'],
  )
  assert.deepEqual(
    Object.values(highlightedCalendarRange({ ...input, focused: date(9, 2) })).map(String),
    ['2026-09-02', '2026-09-04'],
  )
  assert.equal(highlightedCalendarRange({ ...input, end: date(9, 9) }), null)
})

test('pressing days picks the start, then the end, then starts over', () => {
  assert.deepEqual(iso(nextRangeSelection(date(9, 4), base)), {
    lastPressed: '2026-09-04',
    start: '2026-09-04',
  })
  assert.deepEqual(
    iso(nextRangeSelection(date(9, 8), { ...base, start: date(9, 4), highlighted: true })),
    { lastPressed: '2026-09-08', end: '2026-09-08' },
  )
  assert.deepEqual(
    iso(nextRangeSelection(date(9, 12), { ...base, start: date(9, 4), end: date(9, 8) })),
    { lastPressed: '2026-09-12', end: undefined, start: '2026-09-12' },
  )
  assert.deepEqual(
    iso(
      nextRangeSelection(date(9, 2), {
        ...base,
        start: date(9, 4),
        end: date(9, 8),
        fixedDate: 'start',
      }),
    ),
    { lastPressed: '2026-09-02', start: '2026-09-02' },
  )
})

test('pressing the start again clears it, and a second press without a preview confirms it', () => {
  assert.deepEqual(iso(nextRangeSelection(date(9, 4), { ...base, start: date(9, 4) })), {
    start: undefined,
    placeholder: '2026-09-04',
    lastPressed: '2026-09-04',
  })
  const waiting = nextRangeSelection(date(9, 6), { ...base, start: date(9, 4) })
  assert.equal(waiting.preventDefault, true)
  assert.equal(waiting.start, undefined)
  const confirmed = nextRangeSelection(date(9, 6), {
    ...base,
    start: date(9, 4),
    lastPressed: date(9, 6),
  })
  assert.equal(confirmed.start.value.toString(), '2026-09-06')
})

test('focus prefers an enabled end of the selection', () => {
  const disabled = value => value.day === 4
  const focus = rangeSelectionFocus({ start: date(9, 4), end: date(9, 8) }, disabled)
  assert.equal(focus.hasSelectedDate, true)
  assert.equal(focus.isSelectedDisabled, false)
  assert.equal(focus.selectedFocusableDate.toString(), '2026-09-08')
  assert.equal(
    rangeSelectionFocus({ start: date(9, 4), end: undefined }, disabled).isSelectedDisabled,
    true,
  )
})
