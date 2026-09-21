import { computed } from 'vue'
import type { CommandItems } from '../types'
import { filterCommands } from '../utils/match'
import type { CommandMatch } from '../utils/match'
import type { SelectItems, SelectOption } from '../../select/types'

type CommandOption = SelectOption & { match: CommandMatch }

export function useCommandItems(
  props: { items: CommandItems; ignoreFilter?: boolean },
  search: () => string,
) {
  const sections = computed(() => filterCommands(props.items, props.ignoreFilter ? '' : search()))
  const options = computed<SelectItems<CommandOption>>(() =>
    sections.value.flatMap<CommandOption | { label: string; options: CommandOption[] }>(section => {
      const options = section.matches.map(match => ({
        value: match.item.id,
        label: match.item.label,
        disabled: match.item.disabled,
        description: match.item.description,
        match,
      }))
      return section.label ? [{ label: section.label, options }] : options
    }),
  )
  return { sections, options }
}
