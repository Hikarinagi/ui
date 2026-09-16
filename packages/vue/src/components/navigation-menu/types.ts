export type NavigationMenuSize = 'sm' | 'md' | 'lg'
export type NavigationMenuOrientation = 'horizontal' | 'vertical'

export interface NavigationMenuProps {
  label?: string
  orientation?: NavigationMenuOrientation
  dir?: 'ltr' | 'rtl'
  size?: NavigationMenuSize
  trigger?: 'hover' | 'click'
  delayDuration?: number
  skipDelayDuration?: number
  align?: 'start' | 'center' | 'end'
  unmountOnHide?: boolean
  class?: string
  listClass?: string
  viewportClass?: string
}
