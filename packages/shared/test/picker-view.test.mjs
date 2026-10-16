import assert from 'node:assert/strict'
import { test } from 'node:test'
import { CalendarDate } from '@internationalized/date'
import {
  buildPickerGrid,
  isPickerDateDisabled,
  isPickerNextDisabled,
  isPickerPrevDisabled,
  nextPickerSelection,
  pickerGridContains,
  pickerShiftCandidate,
  turnPickerPage,
} from '../src/primitives/date/picker-view.ts'

const date = (year, month, day) => new CalendarDate(year, month, day)
const iso = value => (Array.isArray(value) ? value.map(item => item.toString()) : value?.toString())

test('a month is disabled once it lies wholly outside the bounds, a year likewise', () => {
  const bounds = { minValue: date(2026, 3, 15), maxValue: date(2026, 9, 10), disabled: false }
  assert.equal(isPickerDateDisabled('month', date(2026, 2, 20), bounds, undefined), true)
  assert.equal(isPickerDateDisabled('month', date(2026, 3, 1), bounds, undefined), false)
  assert.equal(isPickerDateDisabled('month', date(2026, 9, 30), bounds, undefined), false)
  assert.equal(isPickerDateDisabled('month', date(2026, 10, 1), bounds, undefined), true)
  assert.equal(isPickerDateDisabled('year', date(2025, 6, 1), bounds, undefined), true)
  assert.equal(isPickerDateDisabled('year', date(2026, 1, 1), bounds, undefined), false)
})

test('month pages turn by a year and year pages by the page size, keeping month and day', () => {
  const months = buildPickerGrid('month', date(2026, 5, 9))
  const next = turnPickerPage('month', 1, months, date(2026, 5, 9), { page: undefined })
  assert.equal(next.placeholder.toString(), '2027-05-09')
  const years = buildPickerGrid('year', date(2026, 5, 9), 12)
  assert.equal(years.value.year, 2020)
  const prev = turnPickerPage('year', -1, years, date(2026, 5, 9), {
    page: undefined,
    yearsPerPage: 12,
  })
  assert.equal(prev.grid.value.year, 2008)
  assert.equal(prev.placeholder.toString(), '2008-05-09')
  assert.equal(pickerGridContains('year', years, date(2031, 1, 1)), true)
  assert.equal(pickerGridContains('year', years, date(2032, 1, 1)), false)
})

test('paging stops at the bounds', () => {
  const months = buildPickerGrid('month', date(2026, 5, 9))
  const bounds = { minValue: date(2026, 1, 1), maxValue: date(2026, 12, 31), disabled: false }
  assert.equal(isPickerNextDisabled('month', months, bounds, undefined), true)
  assert.equal(isPickerPrevDisabled('month', months, bounds, undefined), true)
  const years = buildPickerGrid('year', date(2026, 5, 9), 12)
  assert.equal(
    isPickerNextDisabled('year', years, { ...bounds, maxValue: date(2040, 1, 1) }, undefined),
    false,
  )
  assert.equal(
    isPickerPrevDisabled('year', years, { ...bounds, minValue: date(2019, 12, 31) }, undefined),
    false,
  )
})

test('selection keeps the day of the reference and toggles off in single mode', () => {
  const options = { multiple: false, preventDeselect: false }
  assert.equal(
    iso(
      nextPickerSelection('month', undefined, date(2026, 7, 1), date(2026, 5, 20), options).value,
    ),
    '2026-07-20',
  )
  const off = nextPickerSelection(
    'month',
    date(2026, 7, 20),
    date(2026, 7, 1),
    date(2026, 7, 20),
    options,
  )
  assert.equal(off.value, undefined)
  assert.equal(off.placeholder.toString(), '2026-07-20')
  assert.equal(
    iso(
      nextPickerSelection('year', date(2026, 7, 20), date(2030, 1, 1), date(2026, 7, 20), options)
        .value,
    ),
    '2030-07-20',
  )
})

test('multiple selection adds and removes, and preventDeselect keeps the last one', () => {
  const options = { multiple: true, preventDeselect: false }
  const added = nextPickerSelection(
    'month',
    [date(2026, 1, 5)],
    date(2026, 3, 1),
    date(2026, 1, 5),
    options,
  )
  assert.deepEqual(iso(added.value), ['2026-01-05', '2026-03-05'])
  const removed = nextPickerSelection(
    'month',
    added.value,
    date(2026, 1, 1),
    date(2026, 1, 5),
    options,
  )
  assert.deepEqual(iso(removed.value), ['2026-03-05'])
  assert.equal(
    nextPickerSelection('year', [date(2026, 1, 5)], date(2026, 6, 1), date(2026, 1, 5), {
      multiple: true,
      preventDeselect: true,
    }),
    undefined,
  )
  assert.deepEqual(
    iso(
      nextPickerSelection('month', date(2026, 1, 5), date(2026, 2, 1), date(2026, 1, 5), options)
        .value,
    ),
    ['2026-01-05', '2026-02-05'],
  )
  assert.equal(
    nextPickerSelection('year', date(2026, 1, 5), date(2027, 1, 1), date(2026, 1, 5), options),
    undefined,
  )
})

test('focus moves by a cell or a page and stops beyond the bounds', () => {
  const bounds = { minValue: date(2026, 1, 1), maxValue: date(2027, 6, 30), yearsPerPage: 12 }
  assert.equal(
    pickerShiftCandidate('month', date(2026, 12, 1), 1, 'cell', bounds).toString(),
    '2027-01-01',
  )
  assert.equal(pickerShiftCandidate('month', date(2026, 1, 1), -1, 'cell', bounds), undefined)
  assert.equal(
    pickerShiftCandidate('month', date(2026, 6, 1), 1, 'page', bounds).toString(),
    '2027-06-01',
  )
  assert.equal(pickerShiftCandidate('year', date(2026, 1, 1), 1, 'page', bounds), undefined)
  assert.equal(
    pickerShiftCandidate('year', date(2026, 1, 1), 1, 'cell', bounds).toString(),
    '2027-01-01',
  )
})
