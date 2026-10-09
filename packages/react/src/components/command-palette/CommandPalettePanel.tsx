'use client'

import { useMemo, useState, type HTMLAttributes, type ReactNode, type Ref } from 'react'
import { Search } from 'lucide-react'
import {
  ListboxContent,
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
import { CommandPaletteInput } from './CommandPaletteInput'
import { CommandPaletteItem } from './CommandPaletteItem'
import { commandCard, commandEmpty, commandInputRow, commandList } from './command-palette.variants'
import { CommandPaletteContext, type CommandPaletteContextValue } from './context'
import type { CommandItem, CommandItemRenderProps, CommandItems } from './types'
import { commandMatchRange, type CommandMatch } from './utils/match'
import { useCommandItems, type CommandOption } from './hooks/useCommandItems'
import { useControllableState } from '../../primitives/utils/controllable-state'

const SearchIcon = lucide(Search)

export interface CommandPalettePanelProps<T = unknown> extends Omit<
  HTMLAttributes<HTMLElement>,
  'onSelect' | 'children'
> {
  items: CommandItems<T>
  virtualize?: VirtualizeOptions
  label: string
  placeholder?: string
  ignoreFilter?: boolean
  autoFocus?: boolean
  inline?: boolean
  search?: string
  defaultSearch?: string
  onSearchChange?: (search: string) => void
  onSelect?: (item: CommandItem<T>) => void
  renderItem?: (props: CommandItemRenderProps<T>) => ReactNode
  input?: ReactNode
  children?: ReactNode
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function CommandPalettePanel<T = unknown>({
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
  renderItem,
  input: inputRow,
  className,
  children,
  ...attrs
}: CommandPalettePanelProps<T>) {
  const t = useUiLocale()
  const [search = '', setSearch] = useControllableState<string>({
    prop: searchProp,
    defaultProp: defaultSearch,
    onChange: onSearchChange,
    caller: 'CommandPalettePanel',
  })
  const [input, setInput] = useState<HTMLInputElement | null>(null)
  const { sections, options } = useCommandItems(items, ignoreFilter, search)
  const resolvedPlaceholder = placeholder ?? t.command.placeholder
  const context = useMemo<CommandPaletteContextValue>(
    () => ({
      search,
      setSearch,
      label,
      placeholder: resolvedPlaceholder,
      autoFocus,
      setInput,
    }),
    [search, setSearch, label, resolvedPlaceholder, autoFocus],
  )
  const custom = (match: CommandMatch<T>) =>
    renderItem && (() => renderItem({ item: match.item, match: commandMatchRange(match) }))

  return (
    <Card
      {...attrs}
      data-hn-command-palette=""
      padded={false}
      className={cn(commandCard({ inline }), className)}
    >
      {children}
      <ListboxRoot selectionBehavior="replace" highlightOnHover className="flex min-h-0 flex-col">
        <CommandPaletteContext value={context}>
          {inputRow !== undefined ? (
            inputRow
          ) : (
            <div className={commandInputRow()}>
              <SearchIcon aria-hidden="true" />
              <CommandPaletteInput />
            </div>
          )}
        </CommandPaletteContext>
        {virtualize ? (
          <ListboxContent asChild aria-label={label}>
            <VirtualChoices<CommandOption<T>>
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
                  render={custom(option.match)}
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
                        render={custom(match)}
                        onSelect={() => onSelect?.(match.item)}
                      />
                    ))}
                  </ListboxGroup>
                ) : (
                  section.matches.map(match => (
                    <CommandPaletteItem
                      key={match.item.id}
                      match={match}
                      render={custom(match)}
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
