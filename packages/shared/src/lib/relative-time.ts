const DIVISIONS = [
  [60, 'second'],
  [60, 'minute'],
  [24, 'hour'],
  [7, 'day'],
  [4.34524, 'week'],
  [12, 'month'],
  [Infinity, 'year'],
] as const

export function relativeTime(target: Date, nowMs: number, tag: string, justNow: string): string {
  let duration = (target.getTime() - nowMs) / 1000
  if (Math.abs(duration) < 45) return justNow
  const rtf = new Intl.RelativeTimeFormat(tag, { numeric: 'auto' })
  for (const [amount, unit] of DIVISIONS) {
    if (Math.abs(duration) < amount) return rtf.format(Math.round(duration), unit)
    duration /= amount
  }
  return ''
}
