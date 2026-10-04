import { NumberFormatter, NumberParser } from '@internationalized/number'

export type NumberFieldStep = 'increase' | 'decrease'
export type NumberFieldBound = 'min' | 'max'
export type NumberFieldInputMode = 'decimal' | 'numeric'

export interface NumberFieldRange {
  min?: number
  max?: number
  step: number
  stepSnapping: boolean
}

export interface NumberFieldFormat {
  formatter: NumberFormatter
  parser: NumberParser
}

export const NUMBER_FIELD_DEFAULT_LOCALE = 'en'
export const NUMBER_FIELD_PAGE_STEPS = 10
export const NUMBER_FIELD_HOLD_DELAY = 400
export const NUMBER_FIELD_HOLD_INTERVAL = 60

export function clamp(
  value: number,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
) {
  return Math.min(max, Math.max(min, value))
}

export function roundToStepPrecision(value: number, step: number) {
  let rounded = value
  const text = step.toString()
  const point = text.indexOf('.')
  const precision = point >= 0 ? text.length - point : 0
  if (precision > 0) {
    const pow = 10 ** precision
    rounded = Math.round(rounded * pow) / pow
  }
  return rounded
}

export function snapValueToStep(
  value: number,
  minValue: number | undefined,
  maxValue: number | undefined,
  step: number,
) {
  const min = Number(minValue)
  const max = Number(maxValue)
  const remainder = (value - (Number.isNaN(min) ? 0 : min)) % step
  let snapped = roundToStepPrecision(
    Math.abs(remainder) * 2 >= step
      ? value + Math.sign(remainder) * (step - Math.abs(remainder))
      : value - remainder,
    step,
  )
  if (!Number.isNaN(min)) {
    if (snapped < min) snapped = min
    else if (!Number.isNaN(max) && snapped > max)
      snapped = min + Math.floor(roundToStepPrecision((max - min) / step, step)) * step
  } else if (!Number.isNaN(max) && snapped > max)
    snapped = Math.floor(roundToStepPrecision(max / step, step)) * step
  return roundToStepPrecision(snapped, step)
}

export function handleDecimalOperation(operator: '-' | '+', left: number, right: number) {
  let result = operator === '+' ? left + right : left - right
  if (left % 1 !== 0 || right % 1 !== 0) {
    const leftDecimals = left.toString().split('.')[1]?.length ?? 0
    const rightDecimals = right.toString().split('.')[1]?.length ?? 0
    const multiplier = 10 ** Math.max(leftDecimals, rightDecimals)
    const a = Math.round(left * multiplier)
    const b = Math.round(right * multiplier)
    result = (operator === '+' ? a + b : a - b) / multiplier
  }
  return result
}

export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined
}

function isNumber(value: number | null | undefined): value is number {
  return !isNullish(value) && !Number.isNaN(value)
}

export function resolveNumberFieldLocale(locale?: string, inherited?: string) {
  return locale || inherited || NUMBER_FIELD_DEFAULT_LOCALE
}

export function createNumberFieldFormat(
  locale: string,
  options?: Intl.NumberFormatOptions,
): NumberFieldFormat {
  return {
    formatter: new NumberFormatter(locale, options),
    parser: new NumberParser(locale, options),
  }
}

export function numberFieldInputMode(format: NumberFieldFormat): NumberFieldInputMode {
  return format.formatter.resolvedOptions().maximumFractionDigits! > 0 ? 'decimal' : 'numeric'
}

export function formatNumberFieldValue(
  value: number | null | undefined,
  format: NumberFieldFormat,
) {
  return isNumber(value) ? format.formatter.format(value) : ''
}

export function clampNumberFieldValue(
  value: number,
  range: NumberFieldRange,
  format: NumberFieldFormat,
) {
  const { min, max, step, stepSnapping } = range
  const clamped =
    Number.isNaN(step) || !stepSnapping
      ? clamp(value, min, max)
      : snapValueToStep(value, min, max, step)
  return format.parser.parse(format.formatter.format(clamped))
}

export function nextNumberFieldValue(
  direction: NumberFieldStep,
  from: number,
  range: NumberFieldRange,
  format: NumberFieldFormat,
  multiplier = 1,
) {
  const { step } = range
  const operator = direction === 'increase' ? '+' : '-'
  let next: number
  if (range.stepSnapping && !Number.isNaN(step)) {
    const snapped = snapValueToStep(from, range.min, range.max, step)
    if (snapped === from) next = handleDecimalOperation(operator, from, step * multiplier)
    else {
      const aligned =
        direction === 'increase'
          ? snapped > from
            ? snapped
            : handleDecimalOperation('+', snapped, step)
          : snapped < from
            ? snapped
            : handleDecimalOperation('-', snapped, step)
      next =
        multiplier > 1
          ? handleDecimalOperation(operator, aligned, step * (multiplier - 1))
          : aligned
    }
  } else next = handleDecimalOperation(operator, from, step * multiplier)
  return clampNumberFieldValue(next, range, format)
}

export function isNumberFieldAtLimit(
  direction: NumberFieldStep,
  value: number | null | undefined,
  range: NumberFieldRange,
  format: NumberFieldFormat,
) {
  if (!isNumber(value)) return false
  const next = nextNumberFieldValue(direction, value, range, format)
  return direction === 'increase' ? next <= value : next >= value
}

export function stepNumberFieldText(
  direction: NumberFieldStep,
  text: string,
  range: NumberFieldRange,
  format: NumberFieldFormat,
  multiplier = 1,
) {
  const current = format.parser.parse(text)
  if (Number.isNaN(current)) return clampNumberFieldValue(range.min ?? 0, range, format)
  return nextNumberFieldValue(direction, current, range, format, multiplier)
}

export function boundNumberFieldValue(
  bound: NumberFieldBound,
  range: NumberFieldRange,
  format: NumberFieldFormat,
) {
  const target = bound === 'min' ? range.min : range.max
  return target === undefined ? undefined : clampNumberFieldValue(target, range, format)
}

export interface NumberFieldCommit {
  value: number | undefined
  reformat: boolean
}

export function commitNumberFieldText(
  text: string,
  range: NumberFieldRange,
  format: NumberFieldFormat,
): NumberFieldCommit {
  const parsed = format.parser.parse(text)
  return {
    value: Number.isNaN(parsed) ? undefined : clampNumberFieldValue(parsed, range, format),
    reformat: text.length > 0,
  }
}

export interface NumberFieldBeforeInput {
  isComposing: boolean
  inputType: string
  data: string | null
}

export interface NumberFieldTextSelection {
  value: string
  selectionStart: number | null
  selectionEnd: number | null
}

export function rejectsNumberFieldInput(
  event: NumberFieldBeforeInput,
  input: NumberFieldTextSelection,
  range: NumberFieldRange,
  format: NumberFieldFormat,
) {
  if (event.isComposing) return false
  if (event.inputType.startsWith('delete') || event.inputType.startsWith('history')) return false
  const next =
    input.value.slice(0, input.selectionStart ?? undefined) +
    (event.data ?? '') +
    input.value.slice(input.selectionEnd ?? undefined)
  return !format.parser.isValidPartialNumber(next, range.min, range.max)
}

export type NumberFieldKeyAction =
  | { type: 'step'; direction: NumberFieldStep; multiplier: number; prevent: true }
  | { type: 'bound'; bound: NumberFieldBound; prevent: true }
  | { type: 'commit'; prevent: false }

export function numberFieldKeyAction(
  event: { key: string; isComposing: boolean },
  composing: boolean,
): NumberFieldKeyAction | undefined {
  if (composing || event.isComposing) return undefined
  switch (event.key) {
    case 'ArrowUp':
      return { type: 'step', direction: 'increase', multiplier: 1, prevent: true }
    case 'ArrowDown':
      return { type: 'step', direction: 'decrease', multiplier: 1, prevent: true }
    case 'PageUp':
      return {
        type: 'step',
        direction: 'increase',
        multiplier: NUMBER_FIELD_PAGE_STEPS,
        prevent: true,
      }
    case 'PageDown':
      return {
        type: 'step',
        direction: 'decrease',
        multiplier: NUMBER_FIELD_PAGE_STEPS,
        prevent: true,
      }
    case 'Home':
      return { type: 'bound', bound: 'min', prevent: true }
    case 'End':
      return { type: 'bound', bound: 'max', prevent: true }
    case 'Enter':
      return { type: 'commit', prevent: false }
    default:
      return undefined
  }
}

export interface NumberFieldWheelState {
  focused: boolean
  disabled: boolean
  inverted: boolean
}

export function numberFieldWheelStep(
  event: { deltaX: number; deltaY: number },
  state: NumberFieldWheelState,
): NumberFieldStep | undefined {
  if (state.disabled || !state.focused) return undefined
  if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return undefined
  const down = event.deltaY > 0
  return down !== state.inverted ? 'increase' : 'decrease'
}

export function deepActiveElement(root: Pick<DocumentOrShadowRoot, 'activeElement'>) {
  let active = root.activeElement
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement
  return active
}

export interface NumberFieldTimers {
  setTimeout: (callback: () => void, delay: number) => unknown
  clearTimeout: (handle: unknown) => void
}

export interface NumberFieldPressHoldOptions {
  timers: NumberFieldTimers
  disabled: () => boolean
  trigger: () => void
  pressed: (pressed: boolean) => void
}

export interface NumberFieldPress {
  button: number
  preventDefault: () => void
}

export function createNumberFieldPressHold(options: NumberFieldPressHoldOptions) {
  let handle: unknown
  let pressed = false
  const reset = () => options.timers.clearTimeout(handle)
  const repeat = (delay: number) => {
    reset()
    if (options.disabled()) return
    options.trigger()
    handle = options.timers.setTimeout(() => repeat(NUMBER_FIELD_HOLD_INTERVAL), delay)
  }
  return {
    press(event: NumberFieldPress) {
      if (event.button !== 0 || pressed) return
      event.preventDefault()
      pressed = true
      options.pressed(true)
      repeat(NUMBER_FIELD_HOLD_DELAY)
    },
    release() {
      pressed = false
      options.pressed(false)
      reset()
    },
    dispose: reset,
  }
}

export function numberFieldRootAttributes(state: { disabled: boolean; readonly: boolean }) {
  return {
    role: 'group',
    'data-disabled': state.disabled ? '' : undefined,
    'data-readonly': state.readonly ? '' : undefined,
  } as const
}

export interface NumberFieldInputState {
  id: string | undefined
  value: string
  inputMode: NumberFieldInputMode
  disabled: boolean
  readonly: boolean
  modelValue: number | null | undefined
  min: number | undefined
  max: number | undefined
}

export function numberFieldInputAttributes(state: NumberFieldInputState) {
  return {
    id: state.id,
    value: state.value,
    role: 'spinbutton',
    type: 'text',
    tabindex: '0',
    inputmode: state.inputMode,
    disabled: state.disabled ? '' : undefined,
    'data-disabled': state.disabled ? '' : undefined,
    readonly: state.readonly ? '' : undefined,
    'data-readonly': state.readonly ? '' : undefined,
    autocomplete: 'off',
    autocorrect: 'off',
    spellcheck: 'false',
    'aria-roledescription': 'Number field',
    'aria-valuenow': state.modelValue,
    'aria-valuemin': state.min,
    'aria-valuemax': state.max,
  } as const
}

export function isNumberFieldStepDisabled(state: {
  disabled: boolean
  readonly: boolean
  own: boolean
  atLimit: boolean
}) {
  return state.disabled || state.readonly || state.own || state.atLimit
}

export interface NumberFieldStepState {
  direction: NumberFieldStep
  button: boolean
  disabled: boolean
  pressed: boolean
}

export function numberFieldStepAttributes(state: NumberFieldStepState) {
  return {
    tabindex: '-1',
    'aria-label': state.direction === 'increase' ? 'Increase' : 'Decrease',
    type: state.button ? 'button' : undefined,
    style: { userSelect: state.pressed ? 'none' : undefined },
    disabled: state.disabled ? '' : undefined,
    'data-disabled': state.disabled ? '' : undefined,
    'data-pressed': state.pressed ? 'true' : undefined,
  } as const
}
