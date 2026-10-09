'use client'

import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from 'react'
import type { DateValue } from '@internationalized/date'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { PrimitiveVisuallyHidden } from '../visually-hidden'
import {
  getDefaultDate,
  hasTime,
  isBefore,
  type Granularity,
  type HourCycle,
} from './date/comparators'
import { createDateFormatter } from './date/formatter'
import { useDirection, useLocale, useNextTick, useStore, useVModel, useWatch } from './date/hooks'
import {
  createContent,
  initializeSegmentValues,
  syncSegmentValues,
  type SegmentContent,
  type SegmentValueObj,
} from './date/parser'
import { getSegmentElements, isSegmentNavigationKey } from './date/segment'
import {
  SegmentInput,
  type SegmentFieldContext,
  type SegmentInputConfig,
  type SegmentInputProps,
} from './date/segment-input'
import type { SegmentStore } from './date/use-date-field'
import {
  getInputType,
  kbd,
  normalizeDateStep,
  normalizeHourCycle,
  normalizeInputValue,
  type DateStep,
} from './date/utils'

export type { DateStep } from './date/utils'
export type { SegmentContent } from './date/parser'
export type { Granularity, HourCycle } from './date/comparators'
import { useComposedRefs } from '../utils/compose-refs'

interface DateFieldContextValue extends SegmentFieldContext {
  segmentValues: SegmentStore
  modelValue: { set: (value: DateValue | undefined) => void }
}

const DateFieldContext = createContext<DateFieldContextValue | null>(null)

function useDateFieldContext() {
  const context = useContext(DateFieldContext)
  if (!context) throw new Error('`DateFieldInput` must be used within `DateFieldRoot`')
  return context
}

export interface DateFieldSlotProps {
  modelValue: DateValue | undefined
  segments: SegmentContent[]
  isInvalid: boolean
}

export interface DateFieldRootProps
  extends
    PrimitiveProps,
    Omit<HTMLAttributes<HTMLElement>, 'defaultValue' | 'placeholder' | 'children' | 'dir'> {
  defaultValue?: DateValue
  defaultPlaceholder?: DateValue
  placeholder?: DateValue
  onPlaceholderChange?: (value: DateValue) => void
  value?: DateValue
  onValueChange?: (value: DateValue | undefined) => void
  hourCycle?: HourCycle
  step?: DateStep
  stepSnapping?: boolean
  granularity?: Granularity
  hideTimeZone?: boolean
  maxValue?: DateValue
  minValue?: DateValue
  locale?: string
  disabled?: boolean
  readonly?: boolean
  isDateUnavailable?: (date: DateValue) => boolean
  id?: string
  dir?: string
  name?: string
  required?: boolean
  children?: (props: DateFieldSlotProps) => ReactNode
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function DateFieldRoot({
  defaultValue,
  defaultPlaceholder,
  placeholder: placeholderProp,
  onPlaceholderChange,
  value,
  onValueChange,
  hourCycle,
  step: stepProp,
  stepSnapping = false,
  granularity,
  hideTimeZone,
  maxValue,
  minValue,
  locale: localeProp,
  disabled = false,
  readonly = false,
  isDateUnavailable,
  id,
  dir: dirProp,
  name,
  required,
  children,
  onKeyDown,
  ref,
  ...attrs
}: DateFieldRootProps) {
  const locale = useLocale(localeProp)
  const dir = useDirection(dirProp as 'ltr' | 'rtl' | undefined)
  const formatterRef = useRef<ReturnType<typeof createDateFormatter> | null>(null)
  if (!formatterRef.current)
    formatterRef.current = createDateFormatter(locale, {
      hourCycle: normalizeHourCycle(hourCycle),
    })
  const formatter = formatterRef.current
  const parentElement = useRef<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, parentElement)
  const segmentElements = useRef(new Set<HTMLElement>())
  const nextTick = useNextTick()

  const modelValue = useVModel<DateValue | undefined>(value, onValueChange, () => defaultValue)
  const placeholder = useVModel<DateValue>(
    placeholderProp,
    onPlaceholderChange as (value: DateValue) => void,
    () =>
      defaultPlaceholder ??
      getDefaultDate({
        defaultPlaceholder: placeholderProp,
        granularity,
        defaultValue: modelValue.value,
        locale: localeProp,
      }).copy(),
  )
  const step = useMemo(() => normalizeDateStep(stepProp), [stepProp])
  const inferredGranularity: Granularity = granularity
    ? !hasTime(placeholder.value)
      ? 'day'
      : granularity
    : hasTime(placeholder.value)
      ? 'minute'
      : 'day'

  const current = modelValue.value
  const isInvalid = !current
    ? false
    : !!isDateUnavailable?.(current) ||
      !!(minValue && isBefore(current, minValue)) ||
      !!(maxValue && isBefore(maxValue, current))

  const initialRef = useRef<SegmentValueObj | null>(null)
  if (!initialRef.current) initialRef.current = initializeSegmentValues(inferredGranularity)
  const initialSegments = initialRef.current
  const segmentValues = useStore<SegmentValueObj>(() =>
    current ? { ...syncSegmentValues({ value: current, formatter }) } : { ...initialSegments },
  )

  const segmentContents = createContent({
    granularity: inferredGranularity,
    dateRef: placeholder.value,
    formatter,
    hideTimeZone,
    hourCycle,
    segmentValues: segmentValues.value,
    locale,
  }).arr

  useLayoutEffect(() => {
    for (const item of getSegmentElements(parentElement.current)) segmentElements.current.add(item)
  }, [])

  useWatch([locale] as const, ([next]) => {
    if (formatter.getLocale() !== next) {
      formatter.setLocale(next)
      nextTick(() => {
        segmentElements.current.clear()
        for (const item of getSegmentElements(parentElement.current))
          segmentElements.current.add(item)
      })
    }
  })

  useWatch([current] as const, ([next]) => {
    if (next != null && placeholder.get().compare(next) !== 0) placeholder.set(next.copy())
  })

  useWatch([current, locale] as const, ([next]) => {
    if (next != null) segmentValues.set({ ...syncSegmentValues({ value: next, formatter }) })
    else if (Object.values(segmentValues.get()).every(item => item !== null))
      segmentValues.set({ ...initialSegments })
  })

  const focusedElement = useRef<HTMLElement | null>(null)

  function currentSegmentIndex() {
    return Array.from(segmentElements.current).findIndex(
      el =>
        el.getAttribute('data-radix-date-field-segment') ===
        focusedElement.current?.getAttribute('data-radix-date-field-segment'),
    )
  }

  function nextFocusableSegment() {
    const index = currentSegmentIndex()
    const sign = dir === 'rtl' ? -1 : 1
    const nextCondition = sign < 0 ? index < 0 : index > segmentElements.current.size - 1
    if (nextCondition) return null
    return Array.from(segmentElements.current)[index + sign]
  }

  function prevFocusableSegment() {
    const index = currentSegmentIndex()
    const sign = dir === 'rtl' ? -1 : 1
    const prevCondition = sign > 0 ? index < 0 : index > segmentElements.current.size - 1
    if (prevCondition) return null
    return Array.from(segmentElements.current)[index - sign]
  }

  function handleKeydown(event: KeyboardEvent<HTMLElement>) {
    onKeyDown?.(event)
    if (event.key !== kbd.ARROW_LEFT && event.key !== kbd.ARROW_RIGHT) return
    if (event.nativeEvent.isComposing) return
    if (!isSegmentNavigationKey(event.key)) return
    if (event.key === kbd.ARROW_LEFT) prevFocusableSegment()?.focus()
    if (event.key === kbd.ARROW_RIGHT) nextFocusableSegment()?.focus()
  }

  const context: DateFieldContextValue = {
    placeholder: placeholder.get,
    hourCycle,
    step,
    stepSnapping,
    formatter,
    disabled,
    readonly,
    isInvalid,
    segmentValues,
    modelValue,
    focusNext: () => Array.from(segmentElements.current)[currentSegmentIndex() + 1]?.focus(),
    setFocusedElement: element => {
      focusedElement.current = element
    },
  }

  return (
    <DateFieldContext value={context}>
      <Primitive
        {...attrs}
        ref={composedRef}
        role="group"
        aria-disabled={disabled ? true : undefined}
        data-disabled={disabled ? '' : undefined}
        data-readonly={readonly ? '' : undefined}
        data-invalid={isInvalid ? '' : undefined}
        dir={dir}
        onKeyDown={handleKeydown}
      >
        {children?.({ modelValue: current, segments: segmentContents, isInvalid })}
        <PrimitiveVisuallyHidden
          id={id}
          as="input"
          feature="focusable"
          {...({
            type: getInputType(inferredGranularity),
            tabIndex: -1,
            value: normalizeInputValue(current, inferredGranularity),
            name,
            disabled,
            required,
            max: maxValue ? normalizeInputValue(maxValue, inferredGranularity) : undefined,
            min: minValue ? normalizeInputValue(minValue, inferredGranularity) : undefined,
            onChange: () => {},
          } as HTMLAttributes<HTMLElement>)}
          onFocus={() => Array.from(segmentElements.current)[0]?.focus()}
        />
      </Primitive>
    </DateFieldContext>
  )
}

export interface DateFieldInputProps extends SegmentInputProps {}

export function DateFieldInput(props: DateFieldInputProps) {
  const context = useDateFieldContext()
  const config: SegmentInputConfig = {
    context,
    segmentValues: context.segmentValues,
    modelValue: context.modelValue,
    segmentAttribute: 'data-radix-date-field-segment',
    snapOnFocusOut: true,
  }
  return <SegmentInput {...props} config={config} />
}
