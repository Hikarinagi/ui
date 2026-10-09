import { computed } from 'vue'
import type { CommandGroup, CommandItems } from '../types'
import { filterCommands } from '../utils/match'
import type { CommandMatch } from '../utils/match'
import type { SelectItems, SelectOption } from '../../select/types'

type CommandOption<T> = SelectOption & { match: CommandMatch<T> }

export interface CommandOptionGroup<T> {
  label: string
  options: CommandOption<T>[]
  group: CommandGroup<T>
}

export function useCommandItems<T>(
  props: { items: CommandItems<T>; ignoreFilter?: boolean },
  search: () => string,
) {
  const sections = computed(() => filterCommands(props.items, props.ignoreFilter ? '' : search()))
  const options = computed<SelectItems<CommandOption<T>>>(() =>
    sections.value.flatMap<CommandOption<T> | CommandOptionGroup<T>>(section => {
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
  )
  return { sections, options }
}
