'use client'

import { createContext, useContext } from 'react'
import type { NavigationMenuOrientation, NavigationMenuSize } from './types'

interface NavigationMenuContextValue {
  size: NavigationMenuSize
  orientation: NavigationMenuOrientation
}

export const NavigationMenuContext = createContext<NavigationMenuContextValue | null>(null)

export function useNavigationMenu() {
  const context = useContext(NavigationMenuContext)
  if (!context) throw new Error('NavigationMenu controls must be inside NavigationMenu.')
  return context
}
