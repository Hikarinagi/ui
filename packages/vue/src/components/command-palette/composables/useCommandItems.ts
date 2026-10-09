import { computed } from 'vue'
import type { CommandItems } from '../types'
import { filterCommands } from '../utils/match'
import type { CommandMatch } from '../utils/match'
import type { SelectItems, SelectOption } from '../../select/types'

type CommandOption<T> = SelectOption & { match: CommandMatch<T> }

export function useCommandItems<T>(
  props: { items: CommandItems<T>; ignoreFilter?: boolean },
  search: () => string,
) {
  const sections = computed(() => filterCommands(props.items, props.ignoreFilter ? '' : search()))
  const options = computed<SelectItems<CommandOption<T>>>(() =>
    sections.value.flatMap<CommandOption<T> | { label: string; options: CommandOption<T>[] }>(
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
  )
  return { sections, options }
}
