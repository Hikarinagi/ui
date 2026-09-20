import type { StyleValue } from 'vue'
import type { PrimitiveProps } from 'reka-ui'
import type { ButtonVariants } from '../button/button.variants'

export interface SplitButtonProps {
  as?: PrimitiveProps['as']
  type?: 'button' | 'submit' | 'reset'
  variant?: Exclude<ButtonVariants['variant'], 'link'>
  tone?: ButtonVariants['tone']
  size?: ButtonVariants['size']
  block?: boolean
  pill?: boolean
  ripple?: boolean
  loading?: boolean
  disabled?: boolean
  primaryDisabled?: boolean
  menuDisabled?: boolean
  label?: string
  menuLabel?: string
  modal?: boolean
  dir?: 'ltr' | 'rtl'
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  class?: string
  style?: StyleValue
  menuClass?: string
}
