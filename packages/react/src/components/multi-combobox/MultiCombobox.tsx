'use client'

import type { InputHTMLAttributes, KeyboardEvent, MouseEvent, ReactNode, Ref } from 'react'
import { X } from 'lucide-react'
import { useControllableState } from 'radix-ui/internal'
import {
  ComboboxAnchor,
  ComboboxInput,
  ComboboxRoot,
  ComboboxTrigger,
} from '../../primitives/combobox'
import { cn } from '../../lib/cn'
import { lucide } from '../../lib/icon'
import { Transition } from '../../lib/transition/Transition'
import type { VirtualizeOptions } from '../../lib/virtual/types'
import { useFieldControl } from '../form-field/context'
import { useUiLocale } from '../../locale'
import { buttonIconBox } from '../button/button.variants'
import { IconSlot } from '../button/IconSlot'
import { Chip } from '../chip/Chip'
import { InputAction } from '../input/InputAction'
import { ComboboxList } from '../combobox/ComboboxList'
import { DisclosureIcon } from '../disclosure-icon/DisclosureIcon'
import {
  inputActionSlot,
  inputAdornment,
  inputHost,
  inputIndicator,
  type InputVariants,
} from '../input/input.variants'
import type { SelectItems, SelectOption } from '../select/types'
import { useMultiCombobox } from './hooks/useMultiCombobox'
import {
  tagsInputChip,
  tagsInputControl,
  tagsInputHost,
  tagsInputList,
} from '../tags-input/tags-input.variants'
import { multiComboboxEnd, multiComboboxHost } from './multi-combobox.variants'

const XIcon = lucide(X)
const EMPTY: Array<string | number> = []

export interface MultiComboboxProps<T extends SelectOption = SelectOption> extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'size' | 'disabled' | 'onChange' | 'placeholder' | 'name'
> {
  options: SelectItems<T>
  virtualize?: VirtualizeOptions
  selectedOptions?: T[]
  placeholder?: string
  ignoreFilter?: boolean
  loading?: boolean
  clearable?: boolean
  name?: string
  variant?: InputVariants['variant']
  size?: InputVariants['size']
  disabled?: boolean
  invalid?: boolean
  value?: Array<string | number>
  defaultValue?: Array<string | number>
  onValueChange?: (value: Array<string | number>) => void
  search?: string
  defaultSearch?: string
  onSearchChange?: (search: string) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onClear?: () => void
  renderOption?: (props: { option: T }) => ReactNode
  ref?: Ref<HTMLInputElement>
  [attribute: `data-${string}`]: string | undefined
}

export function MultiCombobox<T extends SelectOption = SelectOption>({
  options,
  virtualize,
  selectedOptions,
  placeholder,
  ignoreFilter,
  loading,
  clearable = false,
  name,
  variant,
  size,
  disabled: disabledProp,
  invalid: invalidProp,
  value,
  defaultValue,
  onValueChange,
  search: searchProp,
  defaultSearch = '',
  onSearchChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onClear,
  renderOption,
  className,
  onKeyDown,
  ref,
  ...attrs
}: MultiComboboxProps<T>) {
  const t = useUiLocale()
  const [modelValue, setModel] = useControllableState<Array<string | number>>({
    prop: value,
    defaultProp: defaultValue ?? EMPTY,
    onChange: onValueChange,
    caller: 'MultiCombobox',
  })
  const model = modelValue ?? EMPTY
  const [search = '', setSearch] = useControllableState<string>({
    prop: searchProp,
    defaultProp: defaultSearch,
    onChange: onSearchChange,
    caller: 'MultiCombobox',
  })
  const [open = false, setOpen] = useControllableState<boolean>({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
    caller: 'MultiCombobox',
  })

  const {
    id: fieldId,
    invalid,
    disabled,
    describedBy,
  } = useFieldControl({ invalid: invalidProp, disabled: disabledProp }, attrs)

  const { selected, keyboard, input, remove, clear, onHostClick, onInputKeydown } =
    useMultiCombobox({
      options,
      selectedOptions,
      model,
      setModel,
      open,
      setOpen,
      disabled,
      onClear: () => onClear?.(),
    })
  const chipSize = size === 'sm' ? 'sm' : 'md'
  const clearing = clearable && selected.length > 0 && !disabled

  function setInput(node: HTMLInputElement | null) {
    input.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) (ref as { current: HTMLInputElement | null }).current = node
  }

  return (
    <ComboboxRoot
      value={model}
      onValueChange={next => setModel(next as Array<string | number>)}
      open={open}
      onOpenChange={setOpen}
      disabled={disabled}
      ignoreFilter={ignoreFilter}
      name={name}
      multiple
      openOnClick
    >
      <ComboboxAnchor asChild>
        <div
          data-hn-multi-combobox=""
          data-invalid={invalid ? '' : undefined}
          data-disabled={disabled ? '' : undefined}
          aria-busy={loading || undefined}
          className={cn(
            inputHost({ variant, size }),
            tagsInputHost({ size, trailing: true }),
            multiComboboxHost({ clearing }),
            className,
          )}
          onClick={onHostClick}
        >
          <div className={tagsInputList()}>
            {selected.map(option => (
              <Chip
                key={option.value}
                size={chipSize}
                removable
                disabled={disabled}
                className={tagsInputChip()}
                onRemove={() => remove(option.value)}
              >
                <span className="min-w-0 truncate">{option.label}</span>
              </Chip>
            ))}
            <ComboboxInput
              {...attrs}
              ref={setInput}
              value={search}
              onValueChange={next => setSearch(next ?? '')}
              placeholder={selected.length ? undefined : (placeholder ?? t.combobox.placeholder)}
              disabled={disabled}
              id={fieldId}
              aria-invalid={invalid || undefined}
              aria-describedby={describedBy}
              className={tagsInputControl({ size })}
              onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                onInputKeydown(event)
                onKeyDown?.(event)
              }}
            />
          </div>
          <span className={multiComboboxEnd()}>
            <Transition
              show={clearing}
              enterActiveClass="hn-transition-base"
              enterFromClass="scale-90 opacity-0"
              leaveActiveClass="hn-transition"
              leaveToClass="scale-90 opacity-0"
            >
              <span data-hn-multi-combobox-clear="" className={inputActionSlot()}>
                <InputAction label={t.common.clear} onClick={clear}>
                  <XIcon />
                </InputAction>
              </span>
            </Transition>
            <ComboboxTrigger
              aria-label={t.combobox.toggle}
              disabled={disabled}
              className={cn(inputAdornment(), inputIndicator())}
              onMouseDown={(event: MouseEvent<HTMLElement>) => event.preventDefault()}
            >
              <IconSlot boxClass={buttonIconBox({ size })} swapped={!!loading} spinnerSize="sm">
                <DisclosureIcon open={open} />
              </IconSlot>
            </ComboboxTrigger>
          </span>
        </div>
      </ComboboxAnchor>
      <ComboboxList<T>
        options={options}
        keyboard={keyboard}
        virtualize={virtualize}
        renderOption={renderOption}
      />
    </ComboboxRoot>
  )
}
