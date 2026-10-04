'use client'

import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import { Check, Minus } from 'lucide-react'
import { useControllableState } from 'radix-ui/internal'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { lucide } from '../../lib/icon'
import { Transition } from '../../lib/transition/Transition'
import { CheckboxRoot, type CheckedState } from '../../primitives/checkbox'
import { useFieldControl } from '../form-field/context'
import {
  checkbox,
  checkboxBox,
  checkboxControl,
  checkboxDescription,
  checkboxTitle,
  checkboxTitleText,
  type CheckboxVariants,
} from './checkbox.variants'

const CheckIcon = lucide(Check)
const MinusIcon = lucide(Minus)

export interface CheckboxProps extends Omit<
  ButtonHTMLAttributes<HTMLElement>,
  'value' | 'defaultValue' | 'defaultChecked' | 'onChange' | 'type' | 'children' | 'disabled'
> {
  size?: CheckboxVariants['size']
  description?: string
  controlPlacement?: CheckboxVariants['controlPlacement']
  block?: boolean
  disabled?: boolean
  invalid?: boolean
  checked?: CheckedState
  defaultChecked?: CheckedState
  onCheckedChange?: (checked: CheckedState) => void
  value?: unknown
  name?: string
  required?: boolean
  children?: ReactNode
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function Checkbox({
  size,
  description,
  controlPlacement,
  block,
  disabled: disabledProp,
  invalid: invalidProp,
  checked,
  defaultChecked,
  onCheckedChange,
  value,
  className,
  children,
  ...attrs
}: CheckboxProps) {
  const [model = false, setModel] = useControllableState<CheckedState>({
    prop: checked,
    defaultProp: defaultChecked ?? false,
    onChange: onCheckedChange,
    caller: 'Checkbox',
  })
  const {
    id: fieldId,
    invalid,
    disabled,
    describedBy,
  } = useFieldControl({ invalid: invalidProp, disabled: disabledProp }, attrs)
  const titled = hasContent(children)

  return (
    <label
      data-hn-checkbox=""
      data-hn-state-group=""
      data-disabled={disabled ? '' : undefined}
      className={cn(
        checkbox({ size, controlPlacement, block, bare: !titled && !description }),
        className,
      )}
    >
      <CheckboxRoot
        {...attrs}
        {...(value === undefined ? {} : { value })}
        checked={model}
        onCheckedChange={setModel}
        id={fieldId}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        data-invalid={invalid ? '' : undefined}
        className={cn(checkboxBox({ size }), checkboxControl({ controlPlacement }))}
      >
        {({ state }) => (
          <>
            <Transition
              show={state === true}
              enterActiveClass="hn-transition-press"
              enterFromClass="scale-50 opacity-0"
              leaveActiveClass="hn-transition"
              leaveToClass="scale-50 opacity-0"
            >
              <CheckIcon aria-hidden="true" />
            </Transition>
            <Transition
              show={state === 'indeterminate'}
              enterActiveClass="hn-transition-press"
              enterFromClass="scale-50 opacity-0"
              leaveActiveClass="hn-transition"
              leaveToClass="scale-50 opacity-0"
            >
              <MinusIcon aria-hidden="true" />
            </Transition>
          </>
        )}
      </CheckboxRoot>
      {titled && (
        <span className={checkboxTitle({ controlPlacement })}>
          <span className={checkboxTitleText()}>{children}</span>
        </span>
      )}
      {description && (
        <span className={checkboxDescription({ size, controlPlacement })}>{description}</span>
      )}
    </label>
  )
}
