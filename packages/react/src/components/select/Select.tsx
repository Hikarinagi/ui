'use client'

import { useRef, useState, type ButtonHTMLAttributes, type ReactNode, type Ref } from 'react'
import { X } from 'lucide-react'
import { Direction } from 'radix-ui'
import { useControllableState } from 'radix-ui/internal'
import { SelectRoot, SelectTrigger } from '../../primitives/select'
import { cn } from '../../lib/cn'
import { lucide } from '../../lib/icon'
import { Transition } from '../../lib/transition/Transition'
import type { VirtualizeOptions } from '../../lib/virtual/types'
import { useUiLocale } from '../../locale'
import { InputAction } from '../input/InputAction'
import { DisclosureIcon } from '../disclosure-icon/DisclosureIcon'
import { useFieldControl } from '../form-field/context'
import { useInputGroup } from '../input-group/context'
import {
  inputAdornment,
  inputEmbedded,
  inputHost,
  type InputVariants,
} from '../input/input.variants'
import { SelectList } from './SelectList'
import { selectButton, selectClearSlot, selectHost, selectValue } from './select.variants'
import { useClearTransition } from './hooks/useClearTransition'
import { flattenOptions, type SelectItems, type SelectOption } from './types'

const XIcon = lucide(X)

export type SelectValue = string | number | null | undefined

export interface SelectProps<T extends SelectOption = SelectOption> extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'value' | 'defaultValue' | 'onChange' | 'disabled'
> {
  options: SelectItems<T>
  virtualize?: VirtualizeOptions
  placeholder?: string
  clearable?: boolean
  name?: string
  required?: boolean
  autocomplete?: string
  variant?: InputVariants['variant']
  size?: InputVariants['size']
  disabled?: boolean
  invalid?: boolean
  value?: SelectValue
  defaultValue?: SelectValue
  onValueChange?: (value: SelectValue) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onClear?: () => void
  renderValue?: (props: { option: T }) => ReactNode
  renderOption?: (props: { option: T }) => ReactNode
  ref?: Ref<HTMLButtonElement>
  [attribute: `data-${string}`]: string | undefined
}

export function Select<T extends SelectOption = SelectOption>({
  options,
  virtualize,
  placeholder,
  clearable,
  name,
  required,
  autocomplete,
  variant,
  size,
  disabled: disabledProp,
  invalid: invalidProp,
  value,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onClear,
  renderValue,
  renderOption,
  className,
  onKeyDown,
  onPointerDown,
  ref,
  ...attrs
}: SelectProps<T>) {
  const t = useUiLocale()
  const group = useInputGroup()
  const direction = Direction.useDirection(undefined)
  const [keyboard, setKeyboard] = useState(false)
  const [host, setHost] = useState<HTMLDivElement | null>(null)
  const trigger = useRef<HTMLElement | null>(null)
  const [model, setModel] = useControllableState<SelectValue>({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange,
    caller: 'Select',
  })
  const [open, setOpen] = useControllableState<boolean>({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
    caller: 'Select',
  })

  const {
    id: fieldId,
    invalid,
    disabled,
    describedBy,
  } = useFieldControl(
    {
      invalid: invalidProp || !!group?.invalid,
      disabled: disabledProp || !!group?.disabled,
    },
    attrs,
  )
  const selected = flattenOptions(options).find(option => option.value === model)
  const clearing = !!clearable && model != null && model !== '' && !disabled
  const { reserved: clearSpace, hooks: clearTransition } = useClearTransition(clearing)

  function clear() {
    if (disabled || model == null || model === '') return
    setModel(null)
    onClear?.()
    trigger.current?.focus()
  }

  function setTrigger(node: HTMLElement | null) {
    trigger.current = node
    if (typeof ref === 'function') ref(node as HTMLButtonElement | null)
    else if (ref) (ref as { current: HTMLElement | null }).current = node
  }

  return (
    <SelectRoot
      value={model}
      onValueChange={next => setModel(next as SelectValue)}
      open={open}
      onOpenChange={setOpen}
      disabled={disabled}
      name={name}
      required={required}
      autocomplete={autocomplete}
    >
      <div
        ref={setHost}
        dir={direction}
        data-hn-select=""
        data-invalid={invalid ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        className={cn(
          group ? inputEmbedded() : inputHost({ variant, size }),
          selectHost(),
          className,
        )}
      >
        <SelectTrigger
          {...attrs}
          ref={setTrigger}
          reference={host}
          id={fieldId}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          data-hn-select-trigger=""
          onKeyDown={event => {
            setKeyboard(true)
            onKeyDown?.(event as Parameters<NonNullable<typeof onKeyDown>>[0])
          }}
          onPointerDown={event => {
            setKeyboard(false)
            onPointerDown?.(event as Parameters<NonNullable<typeof onPointerDown>>[0])
          }}
          className={selectButton()}
        >
          <span className={selectValue({ clearing: clearSpace })}>
            {selected
              ? renderValue
                ? renderValue({ option: selected })
                : selected.label
              : (placeholder ?? t.select.placeholder)}
          </span>
          <span className={inputAdornment()}>
            <DisclosureIcon />
          </span>
        </SelectTrigger>
        <Transition
          show={clearing}
          enterActiveClass="hn-transition-base"
          enterFromClass="scale-90 opacity-0"
          leaveActiveClass="hn-transition"
          leaveToClass="scale-90 opacity-0"
          {...clearTransition}
        >
          <span className={selectClearSlot()}>
            <InputAction data-hn-select-clear="" label={t.common.clear} onClick={clear}>
              <XIcon />
            </InputAction>
          </span>
        </Transition>
      </div>
      <SelectList<T>
        options={options}
        keyboard={keyboard}
        virtualize={virtualize}
        renderOption={renderOption}
      />
    </SelectRoot>
  )
}
