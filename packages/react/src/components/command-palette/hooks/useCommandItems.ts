'use client'

import { useMemo } from 'react'
import type { CommandItems } from '../types'
import { filterCommands, type CommandMatch } from '../utils/match'
import type { SelectItems, SelectOption } from '../../select/types'

export type CommandOption<T = unknown> = SelectOption & { match: CommandMatch<T> }

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
      sections.flatMap<CommandOption<T> | { label: string; options: CommandOption<T>[] }>(
        section => {
          const options = section.matches.map(match => ({
            value: match.item.id,
            label: match.item.label,
            disabled: match.item.disabled,
            description: match.item.description,
            match,
          }))
          return section.label ? [{ label: section.label, options }] : options
        },
      ),
    [sections],
  )
  return { sections, options }
}
