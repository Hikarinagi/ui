'use client'

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { arrowNavigation } from '../../../../shared/src/primitives/arrow-navigation'
import { getActiveElement } from '../../../../shared/src/primitives/focus-scope'
import {
  activatesStepOnPointer,
  isStepFocusable,
  STEPPER_KEYS,
  STEPPER_STATUS_STYLE,
  stepperItemState,
  stepperStatusText,
  type StepperState,
} from '../../../../shared/src/primitives/stepper'
import { Separator as HnSeparator } from '../separator'
import { useComposedRefs } from '../utils/compose-refs'
import { useControllableState } from '../utils/controllable-state'
import { useDirection } from '../utils/direction'

export type { StepperState }
type Orientation = 'horizontal' | 'vertical'
type Dir = 'ltr' | 'rtl'

interface StepperRootContextValue {
  modelValue: number | undefined
  changeModelValue: (value: number) => void
  orientation: Orientation
  dir: Dir
  linear: boolean
  totalStepperItems: { readonly current: Set<HTMLElement> }
  registerStepperItem: (element: HTMLElement) => () => void
}

interface StepperItemContextValue {
  titleId: string
  descriptionId: string
  state: StepperState
  disabled: boolean
  step: number
  isFocusable: boolean
}

const StepperRootContext = createContext<StepperRootContextValue | null>(null)
const StepperItemContext = createContext<StepperItemContextValue | null>(null)

function useStepperRootContext(consumer: string) {
  const context = useContext(StepperRootContext)
  if (!context) throw new Error(`Injection \`StepperRoot\` not found. Component \`${consumer}\``)
  return context
}

function useStepperItemContext(consumer: string) {
  const context = useContext(StepperItemContext)
  if (!context) throw new Error(`Injection \`StepperItem\` not found. Component \`${consumer}\``)
  return context
}

export interface StepperRootProps
  extends PrimitiveProps, Omit<HTMLAttributes<HTMLElement>, 'defaultValue' | 'dir'> {
  defaultValue?: number
  orientation?: Orientation
  dir?: Dir
  value?: number
  onValueChange?: (value: number) => void
  linear?: boolean
  children?: ReactNode
  ref?: Ref<HTMLElement>
}

export function StepperRoot({
  defaultValue = 1,
  orientation = 'horizontal',
  dir: dirProp,
  value,
  onValueChange,
  linear = true,
  as,
  asChild,
  children,
  ...attrs
}: StepperRootProps) {
  const dir = useDirection(dirProp)
  const [modelValue, setModelValue] = useControllableState<number | undefined>({
    prop: value,
    defaultProp: defaultValue,
    onChange: next => {
      if (next !== undefined) onValueChange?.(next)
    },
    caller: 'StepperRoot',
  })
  const totalStepperItems = useRef(new Set<HTMLElement>())
  const [totalSteps, setTotalSteps] = useState(0)
  const registerStepperItem = useCallback((element: HTMLElement) => {
    totalStepperItems.current.add(element)
    setTotalSteps(totalStepperItems.current.size)
    return () => {
      totalStepperItems.current.delete(element)
      setTotalSteps(totalStepperItems.current.size)
    }
  }, [])
  const context = useMemo<StepperRootContextValue>(
    () => ({
      modelValue,
      changeModelValue: next => setModelValue(next),
      orientation,
      dir,
      linear,
      totalStepperItems,
      registerStepperItem,
    }),
    [modelValue, setModelValue, orientation, dir, linear, registerStepperItem],
  )

  return (
    <StepperRootContext value={context}>
      <Primitive
        role="group"
        aria-label="progress"
        as={as}
        asChild={asChild}
        data-linear={linear ? '' : undefined}
        data-orientation={orientation}
        {...attrs}
      >
        {children}
        <div
          aria-live="polite"
          aria-atomic="true"
          role="status"
          style={STEPPER_STATUS_STYLE as CSSProperties}
        >
          {stepperStatusText(modelValue, totalSteps)}
        </div>
      </Primitive>
    </StepperRootContext>
  )
}

export interface StepperItemProps extends PrimitiveProps, HTMLAttributes<HTMLElement> {
  step: number
  disabled?: boolean
  completed?: boolean
  children?: ReactNode
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function StepperItem({
  step,
  disabled = false,
  completed = false,
  as,
  asChild,
  children,
  ...attrs
}: StepperItemProps) {
  const rootContext = useStepperRootContext('StepperItem')
  const titleId = `reka-stepper-item-title-${useId()}`
  const descriptionId = `reka-stepper-item-description-${useId()}`
  const modelValue = rootContext.modelValue as number
  const state = stepperItemState(completed, modelValue, step)
  const isFocusable = isStepFocusable(disabled, rootContext.linear, step, modelValue)
  const context = useMemo<StepperItemContextValue>(
    () => ({ titleId, descriptionId, state, disabled, step, isFocusable }),
    [titleId, descriptionId, state, disabled, step, isFocusable],
  )
  const unavailable = disabled || !isFocusable

  return (
    <StepperItemContext value={context}>
      <Primitive
        as={as}
        asChild={asChild}
        aria-current={state === 'active' ? 'true' : undefined}
        data-state={state}
        {...{ disabled: unavailable || undefined }}
        data-disabled={unavailable ? '' : undefined}
        data-orientation={rootContext.orientation}
        {...attrs}
      >
        {children}
      </Primitive>
    </StepperItemContext>
  )
}

export interface StepperTriggerProps extends PrimitiveProps, HTMLAttributes<HTMLElement> {
  children?: ReactNode
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function StepperTrigger({
  as = 'button',
  asChild,
  onMouseDown,
  onKeyDown,
  children,
  ref,
  ...attrs
}: StepperTriggerProps) {
  const rootContext = useStepperRootContext('StepperTrigger')
  const itemContext = useStepperItemContext('StepperTrigger')
  const element = useRef<HTMLElement>(null)
  const composedRef = useComposedRefs(ref, element)
  const modelValue = rootContext.modelValue as number
  const { registerStepperItem } = rootContext

  useLayoutEffect(() => {
    const registered = element.current
    if (!registered) return
    return registerStepperItem(registered)
  }, [registerStepperItem])

  function handleMouseDown(event: MouseEvent<HTMLElement>) {
    if (event.button !== 0) return
    if (itemContext.disabled) return
    if (activatesStepOnPointer(event, rootContext.linear, itemContext.step, modelValue)) {
      rootContext.changeModelValue(itemContext.step)
      return
    }
    event.preventDefault()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!STEPPER_KEYS.includes(event.key)) return
    event.preventDefault()
    if (itemContext.disabled) return
    if ((event.key === 'Enter' || event.key === ' ') && !event.ctrlKey && !event.shiftKey)
      rootContext.changeModelValue(itemContext.step)
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key))
      arrowNavigation(event.nativeEvent, getActiveElement() as HTMLElement | null, undefined, {
        itemsArray: Array.from(rootContext.totalStepperItems.current),
        focus: true,
        loop: false,
        arrowKeyOptions: rootContext.orientation,
        dir: rootContext.dir,
      })
  }

  const unavailable = itemContext.disabled || !itemContext.isFocusable

  return (
    <Primitive
      ref={composedRef}
      {...{ type: as === 'button' ? 'button' : undefined }}
      as={as}
      asChild={asChild}
      data-state={itemContext.state}
      {...{ disabled: unavailable || undefined }}
      data-disabled={unavailable ? '' : undefined}
      data-orientation={rootContext.orientation}
      tabIndex={itemContext.isFocusable ? 0 : -1}
      aria-describedby={itemContext.descriptionId}
      aria-labelledby={itemContext.titleId}
      {...attrs}
      onMouseDown={event => {
        handleMouseDown(event)
        onMouseDown?.(event)
      }}
      onKeyDown={event => {
        handleKeyDown(event)
        onKeyDown?.(event)
      }}
    >
      {children}
    </Primitive>
  )
}

export interface StepperTextProps extends PrimitiveProps, HTMLAttributes<HTMLElement> {
  children?: ReactNode
  ref?: Ref<HTMLElement>
}

export function StepperTitle({ as = 'h4', asChild, ...attrs }: StepperTextProps) {
  const itemContext = useStepperItemContext('StepperTitle')
  return <Primitive as={as} asChild={asChild} id={itemContext.titleId} {...attrs} />
}

export function StepperDescription({ as = 'p', asChild, ...attrs }: StepperTextProps) {
  const itemContext = useStepperItemContext('StepperDescription')
  return <Primitive as={as} asChild={asChild} id={itemContext.descriptionId} {...attrs} />
}

export function StepperIndicator({ as = 'span', asChild, children, ...attrs }: StepperTextProps) {
  const itemContext = useStepperItemContext('StepperIndicator')
  return (
    <Primitive as={as} asChild={asChild} {...attrs}>
      {children ?? ` Step ${itemContext.step}`}
    </Primitive>
  )
}

export interface StepperSeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: Orientation
  decorative?: boolean
  asChild?: boolean
  ref?: Ref<HTMLDivElement>
}

export function StepperSeparator({
  orientation: _orientation,
  decorative: _decorative,
  ...attrs
}: StepperSeparatorProps) {
  const rootContext = useStepperRootContext('StepperSeparator')
  const itemContext = useStepperItemContext('StepperSeparator')
  return (
    <HnSeparator
      decorative
      orientation={rootContext.orientation}
      data-state={itemContext.state}
      {...attrs}
    />
  )
}
