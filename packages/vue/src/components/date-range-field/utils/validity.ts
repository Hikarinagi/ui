import type { DateValue } from '@internationalized/date'

interface Bounds {
  min?: DateValue
  max?: DateValue
}

interface Parts {
  start?: DateValue
  end?: DateValue
}

function outside(value: DateValue | undefined, { min, max }: Bounds) {
  if (!value) return false
  return (!!min && value.compare(min) < 0) || (!!max && value.compare(max) > 0)
}

export function isRangeInvalid({ start, end }: Parts, bounds: Bounds) {
  if (outside(start, bounds) || outside(end, bounds)) return true
  return !!start && !!end && start.compare(end) > 0
}
