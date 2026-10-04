function isPlain(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]'
}

export function snapshot(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(snapshot)
  if (isPlain(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, snapshot(item)]))
  }
  return value
}

export function same(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, index) => same(item, b[index]))
  }
  if (isPlain(a) && isPlain(b)) {
    const keys = Object.keys(a)
    return keys.length === Object.keys(b).length && keys.every(key => same(a[key], b[key]))
  }
  return false
}
