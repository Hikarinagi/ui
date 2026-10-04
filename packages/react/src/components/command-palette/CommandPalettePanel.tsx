'use client'

import { useState, type HTMLAttributes, type ReactNode, type Ref } from 'react'
import { Search } from 'lucide-react'
import {
  ListboxContent,
  ListboxFilter,
  ListboxGroup,
  ListboxGroupLabel,
  ListboxRoot,
} from '../../primitives/listbox'
import { cn } from '../../lib/cn'
import { lucide } from '../../lib/icon'
import { useUiLocale } from '../../locale'
import { Card } from '../card/Card'
import { ScrollArea } from '../scroll-area/ScrollArea'
import { VirtualChoices } from '../virtual-list/VirtualChoices'
import type { VirtualizeOptions } from '../../lib/virtual/types'
import { selectLabel, selectListBody } from '../select/select.variants'
import { CommandPaletteItem } from './CommandPaletteItem'
import {
  commandCard,
  commandEmpty,
  commandInput,
  commandInputRow,
  commandList,
} from './command-palette.variants'
import type { CommandItem, CommandItems } from './types'
import { useCommandItems, type CommandOption } from './hooks/useCommandItems'
import { useControllableState } from '../../primitives/utils/controllable-state'

const SearchIcon = lucide(Search)

export interface CommandPalettePanelProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'onSelect' | 'children'
> {
  items: CommandItems
  virtualize?: VirtualizeOptions
  label: string
  placeholder?: string
  ignoreFilter?: boolean
  autoFocus?: boolean
  inline?: boolean
  search?: string
  defaultSearch?: string
  onSearchChange?: (search: string) => void
  onSelect?: (item: CommandItem) => void
  children?: ReactNode
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function CommandPalettePanel({
  items,
  virtualize,
  label,
  placeholder,
  ignoreFilter,
  autoFocus,
  inline,
  search: searchProp,
  defaultSearch = '',
  onSearchChange,
  onSelect,
  className,
  children,
  ...attrs
}: CommandPalettePanelProps) {
  const t = useUiLocale()
  const [search = '', setSearch] = useControllableState<string>({
    prop: searchProp,
    defaultProp: defaultSearch,
    onChange: onSearchChange,
    caller: 'CommandPalettePanel',
  })
  const [input, setInput] = useState<HTMLInputElement | null>(null)
  const { sections, options } = useCommandItems(items, ignoreFilter, search)

  return (
    <Card
      {...attrs}
      data-hn-command-palette=""
      padded={false}
      className={cn(commandCard({ inline }), className)}
    >
      {children}
      <ListboxRoot selectionBehavior="replace" highlightOnHover className="flex min-h-0 flex-col">
        <div className={commandInputRow()}>
          <SearchIcon aria-hidden="true" />
          <ListboxFilter
            ref={setInput}
            value={search}
            onValueChange={setSearch}
            autoFocus={autoFocus}
            placeholder={placeholder ?? t.command.placeholder}
            aria-label={label}
            className={commandInput()}
          />
        </div>
        {virtualize ? (
          <ListboxContent asChild aria-label={label}>
            <VirtualChoices<CommandOption>
              options={options}
              virtualize={virtualize}
              input={input}
              kind="listbox"
              className={commandList()}
              empty={t.command.empty}
            >
              {({ option, attrs: itemAttrs }) => (
                <CommandPaletteItem
                  {...itemAttrs}
                  match={option.match}
                  onSelect={() => onSelect?.(option.match.item)}
                />
              )}
            </VirtualChoices>
          </ListboxContent>
        ) : (
          <ScrollArea className={commandList()}>
            <ListboxContent aria-label={label} className={selectListBody()}>
              {sections.map(section =>
                section.label ? (
                  <ListboxGroup key={section.key}>
                    <ListboxGroupLabel className={selectLabel()}>{section.label}</ListboxGroupLabel>
                    {section.matches.map(match => (
                      <CommandPaletteItem
                        key={match.item.id}
                        match={match}
                        onSelect={() => onSelect?.(match.item)}
                      />
                    ))}
                  </ListboxGroup>
                ) : (
                  section.matches.map(match => (
                    <CommandPaletteItem
                      key={match.item.id}
                      match={match}
                      onSelect={() => onSelect?.(match.item)}
                    />
                  ))
                ),
              )}
              {sections.length === 0 && <div className={commandEmpty()}>{t.command.empty}</div>}
            </ListboxContent>
          </ScrollArea>
        )}
      </ListboxRoot>
    </Card>
  )
}
