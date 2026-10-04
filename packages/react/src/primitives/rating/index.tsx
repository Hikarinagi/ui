'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { useCurrentElement } from '../utils/hidden-input'
import {
  RadioGroupIndicator,
  RadioGroupItem,
  RadioGroupRoot,
  type RadioGroupItemProps,
} from '../radio-group'
import type { Direction, Orientation } from '../roving-focus'
import { composeEventHandlers } from '../utils/compose-event-handlers'
import { useComposedRefs } from '../utils/compose-refs'
import { useControllableState } from '../utils/controllable-state'

type DataAttributes = { [attribute: `data-${string}`]: string | undefined }

const both = { checkForDefaultPrevented: false }

interface RatingRootContextValue {
  modelValue: number | undefined
  items: number[]
  hoveredRating: number
  disabled: boolean
  step: number
  changeModelValue: (rating: number) => void
  changeHoveredRating: (rating: number) => void
}

const RatingRootContext = createContext<RatingRootContextValue | null>(null)

function useRatingRootContext(consumer: string) {
  const context = useContext(RatingRootContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`RatingRoot\``)
  return context
}

export interface RatingRootProps
  extends
    PrimitiveProps,
    Omit<HTMLAttributes<HTMLElement>, 'defaultValue' | 'dir' | 'onChange' | 'children'>,
    DataAttributes {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  length?: number
  clearable?: boolean
  hoverable?: boolean
  step?: number
  disabled?: boolean
  orientation?: Orientation
  dir?: Direction
  loop?: boolean
  name?: string
  required?: boolean
  children?: ReactNode | ((props: { items: number[]; modelValue: number | undefined }) => ReactNode)
  ref?: Ref<HTMLElement>
}

export function RatingRoot({
  value,
  defaultValue,
  onValueChange,
  length = 5,
  clearable = false,
  hoverable = false,
  step = 1,
  disabled = false,
  orientation = 'horizontal',
  dir,
  loop = false,
  name,
  required = false,
  as,
  asChild,
  children,
  onMouseLeave,
  ...attrs
}: RatingRootProps) {
  const [modelValue, setModelValue] = useControllableState<number | undefined>({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange as ((value: number | undefined) => void) | undefined,
    caller: 'RatingRoot',
  })
  const items = Array.from({ length }, (_, i) => i + 1)
  const [hoveredRating, setHoveredRating] = useState(0)

  function changeModelValue(rating: number) {
    if (disabled) return
    if (clearable && modelValue === rating) {
      setHoveredRating(0)
      setModelValue(0)
    } else setModelValue(rating)
  }

  function changeHoveredRating(rating: number) {
    if (disabled || !hoverable) return
    setHoveredRating(rating)
  }

  return (
    <RatingRootContext
      value={{
        modelValue,
        items,
        hoveredRating,
        disabled,
        step,
        changeModelValue,
        changeHoveredRating,
      }}
    >
      <RadioGroupRoot
        {...attrs}
        value={modelValue}
        defaultValue={defaultValue}
        orientation={orientation}
        dir={dir}
        loop={loop}
        as={as}
        asChild={asChild}
        name={name}
        required={required}
        disabled={disabled}
        onMouseLeave={composeEventHandlers(onMouseLeave, () => setHoveredRating(0), both)}
      >
        {typeof children === 'function' ? children({ items, modelValue }) : children}
      </RadioGroupRoot>
    </RatingRootContext>
  )
}

interface RatingItemContextValue {
  steps: number[]
}

const RatingItemContext = createContext<RatingItemContextValue | null>(null)

export interface RatingItemProps
  extends PrimitiveProps, Omit<HTMLAttributes<HTMLElement>, 'children'>, DataAttributes {
  item: number
  children?: ReactNode | ((props: { steps: number[] }) => ReactNode)
  ref?: Ref<HTMLElement>
}

export function RatingItem({ item, as = 'label', asChild, children, ...attrs }: RatingItemProps) {
  const root = useRatingRootContext('RatingItem')
  const groupStart = item - 1
  const count = Math.ceil((item - groupStart) / root.step)
  const steps = Array.from({ length: count }, (_, index) =>
    Number((groupStart + (index + 1) * root.step).toFixed(2)),
  )
  return (
    <RatingItemContext value={{ steps }}>
      <Primitive as={as} asChild={asChild} {...attrs}>
        {typeof children === 'function' ? children({ steps }) : children}
      </Primitive>
    </RatingItemContext>
  )
}

function useActiveElement() {
  const [active, setActive] = useState<Element | null>(null)
  useEffect(() => {
    const update = () => setActive(document.activeElement)
    update()
    window.addEventListener('focus', update, true)
    window.addEventListener('blur', update, true)
    return () => {
      window.removeEventListener('focus', update, true)
      window.removeEventListener('blur', update, true)
    }
  }, [])
  return active
}

export interface RatingItemIndicatorProps extends Omit<
  RadioGroupItemProps,
  'value' | 'onSelect' | 'children'
> {
  step: number
  children?: ReactNode
}

export function RatingItemIndicator({
  step,
  as,
  asChild,
  style,
  onMouseEnter,
  children,
  ref,
  ...attrs
}: RatingItemIndicatorProps) {
  const root = useRatingRootContext('RatingItemIndicator')
  const item = useContext(RatingItemContext)
  if (!item) throw new Error('`RatingItemIndicator` must be used within `RatingItem`')
  const [element, setElement] = useCurrentElement<HTMLElement>()
  const composedRef = useComposedRefs(ref, setElement)
  const activeElement = useActiveElement()
  const isActive =
    (root.hoveredRating > 0 && step <= root.hoveredRating) ||
    (root.hoveredRating === 0 && step <= (root.modelValue ?? Number.NaN))
  const isVisible =
    activeElement === element ||
    root.step === 1 ||
    step % 1 === 0 ||
    step === root.hoveredRating ||
    step === root.modelValue

  return (
    <RadioGroupItem
      ref={composedRef}
      as={as}
      asChild={asChild}
      value={step}
      data-state={isActive ? 'active' : undefined}
      disabled={root.disabled}
      {...attrs}
      style={
        {
          '--radix-rating-item-step-width': `${(step % 1 || 1) * 100}%`,
          '--radix-rating-item-step-opacity': isVisible ? 1 : 0,
          '--radix-rating-item-step-z-index': item.steps.length - item.steps.indexOf(step),
          ...style,
        } as CSSProperties
      }
      onSelect={() => root.changeModelValue(step)}
      onMouseEnter={composeEventHandlers(
        onMouseEnter as ((event: MouseEvent<HTMLElement>) => void) | undefined,
        () => root.changeHoveredRating(step),
        both,
      )}
    >
      <RadioGroupIndicator forceMount asChild>
        {children}
      </RadioGroupIndicator>
    </RadioGroupItem>
  )
}
