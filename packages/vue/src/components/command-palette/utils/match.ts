import type { CommandItem } from '../types'
import type * as Shared from '../../../../../shared/src/lib/command-palette/match'

export {
  commandMatchRange,
  filterCommands,
} from '../../../../../shared/src/lib/command-palette/match'
export type CommandMatch<T = unknown> = Shared.CommandMatch<CommandItem<T>>
export type CommandSection<T = unknown> = Shared.CommandSection<CommandItem<T>>
