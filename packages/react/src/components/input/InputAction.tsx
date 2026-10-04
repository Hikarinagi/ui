'use client'

import type { ButtonHTMLAttributes, MouseEvent, Ref } from 'react'
import { cn } from '../../lib/cn'
import { inputAction, inputAdornment } from './input.variants'

export interface InputActionProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  label: string
  disabled?: boolean
  ref?: Ref<HTMLButtonElement>
}

export function InputAction({
  label,
  disabled,
  className,
  onMouseDown,
  ...attrs
}: InputActionProps) {
  function prevent(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    onMouseDown?.(event)
  }

  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      {...attrs}
      className={cn(inputAdornment(), inputAction(), className)}
      onMouseDown={prevent}
    />
  )
}
