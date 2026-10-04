import { PRECISION } from './constants'

export function fuzzyCompareNumbers(actual: number, expected: number, fractionDigits = PRECISION) {
  actual = Number.parseFloat(actual.toFixed(fractionDigits))
  expected = Number.parseFloat(expected.toFixed(fractionDigits))
  const delta = actual - expected
  if (delta === 0) return 0
  else return delta > 0 ? 1 : -1
}

export function fuzzyNumbersEqual(actual: number, expected: number, fractionDigits?: number) {
  return fuzzyCompareNumbers(actual, expected, fractionDigits) === 0
}
