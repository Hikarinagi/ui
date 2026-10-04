'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ElementType,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react'
import { useComposedRefs, useControllableState } from 'radix-ui/internal'
import { Primitive } from '../../lib/primitive'
import { reactAttributes } from '../utils/attributes'
import { windowTimers } from '../utils/timers'
import {
  boundNumberFieldValue,
  commitNumberFieldText,
  createNumberFieldFormat,
  createNumberFieldPressHold,
  deepActiveElement,
  formatNumberFieldValue,
  isNumberFieldAtLimit,
  isNumberFieldStepDisabled,
  numberFieldInputAttributes,
  numberFieldInputMode,
  numberFieldKeyAction,
  numberFieldRootAttributes,
  numberFieldStepAttributes,
  numberFieldWheelStep,
  rejectsNumberFieldInput,
  resolveNumberFieldLocale,
  stepNumberFieldText,
  type NumberFieldBound,
  type NumberFieldFormat,
  type NumberFieldInputMode,
  type NumberFieldRange,
  type NumberFieldStep,
} from '../../../../shared/src/primitives/number-field'

interface RootContextValue {
  modelValue: number | null | undefined
  step: (direction: NumberFieldStep, multiplier?: number) => void
  jump: (bound: NumberFieldBound) => void
  commit: (text: string) => void
  inputMode: NumberFieldInputMode
  inputEl: RefObject<HTMLInputElement | null>
  textValue: string
  range: NumberFieldRange
  format: NumberFieldFormat
  readonly: boolean
  disabled: boolean
  disableWheelChange: boolean
  invertWheelChange: boolean
  isDecreaseDisabled: boolean
  isIncreaseDisabled: boolean
  id: string | undefined
}

const RootContext = createContext<RootContextValue | null>(null)

function useRootContext(consumer: string) {
  const context = useContext(RootContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`NumberFieldRoot\``)
  return context
}

export interface NumberFieldRootProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'defaultValue' | 'onChange' | 'id'
> {
  as?: ElementType
  asChild?: boolean
  defaultValue?: number
  value?: number | null
  onValueChange?: (value: number | undefined) => void
  min?: number
  max?: number
  step?: number
  stepSnapping?: boolean
  focusOnChange?: boolean
  formatOptions?: Intl.NumberFormatOptions
  locale?: string
  disabled?: boolean
  readonly?: boolean
  disableWheelChange?: boolean
  invertWheelChange?: boolean
  id?: string
  children?: ReactNode
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function NumberFieldRoot({
  as = 'div',
  asChild,
  defaultValue,
  value,
  onValueChange,
  min,
  max,
  step = 1,
  stepSnapping = true,
  focusOnChange = true,
  formatOptions,
  locale,
  disabled = false,
  readonly = false,
  disableWheelChange = false,
  invertWheelChange = false,
  id,
  children,
  ...attrs
}: NumberFieldRootProps) {
  const [modelValue, setModelValue] = useControllableState<number | null | undefined>({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange as ((value: number | null | undefined) => void) | undefined,
    caller: 'NumberFieldRoot',
  })
  const controlled = value !== undefined
  const resolvedLocale = resolveNumberFieldLocale(locale)
  const inputEl = useRef<HTMLInputElement | null>(null)
  const format = useMemo(
    () => createNumberFieldFormat(resolvedLocale, formatOptions),
    [resolvedLocale, formatOptions],
  )
  const range: NumberFieldRange = { min, max, step, stepSnapping }
  const textValue = formatNumberFieldValue(modelValue, format)

  function stepBy(direction: NumberFieldStep, multiplier = 1) {
    if (focusOnChange) inputEl.current?.focus()
    if (disabled || readonly) return
    setModelValue(
      stepNumberFieldText(direction, inputEl.current?.value ?? '', range, format, multiplier),
    )
  }

  function jump(bound: NumberFieldBound) {
    const next = boundNumberFieldValue(bound, range, format)
    if (next !== undefined) setModelValue(next)
  }

  function commit(text: string) {
    const { value: next, reformat } = commitNumberFieldText(text, range, format)
    setModelValue(next)
    if (!inputEl.current) return
    inputEl.current.value = !reformat
      ? text
      : controlled
        ? textValue
        : formatNumberFieldValue(next, format)
  }

  const context: RootContextValue = {
    modelValue,
    step: stepBy,
    jump,
    commit,
    inputMode: numberFieldInputMode(format),
    inputEl,
    textValue,
    range,
    format,
    readonly,
    disabled,
    disableWheelChange,
    invertWheelChange,
    isDecreaseDisabled: isNumberFieldAtLimit('decrease', modelValue, range, format),
    isIncreaseDisabled: isNumberFieldAtLimit('increase', modelValue, range, format),
    id,
  }

  return (
    <RootContext value={context}>
      <Primitive
        as={as}
        asChild={asChild}
        {...attrs}
        {...reactAttributes(numberFieldRootAttributes({ disabled, readonly }))}
      >
        {children}
      </Primitive>
    </RootContext>
  )
}

export interface NumberFieldInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue'
> {
  ref?: Ref<HTMLInputElement>
  [attribute: `data-${string}`]: string | undefined
}

export function NumberFieldInput({
  ref,
  onKeyDown,
  onChange,
  onBlur,
  onCompositionStart,
  onCompositionEnd,
  ...props
}: NumberFieldInputProps) {
  const context = useRootContext('NumberFieldInput')
  const element = useComposedRefs(ref, context.inputEl)
  const composing = useRef(false)
  const [inputValue, setInputValue] = useState(context.textValue)
  const [seen, setSeen] = useState(context.textValue)
  if (seen !== context.textValue) {
    setSeen(context.textValue)
    setInputValue(context.textValue)
  }

  const latest = useRef(context)
  latest.current = context

  useEffect(() => {
    const node = context.inputEl.current
    if (!node) return
    function onBeforeInput(event: InputEvent) {
      const root = latest.current
      if (rejectsNumberFieldInput(event, event.target as HTMLInputElement, root.range, root.format))
        event.preventDefault()
    }
    function onWheel(event: WheelEvent) {
      const root = latest.current
      const direction = numberFieldWheelStep(event, {
        focused: event.target === deepActiveElement(document),
        disabled: root.disableWheelChange,
        inverted: root.invertWheelChange,
      })
      if (!direction) return
      event.preventDefault()
      root.step(direction)
    }
    function onNativeChange() {
      requestAnimationFrame(() => setInputValue(latest.current.textValue))
    }
    node.addEventListener('beforeinput', onBeforeInput)
    node.addEventListener('wheel', onWheel)
    node.addEventListener('change', onNativeChange)
    return () => {
      node.removeEventListener('beforeinput', onBeforeInput)
      node.removeEventListener('wheel', onWheel)
      node.removeEventListener('change', onNativeChange)
    }
  }, [context.inputEl])

  function handleKeydown(event: KeyboardEvent<HTMLInputElement>) {
    const action = numberFieldKeyAction(event.nativeEvent, composing.current)
    if (action?.prevent) event.preventDefault()
    if (action?.type === 'step') context.step(action.direction, action.multiplier)
    else if (action?.type === 'bound') context.jump(action.bound)
    else if (action?.type === 'commit') context.commit((event.target as HTMLInputElement).value)
    onKeyDown?.(event)
  }

  return (
    <input
      ref={element}
      {...reactAttributes(
        numberFieldInputAttributes({
          id: context.id,
          value: inputValue,
          inputMode: context.inputMode,
          disabled: context.disabled,
          readonly: context.readonly,
          modelValue: context.modelValue,
          min: context.range.min,
          max: context.range.max,
        }),
      )}
      {...props}
      onKeyDown={handleKeydown}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value)
        onChange?.(event)
      }}
      onBlur={event => {
        context.commit(event.target.value)
        onBlur?.(event)
      }}
      onCompositionStart={event => {
        composing.current = true
        onCompositionStart?.(event)
      }}
      onCompositionEnd={event => {
        void Promise.resolve().then(() => {
          composing.current = false
        })
        onCompositionEnd?.(event)
      }}
    />
  )
}

function usePressHold(disabled: boolean, onTrigger: () => void) {
  const [isPressed, setIsPressed] = useState(false)
  const latest = useRef({ disabled, onTrigger })
  latest.current = { disabled, onTrigger }
  const [hold] = useState(() =>
    createNumberFieldPressHold({
      timers: windowTimers,
      disabled: () => latest.current.disabled,
      trigger: () => latest.current.onTrigger(),
      pressed: setIsPressed,
    }),
  )

  useEffect(() => {
    window.addEventListener('pointerup', hold.release)
    window.addEventListener('pointercancel', hold.release)
    return () => {
      window.removeEventListener('pointerup', hold.release)
      window.removeEventListener('pointercancel', hold.release)
      hold.dispose()
    }
  }, [hold])

  return { isPressed, onPressStart: hold.press }
}

export interface NumberFieldStepProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  asChild?: boolean
  disabled?: boolean
  ref?: Ref<HTMLElement>
}

function NumberFieldStepButton({
  direction,
  as = 'button',
  asChild,
  disabled,
  style,
  onPointerDown,
  onContextMenu,
  ...props
}: NumberFieldStepProps & { direction: NumberFieldStep }) {
  const context = useRootContext(
    direction === 'increase' ? 'NumberFieldIncrement' : 'NumberFieldDecrement',
  )
  const isDisabled = isNumberFieldStepDisabled({
    disabled: context.disabled,
    readonly: context.readonly,
    own: !!disabled,
    atLimit: direction === 'increase' ? context.isIncreaseDisabled : context.isDecreaseDisabled,
  })
  const { isPressed, onPressStart } = usePressHold(isDisabled, () => context.step(direction))
  const { style: pressStyle, ...attributes } = numberFieldStepAttributes({
    direction,
    button: as === 'button',
    disabled: isDisabled,
    pressed: isPressed,
  })

  return (
    <Primitive
      as={as}
      asChild={asChild}
      {...reactAttributes(attributes)}
      {...props}
      style={{ ...style, ...pressStyle }}
      onPointerDown={event => {
        onPressStart(event as ReactPointerEvent)
        onPointerDown?.(event)
      }}
      onContextMenu={(event: MouseEvent<HTMLElement>) => {
        event.preventDefault()
        onContextMenu?.(event)
      }}
    />
  )
}

export function NumberFieldIncrement(props: NumberFieldStepProps) {
  return <NumberFieldStepButton {...props} direction="increase" />
}

export function NumberFieldDecrement(props: NumberFieldStepProps) {
  return <NumberFieldStepButton {...props} direction="decrease" />
}
