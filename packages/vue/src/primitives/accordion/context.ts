import type { ComputedRef, Ref } from 'vue'
import { createContext } from '../utils/createContext'
import type { Direction } from '../utils/useDirection'

export type AccordionOrientation = 'vertical' | 'horizontal'

export interface AccordionRootContext {
  disabled: Ref<boolean>
  direction: Ref<Direction>
  orientation: AccordionOrientation
  parentElement: Ref<HTMLElement | undefined>
  isSingle: ComputedRef<boolean>
  collapsible: boolean
  modelValue: Ref<string | string[] | undefined>
  changeModelValue: (value: string) => void
  unmountOnHide: Ref<boolean>
}

export const [injectAccordionRootContext, provideAccordionRootContext] =
  createContext<AccordionRootContext>('AccordionRoot')

export interface AccordionItemContext {
  open: ComputedRef<boolean>
  dataState: ComputedRef<'open' | 'closed'>
  disabled: ComputedRef<boolean>
  dataDisabled: ComputedRef<'' | undefined>
  triggerId: string
  currentRef: Ref<unknown>
  currentElement: ComputedRef<HTMLElement | undefined>
  value: ComputedRef<string>
}

export const [injectAccordionItemContext, provideAccordionItemContext] =
  createContext<AccordionItemContext>('AccordionItem')
