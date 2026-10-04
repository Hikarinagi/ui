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
import { useComposedRefs } from 'radix-ui/internal'
import type { DateValue } from '@internationalized/date'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { PrimitiveVisuallyHidden } from '../visually-hidden'
import {
  areAllDaysBetweenValid,
  getDefaultDate,
  hasTime,
  isBefore,
  isBeforeOrSame,
  type Granularity,
  type HourCycle,
} from '../date-field/date/comparators'
import { createDateFormatter } from '../date-field/date/formatter'
import {
  useDirection,
  useLocale,
  useNextTick,
  useStore,
  useVModel,
  useWatch,
  type Store,
} from '../date-field/date/hooks'
import {
  createContent,
  initializeSegmentValues,
  syncSegmentValues,
  type SegmentContent,
  type SegmentValueObj,
} from '../date-field/date/parser'
import { getSegmentElements, isSegmentNavigationKey } from '../date-field/date/segment'
import {
  SegmentInput,
  type SegmentFieldContext,
  type SegmentInputConfig,
  type SegmentInputProps,
} from '../date-field/date/segment-input'
import { kbd, normalizeDateStep, normalizeHourCycle, type DateStep } from '../date-field/date/utils'

export interface DateRange {
  start: DateValue | undefined
  end: DateValue | undefined
}

type DateRangeType = 'start' | 'end'

interface DateRangeFieldContextValue extends SegmentFieldContext {
  segmentValues: Record<DateRangeType, Store<SegmentValueObj>>
  startValue: Store<DateValue | undefined>
  endValue: Store<DateValue | undefined>
}

const DateRangeFieldContext = createContext<DateRangeFieldContextValue | null>(null)

function useDateRangeFieldContext() {
  const context = useContext(DateRangeFieldContext)
  if (!context) throw new Error('`DateRangeFieldInput` must be used within `DateRangeFieldRoot`')
  return context
}

export interface DateRangeFieldSlotProps {
  modelValue: DateRange | null
  segments: Record<DateRangeType, SegmentContent[]>
  isInvalid: boolean
}

export interface DateRangeFieldRootProps
  extends
    PrimitiveProps,
    Omit<HTMLAttributes<HTMLElement>, 'defaultValue' | 'placeholder' | 'children' | 'dir'> {
  defaultValue?: DateRange
  defaultPlaceholder?: DateValue
  placeholder?: DateValue
  onPlaceholderChange?: (value: DateValue) => void
  value?: DateRange | null
  onValueChange?: (value: DateRange) => void
  hourCycle?: HourCycle
  step?: DateStep
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
  children?: (props: DateRangeFieldSlotProps) => ReactNode
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function DateRangeFieldRoot({
  defaultValue,
  defaultPlaceholder,
  placeholder: placeholderProp,
  onPlaceholderChange,
  value,
  onValueChange,
  hourCycle,
  step: stepProp,
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
}: DateRangeFieldRootProps) {
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

  const modelValue = useVModel<DateRange | null | undefined>(
    value,
    onValueChange as (value: DateRange | null | undefined) => void,
    () => defaultValue ?? { start: undefined, end: undefined },
  )
  const model = modelValue.value
  const placeholder = useVModel<DateValue>(
    placeholderProp,
    onPlaceholderChange as (value: DateValue) => void,
    () =>
      defaultPlaceholder ??
      getDefaultDate({
        defaultPlaceholder: placeholderProp,
        granularity,
        defaultValue: model?.start,
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

  function invalidSide(side: DateValue | undefined) {
    if (!side) return false
    if (isDateUnavailable?.(side)) return true
    if (minValue && isBefore(side, minValue)) return true
    if (maxValue && isBefore(maxValue, side)) return true
    return false
  }

  function computeInvalid() {
    if (invalidSide(model?.start) || invalidSide(model?.end)) return true
    if (!model?.start || !model?.end) return false
    if (!isBeforeOrSame(model.start, model.end)) return true
    if (isDateUnavailable !== undefined)
      return !areAllDaysBetweenValid(model.start, model.end, isDateUnavailable, undefined)
    return false
  }
  const isInvalid = computeInvalid()

  const initialRef = useRef<SegmentValueObj | null>(null)
  if (!initialRef.current) initialRef.current = initializeSegmentValues(inferredGranularity)
  const initialSegments = initialRef.current
  const startSegmentValues = useStore<SegmentValueObj>(() =>
    model?.start
      ? { ...syncSegmentValues({ value: model.start, formatter }) }
      : { ...initialSegments },
  )
  const endSegmentValues = useStore<SegmentValueObj>(() =>
    model?.end ? { ...syncSegmentValues({ value: model.end, formatter }) } : { ...initialSegments },
  )

  const content = (segmentValues: SegmentValueObj) =>
    createContent({
      granularity: inferredGranularity,
      dateRef: placeholder.value,
      formatter,
      hideTimeZone,
      hourCycle,
      segmentValues,
      locale,
    }).arr
  const segmentContents = {
    start: content(startSegmentValues.value),
    end: content(endSegmentValues.value),
  }

  const startValue = useStore<DateValue | undefined>(() => model?.start?.copy())
  const endValue = useStore<DateValue | undefined>(() => model?.end?.copy())

  useLayoutEffect(() => {
    for (const item of getSegmentElements(parentElement.current)) segmentElements.current.add(item)
  }, [])

  useWatch([startValue.value, endValue.value] as const, ([start, end]) => {
    modelValue.set({ start: start?.copy(), end: end?.copy() })
  })

  useWatch([model] as const, ([next]) => {
    const start = startValue.get()
    const isStartChanged =
      next?.start && start ? next.start.compare(start) !== 0 : next?.start !== start
    if (isStartChanged) startValue.set(next?.start?.copy())
    const end = endValue.get()
    const isEndChanged = next?.end && end ? next.end.compare(end) !== 0 : next?.end !== end
    if (isEndChanged) endValue.set(next?.end?.copy())
  })

  useWatch([startValue.value, locale] as const, ([start]) => {
    if (start !== undefined)
      startSegmentValues.set({ ...syncSegmentValues({ value: start, formatter }) })
    else if (Object.values(startSegmentValues.get()).every(item => item !== null))
      startSegmentValues.set({ ...initialSegments })
  })

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

  useWatch([model] as const, ([next]) => {
    if (next && next.start !== undefined && placeholder.get().compare(next.start) !== 0)
      placeholder.set(next.start.copy())
  })

  useWatch([endValue.value, locale] as const, ([end]) => {
    if (end !== undefined) endSegmentValues.set({ ...syncSegmentValues({ value: end, formatter }) })
    else if (Object.values(endSegmentValues.get()).every(item => item !== null))
      endSegmentValues.set({ ...initialSegments })
  })

  const focusedElement = useRef<HTMLElement | null>(null)

  function currentSegmentIndex() {
    return Array.from(segmentElements.current).findIndex(
      el =>
        el.getAttribute('data-radix-date-field-segment') ===
          focusedElement.current?.getAttribute('data-radix-date-field-segment') &&
        el.getAttribute('data-radix-date-range-field-segment-type') ===
          focusedElement.current?.getAttribute('data-radix-date-range-field-segment-type'),
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

  const context: DateRangeFieldContextValue = {
    placeholder: placeholder.get,
    hourCycle,
    step,
    formatter,
    disabled,
    readonly,
    isInvalid,
    segmentValues: { start: startSegmentValues, end: endSegmentValues },
    startValue,
    endValue,
    focusNext: () => Array.from(segmentElements.current)[currentSegmentIndex() + 1]?.focus(),
    setFocusedElement: element => {
      focusedElement.current = element
    },
  }

  return (
    <DateRangeFieldContext value={context}>
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
        {children?.({ modelValue: model ?? null, segments: segmentContents, isInvalid })}
        <PrimitiveVisuallyHidden
          id={id}
          as="input"
          feature="focusable"
          {...({
            tabIndex: -1,
            value: `${model?.start?.toString()} - ${model?.end?.toString()}`,
            name,
            disabled,
            required,
            onChange: () => {},
          } as HTMLAttributes<HTMLElement>)}
          onFocus={() => Array.from(segmentElements.current)[0]?.focus()}
        />
      </Primitive>
    </DateRangeFieldContext>
  )
}

export interface DateRangeFieldInputProps extends SegmentInputProps {
  type: DateRangeType
}

export function DateRangeFieldInput({ type, ...props }: DateRangeFieldInputProps) {
  const context = useDateRangeFieldContext()
  const config: SegmentInputConfig = {
    context,
    segmentValues: context.segmentValues[type],
    modelValue: type === 'start' ? context.startValue : context.endValue,
    segmentAttribute: 'data-radix-date-field-segment',
    extra: { 'data-radix-date-range-field-segment-type': type },
    snapOnFocusOut: false,
  }
  return <SegmentInput {...props} config={config} />
}
