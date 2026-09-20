import type { FloatButtonProps } from '../float-button/types'

export type ScrollTopTarget = HTMLElement | Window
export interface ScrollTopProps extends Omit<
  FloatButtonProps,
  'label' | 'as' | 'type' | 'visible'
> {
  label?: string
  target?: ScrollTopTarget | null | (() => ScrollTopTarget | null | undefined)
  threshold?: number
  behavior?: ScrollBehavior
  focusTarget?: HTMLElement | (() => HTMLElement | null | undefined)
}
