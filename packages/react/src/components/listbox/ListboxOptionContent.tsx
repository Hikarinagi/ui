'use client'

import type { ReactNode } from 'react'
import { Check } from 'lucide-react'
import { ListboxItemIndicator, useListboxItemContext } from '../../primitives/listbox'
import { hasContent } from '../../lib/content'
import { lucide } from '../../lib/icon'
import type { SelectOption } from '../select/types'

const CheckIcon = lucide(Check)

export interface ListboxSlotProps<T extends SelectOption = SelectOption> {
  option: T
  selected: boolean
}

export interface ListboxOptionContentProps<T extends SelectOption = SelectOption> {
  option: T
  renderOption?: (props: ListboxSlotProps<T>) => ReactNode
  renderTrailing?: (props: ListboxSlotProps<T>) => ReactNode
}

export function ListboxOptionContent<T extends SelectOption = SelectOption>({
  option,
  renderOption,
  renderTrailing,
}: ListboxOptionContentProps<T>) {
  const { isSelected: selected } = useListboxItemContext('ListboxOptionContent')
  const custom = renderOption?.({ option, selected })
  return (
    <>
      <span className="min-w-0 flex-1">
        {hasContent(custom) ? (
          custom
        ) : (
          <>
            <span className="block truncate">{option.label}</span>
            {option.description && (
              <span className="text-muted block truncate text-xs">{option.description}</span>
            )}
          </>
        )}
      </span>
      {renderTrailing ? (
        renderTrailing({ option, selected })
      ) : (
        <span className="flex size-4 shrink-0 items-center justify-center">
          <ListboxItemIndicator>
            <CheckIcon />
          </ListboxItemIndicator>
        </span>
      )}
    </>
  )
}
