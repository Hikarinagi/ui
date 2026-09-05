const UNITS = ['byte', 'kilobyte', 'megabyte', 'gigabyte'] as const

export function formatSize(tag: string, bytes: number) {
  let value = bytes
  let index = 0
  while (value >= 1024 && index < UNITS.length - 1) {
    value /= 1024
    index += 1
  }
  return new Intl.NumberFormat(tag, {
    style: 'unit',
    unit: UNITS[index],
    unitDisplay: 'narrow',
    maximumFractionDigits: index === 0 ? 0 : 1,
  }).format(value)
}
