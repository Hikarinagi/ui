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
import {
  Time,
  getLocalTimeZone,
  isEqualDay,
  toCalendarDateTime,
  today,
  type DateValue,
} from '@internationalized/date'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { PrimitiveVisuallyHidden } from '../visually-hidden'
import {
  getDefaultTime,
  isBefore,
  type HourCycle,
  type TimeValue,
} from '../date-field/date/comparators'
import { createDateFormatter } from '../date-field/date/formatter'
import {
  useDirection,
  useLocale,
  useNextTick,
  useStore,
  useVModel,
  useWatch,
} from '../date-field/date/hooks'
import {
  createContent,
  initializeTimeSegmentValues,
  syncTimeSegmentValues,
  type SegmentContent,
  type SegmentValueObj,
} from '../date-field/date/parser'
import { getTimeFieldSegmentElements, isSegmentNavigationKey } from '../date-field/date/segment'
import {
  SegmentInput,
  type SegmentFieldContext,
  type SegmentInputConfig,
  type SegmentInputProps,
} from '../date-field/date/segment-input'
import type { SegmentStore } from '../date-field/date/use-date-field'
import { kbd, normalizeDateStep, normalizeHourCycle, type DateStep } from '../date-field/date/utils'

export type { TimeValue } from '../date-field/date/comparators'

type Converted = DateValue & { hour: number; minute: number; second: number; millisecond: number }

function convertValue(value: TimeValue, date = today(getLocalTimeZone())): Converted {
  if (value && 'day' in value) return value as Converted
  return toCalendarDateTime(date, value as Time) as Converted
}

interface TimeFieldContextValue extends SegmentFieldContext {
  segmentValues: SegmentStore
  modelValue: { set: (value: DateValue | undefined) => void }
}

const TimeFieldContext = createContext<TimeFieldContextValue | null>(null)

function useTimeFieldContext() {
  const context = useContext(TimeFieldContext)
  if (!context) throw new Error('`TimeFieldInput` must be used within `TimeFieldRoot`')
  return context
}

export interface TimeFieldSlotProps {
  modelValue: TimeValue | undefined
  segments: SegmentContent[]
  isInvalid: boolean
}

export interface TimeFieldRootProps
  extends
    PrimitiveProps,
    Omit<HTMLAttributes<HTMLElement>, 'defaultValue' | 'placeholder' | 'children' | 'dir'> {
  defaultValue?: TimeValue
  defaultPlaceholder?: TimeValue
  placeholder?: TimeValue
  onPlaceholderChange?: (value: TimeValue) => void
  value?: TimeValue
  onValueChange?: (value: TimeValue | undefined) => void
  hourCycle?: HourCycle
  step?: DateStep
  stepSnapping?: boolean
  granularity?: 'hour' | 'minute' | 'second'
  hideTimeZone?: boolean
  maxValue?: TimeValue
  minValue?: TimeValue
  locale?: string
  disabled?: boolean
  readonly?: boolean
  id?: string
  dir?: string
  name?: string
  required?: boolean
  children?: (props: TimeFieldSlotProps) => ReactNode
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function TimeFieldRoot({
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
  id,
  dir: dirProp,
  name,
  required,
  children,
  onKeyDown,
  ref,
  ...attrs
}: TimeFieldRootProps) {
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
  const step = useMemo(() => normalizeDateStep(stepProp), [stepProp])
  const convertedMinValue = useMemo(
    () => (minValue ? convertValue(minValue) : undefined),
    [minValue],
  )
  const convertedMaxValue = useMemo(
    () => (maxValue ? convertValue(maxValue) : undefined),
    [maxValue],
  )

  const modelValue = useVModel<TimeValue | undefined>(value, onValueChange, () => defaultValue)
  const model = modelValue.value
  const convertedModelValue = useMemo(() => (model == null ? model : convertValue(model)), [model])
  const setConvertedModelValue = (newValue: DateValue | undefined) => {
    const current = modelValue.get()
    if (newValue) {
      const next = newValue as Converted
      modelValue.set(
        current && 'day' in current
          ? (newValue as TimeValue)
          : new Time(next.hour, next.minute, next.second, current?.millisecond),
      )
    } else modelValue.set(newValue)
  }

  const placeholder = useVModel<TimeValue>(
    placeholderProp,
    onPlaceholderChange as (value: TimeValue) => void,
    () =>
      defaultPlaceholder ??
      getDefaultTime({ defaultPlaceholder: placeholderProp, defaultValue: model }).copy(),
  )
  const convertedPlaceholder = useMemo(() => convertValue(placeholder.value), [placeholder.value])
  const latestPlaceholder = useRef(convertedPlaceholder)
  latestPlaceholder.current = convertedPlaceholder

  const inferredGranularity = granularity ?? 'minute'
  const isInvalid = !model
    ? false
    : !!(convertedMinValue && isBefore(convertedModelValue!, convertedMinValue)) ||
      !!(convertedMaxValue && isBefore(convertedMaxValue, convertedModelValue!))

  const initialRef = useRef<SegmentValueObj | null>(null)
  if (!initialRef.current) initialRef.current = initializeTimeSegmentValues(inferredGranularity)
  const initialSegments = initialRef.current
  const segmentValues = useStore<SegmentValueObj>(() =>
    model
      ? { ...syncTimeSegmentValues({ value: convertedModelValue!, formatter }) }
      : { ...initialSegments },
  )

  const allContents = createContent({
    granularity: inferredGranularity,
    dateRef: convertedPlaceholder,
    formatter,
    hideTimeZone,
    hourCycle,
    segmentValues: segmentValues.value,
    locale,
    isTimeValue: true,
  }).arr
  const segmentContents =
    hourCycle === 12
      ? allContents.map(segment => {
          if (segment.part === 'hour' && 'hour' in segmentValues.value) {
            const hour = segmentValues.value.hour
            if (hour != null) {
              const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
              return { ...segment, value: displayHour.toString() }
            }
          }
          return segment
        })
      : allContents

  useLayoutEffect(() => {
    for (const item of getTimeFieldSegmentElements(parentElement.current))
      segmentElements.current.add(item)
  }, [])

  useWatch([locale] as const, ([next]) => {
    if (formatter.getLocale() !== next) {
      formatter.setLocale(next)
      nextTick(() => {
        segmentElements.current.clear()
        for (const item of getTimeFieldSegmentElements(parentElement.current))
          segmentElements.current.add(item)
      })
    }
  })

  useWatch([convertedModelValue] as const, ([next]) => {
    const current = latestPlaceholder.current
    if (next != null && (!isEqualDay(current, next) || current.compare(next) !== 0))
      placeholder.set(next.copy() as TimeValue)
  })

  useWatch([convertedModelValue, locale] as const, ([next]) => {
    if (next != null) segmentValues.set({ ...syncTimeSegmentValues({ value: next, formatter }) })
    else if (Object.values(segmentValues.get()).every(item => item !== null))
      segmentValues.set({ ...initialSegments })
  })

  const focusedElement = useRef<HTMLElement | null>(null)

  function currentSegmentIndex() {
    return Array.from(segmentElements.current).findIndex(
      el =>
        el.getAttribute('data-radix-time-field-segment') ===
        focusedElement.current?.getAttribute('data-radix-time-field-segment'),
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

  const context: TimeFieldContextValue = {
    placeholder: () => latestPlaceholder.current,
    hourCycle,
    step,
    stepSnapping,
    formatter,
    disabled,
    readonly,
    isInvalid,
    segmentValues,
    modelValue: { set: setConvertedModelValue },
    focusNext: () => Array.from(segmentElements.current)[currentSegmentIndex() + 1]?.focus(),
    setFocusedElement: element => {
      focusedElement.current = element
    },
  }

  return (
    <TimeFieldContext value={context}>
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
        {children?.({ modelValue: model, segments: segmentContents, isInvalid })}
        <PrimitiveVisuallyHidden
          id={id}
          as="input"
          feature="focusable"
          {...({
            tabIndex: -1,
            value: model ? model.toString() : '',
            name,
            disabled,
            required,
            onChange: () => {},
          } as HTMLAttributes<HTMLElement>)}
          onFocus={() => Array.from(segmentElements.current)[0]?.focus()}
        />
      </Primitive>
    </TimeFieldContext>
  )
}

export interface TimeFieldInputProps extends SegmentInputProps {}

export function TimeFieldInput(props: TimeFieldInputProps) {
  const context = useTimeFieldContext()
  const config: SegmentInputConfig = {
    context,
    segmentValues: context.segmentValues,
    modelValue: context.modelValue,
    segmentAttribute: 'data-radix-time-field-segment',
    snapOnFocusOut: true,
  }
  return <SegmentInput {...props} config={config} />
}
