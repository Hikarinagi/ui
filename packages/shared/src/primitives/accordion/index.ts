import { arrowNavigation } from '../arrow-navigation'

export const ACCORDION_NAVIGATION_KEYS = [
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
]

export function isAccordionItemOpen(isSingle: boolean, modelValue: unknown, value: string) {
  return isSingle ? value === modelValue : Array.isArray(modelValue) && modelValue.includes(value)
}

export function isAccordionTriggerLocked(isSingle: boolean, open: boolean, collapsible: boolean) {
  return isSingle && open && !collapsible
}

export function navigateAccordion(
  event: KeyboardEvent,
  parent: HTMLElement | null | undefined,
  options: { orientation: 'vertical' | 'horizontal'; dir: 'ltr' | 'rtl'; attributeName: string },
) {
  const target = event.target as HTMLElement
  const items = Array.from(parent?.querySelectorAll(options.attributeName) ?? [])
  if (!items.includes(target)) return
  arrowNavigation(event, target, parent ?? undefined, {
    arrowKeyOptions: options.orientation,
    dir: options.dir,
    focus: true,
    attributeName: options.attributeName,
  })
}
