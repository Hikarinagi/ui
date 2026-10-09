'use client'

import { Children, useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react'
import {
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '../../primitives/dialog'
import { PrimitiveVisuallyHidden } from '../../primitives/visually-hidden'
import { hasContent } from '../../lib/content'
import type { VirtualizeOptions } from '../../lib/virtual/types'
import { useUiLocale } from '../../locale'
import { CommandPalettePanel } from './CommandPalettePanel'
import { useHotkey } from './hooks/useHotkey'
import { commandWrapper } from './command-palette.variants'
import type { CommandItem, CommandItems } from './types'
import { useControllableState } from '../../primitives/utils/controllable-state'

export interface CommandPaletteProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'onSelect' | 'children'
> {
  items: CommandItems
  virtualize?: VirtualizeOptions
  placeholder?: string
  label?: string
  hotkey?: string
  ignoreFilter?: boolean
  inline?: boolean
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  search?: string
  defaultSearch?: string
  onSearchChange?: (search: string) => void
  onSelect?: (item: CommandItem) => void
  children?: ReactNode
  [attribute: `data-${string}`]: string | undefined
}

export function CommandPalette({
  items,
  virtualize,
  placeholder,
  label: labelProp,
  hotkey,
  ignoreFilter,
  inline,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  search: searchProp,
  defaultSearch = '',
  onSearchChange,
  onSelect,
  className,
  children,
  ...attrs
}: CommandPaletteProps) {
  const t = useUiLocale()
  const [search = '', setSearch] = useControllableState<string>({
    prop: searchProp,
    defaultProp: defaultSearch,
    onChange: onSearchChange,
    caller: 'CommandPalette',
  })
  const [open = false, setOpenState] = useControllableState<boolean>({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
    caller: 'CommandPalette',
  })

  const label = labelProp ?? t.command.label

  function setOpen(value: boolean) {
    setOpenState(value)
  }

  const previousOpen = useRef(open)
  useEffect(() => {
    if (previousOpen.current === open) return
    previousOpen.current = open
    if (!open) setSearch('')
  }, [open])

  useHotkey(inline ? undefined : hotkey, () => setOpen(!open))

  function select(item: CommandItem) {
    item.onSelect?.()
    onSelect?.(item)
    if (!inline) setOpen(false)
  }

  if (inline)
    return (
      <CommandPalettePanel
        {...attrs}
        search={search}
        onSearchChange={setSearch}
        inline
        items={items}
        virtualize={virtualize}
        label={label}
        placeholder={placeholder}
        ignoreFilter={ignoreFilter}
        className={className}
        onSelect={select}
      />
    )

  return (
    <DialogRoot open={open} onOpenChange={setOpen}>
      {hasContent(children) && Children.toArray(children).length > 0 && (
        <DialogTrigger asChild>{children}</DialogTrigger>
      )}
      <DialogPortal>
        <DialogOverlay className="hn-scrim" />
        <div className={commandWrapper()}>
          <DialogContent asChild>
            <CommandPalettePanel
              {...attrs}
              search={search}
              onSearchChange={setSearch}
              autoFocus
              items={items}
              virtualize={virtualize}
              label={label}
              placeholder={placeholder}
              ignoreFilter={ignoreFilter}
              className={className}
              onSelect={select}
            >
              <PrimitiveVisuallyHidden>
                <DialogTitle>{label}</DialogTitle>
              </PrimitiveVisuallyHidden>
            </CommandPalettePanel>
          </DialogContent>
        </div>
      </DialogPortal>
    </DialogRoot>
  )
}
