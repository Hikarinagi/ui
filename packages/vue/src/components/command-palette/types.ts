import type { Component } from 'vue'

export interface CommandItem {
  id: string
  label: string
  description?: string
  keywords?: string[]
  icon?: Component
  kbd?: string[]
  disabled?: boolean
  onSelect?: () => void
}

export interface CommandGroup {
  label: string
  items: CommandItem[]
}

export type CommandItems = Array<CommandItem | CommandGroup>

export function isCommandGroup(entry: CommandItem | CommandGroup): entry is CommandGroup {
  return 'items' in entry
}
