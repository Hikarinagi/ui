import type { PrimitiveProps } from 'reka-ui'
import type { ButtonVariants } from '../button/button.variants'

export type ToolbarOrientation = 'horizontal' | 'vertical'
export type ToolbarSize = 'sm' | 'md' | 'lg'
export type ToolbarVariant = 'primary' | 'secondary' | 'bare'

export interface ToolbarProps {
  label?: string
  orientation?: ToolbarOrientation
  dir?: 'ltr' | 'rtl'
  loop?: boolean
  disabled?: boolean
  size?: ToolbarSize
  variant?: ToolbarVariant
  class?: string
}

export interface ToolbarControlProps extends PrimitiveProps {
  label?: string
  tooltip?: boolean
  side?: 'top' | 'right' | 'bottom' | 'left'
  variant?: ButtonVariants['variant']
  tone?: ButtonVariants['tone']
  size?: ToolbarSize
  disabled?: boolean
  loading?: boolean
  ripple?: boolean
  class?: string
}
