'use client'

import { useCallback, useRef, useState, type ReactNode } from 'react'
import { Check } from 'lucide-react'
import {
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxPortal,
  useComboboxRootContext,
} from '../../primitives/combobox'
import { lucide } from '../../lib/icon'
import { hasContent } from '../../lib/content'
import { radixComboboxStyle } from '../../lib/radix/styles'
import type { VirtualizeOptions } from '../../lib/virtual/types'
import { useUiLocale } from '../../locale'
import { Card } from '../card/Card'
import { ScrollArea } from '../scroll-area/ScrollArea'
import { VirtualChoices, type VirtualChoiceAttrs } from '../virtual-list/VirtualChoices'
import { selectEmpty, selectItem, selectLabel, selectListBody } from '../select/select.variants'
import { isOptionGroup, type SelectItems, type SelectOption } from '../select/types'
import { comboboxContent, comboboxList } from './combobox.variants'

const CheckIcon = lucide(Check)

export interface ComboboxListProps<T extends SelectOption = SelectOption> {
  options: SelectItems<T>
  keyboard?: boolean
  virtualize?: VirtualizeOptions
  renderOption?: (props: { option: T }) => ReactNode
}

function ComboboxListItem<T extends SelectOption>({
  option,
  attrs,
  renderOption,
}: {
  option: T
  attrs?: VirtualChoiceAttrs
  renderOption?: (props: { option: T }) => ReactNode
}) {
  const custom = renderOption?.({ option })
  return (
    <ComboboxItem
      {...attrs}
      value={option.value}
      disabled={option.disabled}
      textValue={option.label}
      className={selectItem()}
    >
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
      <span className="flex size-4 shrink-0 items-center justify-center">
        <ComboboxItemIndicator>
          <CheckIcon />
        </ComboboxItemIndicator>
      </span>
    </ComboboxItem>
  )
}

export function ComboboxList<T extends SelectOption = SelectOption>({
  options,
  keyboard,
  virtualize,
  renderOption,
}: ComboboxListProps<T>) {
  const t = useUiLocale()
  const root = useComboboxRootContext('ComboboxList')
  const [fresh, setFresh] = useState(false)
  const panel = useRef<HTMLElement | null>(null)
  const onPanel = useCallback((node: HTMLElement | null) => {
    if (node && node !== panel.current) setFresh(true)
    panel.current = node
  }, [])

  return (
    <ComboboxPortal>
      <ComboboxContent asChild position="popper" align="start" sideOffset={8}>
        <Card
          ref={onPanel}
          padded={false}
          data-hn-combobox-content=""
          data-hn-fresh={fresh && !keyboard ? '' : undefined}
          className={comboboxContent()}
          style={radixComboboxStyle}
          onKeyDown={() => setFresh(false)}
          onPointerMove={() => setFresh(false)}
        >
          {virtualize ? (
            <VirtualChoices<T>
              options={options}
              virtualize={virtualize}
              kind="combobox"
              combobox={{
                ignoreFilter: root.ignoreFilter,
                filterSearch: root.filterSearch,
                inputElement: root.getInputElement(),
                isVirtual: root.isVirtual,
              }}
              className={comboboxList()}
            >
              {({ option, attrs }) => (
                <ComboboxListItem option={option} attrs={attrs} renderOption={renderOption} />
              )}
            </VirtualChoices>
          ) : (
            <ScrollArea className={comboboxList()}>
              <div className={selectListBody()}>
                {options.map(item =>
                  isOptionGroup(item) ? (
                    <ComboboxGroup key={item.label}>
                      <ComboboxLabel className={selectLabel()}>{item.label}</ComboboxLabel>
                      {item.options.map(option => (
                        <ComboboxListItem
                          key={option.value}
                          option={option}
                          renderOption={renderOption}
                        />
                      ))}
                    </ComboboxGroup>
                  ) : (
                    <ComboboxListItem key={item.value} option={item} renderOption={renderOption} />
                  ),
                )}
                <ComboboxEmpty className={selectEmpty()}>{t.select.empty}</ComboboxEmpty>
              </div>
            </ScrollArea>
          )}
        </Card>
      </ComboboxContent>
    </ComboboxPortal>
  )
}
