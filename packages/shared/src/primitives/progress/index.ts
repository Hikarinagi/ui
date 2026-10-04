export const DEFAULT_PROGRESS_MAX = 100

export type ProgressState = 'indeterminate' | 'complete' | 'loading'

export function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}

export function isValidProgressMax(max: unknown): max is number {
  return isNumber(max) && !Number.isNaN(max) && max > 0
}

export function isValidProgressValue(
  value: unknown,
  max: number,
): value is number | null | undefined {
  return value == null || (isNumber(value) && !Number.isNaN(value) && value <= max && value >= 0)
}

export function progressValueError(value: unknown) {
  return `Invalid prop \`value\` of value \`${value}\` supplied to \`ProgressRoot\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${DEFAULT_PROGRESS_MAX} if no \`max\` prop is set)
  - \`null\`  or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`
}

export function progressMaxError(max: unknown) {
  return `Invalid prop \`max\` of value \`${max}\` supplied to \`ProgressRoot\`. Only numbers greater than 0 are valid max values. Defaulting to \`${DEFAULT_PROGRESS_MAX}\`.`
}

export function progressState(value: number | null | undefined, max: number): ProgressState {
  if (value == null) return 'indeterminate'
  if (value === max) return 'complete'
  return 'loading'
}

export function defaultProgressLabel(value: number | null | undefined, max: number) {
  return isNumber(value) ? `${Math.round((value / max) * DEFAULT_PROGRESS_MAX)}%` : undefined
}
