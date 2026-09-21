export function parseMonth(value: string | undefined): { year: number; month: number } | undefined {
  if (!value || !/^\d{4}-\d{2}$/.test(value)) return
  const [year, month] = value.split('-').map(Number)
  if (!year || year > 9999 || !month || month > 12) return
  return { year, month }
}

function utcDate(year: number, month: number, day: number) {
  const date = new Date(0)
  date.setUTCFullYear(year, month - 1, day)
  return date
}

export function shiftMonth(value: string, delta: number): string {
  const parsed = parseMonth(value)
  if (!parsed) return value
  const index = Math.max(
    12,
    Math.min(9999 * 12 + 11, parsed.year * 12 + parsed.month - 1 + Math.trunc(delta)),
  )
  return `${String(Math.floor(index / 12)).padStart(4, '0')}-${String((index % 12) + 1).padStart(2, '0')}`
}

export function monthGridDates(value: string, weekStartsOn: number, fixedWeeks = true): string[][] {
  const parsed = parseMonth(value)
  if (!parsed) return []
  const first = utcDate(parsed.year, parsed.month, 1)
  const before = (first.getUTCDay() - weekStartsOn + 7) % 7
  const days = utcDate(parsed.year, parsed.month + 1, 0).getUTCDate()
  const weeks = fixedWeeks ? 6 : Math.ceil((before + days) / 7)
  return Array.from({ length: weeks }, (_, week) =>
    Array.from(
      { length: 7 },
      (_, day) =>
        utcDate(parsed.year, parsed.month, 1 - before + week * 7 + day)
          .toISOString()
          .split('T')[0]!,
    ),
  )
}
