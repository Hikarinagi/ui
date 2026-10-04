export type CheckedState = boolean | 'indeterminate'

export function isIndeterminate(checked: unknown): checked is 'indeterminate' {
  return checked === 'indeterminate'
}

export function getCheckedState(checked: unknown) {
  return isIndeterminate(checked) ? 'indeterminate' : checked ? 'checked' : 'unchecked'
}

export function ariaChecked(state: CheckedState) {
  return isIndeterminate(state) ? 'mixed' : state
}

export function nextCheckedValue<T>(
  current: unknown,
  checked: boolean,
  trueValue: T,
  falseValue: T,
) {
  if (isIndeterminate(current)) return trueValue
  return checked ? falseValue : trueValue
}
