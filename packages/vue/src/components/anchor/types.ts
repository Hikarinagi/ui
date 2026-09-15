export interface AnchorItem {
  id: string
  label: string
  children?: AnchorItem[]
}

export type AnchorSlotItem<T extends AnchorItem> =
  T | (T extends { children?: AnchorItem[] } ? NonNullable<T['children']>[number] : never)
