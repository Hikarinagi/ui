import type { Component } from 'vue'
import type { CommandMatchRange } from '../../../../shared/src/lib/command-palette/match'

export interface CommandItem<T = unknown> {
  id: string
  label: string
  description?: string
  keywords?: string[]
  icon?: Component
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

export interface CommandItemSlotProps<T = unknown> {
  item: CommandItem<T>
  match: CommandItemMatch | null
}

export interface CommandEmptySlotProps {
  search: string
}

export function isCommandGroup<T>(
  entry: CommandItem<T> | CommandGroup<T>,
): entry is CommandGroup<T> {
  return 'items' in entry
}
