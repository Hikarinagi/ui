'use client'

import { useMemo } from 'react'
import type { CommandGroup, CommandItems } from '../types'
import { filterCommands, type CommandMatch } from '../utils/match'
import type { SelectItems, SelectOption } from '../../select/types'

export type CommandOption<T = unknown> = SelectOption & { match: CommandMatch<T> }

export interface CommandOptionGroup<T = unknown> {
  label: string
  options: CommandOption<T>[]
  group: CommandGroup<T>
}

export function useCommandItems<T>(
  items: CommandItems<T>,
  ignoreFilter: boolean | undefined,
  search: string,
) {
  const sections = useMemo(
    () => filterCommands(items, ignoreFilter ? '' : search),
    [items, ignoreFilter, search],
  )
  const options = useMemo<SelectItems<CommandOption<T>>>(
    () =>
      sections.flatMap<CommandOption<T> | CommandOptionGroup<T>>(section => {
        const options = section.matches.map(match => ({
          value: match.item.id,
          label: match.item.label,
          disabled: match.item.disabled,
          description: match.item.description,
          match,
        }))
        return section.group
          ? [{ label: section.group.label, options, group: section.group as CommandGroup<T> }]
          : options
      }),
    [sections],
  )
  return { sections, options }
}
