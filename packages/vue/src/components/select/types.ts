export interface SelectOption {
  value: string | number
  label: string
  description?: string
  disabled?: boolean
}

export interface SelectOptionGroup {
  label: string
  options: SelectOption[]
}

export type SelectItems = Array<SelectOption | SelectOptionGroup>

export function isOptionGroup(item: SelectOption | SelectOptionGroup): item is SelectOptionGroup {
  return 'options' in item
}

export function flattenOptions(items: SelectItems): SelectOption[] {
  return items.flatMap(item => (isOptionGroup(item) ? item.options : [item]))
}
