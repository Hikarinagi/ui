'use client'

import {
  Fragment,
  useMemo,
  useState,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react'
import { Search } from 'lucide-react'
import {
  ListboxContent,
  ListboxGroup,
  ListboxGroupLabel,
  ListboxRoot,
} from '../../primitives/listbox'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { lucide } from '../../lib/icon'
import { useUiLocale } from '../../locale'
import { Card } from '../card/Card'
import { ScrollArea } from '../scroll-area/ScrollArea'
import { VirtualChoices } from '../virtual-list/VirtualChoices'
import type { VirtualizeOptions } from '../../lib/virtual/types'
import { selectLabel, selectListBody } from '../select/select.variants'
import { CommandPaletteInput } from './CommandPaletteInput'
import { CommandPaletteItem } from './CommandPaletteItem'
import {
  commandCard,
  commandEmpty,
  commandGrid,
  commandGridRows,
  commandHeading,
  commandInputRow,
  commandList,
  commandStatus,
} from './command-palette.variants'
import { CommandPaletteContext, type CommandPaletteContextValue } from './context'
import type {
  CommandEmptyRenderProps,
  CommandGroup,
  CommandHeadingRenderProps,
  CommandItem,
  CommandItemRenderProps,
  CommandItems,
} from './types'
import { commandMatchRange, layoutCommandSections, type CommandMatch } from './utils/match'
import {
  useCommandItems,
  type CommandOption,
  type CommandOptionGroup,
} from './hooks/useCommandItems'
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
  loading?: boolean
  autoFocus?: boolean
  inline?: boolean
  search?: string
  defaultSearch?: string
  onSearchChange?: (search: string) => void
  onSelect?: (item: CommandItem<T>) => void
  renderItem?: (props: CommandItemRenderProps<T>) => ReactNode
  renderHeading?: (props: CommandHeadingRenderProps<T>) => ReactNode
  renderEmpty?: (props: CommandEmptyRenderProps) => ReactNode
  loadingContent?: ReactNode
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
  loading,
  autoFocus,
  inline,
  search: searchProp,
  defaultSearch = '',
  onSearchChange,
  onSelect,
  renderItem,
  renderHeading,
  renderEmpty,
  loadingContent,
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
  const loadingRow = hasContent(loadingContent) ? loadingContent : t.common.loading
  const status = loading ? loadingRow : renderEmpty ? renderEmpty({ search }) : t.command.empty

  function select(item: CommandItem<T>) {
    const panel = input?.closest('[data-hn-command-palette]')
    const inside = !!panel?.contains(document.activeElement)
    onSelect?.(item)
    if (!input || !panel || !inside) return
    queueMicrotask(() => {
      const active = document.activeElement
      if (!input.isConnected) return
      if (!active || active === document.body || panel.contains(active))
        input.focus({ preventScroll: true })
    })
  }

  const custom = (match: CommandMatch<T>) =>
    renderItem && (() => renderItem({ item: match.item, match: commandMatchRange(match) }))

  function keepInputFocus(event: MouseEvent) {
    event.preventDefault()
  }

  function returnFocus() {
    queueMicrotask(() => {
      const active = document.activeElement
      if (input?.isConnected && (!active || active === document.body || active.contains(input)))
        input.focus({ preventScroll: true })
    })
  }

  const heading = (group: CommandGroup<T>, row?: number) => (
    <div
      data-hn-command-heading=""
      className={commandHeading()}
      style={row ? { gridRow: row, gridColumn: 1 } : undefined}
      onMouseDown={keepInputFocus}
      onClick={returnFocus}
    >
      {renderHeading!({ group })}
    </div>
  )

  const layout = renderHeading ? layoutCommandSections(sections) : undefined

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
          <ListboxContent asChild aria-label={label} aria-busy={loading || undefined}>
            <VirtualChoices<CommandOption<T>>
              options={options}
              virtualize={virtualize}
              input={input}
              kind="listbox"
              className={commandList()}
              empty={status}
              renderGroup={
                renderHeading && (({ group }) => heading((group as CommandOptionGroup<T>).group))
              }
            >
              {({ option, attrs: itemAttrs }) => (
                <CommandPaletteItem
                  {...itemAttrs}
                  match={option.match}
                  render={custom(option.match)}
                  onSelect={() => select(option.match.item)}
                />
              )}
            </VirtualChoices>
          </ListboxContent>
        ) : (
          <ScrollArea className={commandList()}>
            {layout ? (
              <div className={commandGrid()}>
                <ListboxContent
                  aria-label={label}
                  aria-busy={loading || undefined}
                  className={commandGridRows()}
                  style={{ gridRow: `1 / span ${layout.rows}` }}
                >
                  {layout.sections.map(({ section, row, span }) =>
                    section.group ? (
                      <ListboxGroup
                        key={section.key}
                        aria-label={section.group.label}
                        aria-labelledby={undefined}
                        className={commandGridRows()}
                        style={{ gridRow: `${row} / span ${span}` }}
                      >
                        {section.matches.map((match, index) => (
                          <CommandPaletteItem
                            key={match.item.id}
                            match={match}
                            render={custom(match)}
                            style={{ gridRow: index + 2 }}
                            onSelect={() => select(match.item)}
                          />
                        ))}
                      </ListboxGroup>
                    ) : (
                      section.matches.map((match, index) => (
                        <CommandPaletteItem
                          key={match.item.id}
                          match={match}
                          render={custom(match)}
                          style={{ gridRow: row + index }}
                          onSelect={() => select(match.item)}
                        />
                      ))
                    ),
                  )}
                </ListboxContent>
                {layout.sections.map(
                  ({ section, row }) =>
                    section.group && (
                      <Fragment key={section.key}>
                        {heading(section.group as CommandGroup<T>, row)}
                      </Fragment>
                    ),
                )}
              </div>
            ) : (
              <ListboxContent
                aria-label={label}
                aria-busy={loading || undefined}
                className={selectListBody()}
              >
                {sections.map(section =>
                  section.label ? (
                    <ListboxGroup key={section.key}>
                      <ListboxGroupLabel className={selectLabel()}>
                        {section.label}
                      </ListboxGroupLabel>
                      {section.matches.map(match => (
                        <CommandPaletteItem
                          key={match.item.id}
                          match={match}
                          render={custom(match)}
                          onSelect={() => select(match.item)}
                        />
                      ))}
                    </ListboxGroup>
                  ) : (
                    section.matches.map(match => (
                      <CommandPaletteItem
                        key={match.item.id}
                        match={match}
                        render={custom(match)}
                        onSelect={() => select(match.item)}
                      />
                    ))
                  ),
                )}
              </ListboxContent>
            )}
            {sections.length === 0 && (
              <div role="status" className={commandEmpty()}>
                {status}
              </div>
            )}
          </ScrollArea>
        )}
        {loading && sections.length > 0 && (
          <div role="status" className={commandStatus()}>
            {loadingRow}
          </div>
        )}
      </ListboxRoot>
    </Card>
  )
}
