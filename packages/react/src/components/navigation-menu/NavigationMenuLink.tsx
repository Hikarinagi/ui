'use client'

import type { AnchorHTMLAttributes, ElementType, MouseEvent, ReactNode, Ref } from 'react'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import {
  NavigationMenuLink as PrimitiveLink,
  type NavigationMenuLinkProps as PrimitiveLinkProps,
} from '../../primitives/navigation-menu'
import { useNavigationMenu } from './context'
import {
  navigationMenuControl,
  navigationMenuIcon,
  navigationMenuLink,
} from './navigation-menu.variants'

export interface NavigationMenuLinkProps extends Omit<
  AnchorHTMLAttributes<HTMLElement>,
  'onSelect'
> {
  as?: ElementType
  asChild?: boolean
  active?: boolean
  disabled?: boolean
  description?: ReactNode
  icon?: ReactNode
  trailing?: ReactNode
  onSelect?: PrimitiveLinkProps['onSelect']
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function NavigationMenuLink({
  as = 'a',
  asChild,
  active,
  disabled,
  description,
  icon,
  trailing,
  onSelect,
  onClickCapture,
  className,
  children,
  ...attrs
}: NavigationMenuLinkProps) {
  const menu = useNavigationMenu()

  function guard(event: MouseEvent<HTMLElement>) {
    onClickCapture?.(event)
    if (!disabled) return
    event.preventDefault()
    event.stopPropagation()
    event.nativeEvent.stopImmediatePropagation()
  }

  return (
    <PrimitiveLink
      {...(attrs as PrimitiveLinkProps)}
      as={as}
      asChild={asChild}
      active={active}
      aria-disabled={disabled || undefined}
      data-disabled={disabled ? '' : undefined}
      tabIndex={disabled ? -1 : undefined}
      data-hn-navigation-control=""
      className={cn(
        navigationMenuControl({ size: menu.size, orientation: menu.orientation }),
        navigationMenuLink(),
        className,
      )}
      onClickCapture={guard}
      onSelect={event => onSelect?.(event)}
    >
      {asChild ? (
        children
      ) : (
        <>
          {hasContent(icon) ? (
            <span className={navigationMenuIcon()} aria-hidden="true">
              {icon}
            </span>
          ) : null}
          <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span>{children}</span>
            {hasContent(description) && description !== '' ? (
              <span className="text-muted text-xs leading-relaxed font-normal">{description}</span>
            ) : null}
          </span>
          {hasContent(trailing) ? <span className={navigationMenuIcon()}>{trailing}</span> : null}
        </>
      )}
    </PrimitiveLink>
  )
}
