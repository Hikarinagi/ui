'use client'

import { useCallback, useRef, useState, type ReactNode } from 'react'
import { Check } from 'lucide-react'
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPortal,
} from '../../primitives/select'
import { lucide } from '../../lib/icon'
import { hasContent } from '../../lib/content'
import { radixSelectStyle } from '../../lib/radix/styles'
import type { VirtualizeOptions } from '../../lib/virtual/types'
import { useUiLocale } from '../../locale'
import { Card } from '../card/Card'
import { ScrollArea } from '../scroll-area/ScrollArea'
import { VirtualChoices, type VirtualChoiceAttrs } from '../virtual-list/VirtualChoices'
import {
  selectContent,
  selectEmpty,
  selectItem,
  selectLabel,
  selectList,
  selectListBody,
} from './select.variants'
import { isOptionGroup, type SelectItems, type SelectOption } from './types'

const CheckIcon = lucide(Check)

export interface SelectListProps<T extends SelectOption = SelectOption> {
  options: SelectItems<T>
  keyboard?: boolean
  virtualize?: VirtualizeOptions
  renderOption?: (props: { option: T }) => ReactNode
}

function SelectListItem<T extends SelectOption>({
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
    <SelectItem
      {...attrs}
      value={option.value}
      disabled={option.disabled}
      textValue={option.label}
      className={selectItem()}
    >
      <SelectItemText asChild>
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
      </SelectItemText>
      <span className="flex size-4 shrink-0 items-center justify-center">
        <SelectItemIndicator>
          <CheckIcon />
        </SelectItemIndicator>
      </span>
    </SelectItem>
  )
}

export function SelectList<T extends SelectOption = SelectOption>({
  options,
  keyboard,
  virtualize,
  renderOption,
}: SelectListProps<T>) {
  const t = useUiLocale()
  const [fresh, setFresh] = useState(false)
  const keyboardRef = useRef(keyboard)
  keyboardRef.current = keyboard
  const onPanel = useCallback((node: HTMLElement | null) => {
    if (node) setFresh(!keyboardRef.current)
  }, [])

  return (
    <SelectPortal>
      <SelectContent asChild position="popper" align="start" sideOffset={8}>
        <Card
          ref={onPanel}
          padded={false}
          data-hn-select-content=""
          data-hn-fresh={fresh ? '' : undefined}
          className={selectContent()}
          style={radixSelectStyle}
          onKeyDown={() => setFresh(false)}
          onPointerMove={() => setFresh(false)}
        >
          {virtualize ? (
            <VirtualChoices<T>
              options={options}
              virtualize={virtualize}
              kind="select"
              className={selectList()}
            >
              {({ option, attrs }) => (
                <SelectListItem option={option} attrs={attrs} renderOption={renderOption} />
              )}
            </VirtualChoices>
          ) : (
            <ScrollArea className={selectList()}>
              <div className={selectListBody()}>
                {options.map(item =>
                  isOptionGroup(item) ? (
                    <SelectGroup key={item.label}>
                      <SelectLabel className={selectLabel()}>{item.label}</SelectLabel>
                      {item.options.map(option => (
                        <SelectListItem
                          key={option.value}
                          option={option}
                          renderOption={renderOption}
                        />
                      ))}
                    </SelectGroup>
                  ) : (
                    <SelectListItem key={item.value} option={item} renderOption={renderOption} />
                  ),
                )}
                {options.length === 0 && <div className={selectEmpty()}>{t.select.empty}</div>}
              </div>
            </ScrollArea>
          )}
        </Card>
      </SelectContent>
    </SelectPortal>
  )
}
