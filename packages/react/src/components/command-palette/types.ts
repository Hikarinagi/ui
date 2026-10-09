import type { ComponentType } from 'react'
import type { CommandMatchRange } from '../../../../shared/src/lib/command-palette/match'

export interface CommandIconProps {
  'aria-hidden'?: boolean | 'true' | 'false'
  className?: string
}

export interface CommandItem<T = unknown> {
  id: string
  label: string
  description?: string
  keywords?: string[]
  icon?: ComponentType<CommandIconProps>
  kbd?: string[]
  disabled?: boolean
  closeOnSelect?: boolean
  data?: T
  onSelect?: () => void
}

export interface CommandGroup<T = unknown> {
  label: string
  items: CommandItem<T>[]
}

export type CommandItems<T = unknown> = Array<CommandItem<T> | CommandGroup<T>>

export type CommandItemMatch = CommandMatchRange

export interface CommandItemRenderProps<T = unknown> {
  item: CommandItem<T>
  match: CommandItemMatch | null
}

export interface CommandEmptyRenderProps {
  search: string
}

export function isCommandGroup<T>(
  entry: CommandItem<T> | CommandGroup<T>,
): entry is CommandGroup<T> {
  return 'items' in entry
}
