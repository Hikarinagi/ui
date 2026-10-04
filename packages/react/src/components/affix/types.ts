import type { ElementType, HTMLAttributes, ReactNode, Ref } from 'react'
import type { AnchorAttributes } from '../../lib/primitive'

export interface AffixProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'onChange'>, AnchorAttributes {
  as?: ElementType
  position?: 'top' | 'bottom'
  offset?: number
  disabled?: boolean
  onChange?: (affixed: boolean) => void
  children?: ReactNode | ((props: AffixSlotProps) => ReactNode)
  ref?: Ref<AffixExpose>
  [attribute: `data-${string}`]: string | undefined
}

export interface AffixSlotProps {
  affixed: boolean
}

export interface AffixExpose {
  element: HTMLElement | undefined
  affixed: boolean
  update: () => void
}
