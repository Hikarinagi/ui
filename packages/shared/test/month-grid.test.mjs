import assert from 'node:assert/strict'
import { test } from 'node:test'
import { monthGridDates, parseMonth, shiftMonth } from '../src/lib/month-grid.ts'

test('Gregorian month arithmetic handles leap days and year boundaries', () => {
  const dates = monthGridDates('2024-02', 1).flat()
  assert.equal(dates.length, 42)
  assert.equal(dates[0], '2024-01-29')
  assert.equal(dates.at(-1), '2024-03-10')
  assert.ok(dates.includes('2024-02-29'))
  assert.ok(!monthGridDates('2025-02', 1).flat().includes('2025-02-29'))
  assert.equal(shiftMonth('2026-12', 1), '2027-01')
  assert.equal(shiftMonth('2026-01', -1), '2025-12')
})
test('week start and optional compact weeks produce contiguous ranges', () => {
  assert.equal(monthGridDates('2026-02', 0, false).length, 4)
  assert.equal(monthGridDates('2026-02', 1, false).length, 5)
  assert.equal(monthGridDates('2026-02', 1)[0][0], '2026-01-26')
  for (let start = 0; start < 7; start++) {
    const dates = monthGridDates('2026-08', start).flat()
    assert.equal(new Date(dates[0]).getUTCDay(), start)
    for (let i = 1; i < dates.length; i++)
      assert.equal(+new Date(dates[i]) - +new Date(dates[i - 1]), 86400000)
  }
})
test('validates month strings and preserves years below 100', () => {
  for (const month of [undefined, '2026-00', '2026-13', '2026-1', '2026-01-01', '0000-01'])
    assert.equal(parseMonth(month), undefined)
  assert.equal(
    monthGridDates('0099-03', 1)
      .flat()
      .filter(d => d.startsWith('0099-03')).length,
    31,
  )
  assert.equal(shiftMonth('0001-01', -1), '0001-01')
  assert.equal(shiftMonth('9999-12', 1), '9999-12')
  assert.deepEqual(monthGridDates('bad', 1), [])
})
