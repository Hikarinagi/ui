'use client'

import { useMemo, type HTMLAttributes, type MouseEvent, type Ref } from 'react'
import { cn } from '../../lib/cn'
import { focusFieldFrom } from '../../../../shared/src/lib/field-focus'
import { useFieldControl } from '../form-field/context'
import { textInputHost, type TextInputVariants } from '../input/input.variants'
import { InputGroupProvider, type InputGroupContext } from './context'
import { inputGroup } from './input-group.variants'

export interface InputGroupProps extends HTMLAttributes<HTMLDivElement> {
  variant?: TextInputVariants['variant']
  size?: TextInputVariants['size']
  disabled?: boolean
  invalid?: boolean
  ref?: Ref<HTMLDivElement>
  [attribute: `data-${string}`]: string | undefined
}

export function InputGroup({
  variant,
  size,
  disabled: disabledProp,
  invalid,
  className,
  onClick,
  children,
  ...attrs
}: InputGroupProps) {
  const { disabled } = useFieldControl({ disabled: disabledProp }, attrs)

  const context = useMemo<InputGroupContext>(
    () => ({ variant, size, disabled, invalid: !!invalid }),
    [variant, size, disabled, invalid],
  )

  function onGroupClick(event: MouseEvent<HTMLDivElement>) {
    onClick?.(event)
    focusFieldFrom(event.currentTarget, event.target as HTMLElement)
  }

  return (
    <InputGroupProvider value={context}>
      <div
        data-hn-input-group=""
        data-invalid={invalid ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        {...attrs}
        className={cn(
          textInputHost({ variant, size }),
          inputGroup({ divided: variant !== 'bare' }),
          className,
        )}
        onClick={onGroupClick}
      >
        {children}
      </div>
    </InputGroupProvider>
  )
}
