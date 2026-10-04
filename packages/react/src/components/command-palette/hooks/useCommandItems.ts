'use client'

import { useMemo } from 'react'
import type { CommandItems } from '../types'
import { filterCommands, type CommandMatch } from '../utils/match'
import type { SelectItems, SelectOption } from '../../select/types'

export type CommandOption = SelectOption & { match: CommandMatch }

export function useCommandItems(
  items: CommandItems,
  ignoreFilter: boolean | undefined,
  search: string,
) {
  const sections = useMemo(
    () => filterCommands(items, ignoreFilter ? '' : search),
    [items, ignoreFilter, search],
  )
  const options = useMemo<SelectItems<CommandOption>>(
    () =>
      sections.flatMap<CommandOption | { label: string; options: CommandOption[] }>(section => {
        const options = section.matches.map(match => ({
          value: match.item.id,
          label: match.item.label,
          disabled: match.item.disabled,
          description: match.item.description,
          match,
        }))
        return section.label ? [{ label: section.label, options }] : options
      }),
    [sections],
  )
  return { sections, options }
}
