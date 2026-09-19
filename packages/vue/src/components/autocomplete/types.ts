import type { CompletionContext, CompletionEdit } from '../../../../shared/src/lib/completion'

export type { CompletionContext, CompletionEdit } from '../../../../shared/src/lib/completion'

export interface AutocompleteOption {
  value: string | number
  label: string
  description?: string
  disabled?: boolean
}

export interface AutocompleteSelection<T extends AutocompleteOption = AutocompleteOption> {
  option: T
  context: CompletionContext
  edit: CompletionEdit
}
