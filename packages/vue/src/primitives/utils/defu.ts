function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    value !== null && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype
  )
}

function merge(base: Record<string, unknown>, defaults: Record<string, unknown>) {
  const result: Record<string, unknown> = { ...defaults }
  for (const [key, value] of Object.entries(base)) {
    if (value === null || value === undefined) continue
    const fallback = result[key]
    if (Array.isArray(value) && Array.isArray(fallback)) result[key] = [...value, ...fallback]
    else if (isPlainObject(value) && isPlainObject(fallback)) result[key] = merge(value, fallback)
    else result[key] = value
  }
  return result
}

export function defu<T extends Record<string, unknown>>(
  ...sources: Array<Record<string, unknown>>
) {
  return sources.reduceRight<Record<string, unknown>>(
    (defaults, source) => merge(source ?? {}, defaults),
    {},
  ) as T
}
