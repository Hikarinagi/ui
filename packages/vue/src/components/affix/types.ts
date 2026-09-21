export interface AffixProps {
  as?: string
  position?: 'top' | 'bottom'
  offset?: number
  disabled?: boolean
  class?: string
}

export interface AffixSlotProps {
  affixed: boolean
}

export interface AffixExpose {
  element: HTMLElement | undefined
  affixed: boolean
  update: () => void
}
