export function toDisplayString(value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (
    Array.isArray(value) ||
    (typeof value === 'object' &&
      (value.toString === Object.prototype.toString || typeof value.toString !== 'function'))
  )
    return JSON.stringify(
      value,
      (_key, item) => (typeof item === 'symbol' ? item.toString() : item),
      2,
    )
  return String(value)
}
