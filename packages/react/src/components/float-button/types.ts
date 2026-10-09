import type { ButtonHTMLAttributes, CSSProperties, ElementType, ReactNode, Ref } from 'react'
import type { AnchorAttributes } from '../../lib/primitive'
import type { ButtonVariants } from '../button/button.variants'
import type { FloatButtonOffset } from '../../../../shared/src/lib/float-button'

export interface FloatButtonExpose {
  element: HTMLElement | undefined
  focus: () => void
}

export interface FloatButtonProps
  extends
    Omit<ButtonHTMLAttributes<HTMLElement>, 'type' | 'disabled' | 'style' | 'children'>,
    AnchorAttributes {
  label: string
  visible?: boolean
  as?: ElementType
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
  style?: CSSProperties
  children?: ReactNode
  ref?: Ref<FloatButtonExpose>
  [attribute: `data-${string}`]: string | undefined
}
