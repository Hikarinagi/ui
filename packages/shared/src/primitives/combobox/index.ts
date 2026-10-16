export interface ComboboxFilterState<Id = string> {
  count: number
  items: Map<Id, number>
  groups: Set<Id>
}

export function filterComboboxItems<Id>(
  items: Map<Id, string>,
  groups: Map<Id, Set<Id>>,
  search: string,
  contains: (string: string, substring: string) => boolean,
): ComboboxFilterState<Id> {
  let count = 0
  const filteredItems = new Map<Id, number>()
  const filteredGroups = new Set<Id>()
  for (const [id, text] of items) {
    const score = contains(text, search)
    filteredItems.set(id, score ? 1 : 0)
    if (score) count++
  }
  for (const [groupId, group] of groups)
    for (const itemId of group)
      if (filteredItems.get(itemId)! > 0) {
        filteredGroups.add(groupId)
        break
      }
  return { count, items: filteredItems, groups: filteredGroups }
}

export function comboboxSearchText(
  value: unknown,
  multiple: boolean,
  displayValue?: (value: unknown) => string,
) {
  if (displayValue) return displayValue(value)
  if (!multiple && value && !Array.isArray(value))
    return typeof value !== 'object' ? String(value) : ''
  return ''
}

export function isTargetWithinCombobox(
  parent: HTMLElement | null | undefined,
  target: EventTarget | null,
) {
  if (parent?.contains(target as Node)) return true
  const label = target instanceof Element ? target.closest('label') : null
  const control = label?.control
  return !!control && !!parent?.contains(control)
}
