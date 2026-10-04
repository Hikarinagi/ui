import type { Ref } from 'react'
import type { FloatButtonProps } from '../float-button/types'

export type ScrollTopTarget = HTMLElement | Window
export interface ScrollTopExpose {
  visible: boolean
  scrollToTop: () => void
}
export interface ScrollTopProps extends Omit<
  FloatButtonProps,
  'label' | 'as' | 'type' | 'visible' | 'ref' | 'href' | 'target' | 'rel' | 'download'
> {
  label?: string
  target?: ScrollTopTarget | null | (() => ScrollTopTarget | null | undefined)
  threshold?: number
  behavior?: ScrollBehavior
  focusTarget?: HTMLElement | (() => HTMLElement | null | undefined)
  ref?: Ref<ScrollTopExpose>
}
