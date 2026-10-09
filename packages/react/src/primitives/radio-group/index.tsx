'use client'

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { RovingFocusGroup, RovingFocusItem } from '../roving-focus'
import type { Direction, Orientation } from '../roving-focus'
import {
  dispatchRadioSelect,
  trackArrowKeys,
  type RadioSelectDetail,
} from '../../../../shared/src/primitives/radio-group'
import { isEqual } from '../../../../shared/src/primitives/value'
import { useLabelText } from '../utils/label-text'
import { useVModel } from '../toggle-group/model'
import {
  VisuallyHiddenInput,
  useCurrentElement,
  useFormControl,
  useServerRender,
} from '../utils/hidden-input'
import { composeEventHandlers } from '../utils/compose-event-handlers'
import { useComposedRefs } from '../utils/compose-refs'
import { useDirection } from '../utils/direction'
import { Slot } from '../utils/slot'

type DataAttributes = { [attribute: `data-${string}`]: string | undefined }

const both = { checkForDefaultPrevented: false }

export type RadioValue = unknown

interface RadioGroupRootContextValue {
  modelValue: RadioValue
  changeModelValue: (value: RadioValue) => void
  disabled: boolean
  loop: boolean
  orientation?: Orientation
  name?: string
  required: boolean
}

const RadioGroupRootContext = createContext<RadioGroupRootContextValue | null>(null)

export function useRadioGroupRootContext(consumer: string) {
  const context = useContext(RadioGroupRootContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`RadioGroupRoot\``)
  return context
}

export interface RadioGroupRootProps
  extends
    PrimitiveProps,
    Omit<HTMLAttributes<HTMLElement>, 'defaultValue' | 'dir' | 'onChange'>,
    DataAttributes {
  value?: RadioValue
  defaultValue?: RadioValue
  onValueChange?: (value: RadioValue) => void
  disabled?: boolean
  orientation?: Orientation
  dir?: Direction
  loop?: boolean
  name?: string
  required?: boolean
  children?: ReactNode
  ref?: Ref<HTMLElement>
}

export function RadioGroupRoot({
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  orientation,
  dir: dirProp,
  loop = true,
  name,
  required = false,
  as,
  asChild,
  ref,
  children,
  ...attrs
}: RadioGroupRootProps) {
  const dir = useDirection(dirProp)
  const [element, setElement] = useCurrentElement<HTMLElement>()
  const composedRef = useComposedRefs(ref, setElement)
  const isFormControl = useFormControl(element)
  const [modelValue, setModelValue] = useVModel<RadioValue>(value, defaultValue, onValueChange)

  return (
    <RadioGroupRootContext
      value={{
        modelValue,
        changeModelValue: next => setModelValue(next),
        disabled,
        loop,
        orientation,
        name,
        required,
      }}
    >
      <RovingFocusGroup asChild orientation={orientation} dir={dir} loop={loop} {...attrs}>
        <Primitive
          ref={composedRef}
          role="radiogroup"
          data-disabled={disabled ? '' : undefined}
          as={as}
          asChild={asChild}
          aria-orientation={orientation}
          aria-required={required}
          dir={dir}
        >
          {children}
          {isFormControl && name ? (
            <VisuallyHiddenInput
              required={required}
              disabled={disabled}
              value={modelValue}
              name={name}
            />
          ) : null}
        </Primitive>
      </RovingFocusGroup>
    </RadioGroupRootContext>
  )
}

export type RadioSelectEvent = RadioSelectDetail<RadioValue, globalThis.MouseEvent>

export interface RadioGroupItemRenderProps {
  checked: boolean
  required: boolean
  disabled: boolean
}

interface RadioGroupItemContextValue {
  disabled: boolean
  checked: boolean
}

const RadioGroupItemContext = createContext<RadioGroupItemContextValue | null>(null)

export interface RadioGroupItemProps
  extends
    PrimitiveProps,
    Omit<ButtonHTMLAttributes<HTMLElement>, 'value' | 'children' | 'onSelect' | 'type'>,
    DataAttributes {
  value: RadioValue
  id?: string
  disabled?: boolean
  required?: boolean
  name?: string
  onSelect?: (event: CustomEvent<RadioSelectEvent>) => void
  children?: ReactNode | ((props: RadioGroupItemRenderProps) => ReactNode)
  ref?: Ref<HTMLElement>
}

function useArrowKeyPressed() {
  const tracker = useRef<ReturnType<typeof trackArrowKeys> | null>(null)
  useEffect(() => {
    tracker.current = trackArrowKeys(window)
    return () => {
      tracker.current?.dispose()
      tracker.current = null
    }
  }, [])
  return tracker
}

export function RadioGroupItem({
  value,
  id,
  disabled: disabledProp = false,
  required: requiredProp = false,
  name,
  as = 'button',
  asChild,
  onSelect,
  onKeyDown,
  onFocus,
  onClick,
  children,
  ref,
  ...attrs
}: RadioGroupItemProps) {
  const root = useRadioGroupRootContext('RadioGroupItem')
  const disabled = root.disabled || disabledProp
  const required = root.required || requiredProp
  const checked = isEqual(root.modelValue, value)
  const [element, setElement] = useCurrentElement<HTMLElement>()
  const composedRef = useComposedRefs(ref, setElement)
  const isFormControl = useFormControl(element)
  const arrowKeyPressed = useArrowKeyPressed()

  const server = useServerRender()

  useLayoutEffect(() => {
    element?.setAttribute('required', String(required))
  }, [element, required])

  const labelText = useLabelText(id, element)

  function handleClick(event: MouseEvent<HTMLElement>) {
    event.stopPropagation()
    if (disabled) return
    dispatchRadioSelect(event.nativeEvent, value, select => {
      onSelect?.(select)
      if (select.defaultPrevented) return
      root.changeModelValue(value)
      if (isFormControl) select.stopPropagation()
    })
  }

  function handleFocus() {
    setTimeout(() => {
      if (arrowKeyPressed.current?.pressed) element?.click()
    }, 0)
  }

  const content =
    typeof children === 'function' ? children({ checked, required, disabled }) : children

  return (
    <RadioGroupItemContext value={{ disabled, checked }}>
      <RovingFocusItem asChild focusable={!disabled} active={checked}>
        <Primitive
          id={id}
          ref={composedRef}
          role="radio"
          {...({ type: as === 'button' ? 'button' : undefined } as HTMLAttributes<HTMLElement>)}
          as={as}
          aria-checked={checked}
          aria-label={labelText}
          asChild={asChild}
          {...({
            disabled,
            value: value as string,
            required: server ? required : undefined,
            name,
          } as HTMLAttributes<HTMLElement>)}
          data-state={checked ? 'checked' : 'unchecked'}
          data-disabled={disabled ? '' : undefined}
          {...(attrs as HTMLAttributes<HTMLElement>)}
          onClick={composeEventHandlers(onClick, handleClick, both)}
          onKeyDown={composeEventHandlers(
            onKeyDown,
            (event: KeyboardEvent<HTMLElement>) => {
              if (event.key === 'Enter') event.preventDefault()
            },
            both,
          )}
          onFocus={composeEventHandlers(
            onFocus,
            (_event: FocusEvent<HTMLElement>) => handleFocus(),
            both,
          )}
        >
          {content}
        </Primitive>
      </RovingFocusItem>
      {isFormControl && name ? (
        <VisuallyHiddenInput
          type="radio"
          tabIndex={-1}
          value={value}
          checked={checked}
          name={name}
          disabled={disabled}
          required={required}
        />
      ) : null}
    </RadioGroupItemContext>
  )
}

export interface RadioGroupIndicatorProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  forceMount?: boolean
  ref?: Ref<HTMLElement>
}

export function RadioGroupIndicator({
  forceMount,
  as = 'span',
  asChild,
  ...attrs
}: RadioGroupIndicatorProps) {
  const item = useContext(RadioGroupItemContext)
  if (!item) throw new Error('`RadioGroupIndicator` must be used within `RadioGroupItem`')
  if (!forceMount && !item.checked) return null
  const props = {
    'data-state': item.checked ? 'checked' : 'unchecked',
    'data-disabled': item.disabled ? '' : undefined,
    ...attrs,
  }
  if (asChild) return <Slot {...props} />
  return <Primitive as={as} {...props} />
}
