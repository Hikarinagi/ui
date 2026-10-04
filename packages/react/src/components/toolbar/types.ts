import type { HTMLAttributes, ReactNode, Ref } from 'react'
import type { AnchorAttributes, PrimitiveProps } from '../../lib/primitive'
import type { ButtonVariants } from '../button/button.variants'

export type ToolbarOrientation = 'horizontal' | 'vertical'
export type ToolbarSize = 'sm' | 'md' | 'lg'
export type ToolbarVariant = 'primary' | 'secondary' | 'bare'

export interface ToolbarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'dir'> {
  label?: string
  orientation?: ToolbarOrientation
  dir?: 'ltr' | 'rtl'
  loop?: boolean
  disabled?: boolean
  size?: ToolbarSize
  variant?: ToolbarVariant
  className?: string
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export interface ToolbarControlProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, AnchorAttributes {
  label?: string
  tooltip?: boolean
  side?: 'top' | 'right' | 'bottom' | 'left'
  variant?: ButtonVariants['variant']
  tone?: ButtonVariants['tone']
  size?: ToolbarSize
  disabled?: boolean
  loading?: boolean
  ripple?: boolean
  className?: string
  icon?: ReactNode
  trailing?: ReactNode
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}
