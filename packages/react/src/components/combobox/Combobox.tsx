'use client'

import type { InputHTMLAttributes, MouseEvent, ReactNode, Ref } from 'react'
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
import { useUiLocale } from '../../locale'
import { InputAction } from '../input/InputAction'
import { IconSlot } from '../button/IconSlot'
import { buttonIconBox } from '../button/button.variants'
import { DisclosureIcon } from '../disclosure-icon/DisclosureIcon'
import { useFieldControl } from '../form-field/context'
import { useInputGroup } from '../input-group/context'
import {
  inputActionSlot,
  inputAdornment,
  inputControl,
  inputEmbedded,
  inputHost,
  inputIndicator,
  type InputVariants,
} from '../input/input.variants'
import type { SelectItems, SelectOption } from '../select/types'
import { useCombobox, type ComboboxValue } from './hooks/useCombobox'
import { ComboboxList } from './ComboboxList'

const XIcon = lucide(X)

export type { ComboboxValue } from './hooks/useCombobox'

export interface ComboboxProps<T extends SelectOption = SelectOption> extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'size' | 'disabled' | 'onChange' | 'placeholder'
> {
  options: SelectItems<T>
  virtualize?: VirtualizeOptions
  selectedOption?: T | null
  placeholder?: string
  ignoreFilter?: boolean
  loading?: boolean
  clearable?: boolean
  variant?: InputVariants['variant']
  size?: InputVariants['size']
  disabled?: boolean
  invalid?: boolean
  value?: ComboboxValue
  defaultValue?: ComboboxValue
  onValueChange?: (value: ComboboxValue) => void
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

export function Combobox<T extends SelectOption = SelectOption>({
  options,
  virtualize,
  selectedOption,
  placeholder,
  ignoreFilter,
  loading,
  clearable,
  variant,
  size: sizeProp,
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
  onInput,
  ref,
  ...attrs
}: ComboboxProps<T>) {
  const t = useUiLocale()
  const group = useInputGroup()
  const [model, setModel] = useControllableState<ComboboxValue>({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange,
    caller: 'Combobox',
  })
  const [search = '', setSearch] = useControllableState<string>({
    prop: searchProp,
    defaultProp: defaultSearch,
    onChange: onSearchChange,
    caller: 'Combobox',
  })
  const [open = false, setOpen] = useControllableState<boolean>({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
    caller: 'Combobox',
  })

  const size = group ? group.size : sizeProp
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
  const clearing = !!clearable && model != null && model !== '' && !disabled

  const {
    keyboard,
    setKeyboard,
    input,
    inputValue,
    displayValue,
    clear,
    onInput: handleInput,
    onHostClick,
  } = useCombobox({
    options,
    selectedOption,
    model,
    setModel,
    search,
    setSearch,
    open,
    disabled,
    onClear: () => onClear?.(),
  })

  function setInput(node: HTMLInputElement | null) {
    input.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) (ref as { current: HTMLInputElement | null }).current = node
  }

  return (
    <ComboboxRoot
      value={model}
      onValueChange={next => setModel(next as ComboboxValue)}
      open={open}
      onOpenChange={setOpen}
      disabled={disabled}
      ignoreFilter={ignoreFilter}
      openOnClick
    >
      <ComboboxAnchor asChild>
        <div
          data-hn-combobox=""
          data-invalid={invalid ? '' : undefined}
          data-disabled={disabled ? '' : undefined}
          aria-busy={loading || undefined}
          className={cn(
            group ? inputEmbedded() : inputHost({ variant, size: sizeProp }),
            className,
          )}
          onClick={onHostClick}
          onKeyDown={() => setKeyboard(true)}
        >
          <ComboboxInput
            {...attrs}
            ref={setInput}
            value={inputValue}
            onValueChange={next => setSearch(next ?? '')}
            id={fieldId}
            aria-describedby={describedBy}
            displayValue={displayValue}
            placeholder={placeholder ?? t.combobox.placeholder}
            disabled={disabled}
            aria-invalid={invalid || undefined}
            className={inputControl({ trailing: true })}
            onInput={event => {
              handleInput(event)
              onInput?.(event)
            }}
          />
          <Transition
            show={clearing}
            enterActiveClass="hn-transition-base"
            enterFromClass="scale-90 opacity-0"
            leaveActiveClass="hn-transition"
            leaveToClass="scale-90 opacity-0"
          >
            <span data-hn-combobox-clear="" className={inputActionSlot()}>
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
