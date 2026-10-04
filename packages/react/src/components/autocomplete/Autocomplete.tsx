'use client'

import {
  useImperativeHandle,
  type InputHTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react'
import { useControllableState } from 'radix-ui/internal'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { radixPopoverStyle } from '../../lib/radix/styles'
import { Transition } from '../../lib/transition/Transition'
import { focusFieldFrom } from '../../../../shared/src/lib/field-focus'
import { useUiLocale } from '../../locale'
import { useFieldControl } from '../form-field/context'
import { useInputGroup } from '../input-group/context'
import {
  inputAdornment,
  inputControl,
  inputEmbedded,
  inputHost,
  type InputVariants,
} from '../input/input.variants'
import { selectEmpty, selectItem, selectListBody } from '../select/select.variants'
import { Popover } from '../popover/Popover'
import { ScrollArea } from '../scroll-area/ScrollArea'
import { Spinner } from '../spinner/Spinner'
import { autocompleteContent, autocompleteList } from './autocomplete.variants'
import { useAutocomplete } from './hooks/useAutocomplete'
import { useBoundValue } from '../../primitives/utils/bound-value'
import type {
  AutocompleteOption,
  AutocompleteSelection,
  CompletionContext,
  CompletionEdit,
} from './types'

export interface AutocompleteHandle {
  readonly input: HTMLInputElement | undefined
  focus: () => void
  blur: () => void
}

export interface AutocompleteProps<T extends AutocompleteOption = AutocompleteOption> extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | 'value'
  | 'defaultValue'
  | 'size'
  | 'disabled'
  | 'readOnly'
  | 'onChange'
  | 'onSelect'
  | 'onSubmit'
  | 'placeholder'
> {
  options: readonly T[]
  getCompletion?: (option: T, context: CompletionContext) => CompletionEdit
  loading?: boolean
  selectOnTab?: boolean
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  invalid?: boolean
  size?: InputVariants['size']
  variant?: InputVariants['variant']
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onQuery?: (context: CompletionContext) => void
  onSelect?: (selection: AutocompleteSelection<T>) => void
  onSubmit?: (text: string) => void
  onClear?: () => void
  leading?: ReactNode
  trailing?: ReactNode
  renderOption?: (props: { option: T; active: boolean }) => ReactNode
  empty?: ReactNode
  loadingContent?: ReactNode
  ref?: Ref<AutocompleteHandle>
  [attribute: `data-${string}`]: string | undefined
}

export function Autocomplete<T extends AutocompleteOption = AutocompleteOption>({
  options,
  getCompletion,
  loading,
  selectOnTab,
  placeholder,
  disabled: disabledProp,
  readonly,
  invalid: invalidProp,
  size: sizeProp,
  variant,
  value,
  defaultValue = '',
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onQuery,
  onSelect,
  onSubmit,
  onClear,
  leading,
  trailing,
  renderOption,
  empty,
  loadingContent,
  className,
  ref,
  ...attrs
}: AutocompleteProps<T>) {
  const t = useUiLocale()
  const group = useInputGroup()
  const [model = '', setModel] = useControllableState<string>({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange,
    caller: 'Autocomplete',
  })
  const [open = false, setOpen] = useControllableState<boolean>({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
    caller: 'Autocomplete',
  })
  const size = group ? group.size : sizeProp
  const { id, labelledBy, describedBy, invalid, disabled } = useFieldControl(
    {
      invalid: invalidProp || !!group?.invalid,
      disabled: disabledProp || !!group?.disabled,
    },
    attrs,
  )
  const {
    input,
    host,
    setHost,
    scroll,
    listId,
    optionId,
    active,
    activeId,
    visible,
    setVisible,
    show,
    onInput,
    onBlur,
    onCompositionStart,
    onCompositionEnd,
    onKeydown,
    select,
    highlight,
  } = useAutocomplete<T>({
    options,
    model,
    setModel,
    open,
    setOpen,
    disabled,
    readonly,
    selectOnTab,
    getCompletion,
    onQuery: context => onQuery?.(context),
    onSelect: selection => onSelect?.(selection),
    onSubmit: text => onSubmit?.(text),
    onClear: () => onClear?.(),
  })
  const bound = useBoundValue(input, model)

  useImperativeHandle(ref, () => ({
    get input() {
      return input.current ?? undefined
    },
    focus: () => input.current?.focus(),
    blur: () => input.current?.blur(),
  }))

  const hasLeading = hasContent(leading)
  const hasTrailing = hasContent(trailing)
  const label = (attrs as Record<string, unknown>)['aria-label'] as string | undefined

  return (
    <>
      <div
        ref={setHost}
        data-hn-autocomplete=""
        data-invalid={invalid ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        className={cn(group ? inputEmbedded() : inputHost({ size, variant }), className)}
        onClick={(event: MouseEvent<HTMLDivElement>) =>
          focusFieldFrom(event.currentTarget, event.target as HTMLElement)
        }
      >
        {hasLeading && <span className={inputAdornment()}>{leading}</span>}
        <input
          ref={input}
          {...attrs}
          {...bound}
          id={id}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-expanded={visible}
          aria-controls={visible ? listId : undefined}
          aria-activedescendant={activeId}
          aria-busy={loading || undefined}
          aria-invalid={invalid || undefined}
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          disabled={disabled}
          readOnly={readonly}
          placeholder={placeholder}
          className={inputControl({ leading: hasLeading, trailing: hasTrailing || loading })}
          onInput={onInput}
          onFocus={show}
          onClick={show}
          onBlur={onBlur}
          onKeyDown={onKeydown}
          onCompositionStart={onCompositionStart}
          onCompositionEnd={onCompositionEnd}
        />
        <Transition
          show={!!loading}
          enterActiveClass="hn-transition-base"
          enterFromClass="scale-90 opacity-0"
          leaveActiveClass="hn-transition"
          leaveToClass="scale-90 opacity-0"
        >
          <span className={inputAdornment()}>
            <Spinner size="sm" />
          </span>
        </Transition>
        {hasTrailing && <span className={inputAdornment()}>{trailing}</span>}
      </div>
      <Popover
        open={visible}
        onOpenChange={setVisible}
        anchor={host}
        modal={false}
        padded={false}
        align="start"
        role="presentation"
        aria-hidden={!visible || undefined}
        className={autocompleteContent()}
        style={radixPopoverStyle}
        onOpenAutoFocus={event => event.preventDefault()}
        onCloseAutoFocus={event => event.preventDefault()}
        onEscapeKeyDown={event => event.preventDefault()}
        content={
          <ScrollArea ref={scroll} className={autocompleteList()}>
            <div
              id={listId}
              role="listbox"
              aria-label={label ?? t.select.optionCountLabel(options.length)}
              aria-labelledby={labelledBy}
              aria-busy={loading || undefined}
              className={selectListBody()}
            >
              {options.map((option, index) => {
                const custom = renderOption?.({ option, active: active === option.value })
                return (
                  <div
                    key={option.value}
                    id={optionId(index)}
                    role="option"
                    aria-selected={active === option.value}
                    aria-disabled={option.disabled || undefined}
                    data-disabled={option.disabled ? '' : undefined}
                    data-highlighted={active === option.value ? '' : undefined}
                    className={selectItem()}
                    onPointerDown={event => event.preventDefault()}
                    onPointerMove={event => highlight(option, event)}
                    onClick={() => void select(option)}
                  >
                    {hasContent(custom) ? (
                      custom
                    ) : (
                      <span className="min-w-0 flex-1">
                        <span className="block truncate">{option.label}</span>
                        {option.description && (
                          <span className="text-muted block truncate text-xs">
                            {option.description}
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
            {(loading || !options.length) && (
              <div role="status" className={selectEmpty()}>
                {loading
                  ? hasContent(loadingContent)
                    ? loadingContent
                    : t.common.loading
                  : hasContent(empty)
                    ? empty
                    : t.select.empty}
              </div>
            )}
          </ScrollArea>
        }
      />
    </>
  )
}
