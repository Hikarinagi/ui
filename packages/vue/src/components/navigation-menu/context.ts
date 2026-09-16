import { inject, provide, type InjectionKey, type Ref } from 'vue'
import type { NavigationMenuOrientation, NavigationMenuSize } from './types'

interface NavigationMenuContext {
  size: Readonly<Ref<NavigationMenuSize>>
  orientation: Readonly<Ref<NavigationMenuOrientation>>
}

const key: InjectionKey<NavigationMenuContext> = Symbol('hn-navigation-menu')

export function provideNavigationMenu(context: NavigationMenuContext) {
  provide(key, context)
}

export function useNavigationMenu() {
  const context = inject(key)
  if (!context) throw new Error('NavigationMenu controls must be inside NavigationMenu.')
  return context
}
