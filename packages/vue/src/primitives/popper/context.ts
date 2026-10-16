import type { ComputedRef, Ref } from 'vue'
import type { Side } from '../../../../shared/src/primitives/popper'
import type { ReferenceElement } from '@floating-ui/vue'
import { createContext } from '../utils/createContext'

export interface PopperRootContext {
  anchor: Ref<ReferenceElement | undefined>
  onAnchorChange: (element: ReferenceElement | undefined) => void
}

export const [injectPopperRootContext, providePopperRootContext] =
  createContext<PopperRootContext>('PopperRoot')

export interface PopperContentContext {
  placedSide: Ref<Side>
  onArrowChange: (arrow: HTMLElement | undefined) => void
  arrowX?: ComputedRef<number>
  arrowY?: ComputedRef<number>
  shouldHideArrow: Ref<boolean>
}

export const [injectPopperContentContext, providePopperContentContext] =
  createContext<PopperContentContext>('PopperContent')
