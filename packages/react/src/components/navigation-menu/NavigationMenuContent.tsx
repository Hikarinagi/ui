import type { HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'
import {
  NavigationMenuContent as PrimitiveContent,
  type NavigationMenuContentProps as PrimitiveContentProps,
} from '../../primitives/navigation-menu'
import { navigationMenuContent } from './navigation-menu.variants'

type ContentEvents = Pick<
  PrimitiveContentProps,
  'onEscapeKeyDown' | 'onPointerDownOutside' | 'onFocusOutside' | 'onInteractOutside' | 'onDismiss'
>

export interface NavigationMenuContentProps
  extends ContentEvents, Omit<HTMLAttributes<HTMLDivElement>, keyof ContentEvents> {
  padded?: boolean
  ref?: Ref<HTMLDivElement>
  [attribute: `data-${string}`]: string | undefined
}

export function NavigationMenuContent({
  padded = true,
  className,
  ref,
  ...attrs
}: NavigationMenuContentProps) {
  return (
    <PrimitiveContent
      {...attrs}
      ref={ref as Ref<HTMLElement>}
      data-hn-navigation-content=""
      className={cn(navigationMenuContent({ padded }), className)}
    />
  )
}
