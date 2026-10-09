import type { StyleValue } from 'vue'
import type { ButtonVariants } from '../button/button.variants'
import type { PrimitiveProps } from '../../primitives/primitive'
import type { FloatButtonOffset } from '../../../../shared/src/lib/float-button'

export interface FloatButtonProps {
  label: string
  visible?: boolean
  as?: PrimitiveProps['as']
  type?: 'button' | 'submit' | 'reset'
  position?: 'fixed' | 'absolute' | 'static'
  placement?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'
  offset?: FloatButtonOffset
  size?: 'sm' | 'md' | 'lg'
  shape?: 'circle' | 'square'
  extended?: boolean
  variant?: 'solid' | 'soft' | 'outline'
  tone?: ButtonVariants['tone']
  tooltip?: boolean
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left'
  loading?: boolean
  disabled?: boolean
  ripple?: boolean
  class?: string
  style?: StyleValue
}
