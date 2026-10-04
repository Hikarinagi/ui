'use client'

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { VisuallyHiddenInput, useCurrentElement, useFormControl } from '../utils/hidden-input'
import {
  ARROW_KEYS,
  BACK_KEYS,
  PAGE_KEYS,
  clamp,
  convertValueToPercentage,
  getClosestValueIndex,
  getDecimalCount,
  getLabel,
  getNextSortedValues,
  getThumbInBoundsOffset,
  hasMinStepsBetweenValues,
  linearScale,
  roundValue,
} from './utils'
import { composeEventHandlers } from '../utils/compose-event-handlers'
import { useComposedRefs } from '../utils/compose-refs'
import { useControllableState } from '../utils/controllable-state'
import { useDirection } from '../utils/direction'
import { useSize } from '../utils/size'

type DataAttributes = { [attribute: `data-${string}`]: string | undefined }
type Direction = 'ltr' | 'rtl'
type Orientation = 'horizontal' | 'vertical'
type ThumbAlignment = 'contain' | 'overflow'

const both = { checkForDefaultPrevented: false }
const ITEM_DATA_ATTR = 'data-radix-collection-item'

interface SliderRootContextValue {
  modelValue: number[] | null | undefined
  currentModelValue: number[]
  valueIndexToChangeRef: RefObject<number>
  thumbElements: RefObject<HTMLElement[]>
  registerThumb: (element: HTMLElement) => () => void
  orientation: Orientation
  min: number
  max: number
  disabled: boolean
  thumbAlignment: ThumbAlignment
}

const SliderRootContext = createContext<SliderRootContextValue | null>(null)

function useSliderRootContext(consumer: string) {
  const context = useContext(SliderRootContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`SliderRoot\``)
  return context
}

interface SliderOrientationContextValue {
  startEdge: 'left' | 'right' | 'top' | 'bottom'
  endEdge: 'left' | 'right' | 'top' | 'bottom'
  direction: number
  size: 'width' | 'height'
}

const SliderOrientationContext = createContext<SliderOrientationContextValue | null>(null)

export interface SliderRootProps
  extends
    PrimitiveProps,
    Omit<HTMLAttributes<HTMLElement>, 'defaultValue' | 'dir' | 'onChange'>,
    DataAttributes {
  value?: number[] | null
  defaultValue?: number[]
  onValueChange?: (value: number[]) => void
  onValueCommit?: (value: number[]) => void
  disabled?: boolean
  orientation?: Orientation
  dir?: Direction
  inverted?: boolean
  min?: number
  max?: number
  step?: number
  minStepsBetweenThumbs?: number
  thumbAlignment?: ThumbAlignment
  name?: string
  required?: boolean
  children?: ReactNode
  ref?: Ref<HTMLElement>
}

interface SlideHandlers {
  onSlideStart: (event: PointerEvent<HTMLElement>) => void
  onSlideMove: (event: PointerEvent<HTMLElement>) => void
  onSlideEnd: () => void
  onHomeKeyDown: (event: KeyboardEvent<HTMLElement>) => void
  onEndKeyDown: (event: KeyboardEvent<HTMLElement>) => void
  onStepKeyDown: (event: KeyboardEvent<HTMLElement>, direction: number) => void
}

export function SliderRoot({
  value,
  defaultValue = [0],
  onValueChange,
  onValueCommit,
  disabled = false,
  orientation = 'horizontal',
  dir: dirProp,
  inverted = false,
  min = 0,
  max = 100,
  step = 1,
  minStepsBetweenThumbs = 0,
  thumbAlignment = 'contain',
  as = 'span',
  asChild,
  name,
  required,
  children,
  onPointerDown,
  ref,
  ...attrs
}: SliderRootProps) {
  const dir = useDirection(dirProp)
  const [element, setElement] = useCurrentElement<HTMLElement>()
  const composedRef = useComposedRefs(ref, setElement)
  const isFormControl = useFormControl(element)
  const [modelValue, setModelValue] = useControllableState<number[] | null | undefined>({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange as ((value: number[] | null | undefined) => void) | undefined,
    caller: 'SliderRoot',
  })
  const currentModelValue = Array.isArray(modelValue) ? [...modelValue] : []
  const valueIndexToChangeRef = useRef(0)
  const valuesBeforeSlideStartRef = useRef(currentModelValue)
  const thumbElements = useRef<HTMLElement[]>([])
  const latest = useRef({ currentModelValue, modelValue, onValueCommit })
  latest.current = { currentModelValue, modelValue, onValueCommit }

  const registerThumb = useCallback((thumb: HTMLElement) => {
    thumbElements.current.push(thumb)
    return () => {
      const index = thumbElements.current.findIndex(item => item === thumb)
      thumbElements.current.splice(index, 1)
    }
  }, [])

  function updateValues(next: number, atIndex: number, { commit } = { commit: false }) {
    const decimalCount = getDecimalCount(step)
    const snapToStep = roundValue(Math.round((next - min) / step) * step + min, decimalCount)
    const nextValue = clamp(snapToStep, min, max)
    const nextValues = getNextSortedValues(latest.current.currentModelValue, nextValue, atIndex)
    if (!hasMinStepsBetweenValues(nextValues, minStepsBetweenThumbs * step)) return
    valueIndexToChangeRef.current = nextValues.indexOf(nextValue)
    const hasChanged = String(nextValues) !== String(latest.current.modelValue)
    if (hasChanged && commit) latest.current.onValueCommit?.(nextValues)
    if (hasChanged) {
      thumbElements.current[valueIndexToChangeRef.current]?.focus()
      setModelValue(nextValues)
    }
  }

  const handlers: SlideHandlers = {
    onSlideStart: event => {
      if (disabled) return
      const pointerValue = sliderValueFromEvent.current?.(event, true)
      if (pointerValue === undefined) return
      const closestIndex = getClosestValueIndex(latest.current.currentModelValue, pointerValue)
      updateValues(pointerValue, closestIndex)
    },
    onSlideMove: event => {
      if (disabled) return
      const pointerValue = sliderValueFromEvent.current?.(event, false)
      if (pointerValue === undefined) return
      updateValues(pointerValue, valueIndexToChangeRef.current)
    },
    onSlideEnd: () => {
      if (disabled) return
      const index = valueIndexToChangeRef.current
      const prevValue = valuesBeforeSlideStartRef.current[index]
      const nextValue = latest.current.currentModelValue[index]
      if (nextValue !== prevValue) latest.current.onValueCommit?.(latest.current.currentModelValue)
    },
    onHomeKeyDown: () => {
      if (!disabled) updateValues(min, 0, { commit: true })
    },
    onEndKeyDown: () => {
      if (!disabled)
        updateValues(max, latest.current.currentModelValue.length - 1, { commit: true })
    },
    onStepKeyDown: (event, direction) => {
      if (disabled) return
      const isPageKey = PAGE_KEYS.includes(event.key)
      const isSkipKey = isPageKey || (event.shiftKey && ARROW_KEYS.includes(event.key))
      const multiplier = isSkipKey ? 10 : 1
      const atIndex = valueIndexToChangeRef.current
      const current = latest.current.currentModelValue[atIndex]!
      updateValues(current + step * multiplier * direction, atIndex, { commit: true })
    },
  }

  const sliderValueFromEvent = useRef<
    ((event: PointerEvent<HTMLElement>, slideStart: boolean) => number) | null
  >(null)

  const Orientation = orientation === 'horizontal' ? SliderHorizontal : SliderVertical

  return (
    <SliderRootContext
      value={{
        modelValue,
        currentModelValue,
        valueIndexToChangeRef,
        thumbElements,
        registerThumb,
        orientation,
        min,
        max,
        disabled,
        thumbAlignment,
      }}
    >
      <Orientation
        {...attrs}
        ref={composedRef}
        as={as}
        asChild={asChild}
        min={min}
        max={max}
        dir={dir}
        inverted={inverted}
        aria-disabled={disabled}
        data-disabled={disabled ? '' : undefined}
        valueFromEvent={sliderValueFromEvent}
        handlers={handlers}
        onPointerDown={composeEventHandlers(
          onPointerDown,
          () => {
            if (!disabled) valuesBeforeSlideStartRef.current = latest.current.currentModelValue
          },
          both,
        )}
      >
        {children}
        {isFormControl && name ? (
          <VisuallyHiddenInput
            type="number"
            value={modelValue}
            name={name}
            required={required}
            disabled={disabled}
            step={step}
          />
        ) : null}
      </Orientation>
    </SliderRootContext>
  )
}

interface SliderOrientationProps
  extends PrimitiveProps, Omit<HTMLAttributes<HTMLElement>, 'dir'>, DataAttributes {
  min: number
  max: number
  dir: Direction
  inverted: boolean
  valueFromEvent: RefObject<
    ((event: PointerEvent<HTMLElement>, slideStart: boolean) => number) | null
  >
  handlers: SlideHandlers
  ref?: Ref<HTMLElement>
}

function useSlideGeometry(
  sliderElement: RefObject<HTMLElement | null>,
  axis: 'x' | 'y',
  output: () => [number, number],
) {
  const root = useSliderRootContext('Slider')
  const offsetPosition = useRef<number | undefined>(undefined)
  const rectRef = useRef<DOMRect | undefined>(undefined)

  function getValueFromPointerEvent(event: PointerEvent<HTMLElement>, slideStart: boolean) {
    const rect = rectRef.current || sliderElement.current!.getBoundingClientRect()
    const thumb = [...root.thumbElements.current][root.valueIndexToChangeRef.current]!
    const contain = root.thumbAlignment === 'contain'
    const thumbSize = contain ? (axis === 'x' ? thumb.clientWidth : thumb.clientHeight) : 0
    const client = axis === 'x' ? event.clientX : event.clientY
    const thumbStart =
      axis === 'x' ? thumb.getBoundingClientRect().left : thumb.getBoundingClientRect().top
    if (!offsetPosition.current && !slideStart && contain)
      offsetPosition.current = client - thumbStart
    const rectStart = axis === 'x' ? rect.left : rect.top
    const length = axis === 'x' ? rect.width : rect.height
    const value = linearScale([0, length - thumbSize], output())
    rectRef.current = rect
    const position = slideStart
      ? client - rectStart - thumbSize / 2
      : client - rectStart - (offsetPosition.current ?? 0)
    return value(position)
  }

  function reset() {
    rectRef.current = undefined
    offsetPosition.current = undefined
  }

  return { getValueFromPointerEvent, reset }
}

function SliderHorizontal({
  min,
  max,
  dir,
  inverted,
  valueFromEvent,
  handlers,
  ref,
  ...attrs
}: SliderOrientationProps) {
  const root = useSliderRootContext('SliderHorizontal')
  const sliderElement = useRef<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, sliderElement)
  const isSlidingFromLeft = (dir !== 'rtl' && !inverted) || (dir !== 'ltr' && inverted)
  const { getValueFromPointerEvent, reset } = useSlideGeometry(sliderElement, 'x', () =>
    isSlidingFromLeft ? [min, max] : [max, min],
  )
  valueFromEvent.current = getValueFromPointerEvent

  return (
    <SliderOrientationContext
      value={{
        startEdge: isSlidingFromLeft ? 'left' : 'right',
        endEdge: isSlidingFromLeft ? 'right' : 'left',
        direction: isSlidingFromLeft ? 1 : -1,
        size: 'width',
      }}
    >
      <SliderImpl
        {...attrs}
        ref={composedRef}
        dir={dir}
        data-orientation="horizontal"
        thumbTransform={
          !isSlidingFromLeft && root.thumbAlignment === 'overflow'
            ? 'translateX(50%)'
            : 'translateX(-50%)'
        }
        handlers={{
          ...handlers,
          onSlideEnd: () => {
            reset()
            handlers.onSlideEnd()
          },
          onStepKeyDown: event => {
            const slideDirection = isSlidingFromLeft ? 'from-left' : 'from-right'
            const isBackKey = BACK_KEYS[slideDirection]!.includes(event.key)
            handlers.onStepKeyDown(event, isBackKey ? -1 : 1)
          },
        }}
      />
    </SliderOrientationContext>
  )
}

function SliderVertical({
  min,
  max,
  dir: _dir,
  inverted,
  valueFromEvent,
  handlers,
  ref,
  ...attrs
}: SliderOrientationProps) {
  const root = useSliderRootContext('SliderVertical')
  const sliderElement = useRef<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, sliderElement)
  const isSlidingFromBottom = !inverted
  const { getValueFromPointerEvent, reset } = useSlideGeometry(sliderElement, 'y', () =>
    isSlidingFromBottom ? [max, min] : [min, max],
  )
  valueFromEvent.current = getValueFromPointerEvent

  return (
    <SliderOrientationContext
      value={{
        startEdge: isSlidingFromBottom ? 'bottom' : 'top',
        endEdge: isSlidingFromBottom ? 'top' : 'bottom',
        direction: isSlidingFromBottom ? 1 : -1,
        size: 'height',
      }}
    >
      <SliderImpl
        {...attrs}
        ref={composedRef}
        data-orientation="vertical"
        thumbTransform={
          !isSlidingFromBottom && root.thumbAlignment === 'overflow'
            ? 'translateY(-50%)'
            : 'translateY(50%)'
        }
        handlers={{
          ...handlers,
          onSlideEnd: () => {
            reset()
            handlers.onSlideEnd()
          },
          onStepKeyDown: event => {
            const slideDirection = isSlidingFromBottom ? 'from-bottom' : 'from-top'
            const isBackKey = BACK_KEYS[slideDirection]!.includes(event.key)
            handlers.onStepKeyDown(event, isBackKey ? -1 : 1)
          },
        }}
      />
    </SliderOrientationContext>
  )
}

interface SliderImplProps
  extends PrimitiveProps, Omit<HTMLAttributes<HTMLElement>, 'dir'>, DataAttributes {
  dir?: Direction
  thumbTransform: string
  handlers: SlideHandlers
  ref?: Ref<HTMLElement>
}

function SliderImpl({
  thumbTransform,
  handlers,
  style,
  onKeyDown,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  ...attrs
}: SliderImplProps) {
  const root = useSliderRootContext('SliderImpl')
  return (
    <Primitive
      data-slider-impl=""
      {...attrs}
      style={{ ['--radix-slider-thumb-transform' as string]: thumbTransform, ...style }}
      onKeyDown={composeEventHandlers(
        (event: KeyboardEvent<HTMLElement>) => {
          if (event.key === 'Home') {
            handlers.onHomeKeyDown(event)
            event.preventDefault()
          } else if (event.key === 'End') {
            handlers.onEndKeyDown(event)
            event.preventDefault()
          } else if (PAGE_KEYS.concat(ARROW_KEYS).includes(event.key)) {
            handlers.onStepKeyDown(event, 1)
            event.preventDefault()
          }
        },
        onKeyDown,
        both,
      )}
      onPointerDown={composeEventHandlers(
        (event: PointerEvent<HTMLElement>) => {
          const target = event.target as HTMLElement
          target.setPointerCapture(event.pointerId)
          event.preventDefault()
          if (root.thumbElements.current.includes(target)) target.focus()
          else handlers.onSlideStart(event)
        },
        onPointerDown,
        both,
      )}
      onPointerMove={composeEventHandlers(
        (event: PointerEvent<HTMLElement>) => {
          const target = event.target as HTMLElement
          if (target.hasPointerCapture(event.pointerId)) handlers.onSlideMove(event)
        },
        onPointerMove,
        both,
      )}
      onPointerUp={composeEventHandlers(
        (event: PointerEvent<HTMLElement>) => {
          const target = event.target as HTMLElement
          if (target.hasPointerCapture(event.pointerId)) {
            target.releasePointerCapture(event.pointerId)
            handlers.onSlideEnd()
          }
        },
        onPointerUp,
        both,
      )}
    />
  )
}

export interface SliderTrackProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  ref?: Ref<HTMLElement>
}

export function SliderTrack({ as = 'span', asChild, ...attrs }: SliderTrackProps) {
  const root = useSliderRootContext('SliderTrack')
  return (
    <Primitive
      as={as}
      asChild={asChild}
      data-disabled={root.disabled ? '' : undefined}
      data-orientation={root.orientation}
      {...attrs}
    />
  )
}

export interface SliderRangeProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  ref?: Ref<HTMLElement>
}

export function SliderRange({ as = 'span', asChild, style, ...attrs }: SliderRangeProps) {
  const root = useSliderRootContext('SliderRange')
  const orientation = useContext(SliderOrientationContext)!
  const percentages = root.currentModelValue.map(value =>
    convertValueToPercentage(value, root.min, root.max),
  )
  const offsetStart = root.currentModelValue.length > 1 ? Math.min(...percentages) : 0
  const offsetEnd = 100 - Math.max(...percentages, 0)
  return (
    <Primitive
      data-disabled={root.disabled ? '' : undefined}
      data-orientation={root.orientation}
      as={as}
      asChild={asChild}
      {...attrs}
      style={{
        ...style,
        [orientation.startEdge]: `${offsetStart}%`,
        [orientation.endEdge]: `${offsetEnd}%`,
      }}
    />
  )
}

export interface SliderThumbProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  ref?: Ref<HTMLElement>
}

export function SliderThumb({
  as = 'span',
  asChild,
  style,
  onFocus,
  ref,
  ...attrs
}: SliderThumbProps) {
  const root = useSliderRootContext('SliderThumb')
  const orientation = useContext(SliderOrientationContext)!
  const [thumbElement, setThumbElement] = useCurrentElement<HTMLElement>()
  const composedRef = useComposedRefs(ref, setThumbElement)
  const [index, setIndex] = useState(-1)
  const [isMounted, setIsMounted] = useState(false)
  const { registerThumb } = root

  useLayoutEffect(() => {
    if (!thumbElement) return
    return registerThumb(thumbElement)
  }, [thumbElement, registerThumb])

  useLayoutEffect(() => {
    setIsMounted(true)
  }, [])

  useLayoutEffect(() => {
    if (!thumbElement) {
      setIndex(-1)
      return
    }
    const collection = thumbElement.closest('[data-slider-impl]')
    const items = collection
      ? Array.from(collection.querySelectorAll<HTMLElement>(`[${ITEM_DATA_ATTR}]`))
      : []
    setIndex(items.indexOf(thumbElement))
  })

  const value = root.modelValue?.[index]
  const percent =
    value === undefined ? 0 : convertValueToPercentage(value, root.min ?? 0, root.max ?? 100)
  const label = getLabel(index, root.modelValue?.length ?? 0)
  const size = useSize(thumbElement)
  const orientationSize = size?.[orientation.size] ?? 0
  const thumbInBoundsOffset =
    root.thumbAlignment === 'overflow' || !orientationSize
      ? 0
      : getThumbInBoundsOffset(orientationSize, percent, orientation.direction)

  return (
    <Primitive
      {...attrs}
      {...{ [ITEM_DATA_ATTR]: '' }}
      ref={composedRef}
      role="slider"
      tabIndex={root.disabled ? undefined : 0}
      aria-label={attrs['aria-label'] || label}
      data-disabled={root.disabled ? '' : undefined}
      data-orientation={root.orientation}
      aria-valuenow={value}
      aria-valuemin={root.min}
      aria-valuemax={root.max}
      aria-orientation={root.orientation}
      as={as}
      asChild={asChild}
      style={
        {
          ...style,
          transform: 'var(--radix-slider-thumb-transform)',
          position: 'absolute',
          [orientation.startEdge]: `calc(${percent}% + ${thumbInBoundsOffset}px)`,
          display: !isMounted && value === undefined ? 'none' : undefined,
        } as CSSProperties
      }
      onFocus={composeEventHandlers(
        onFocus,
        () => {
          root.valueIndexToChangeRef.current = index
        },
        both,
      )}
    />
  )
}
