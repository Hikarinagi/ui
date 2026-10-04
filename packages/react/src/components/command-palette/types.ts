import type { ComponentType } from 'react'

export interface CommandIconProps {
  'aria-hidden'?: boolean | 'true' | 'false'
  className?: string
}

export interface CommandItem {
  id: string
  label: string
  description?: string
  keywords?: string[]
  icon?: ComponentType<CommandIconProps>
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
