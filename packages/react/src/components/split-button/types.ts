import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  ElementType,
  MouseEvent,
  ReactNode,
  Ref,
} from 'react'
import type { ButtonVariants } from '../button/button.variants'

export interface SplitButtonHandle {
  focus: () => void
  openMenu: () => Promise<void>
  closeMenu: () => void
}

export interface SplitButtonContentProps {
  close: () => void
}

export interface SplitButtonProps
  extends
    Omit<
      ButtonHTMLAttributes<HTMLElement>,
      'type' | 'disabled' | 'dir' | 'content' | 'onClick' | 'style' | 'className'
    >,
    Pick<AnchorHTMLAttributes<HTMLElement>, 'href' | 'target' | 'rel' | 'download'> {
  as?: ElementType
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
  className?: string
  style?: CSSProperties
  menuClass?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onClick?: (event: MouseEvent<HTMLElement>) => void
  icon?: ReactNode
  trailing?: ReactNode
  children?: ReactNode
  renderContent?: (props: SplitButtonContentProps) => ReactNode
  ref?: Ref<SplitButtonHandle>
  [attribute: `data-${string}`]: string | undefined
}
