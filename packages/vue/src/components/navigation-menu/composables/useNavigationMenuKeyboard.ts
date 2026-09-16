import type { Ref } from 'vue'
import type { NavigationMenuOrientation } from '../types'

export function useNavigationMenuKeyboard(
  root: Ref<HTMLElement | undefined>,
  orientation: () => NavigationMenuOrientation,
  direction: () => 'ltr' | 'rtl',
) {
  return (event: KeyboardEvent) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return
    const items = Array.from(
      root.value?.querySelectorAll<HTMLElement>(
        '[data-hn-navigation-list] > [data-menu-item] > [data-hn-navigation-control]',
      ) ?? [],
    ).filter(item => !item.hasAttribute('data-disabled'))
    const index = items.indexOf(event.target as HTMLElement)
    if (index < 0) return

    const horizontal = orientation() === 'horizontal'
    const next = horizontal ? (direction() === 'rtl' ? 'ArrowLeft' : 'ArrowRight') : 'ArrowDown'
    const previous = horizontal ? (direction() === 'rtl' ? 'ArrowRight' : 'ArrowLeft') : 'ArrowUp'
    let target: number
    if (event.key === next) target = Math.min(index + 1, items.length - 1)
    else if (event.key === previous) target = Math.max(index - 1, 0)
    else if (event.key === 'Home') target = 0
    else if (event.key === 'End') target = items.length - 1
    else return

    event.preventDefault()
    event.stopPropagation()
    items[target]?.focus()
  }
}
