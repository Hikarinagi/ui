'use client'

import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { RovingFocusGroup, RovingFocusItem } from '../roving-focus'
import type { Direction, Orientation } from '../roving-focus'
import { isEqual, isValueEqualOrExist } from '../toggle-group/model'
import { VisuallyHiddenInput, useCurrentElement, useFormControl } from '../utils/hidden-input'
import { composeEventHandlers } from '../utils/compose-event-handlers'
import { useComposedRefs } from '../utils/compose-refs'
import { useControllableState } from '../utils/controllable-state'
import { useDirection } from '../utils/direction'

type DataAttributes = { [attribute: `data-${string}`]: string | undefined }

export type CheckedState = boolean | 'indeterminate'

const both = { checkForDefaultPrevented: false }

interface CheckboxGroupRootContextValue {
  modelValue: unknown[]
  setModelValue: (value: unknown[]) => void
  rovingFocus: boolean
  disabled: boolean
}

const CheckboxGroupRootContext = createContext<CheckboxGroupRootContextValue | null>(null)

export function useCheckboxGroupRootContext() {
  return useContext(CheckboxGroupRootContext)
}

export interface CheckboxGroupRootProps
  extends
    PrimitiveProps,
    Omit<HTMLAttributes<HTMLElement>, 'defaultValue' | 'dir' | 'onChange'>,
    DataAttributes {
  value?: unknown[]
  defaultValue?: unknown[]
  onValueChange?: (value: unknown[]) => void
  rovingFocus?: boolean
  disabled?: boolean
  dir?: Direction
  orientation?: Orientation
  loop?: boolean
  name?: string
  required?: boolean
  children?: ReactNode
  ref?: Ref<HTMLElement>
}

export function CheckboxGroupRoot({
  value,
  defaultValue,
  onValueChange,
  rovingFocus = true,
  disabled = false,
  dir: dirProp,
  orientation,
  loop,
  name,
  required,
  as,
  asChild,
  ref,
  children,
  ...attrs
}: CheckboxGroupRootProps) {
  const dir = useDirection(dirProp)
  const [element, setElement] = useCurrentElement<HTMLElement>()
  const composedRef = useComposedRefs(ref, setElement)
  const isFormControl = useFormControl(element)
  const [modelValue = [], setModelValue] = useControllableState<unknown[]>({
    prop: value,
    defaultProp: defaultValue ?? [],
    onChange: onValueChange,
    caller: 'CheckboxGroupRoot',
  })

  const content = (
    <>
      {children}
      {isFormControl && name ? (
        <VisuallyHiddenInput name={name} value={modelValue} required={required} />
      ) : null}
    </>
  )

  return (
    <CheckboxGroupRootContext value={{ modelValue, setModelValue, rovingFocus, disabled }}>
      {rovingFocus ? (
        <RovingFocusGroup
          {...attrs}
          ref={composedRef}
          as={as}
          asChild={asChild}
          loop={loop}
          dir={dir}
          orientation={orientation}
        >
          {content}
        </RovingFocusGroup>
      ) : (
        <Primitive {...attrs} ref={composedRef} as={as} asChild={asChild}>
          {content}
        </Primitive>
      )}
    </CheckboxGroupRootContext>
  )
}

export interface CheckboxRootRenderProps {
  modelValue: CheckedState
  state: CheckedState
}

export interface CheckboxRootProps
  extends
    PrimitiveProps,
    Omit<ButtonHTMLAttributes<HTMLElement>, 'value' | 'defaultChecked' | 'children' | 'type'>,
    DataAttributes {
  checked?: CheckedState
  defaultChecked?: CheckedState
  onCheckedChange?: (checked: CheckedState) => void
  disabled?: boolean
  value?: unknown
  id?: string
  name?: string
  required?: boolean
  children?: ReactNode | ((props: CheckboxRootRenderProps) => ReactNode)
  ref?: Ref<HTMLElement>
}

function getState(checked: CheckedState) {
  return checked === 'indeterminate' ? 'indeterminate' : checked ? 'checked' : 'unchecked'
}

export function CheckboxRoot({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled: disabledProp = false,
  value = 'on',
  id,
  as = 'button',
  asChild,
  name,
  required = false,
  children,
  onKeyDown,
  onClick,
  ref,
  ...attrs
}: CheckboxRootProps) {
  const group = useCheckboxGroupRootContext()
  const [element, setElement] = useCurrentElement<HTMLElement>()
  const composedRef = useComposedRefs(ref, setElement)
  const [modelValue = false, setModelValue] = useControllableState<CheckedState>({
    prop: checked,
    defaultProp: defaultChecked ?? false,
    onChange: onCheckedChange,
    caller: 'CheckboxRoot',
  })
  const disabled = !!group?.disabled || disabledProp
  const isChecked = isEqual(modelValue, true)
  const inGroup = group && group.modelValue !== null && group.modelValue !== undefined
  const state: CheckedState = inGroup
    ? isValueEqualOrExist(group.modelValue, value)
    : modelValue === 'indeterminate'
      ? 'indeterminate'
      : isChecked
  const isFormControl = useFormControl(element)
  const [labelText, setLabelText] = useState<string | undefined>(undefined)
  const ownLabel = attrs['aria-label']

  useLayoutEffect(() => {
    if (ownLabel || !id || !element) {
      setLabelText(undefined)
      return
    }
    setLabelText(
      element.ownerDocument.querySelector<HTMLElement>(`[for="${id}"]`)?.innerText ?? undefined,
    )
  }, [id, element, ownLabel])

  function handleClick() {
    if (inGroup) {
      const next = [...(group.modelValue || [])]
      if (isValueEqualOrExist(next, value))
        next.splice(
          next.findIndex(item => isEqual(item, value)),
          1,
        )
      else next.push(value)
      group.setModelValue(next)
    } else if (modelValue === 'indeterminate') setModelValue(true)
    else setModelValue(!isChecked)
  }

  const roving = !!group?.rovingFocus
  const control = (
    <Primitive
      {...(attrs as HTMLAttributes<HTMLElement>)}
      id={id}
      ref={roving ? undefined : composedRef}
      role="checkbox"
      as={as}
      asChild={asChild}
      {...({ type: as === 'button' ? 'button' : undefined } as HTMLAttributes<HTMLElement>)}
      aria-checked={state === 'indeterminate' ? 'mixed' : state}
      aria-required={required}
      aria-label={ownLabel || labelText}
      data-state={getState(state)}
      data-disabled={disabled ? '' : undefined}
      {...({ disabled } as HTMLAttributes<HTMLElement>)}
      onKeyDown={composeEventHandlers(
        onKeyDown,
        (event: KeyboardEvent<HTMLElement>) => {
          if (event.key === 'Enter') event.preventDefault()
        },
        both,
      )}
      onClick={composeEventHandlers(
        onClick as ((event: MouseEvent<HTMLElement>) => void) | undefined,
        handleClick,
        both,
      )}
    >
      {typeof children === 'function' ? children({ modelValue, state }) : children}
    </Primitive>
  )

  return (
    <>
      {roving ? (
        <RovingFocusItem asChild ref={composedRef} focusable={!disabled}>
          {control}
        </RovingFocusItem>
      ) : (
        control
      )}
      {isFormControl && name && !group ? (
        <VisuallyHiddenInput
          type="checkbox"
          checked={!!state}
          name={name}
          value={value}
          disabled={disabled}
          required={required}
        />
      ) : null}
    </>
  )
}
