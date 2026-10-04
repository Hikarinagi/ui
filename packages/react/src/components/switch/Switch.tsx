'use client'

import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import { useControllableState } from 'radix-ui/internal'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { SwitchRoot } from '../../primitives/switch'
import { useFieldControl } from '../form-field/context'
import {
  checkbox,
  checkboxControl,
  checkboxDescription,
  checkboxTitle,
  checkboxTitleText,
  type CheckboxVariants,
} from '../checkbox/checkbox.variants'
import { switchThumb, switchTrack, type SwitchVariants } from './switch.variants'

export interface SwitchProps extends Omit<
  ButtonHTMLAttributes<HTMLElement>,
  'value' | 'defaultValue' | 'defaultChecked' | 'onChange' | 'type' | 'children' | 'disabled'
> {
  size?: SwitchVariants['size']
  description?: string
  controlPlacement?: CheckboxVariants['controlPlacement']
  block?: boolean
  disabled?: boolean
  invalid?: boolean
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  value?: string
  name?: string
  required?: boolean
  children?: ReactNode
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function Switch({
  size,
  description,
  controlPlacement,
  block,
  disabled: disabledProp,
  invalid: invalidProp,
  checked,
  defaultChecked,
  onCheckedChange,
  className,
  children,
  ...attrs
}: SwitchProps) {
  const [model = false, setModel] = useControllableState<boolean>({
    prop: checked,
    defaultProp: defaultChecked ?? false,
    onChange: onCheckedChange,
    caller: 'Switch',
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
      data-hn-switch=""
      data-hn-state-group=""
      data-disabled={disabled ? '' : undefined}
      className={cn(
        checkbox({ size, controlPlacement, block, bare: !titled && !description }),
        className,
      )}
    >
      <SwitchRoot
        {...attrs}
        checked={model}
        onCheckedChange={setModel}
        id={fieldId}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        data-invalid={invalid ? '' : undefined}
        data-hn-on={model ? '' : undefined}
        className={cn(switchTrack({ size }), checkboxControl({ controlPlacement }))}
      >
        <span data-hn-thumb="" aria-hidden="true" className={switchThumb()} />
      </SwitchRoot>
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
