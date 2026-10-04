'use client'

import { useMemo, type HTMLAttributes, type Ref } from 'react'
import { useControllableState } from 'radix-ui/internal'
import { cn } from '../../lib/cn'
import { useUiLocale } from '../../locale'
import { PinInputInput, PinInputRoot, type PinInputValue } from '../../primitives/pin-input'
import { useFieldControl } from '../form-field/context'
import { pinInput, pinInputCell, type PinInputVariants } from './pin-input.variants'

export interface PinInputProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'defaultValue' | 'onChange' | 'children' | 'placeholder' | 'dir'
> {
  length?: number
  type?: 'text' | 'number'
  mask?: boolean
  otp?: boolean
  placeholder?: string
  name?: string
  variant?: PinInputVariants['variant']
  size?: PinInputVariants['size']
  disabled?: boolean
  invalid?: boolean
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onComplete?: (value: string) => void
  dir?: 'ltr' | 'rtl'
  id?: string
  required?: boolean
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function PinInput({
  length = 6,
  type = 'text',
  mask,
  otp,
  placeholder = '',
  name,
  variant,
  size,
  disabled: disabledProp,
  invalid: invalidProp,
  value,
  defaultValue,
  onValueChange,
  onComplete,
  className,
  ...attrs
}: PinInputProps) {
  const [model = '', setModel] = useControllableState<string>({
    prop: value,
    defaultProp: defaultValue ?? '',
    onChange: onValueChange,
    caller: 'PinInput',
  })
  const t = useUiLocale()
  const { labelledBy, invalid, disabled, describedBy } = useFieldControl(
    { invalid: invalidProp, disabled: disabledProp },
    attrs,
  )

  const cells = useMemo(() => Array.from({ length }, (_, i) => model[i] ?? ''), [model, length])

  function update(next: PinInputValue | undefined) {
    const text = (next ?? []).map(cell => (cell === undefined ? '' : String(cell))).join('')
    if (text !== model) setModel(text)
  }

  return (
    <PinInputRoot
      role="group"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      value={cells}
      type={type}
      mask={mask}
      otp={otp}
      placeholder={placeholder}
      name={name}
      disabled={disabled}
      data-hn-pin-input=""
      data-invalid={invalid ? '' : undefined}
      onValueChange={update}
      onComplete={next => onComplete?.(next.map(String).join(''))}
      {...attrs}
      className={cn(pinInput(), className)}
    >
      {Array.from({ length }, (_, i) => (
        <PinInputInput
          key={i + 1}
          index={i}
          aria-label={t.pinInput.cellLabel(i + 1, length)}
          aria-invalid={invalid || undefined}
          data-invalid={invalid ? '' : undefined}
          className={pinInputCell({ variant, size })}
        />
      ))}
    </PinInputRoot>
  )
}
