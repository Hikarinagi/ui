export type TabsValue = string | number
export type TabsActivationMode = 'automatic' | 'manual'

export function makeTriggerId(baseId: string, value: TabsValue) {
  return `${baseId}-trigger-${value}`
}

export function makeContentId(baseId: string, value: TabsValue) {
  return `${baseId}-content-${value}`
}

export function tabsState(selected: boolean) {
  return selected ? 'active' : 'inactive'
}

export function activatesOnFocus(mode: TabsActivationMode, selected: boolean, disabled: boolean) {
  return !selected && !disabled && mode !== 'manual'
}
