import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  boundNumberFieldValue,
  clampNumberFieldValue,
  commitNumberFieldText,
  createNumberFieldFormat,
  createNumberFieldPressHold,
  deepActiveElement,
  formatNumberFieldValue,
  handleDecimalOperation,
  isNumberFieldAtLimit,
  isNumberFieldStepDisabled,
  nextNumberFieldValue,
  numberFieldInputAttributes,
  numberFieldInputMode,
  numberFieldKeyAction,
  numberFieldRootAttributes,
  numberFieldStepAttributes,
  numberFieldWheelStep,
  rejectsNumberFieldInput,
  resolveNumberFieldLocale,
  snapValueToStep,
  stepNumberFieldText,
} from '../src/primitives/number-field/index.ts'

const en = createNumberFieldFormat('en')
const range = (overrides = {}) => ({ step: 1, stepSnapping: true, ...overrides })

test('decimal arithmetic and snapping avoid floating point drift', () => {
  assert.equal(handleDecimalOperation('+', 0.1, 0.2), 0.3)
  assert.equal(handleDecimalOperation('-', 1.15, 0.05), 1.1)
  assert.equal(snapValueToStep(18.98, undefined, undefined, 1), 19)
  assert.equal(snapValueToStep(0.30000000000000004, 0, 1, 0.1), 0.3)
  assert.equal(snapValueToStep(11, 0, 10, 3), 9)
  assert.equal(snapValueToStep(-7, undefined, -2, 5), -5)
})

test('clamping snaps to the step grid, respects bounds and rounds through the formatter', () => {
  assert.equal(clampNumberFieldValue(99, range({ min: 0, max: 10 }), en), 10)
  assert.equal(clampNumberFieldValue(3.4, range({ min: 0, step: 0.5 }), en), 3.5)
  assert.equal(
    clampNumberFieldValue(3.4, range({ min: 0, step: 0.5, stepSnapping: false }), en),
    3.4,
  )
  assert.equal(clampNumberFieldValue(1.23456, range({ step: Number.NaN }), en), 1.235)
  const integers = createNumberFieldFormat('en', { maximumFractionDigits: 0 })
  assert.equal(clampNumberFieldValue(2.6, range({ stepSnapping: false }), integers), 3)
})

test('stepping follows HTML stepUp and stepDown from off-grid values', () => {
  assert.equal(nextNumberFieldValue('increase', 18.98, range(), en), 19)
  assert.equal(nextNumberFieldValue('decrease', 18.98, range(), en), 18)
  assert.equal(nextNumberFieldValue('increase', 18.2, range(), en), 19)
  assert.equal(nextNumberFieldValue('decrease', 18.7, range(), en), 18)
  assert.equal(nextNumberFieldValue('increase', 18.98, range(), en, 10), 28)
  assert.equal(nextNumberFieldValue('increase', 9, range({ max: 10, step: 0.5 }), en), 9.5)
  assert.equal(nextNumberFieldValue('increase', 9.5, range({ max: 10, step: 0.5 }), en, 10), 10)
  assert.equal(nextNumberFieldValue('increase', 18.98, range({ stepSnapping: false }), en), 19.98)
})

test('a step is disabled only when it cannot move an in-range value', () => {
  const bounded = range({ min: 0, max: 10, step: 0.5 })
  assert.equal(isNumberFieldAtLimit('increase', 10, bounded, en), true)
  assert.equal(isNumberFieldAtLimit('decrease', 10, bounded, en), false)
  assert.equal(isNumberFieldAtLimit('decrease', 0, bounded, en), true)
  assert.equal(isNumberFieldAtLimit('increase', null, bounded, en), false)
  assert.equal(isNumberFieldAtLimit('increase', undefined, bounded, en), false)
  assert.equal(isNumberFieldAtLimit('increase', Number.NaN, bounded, en), false)
  assert.equal(
    isNumberFieldStepDisabled({ disabled: false, readonly: true, own: false, atLimit: false }),
    true,
  )
  assert.equal(
    isNumberFieldStepDisabled({ disabled: false, readonly: false, own: false, atLimit: false }),
    false,
  )
})

test('stepping from the input text falls back to the clamped minimum or zero', () => {
  assert.equal(stepNumberFieldText('increase', '', range({ min: 5 }), en), 5)
  assert.equal(stepNumberFieldText('decrease', 'abc', range(), en), 0)
  assert.equal(stepNumberFieldText('increase', '', range({ max: -3 }), en), -3)
  assert.equal(stepNumberFieldText('increase', '1,234', range(), en), 1235)
  assert.equal(stepNumberFieldText('decrease', '4', range(), en, 10), -6)
})

test('Home and End resolve to the clamped bounds when they exist', () => {
  assert.equal(boundNumberFieldValue('min', range({ min: 1, max: 9 }), en), 1)
  assert.equal(boundNumberFieldValue('max', range({ min: 1, max: 9 }), en), 9)
  assert.equal(boundNumberFieldValue('max', range({ min: 1 }), en), undefined)
  assert.equal(boundNumberFieldValue('min', range({ min: 0.3, step: 0.5 }), en), 0.3)
})

test('committing text parses, clamps and decides whether the input is reformatted', () => {
  assert.deepEqual(commitNumberFieldText('99', range({ min: 0, max: 10 }), en), {
    value: 10,
    reformat: true,
  })
  assert.deepEqual(commitNumberFieldText('', range(), en), { value: undefined, reformat: false })
  assert.deepEqual(commitNumberFieldText('abc', range(), en), { value: undefined, reformat: true })
  const euro = createNumberFieldFormat('de-DE', { style: 'currency', currency: 'EUR' })
  const committed = commitNumberFieldText('1234,5', range({ step: 0.01 }), euro)
  assert.equal(committed.value, 1234.5)
  assert.equal(formatNumberFieldValue(committed.value, euro), '1.234,50 €')
})

test('text formatting and input mode follow the locale and format options', () => {
  const yuan = createNumberFieldFormat('zh-CN', { style: 'currency', currency: 'CNY' })
  assert.equal(formatNumberFieldValue(1234.5, yuan), '¥1,234.50')
  assert.equal(formatNumberFieldValue(null, en), '')
  assert.equal(formatNumberFieldValue(undefined, en), '')
  assert.equal(formatNumberFieldValue(Number.NaN, en), '')
  assert.equal(numberFieldInputMode(en), 'decimal')
  assert.equal(
    numberFieldInputMode(createNumberFieldFormat('en', { maximumFractionDigits: 0 })),
    'numeric',
  )
  assert.equal(resolveNumberFieldLocale('de-DE', 'fr'), 'de-DE')
  assert.equal(resolveNumberFieldLocale('', 'fr'), 'fr')
  assert.equal(resolveNumberFieldLocale(undefined, undefined), 'en')
})

test('beforeinput rejects text that cannot become a valid number', () => {
  const insert = { isComposing: false, inputType: 'insertText' }
  const caret = (value, selectionStart = value.length, selectionEnd = selectionStart) => ({
    value,
    selectionStart,
    selectionEnd,
  })
  const bounded = range({ min: 0, max: 10 })
  const rejects = (event, input, limits = bounded) =>
    rejectsNumberFieldInput(event, input, limits, en)
  assert.equal(rejects({ ...insert, data: 'a' }, caret('')), true)
  assert.equal(rejects({ ...insert, data: '9' }, caret('9')), false)
  assert.equal(rejects({ ...insert, data: '-' }, caret('')), true)
  assert.equal(rejects({ ...insert, data: '-' }, caret(''), range()), false)
  assert.equal(rejects({ ...insert, data: '.' }, caret('12', 1, 2)), false)
  assert.equal(rejects({ ...insert, data: 'a', isComposing: true }, caret('')), false)
  assert.equal(
    rejects({ isComposing: false, inputType: 'deleteContentBackward', data: null }, caret('1')),
    false,
  )
  assert.equal(
    rejects({ isComposing: false, inputType: 'historyUndo', data: null }, caret('1')),
    false,
  )
})

test('keyboard mapping steps, jumps to bounds, commits on Enter and ignores composition', () => {
  const key = (name, isComposing = false) => ({ key: name, isComposing })
  assert.deepEqual(numberFieldKeyAction(key('ArrowUp'), false), {
    type: 'step',
    direction: 'increase',
    multiplier: 1,
    prevent: true,
  })
  assert.deepEqual(numberFieldKeyAction(key('PageDown'), false), {
    type: 'step',
    direction: 'decrease',
    multiplier: 10,
    prevent: true,
  })
  assert.deepEqual(numberFieldKeyAction(key('Home'), false), {
    type: 'bound',
    bound: 'min',
    prevent: true,
  })
  assert.deepEqual(numberFieldKeyAction(key('End'), false), {
    type: 'bound',
    bound: 'max',
    prevent: true,
  })
  assert.deepEqual(numberFieldKeyAction(key('Enter'), false), { type: 'commit', prevent: false })
  assert.equal(numberFieldKeyAction(key('ArrowUp'), true), undefined)
  assert.equal(numberFieldKeyAction(key('Enter', true), false), undefined)
  assert.equal(numberFieldKeyAction(key('a'), false), undefined)
})

test('the wheel steps only a focused field on a mostly vertical scroll', () => {
  const state = { focused: true, disabled: false, inverted: false }
  const wheel = (deltaY, deltaX = 0) => ({ deltaX, deltaY })
  assert.equal(numberFieldWheelStep(wheel(4), state), 'increase')
  assert.equal(numberFieldWheelStep(wheel(-4), state), 'decrease')
  assert.equal(numberFieldWheelStep(wheel(4), { ...state, inverted: true }), 'decrease')
  assert.equal(numberFieldWheelStep(wheel(-4), { ...state, inverted: true }), 'increase')
  assert.equal(numberFieldWheelStep(wheel(4, 4), state), undefined)
  assert.equal(numberFieldWheelStep(wheel(0), state), undefined)
  assert.equal(numberFieldWheelStep(wheel(4), { ...state, focused: false }), undefined)
  assert.equal(numberFieldWheelStep(wheel(4), { ...state, disabled: true }), undefined)
})

test('the deep active element descends through open shadow roots', () => {
  const inner = { shadowRoot: null }
  const host = { shadowRoot: { activeElement: inner } }
  assert.equal(deepActiveElement({ activeElement: host }), inner)
  assert.equal(deepActiveElement({ activeElement: null }), null)
  const closed = { shadowRoot: { activeElement: null } }
  assert.equal(deepActiveElement({ activeElement: closed }), closed)
})

test('press and hold triggers immediately, then after the delay, then on every interval', () => {
  const scheduled = []
  const cleared = []
  const timers = {
    setTimeout: (callback, delay) => scheduled.push({ callback, delay }) - 1,
    clearTimeout: handle => cleared.push(handle),
  }
  const states = []
  let triggers = 0
  let disabled = false
  const hold = createNumberFieldPressHold({
    timers,
    disabled: () => disabled,
    trigger: () => triggers++,
    pressed: pressed => states.push(pressed),
  })
  let prevented = 0
  const event = button => ({ button, preventDefault: () => prevented++ })

  hold.press(event(2))
  assert.equal(triggers, 0)
  assert.equal(prevented, 0)

  hold.press(event(0))
  assert.equal(triggers, 1)
  assert.equal(prevented, 1)
  assert.deepEqual(states, [true])
  assert.equal(scheduled.at(-1).delay, 400)

  hold.press(event(0))
  assert.equal(triggers, 1)

  scheduled.at(-1).callback()
  assert.equal(triggers, 2)
  assert.equal(scheduled.at(-1).delay, 60)
  scheduled.at(-1).callback()
  assert.equal(triggers, 3)

  disabled = true
  const pending = scheduled.length
  scheduled.at(-1).callback()
  assert.equal(triggers, 3)
  assert.equal(scheduled.length, pending)

  hold.release()
  assert.deepEqual(states, [true, false])
  assert.equal(cleared.at(-1), pending - 1)

  disabled = true
  hold.press(event(0))
  assert.equal(triggers, 3)
  assert.deepEqual(states, [true, false, true])
})

test('part attributes keep the primitive markup order and value conventions', () => {
  assert.deepEqual(Object.entries(numberFieldRootAttributes({ disabled: true, readonly: false })), [
    ['role', 'group'],
    ['data-disabled', ''],
    ['data-readonly', undefined],
  ])
  const input = numberFieldInputAttributes({
    id: 'qty',
    value: '5',
    inputMode: 'decimal',
    disabled: false,
    readonly: true,
    modelValue: 5,
    min: 0,
    max: undefined,
  })
  assert.deepEqual(Object.keys(input), [
    'id',
    'value',
    'role',
    'type',
    'tabindex',
    'inputmode',
    'disabled',
    'data-disabled',
    'readonly',
    'data-readonly',
    'autocomplete',
    'autocorrect',
    'spellcheck',
    'aria-roledescription',
    'aria-valuenow',
    'aria-valuemin',
    'aria-valuemax',
  ])
  assert.equal(input.disabled, undefined)
  assert.equal(input.readonly, '')
  assert.equal(input['aria-valuenow'], 5)
  assert.deepEqual(
    numberFieldStepAttributes({
      direction: 'decrease',
      button: true,
      disabled: true,
      pressed: true,
    }),
    {
      tabindex: '-1',
      'aria-label': 'Decrease',
      type: 'button',
      style: { userSelect: 'none' },
      disabled: '',
      'data-disabled': '',
      'data-pressed': 'true',
    },
  )
  const idle = numberFieldStepAttributes({
    direction: 'increase',
    button: false,
    disabled: false,
    pressed: false,
  })
  assert.deepEqual(Object.keys(idle), [
    'tabindex',
    'aria-label',
    'type',
    'style',
    'disabled',
    'data-disabled',
    'data-pressed',
  ])
  assert.equal(idle.type, undefined)
  assert.deepEqual(idle.style, { userSelect: undefined })
})
