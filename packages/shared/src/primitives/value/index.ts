export type SingleOrMultipleType = 'single' | 'multiple'

export function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (typeof a !== typeof b) return false
  if (typeof a === 'number') return Number.isNaN(a) && Number.isNaN(b)
  if (typeof a !== 'object' || a === null || b === null) return false
  if (Array.isArray(a))
    return (
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((value, index) => isEqual(value, b[index]))
    )
  if (Array.isArray(b)) return false
  if (a instanceof Date || b instanceof Date)
    return a instanceof Date && b instanceof Date && a.getTime() === b.getTime()
  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false
  const left = a as Record<string, unknown>
  const right = b as Record<string, unknown>
  const keys = Object.keys(left)
  return (
    keys.length === Object.keys(right).length &&
    keys.every(key => Object.hasOwn(right, key) && isEqual(left[key], right[key]))
  )
}

export function isValueEqualOrExist(base: unknown, current: unknown) {
  if (base === undefined || base === null) return false
  if (Array.isArray(base)) return base.some(value => isEqual(value, current))
  return isEqual(base, current)
}

export function singleOrMultipleType({
  type,
  defaultValue,
  modelValue,
}: {
  type?: SingleOrMultipleType
  defaultValue?: unknown
  modelValue?: unknown
}): SingleOrMultipleType {
  if (type) return type
  if (modelValue !== undefined || defaultValue !== undefined)
    return Array.isArray(modelValue || defaultValue) ? 'multiple' : 'single'
  return 'single'
}

export function singleOrMultipleDefault({
  type,
  defaultValue,
}: {
  type?: SingleOrMultipleType
  defaultValue?: unknown
}) {
  if (defaultValue !== undefined) return defaultValue
  return type === 'single' ? undefined : []
}

export function toggleArrayValue<T>(values: T[], value: T) {
  const next = [...values]
  if (isValueEqualOrExist(next, value))
    next.splice(
      next.findIndex(item => isEqual(item, value)),
      1,
    )
  else next.push(value)
  return next
}

export function nextSingleOrMultipleValue<T>(
  type: SingleOrMultipleType,
  current: T | T[] | undefined,
  value: T,
): T | T[] | undefined {
  if (type === 'single') return isEqual(value, current) ? undefined : value
  return toggleArrayValue(
    Array.isArray(current) ? current : [current].filter((item): item is T => !!item),
    value,
  )
}
