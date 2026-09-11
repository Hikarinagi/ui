export type SelectOption<T extends object = object> = {
  value: string | number
  label: string
  description?: string
  disabled?: boolean
} & T

export interface SelectOptionGroup<T extends SelectOption = SelectOption> {
  label: string
  options: T[]
}

export type SelectItems<T extends SelectOption = SelectOption> = Array<T | SelectOptionGroup<T>>

export function isOptionGroup<T extends SelectOption>(
  item: T | SelectOptionGroup<T>,
): item is SelectOptionGroup<T> {
  return !('value' in item) && 'options' in item
}

export function flattenOptions<T extends SelectOption>(items: SelectItems<T>): T[] {
  return items.flatMap(item => (isOptionGroup(item) ? item.options : [item]))
}
