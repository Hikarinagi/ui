'use client'

import { useEffect, useRef, useState, type HTMLAttributes, type Ref } from 'react'
import { cn } from '../../lib/cn'
import { useFieldControl } from '../form-field/context'
import {
  createPinInput,
  pinCells,
  pinInputValue,
  type PinInputController,
  type PinInputSelection,
} from '../../../../shared/src/primitives/pin-input'
import {
  pinInput,
  pinInputCaret,
  pinInputCell,
  pinInputNative,
  type PinInputVariants,
} from './pin-input.variants'
import { useControllableState } from '../../primitives/utils/controllable-state'
import { useComposedRefs } from '../../primitives/utils/compose-refs'
import { useDirection } from '../../primitives/utils/direction'
import { useLayoutEffect } from '../../primitives/utils/layout-effect'

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
  dir: dirProp,
  id: idProp,
  required,
  autoFocus,
  'aria-label': label,
  'aria-labelledby': labelledByProp,
  'aria-describedby': describedByProp,
  className,
  ref,
  ...attrs
}: PinInputProps) {
  const [model = '', setModel] = useControllableState<string>({
    prop: value,
    defaultProp: defaultValue ?? '',
    onChange: onValueChange,
    caller: 'PinInput',
  })
  const dir = useDirection(dirProp)
  const { id, labelledBy, invalid, disabled, describedBy } = useFieldControl(
    { invalid: invalidProp, disabled: disabledProp },
    {
      id: idProp,
      'aria-label': label,
      'aria-labelledby': labelledByProp,
      'aria-describedby': describedByProp,
    },
  )
  const root = useRef<HTMLElement>(null)
  const composedRef = useComposedRefs(ref, root)
  const input = useRef<HTMLInputElement>(null)
  const controller = useRef<PinInputController | undefined>(undefined)
  const [selection, setSelection] = useState<PinInputSelection>({
    focused: false,
    start: 0,
    end: 0,
  })
  const numeric = type === 'number'
  const shown = pinInputValue(model, length)
  const latest = useRef({ length, numeric, model, dir, setModel, onComplete })
  latest.current = { length, numeric, model, dir, setModel, onComplete }

  useLayoutEffect(() => {
    const created = createPinInput(input.current!, {
      length: () => latest.current.length,
      numeric: () => latest.current.numeric,
      value: () => latest.current.model,
      rtl: () => latest.current.dir === 'rtl',
      cells: () => root.current!.querySelectorAll('[data-hn-pin-cell]'),
      change: next => latest.current.setModel(next),
      select: setSelection,
    })
    controller.current = created
    return () => {
      created.dispose()
      controller.current = undefined
    }
  }, [])

  useLayoutEffect(() => {
    controller.current?.sync()
  }, [shown, numeric])

  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    const current = latest.current
    if (model.length >= current.length) current.onComplete?.(pinInputValue(model, current.length))
  }, [model])

  return (
    <div
      {...attrs}
      ref={composedRef as Ref<HTMLDivElement>}
      dir={dir}
      data-hn-pin-input=""
      data-hn-field-group=""
      data-complete={shown.length >= length ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-invalid={invalid ? '' : undefined}
      className={cn(pinInput({ size }), className)}
    >
      {pinCells(shown, length, selection).map((cell, index) => (
        <div
          key={index}
          data-hn-pin-cell=""
          aria-hidden="true"
          data-filled={cell.char ? '' : undefined}
          data-state={cell.active ? 'active' : undefined}
          data-disabled={disabled ? '' : undefined}
          data-invalid={invalid ? '' : undefined}
          className={pinInputCell({ variant, size })}
        >
          {cell.caret ? (
            <span className={pinInputCaret()} />
          ) : cell.char ? (
            mask ? (
              '•'
            ) : (
              cell.char
            )
          ) : (
            placeholder
          )}
        </div>
      ))}
      <input
        id={id}
        ref={input}
        type={mask ? 'password' : 'text'}
        name={name}
        defaultValue={shown}
        inputMode={numeric ? 'numeric' : 'text'}
        pattern={numeric ? '[0-9]*' : undefined}
        autoComplete={otp ? 'one-time-code' : 'off'}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        autoFocus={autoFocus}
        disabled={disabled}
        required={required}
        aria-label={label}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        className={pinInputNative()}
      />
    </div>
  )
}
