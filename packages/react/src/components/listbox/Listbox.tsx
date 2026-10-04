'use client'

import type { HTMLAttributes, ReactNode, Ref } from 'react'
import {
  ListboxContent,
  ListboxGroup,
  ListboxGroupLabel,
  ListboxItem,
  ListboxRoot,
} from '../../primitives/listbox'
import { cn } from '../../lib/cn'
import type { VirtualizeOptions } from '../../lib/virtual/types'
import { useUiLocale } from '../../locale'
import { useFieldControl } from '../form-field/context'
import { ScrollArea } from '../scroll-area/ScrollArea'
import { VirtualChoices } from '../virtual-list/VirtualChoices'
import { selectEmpty, selectItem, selectLabel } from '../select/select.variants'
import { isOptionGroup, type SelectItems, type SelectOption } from '../select/types'
import { ListboxOptionContent, type ListboxSlotProps } from './ListboxOptionContent'
import { listbox, listboxContent, type ListboxVariants } from './listbox.variants'

export type ListboxValue = string | number | null | Array<string | number> | undefined

export type { ListboxSlotProps } from './ListboxOptionContent'

export interface ListboxProps<T extends SelectOption = SelectOption> extends Omit<
  HTMLAttributes<HTMLElement>,
  'defaultValue' | 'onChange'
> {
  options: SelectItems<T>
  virtualize?: VirtualizeOptions
  multiple?: boolean
  maxHeight?: string
  padded?: boolean
  variant?: ListboxVariants['variant']
  disabled?: boolean
  value?: ListboxValue
  defaultValue?: ListboxValue
  onValueChange?: (value: ListboxValue) => void
  renderOption?: (props: ListboxSlotProps<T>) => ReactNode
  renderTrailing?: (props: ListboxSlotProps<T>) => ReactNode
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function Listbox<T extends SelectOption = SelectOption>({
  options,
  virtualize,
  multiple,
  maxHeight = '20rem',
  padded = true,
  variant,
  disabled: disabledProp,
  value,
  defaultValue,
  onValueChange,
  renderOption,
  renderTrailing,
  className,
  ...attrs
}: ListboxProps<T>) {
  const t = useUiLocale()
  const { labelledBy, invalid, disabled, describedBy } = useFieldControl(
    { disabled: disabledProp },
    attrs,
  )

  function item(option: T, extra?: Record<string, unknown>) {
    return (
      <ListboxItem
        key={option.value}
        {...extra}
        value={option.value}
        disabled={option.disabled}
        className={selectItem()}
      >
        <ListboxOptionContent
          option={option}
          renderOption={renderOption}
          renderTrailing={renderTrailing}
        />
      </ListboxItem>
    )
  }

  return (
    <ListboxRoot
      value={value}
      defaultValue={defaultValue}
      onValueChange={next => onValueChange?.(next as ListboxValue)}
      multiple={multiple}
      disabled={disabled}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      data-hn-listbox=""
      data-disabled={disabled ? '' : undefined}
      data-invalid={invalid ? '' : undefined}
      className={cn(listbox({ variant }), className)}
    >
      {virtualize ? (
        <ListboxContent asChild {...attrs}>
          <VirtualChoices<T>
            options={options}
            virtualize={virtualize}
            kind="listbox"
            padded={padded}
            maxHeight={maxHeight}
          >
            {({ option, attrs: itemAttrs }) => item(option, { ...itemAttrs })}
          </VirtualChoices>
        </ListboxContent>
      ) : (
        <ScrollArea style={{ maxHeight }}>
          <ListboxContent {...attrs} className={listboxContent({ padded })}>
            {options.map(entry =>
              isOptionGroup(entry) ? (
                <ListboxGroup key={entry.label}>
                  <ListboxGroupLabel className={selectLabel()}>{entry.label}</ListboxGroupLabel>
                  {entry.options.map(option => item(option))}
                </ListboxGroup>
              ) : (
                item(entry)
              ),
            )}
            {options.length === 0 && <div className={selectEmpty()}>{t.select.empty}</div>}
          </ListboxContent>
        </ScrollArea>
      )}
    </ListboxRoot>
  )
}
