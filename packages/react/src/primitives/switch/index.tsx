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
import { VisuallyHiddenInput, useCurrentElement, useFormControl } from '../utils/hidden-input'
import { composeEventHandlers } from '../utils/compose-event-handlers'
import { useComposedRefs } from '../utils/compose-refs'
import { useControllableState } from '../utils/controllable-state'

type DataAttributes = { [attribute: `data-${string}`]: string | undefined }

const both = { checkForDefaultPrevented: false }

interface SwitchRootContextValue {
  checked: boolean
  toggleCheck: () => void
  disabled: boolean
}

const SwitchRootContext = createContext<SwitchRootContextValue | null>(null)

export interface SwitchRootRenderProps {
  modelValue: boolean
  checked: boolean
}

export interface SwitchRootProps
  extends
    PrimitiveProps,
    Omit<ButtonHTMLAttributes<HTMLElement>, 'value' | 'defaultChecked' | 'children' | 'type'>,
    DataAttributes {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  id?: string
  value?: string
  name?: string
  required?: boolean
  children?: ReactNode | ((props: SwitchRootRenderProps) => ReactNode)
  ref?: Ref<HTMLElement>
}

export function SwitchRoot({
  checked: checkedProp,
  defaultChecked,
  onCheckedChange,
  disabled = false,
  id,
  value = 'on',
  as = 'button',
  asChild,
  name,
  required = false,
  children,
  onClick,
  onKeyDown,
  ref,
  ...attrs
}: SwitchRootProps) {
  const [modelValue = false, setModelValue] = useControllableState<boolean>({
    prop: checkedProp,
    defaultProp: defaultChecked ?? false,
    onChange: onCheckedChange,
    caller: 'SwitchRoot',
  })
  const checked = modelValue === true
  const [element, setElement] = useCurrentElement<HTMLElement>()
  const composedRef = useComposedRefs(ref, setElement)
  const isFormControl = useFormControl(element)
  const [labelText, setLabelText] = useState<string | undefined>(undefined)

  useLayoutEffect(() => {
    if (!id || !element) {
      setLabelText(undefined)
      return
    }
    setLabelText(
      element.ownerDocument.querySelector<HTMLElement>(`[for="${id}"]`)?.innerText ?? undefined,
    )
  }, [id, element])

  function toggleCheck() {
    if (disabled) return
    setModelValue(!checked)
  }

  return (
    <SwitchRootContext value={{ checked, toggleCheck, disabled }}>
      <Primitive
        id={id}
        ref={composedRef}
        role="switch"
        {...({
          type: as === 'button' ? 'button' : undefined,
          value,
        } as HTMLAttributes<HTMLElement>)}
        aria-label={attrs['aria-label'] || labelText}
        aria-checked={checked}
        aria-required={required}
        data-state={checked ? 'checked' : 'unchecked'}
        data-disabled={disabled ? '' : undefined}
        asChild={asChild}
        as={as}
        {...({ disabled } as HTMLAttributes<HTMLElement>)}
        {...(attrs as HTMLAttributes<HTMLElement>)}
        onClick={composeEventHandlers(
          onClick as ((event: MouseEvent<HTMLElement>) => void) | undefined,
          toggleCheck,
          both,
        )}
        onKeyDown={composeEventHandlers(
          onKeyDown,
          (event: KeyboardEvent<HTMLElement>) => {
            if (event.key !== 'Enter') return
            event.preventDefault()
            toggleCheck()
          },
          both,
        )}
      >
        {typeof children === 'function' ? children({ modelValue, checked }) : children}
      </Primitive>
      {isFormControl && name ? (
        <VisuallyHiddenInput
          type="checkbox"
          name={name}
          disabled={disabled}
          required={required}
          value={value}
          checked={checked}
        />
      ) : null}
    </SwitchRootContext>
  )
}

export interface SwitchThumbProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  ref?: Ref<HTMLElement>
}

export function SwitchThumb({ as = 'span', ...attrs }: SwitchThumbProps) {
  const root = useContext(SwitchRootContext)
  if (!root) throw new Error('`SwitchThumb` must be used within `SwitchRoot`')
  return (
    <Primitive
      data-state={root.checked ? 'checked' : 'unchecked'}
      data-disabled={root.disabled ? '' : undefined}
      as={as}
      {...attrs}
    />
  )
}
