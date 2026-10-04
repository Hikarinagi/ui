'use client'

import { useLayoutEffect, useRef } from 'react'
import clsx from 'clsx'
import { Checkbox } from '../checkbox/Checkbox'
import { checkboxBox } from '../checkbox/checkbox.variants'
import { radioDot } from '../radio-group/radio-group.variants'
import { Transition } from '../../lib/transition/Transition'

export interface DataTableSelectionProps {
  single?: boolean
  checked: boolean | 'indeterminate'
  disabled?: boolean
  label: string
  name: string
  onChange?: (value: boolean) => void
}

export function DataTableSelection({
  single,
  checked,
  disabled,
  label,
  name,
  onChange,
}: DataTableSelectionProps) {
  const input = useRef<HTMLInputElement>(null)
  useLayoutEffect(() => {
    input.current?.toggleAttribute('checked', checked === true)
  }, [checked])
  if (!single)
    return (
      <Checkbox
        className="mx-auto"
        checked={checked}
        disabled={disabled}
        aria-label={label}
        onCheckedChange={value => onChange?.(value === true)}
      />
    )
  return (
    <label className={clsx('relative inline-grid', disabled && 'opacity-50')}>
      <input
        ref={input}
        type="radio"
        name={name}
        checked={checked === true}
        disabled={disabled}
        aria-label={label}
        className="peer absolute inset-0 z-10 size-full cursor-pointer opacity-0"
        onChange={() => onChange?.(true)}
      />
      <span
        aria-hidden="true"
        className={clsx(
          checkboxBox({ shape: 'round' }),
          'peer-focus-visible:outline-(--hn-focus-ring) peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2',
        )}
        data-state={checked === true ? 'checked' : 'unchecked'}
      >
        <Transition
          show={checked === true}
          enterActiveClass="hn-transition-press"
          enterFromClass="scale-50 opacity-0"
          leaveActiveClass="hn-transition"
          leaveToClass="scale-50 opacity-0"
        >
          <span className={radioDot()} />
        </Transition>
      </span>
    </label>
  )
}
