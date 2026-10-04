import type { HTMLAttributes, ReactNode, Ref } from 'react'

export type NavigationMenuSize = 'sm' | 'md' | 'lg'
export type NavigationMenuOrientation = 'horizontal' | 'vertical'

export interface NavigationMenuProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'defaultValue' | 'dir' | 'children'
> {
  label?: string
  orientation?: NavigationMenuOrientation
  dir?: 'ltr' | 'rtl'
  size?: NavigationMenuSize
  trigger?: 'hover' | 'click'
  delayDuration?: number
  skipDelayDuration?: number
  align?: 'start' | 'center' | 'end'
  unmountOnHide?: boolean
  listClass?: string
  viewportClass?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children?: ReactNode | ((props: { value: string }) => ReactNode)
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}
