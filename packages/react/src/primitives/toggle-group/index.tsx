'use client'

import {
  createContext,
  useContext,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { RovingFocusGroup, RovingFocusItem } from '../roving-focus'
import type { Direction, Orientation } from '../roving-focus'
import { toggleState } from '../../../../shared/src/primitives/toggle'
import {
  isValueEqualOrExist,
  nextSingleOrMultipleValue,
  singleOrMultipleDefault,
  singleOrMultipleType,
} from '../../../../shared/src/primitives/value'
import { useVModel } from './model'
import { composeEventHandlers } from '../utils/compose-event-handlers'
import { useDirection } from '../utils/direction'

export { useVModel } from './model'

type DataAttributes = { [attribute: `data-${string}`]: string | undefined }

export type AcceptableValue = string | number | bigint | Record<string, unknown> | null
export type ToggleGroupType = 'single' | 'multiple'
export type ToggleGroupValue = AcceptableValue | AcceptableValue[] | undefined

const both = { checkForDefaultPrevented: false }

export interface ToggleProps
  extends
    PrimitiveProps,
    Omit<ButtonHTMLAttributes<HTMLElement>, 'defaultValue' | 'value'>,
    DataAttributes {
  pressed?: boolean
  defaultPressed?: boolean
  onPressedChange?: (pressed: boolean) => void
  disabled?: boolean
  value?: unknown
  ref?: Ref<HTMLElement>
}

export function Toggle({
  pressed: pressedProp,
  defaultPressed = false,
  onPressedChange,
  disabled = false,
  as = 'button',
  asChild,
  onClick,
  ...attrs
}: ToggleProps) {
  const [pressed, setPressed] = useVModel<boolean | undefined>(pressedProp, defaultPressed, next =>
    onPressedChange?.(!!next),
  )

  return (
    <Primitive
      {...({ type: as === 'button' ? 'button' : undefined } as HTMLAttributes<HTMLElement>)}
      as={as}
      asChild={asChild}
      aria-pressed={pressed}
      data-state={toggleState(pressed)}
      data-disabled={disabled ? '' : undefined}
      {...({ disabled } as HTMLAttributes<HTMLElement>)}
      {...(attrs as HTMLAttributes<HTMLElement>)}
      onClick={composeEventHandlers(onClick, () => setPressed(!pressed), both)}
    />
  )
}

interface ToggleGroupRootContextValue {
  isSingle: boolean
  modelValue: ToggleGroupValue
  changeModelValue: (value: AcceptableValue) => void
  dir: Direction
  orientation?: Orientation
  loop: boolean
  rovingFocus: boolean
  disabled: boolean
}

const ToggleGroupRootContext = createContext<ToggleGroupRootContextValue | null>(null)

export function useToggleGroupRootContext() {
  return useContext(ToggleGroupRootContext)
}

export interface ToggleGroupRootProps
  extends
    PrimitiveProps,
    Omit<HTMLAttributes<HTMLElement>, 'defaultValue' | 'dir'>,
    DataAttributes {
  rovingFocus?: boolean
  disabled?: boolean
  orientation?: Orientation
  dir?: Direction
  loop?: boolean
  type?: ToggleGroupType
  value?: ToggleGroupValue
  defaultValue?: ToggleGroupValue
  onValueChange?: (value: ToggleGroupValue) => void
  children?: ReactNode
  ref?: Ref<HTMLElement>
}

export function ToggleGroupRoot({
  rovingFocus = true,
  disabled = false,
  orientation,
  dir: dirProp,
  loop = true,
  type,
  value,
  defaultValue,
  onValueChange,
  as,
  asChild,
  ref,
  children,
  ...attrs
}: ToggleGroupRootProps) {
  const dir = useDirection(dirProp)
  const resolvedType = singleOrMultipleType({ type, defaultValue, modelValue: value })
  const [modelValue, setModelValue] = useVModel<ToggleGroupValue>(
    value,
    singleOrMultipleDefault({ type, defaultValue }) as ToggleGroupValue,
    onValueChange,
  )
  const isSingle = resolvedType === 'single'

  function changeModelValue(next: AcceptableValue) {
    setModelValue(nextSingleOrMultipleValue(resolvedType, modelValue, next))
  }

  const group = (
    <Primitive ref={ref} role="group" as={as} asChild={asChild}>
      {children}
    </Primitive>
  )

  return (
    <ToggleGroupRootContext
      value={{
        isSingle,
        modelValue,
        changeModelValue,
        dir,
        orientation,
        loop,
        rovingFocus,
        disabled,
      }}
    >
      {rovingFocus ? (
        <RovingFocusGroup asChild orientation={orientation} dir={dir} loop={loop} {...attrs}>
          {group}
        </RovingFocusGroup>
      ) : (
        <Primitive asChild dir={dir} {...attrs}>
          {group}
        </Primitive>
      )}
    </ToggleGroupRootContext>
  )
}

export interface ToggleGroupItemProps
  extends PrimitiveProps, Omit<HTMLAttributes<HTMLElement>, 'defaultValue'>, DataAttributes {
  value: AcceptableValue
  disabled?: boolean
  ref?: Ref<HTMLElement>
}

export function ToggleGroupItem({
  value,
  disabled: disabledProp,
  as = 'button',
  asChild,
  ref,
  children,
  ...attrs
}: ToggleGroupItemProps) {
  const root = useContext(ToggleGroupRootContext)
  if (!root) throw new Error('`ToggleGroupItem` must be used within `ToggleGroupRoot`')
  const disabled = root.disabled || !!disabledProp
  const pressed = isValueEqualOrExist(root.modelValue, value)
  const toggle = (
    <Toggle
      value={value}
      disabled={disabled}
      as={as}
      asChild={asChild}
      ref={ref}
      pressed={pressed}
      onPressedChange={() => root.changeModelValue(value)}
    >
      {children}
    </Toggle>
  )
  return root.rovingFocus ? (
    <RovingFocusItem asChild focusable={!disabled} active={pressed} {...attrs}>
      {toggle}
    </RovingFocusItem>
  ) : (
    <Primitive asChild {...attrs}>
      {toggle}
    </Primitive>
  )
}
