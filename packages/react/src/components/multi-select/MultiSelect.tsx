'use client'

import {
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type Ref,
  type SyntheticEvent,
} from 'react'
import { X } from 'lucide-react'
import { SelectRoot, SelectTrigger } from '../../primitives/select'
import { PrimitiveVisuallyHidden } from '../../primitives/visually-hidden'
import { cn } from '../../lib/cn'
import { lucide } from '../../lib/icon'
import { Transition } from '../../lib/transition/Transition'
import type { VirtualizeOptions } from '../../lib/virtual/types'
import { useUiLocale } from '../../locale'
import { Chip } from '../chip/Chip'
import { InputAction } from '../input/InputAction'
import { DisclosureIcon } from '../disclosure-icon/DisclosureIcon'
import { useFieldControl } from '../form-field/context'
import { useInputGroup } from '../input-group/context'
import {
  inputActionSlot,
  inputAdornment,
  inputEmbedded,
  inputHost,
  type InputVariants,
} from '../input/input.variants'
import { SelectList } from '../select/SelectList'
import { flattenOptions, type SelectItems, type SelectOption } from '../select/types'
import { multiSelectChips, multiSelectTrigger } from './multi-select.variants'
import { useControllableState } from '../../primitives/utils/controllable-state'

const XIcon = lucide(X)
const EMPTY: Array<string | number> = []

export interface MultiSelectProps<T extends SelectOption = SelectOption> extends Omit<
  HTMLAttributes<HTMLElement>,
  'defaultValue' | 'onChange'
> {
  options: SelectItems<T>
  virtualize?: VirtualizeOptions
  placeholder?: string
  name?: string
  required?: boolean
  autocomplete?: string
  maxVisible?: number
  clearable?: boolean
  variant?: InputVariants['variant']
  size?: InputVariants['size']
  disabled?: boolean
  invalid?: boolean
  value?: Array<string | number>
  defaultValue?: Array<string | number>
  onValueChange?: (value: Array<string | number>) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onClear?: () => void
  renderOption?: (props: { option: T }) => ReactNode
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function MultiSelect<T extends SelectOption = SelectOption>({
  options,
  virtualize,
  placeholder,
  name,
  required,
  autocomplete,
  maxVisible = 2,
  clearable = false,
  variant,
  size: sizeProp,
  disabled: disabledProp,
  invalid: invalidProp,
  value,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onClear,
  renderOption,
  className,
  onKeyDown,
  onPointerDown,
  ...attrs
}: MultiSelectProps<T>) {
  const t = useUiLocale()
  const group = useInputGroup()
  const [keyboard, setKeyboard] = useState(false)
  const [modelValue, setModel] = useControllableState<Array<string | number>>({
    prop: value,
    defaultProp: defaultValue ?? EMPTY,
    onChange: onValueChange,
    caller: 'MultiSelect',
  })
  const model = modelValue ?? EMPTY
  const [open, setOpen] = useControllableState<boolean>({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
    caller: 'MultiSelect',
  })

  const size = group ? group.size : sizeProp
  const {
    id: fieldId,
    labelledBy,
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
  const flat = flattenOptions(options)
  const selected = flat.filter(option => model.includes(option.value))
  const formOptions = virtualize ? selected : flat
  const visible = selected.slice(0, maxVisible)
  const overflow = selected.length - visible.length
  const chipSize = size === 'sm' ? 'sm' : 'md'
  const clearing = clearable && selected.length > 0 && !disabled

  const nativeSelect = useRef<HTMLSelectElement>(null)
  useLayoutEffect(() => {
    const element = nativeSelect.current
    if (!element) return
    for (const option of element.options)
      option.selected = model.some(item => String(item) === option.value)
  })

  function remove(item: string | number) {
    if (disabled) return
    setModel(model.filter(entry => entry !== item))
  }

  function clear() {
    if (!model.length) return
    setModel([])
    onClear?.()
  }

  function isolate(event: SyntheticEvent) {
    if ((event.target as HTMLElement).closest('button')) event.stopPropagation()
  }

  return (
    <SelectRoot
      value={model}
      onValueChange={next => setModel(next as Array<string | number>)}
      open={open}
      onOpenChange={setOpen}
      disabled={disabled}
      required={required}
      multiple
    >
      <SelectTrigger
        {...attrs}
        as="div"
        id={fieldId}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        data-hn-multi-select=""
        onKeyDown={event => {
          setKeyboard(true)
          onKeyDown?.(event)
        }}
        onPointerDown={event => {
          setKeyboard(false)
          onPointerDown?.(event)
        }}
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        data-invalid={invalid ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        aria-invalid={invalid || undefined}
        className={cn(
          group ? inputEmbedded() : inputHost({ variant, size: sizeProp }),
          multiSelectTrigger(),
          className,
        )}
      >
        <span className={multiSelectChips()}>
          {selected.length ? (
            <>
              {visible.map(option => (
                <Chip
                  key={option.value}
                  size={chipSize}
                  removable
                  disabled={disabled}
                  className="max-w-40 min-w-0 shrink data-disabled:opacity-100"
                  onPointerDown={isolate}
                  onClick={isolate}
                  onRemove={() => remove(option.value)}
                >
                  <span className="min-w-0 truncate">{option.label}</span>
                </Chip>
              ))}
              {overflow > 0 && (
                <Chip
                  size={chipSize}
                  disabled={disabled}
                  className="shrink-0 data-disabled:opacity-100"
                >
                  +{overflow}
                </Chip>
              )}
            </>
          ) : (
            <span className="min-w-0 truncate">{placeholder ?? t.select.placeholder}</span>
          )}
        </span>
        <Transition
          show={clearing}
          enterActiveClass="hn-transition-base"
          enterFromClass="scale-90 opacity-0"
          leaveActiveClass="hn-transition"
          leaveToClass="scale-90 opacity-0"
        >
          <span data-hn-multi-select-clear="" className={inputActionSlot()}>
            <InputAction
              label={t.common.clear}
              onPointerDown={(event: PointerEvent<HTMLButtonElement>) => event.stopPropagation()}
              onClick={(event: MouseEvent<HTMLButtonElement>) => {
                event.stopPropagation()
                clear()
              }}
            >
              <XIcon />
            </InputAction>
          </span>
        </Transition>
        <span className={inputAdornment()}>
          <DisclosureIcon />
        </span>
      </SelectTrigger>
      {name ? (
        <PrimitiveVisuallyHidden asChild>
          <select
            ref={nativeSelect}
            multiple
            onChange={event =>
              setModel(
                Array.from(event.target.selectedOptions, option =>
                  formOptions.find(entry => String(entry.value) === option.value),
                ).flatMap(option => (option ? [option.value] : [])),
              )
            }
            name={name}
            required={required}
            autoComplete={autocomplete}
            disabled={disabled}
            aria-hidden="true"
            tabIndex={-1}
          >
            {formOptions.map(option => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
        </PrimitiveVisuallyHidden>
      ) : null}
      <SelectList<T>
        options={options}
        keyboard={keyboard}
        virtualize={virtualize}
        renderOption={renderOption}
      />
    </SelectRoot>
  )
}
