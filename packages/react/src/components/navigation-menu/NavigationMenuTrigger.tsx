'use client'

import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { NavigationMenuTrigger as PrimitiveTrigger } from '../../primitives/navigation-menu'
import { DisclosureIcon } from '../disclosure-icon/DisclosureIcon'
import { useNavigationMenu } from './context'
import {
  navigationMenuControl,
  navigationMenuDisclosure,
  navigationMenuIcon,
  navigationMenuTrigger,
} from './navigation-menu.variants'

export interface NavigationMenuTriggerProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'disabled'
> {
  disabled?: boolean
  icon?: ReactNode
  trailing?: ReactNode
  ref?: Ref<HTMLButtonElement>
  [attribute: `data-${string}`]: string | undefined
}

export function NavigationMenuTrigger({
  disabled,
  icon,
  trailing,
  className,
  children,
  ref,
  ...attrs
}: NavigationMenuTriggerProps) {
  const menu = useNavigationMenu()
  return (
    <PrimitiveTrigger
      type="button"
      data-hn-navigation-control=""
      disabled={disabled}
      className={cn(
        navigationMenuControl({ size: menu.size, orientation: menu.orientation }),
        navigationMenuTrigger(),
        className,
      )}
      ref={ref as Ref<HTMLElement>}
      {...attrs}
    >
      {hasContent(icon) ? (
        <span className={navigationMenuIcon()} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="min-w-0 flex-1">{children}</span>
      <span className={navigationMenuIcon()}>
        {hasContent(trailing) ? (
          trailing
        ) : (
          <span className={navigationMenuDisclosure({ orientation: menu.orientation })}>
            <DisclosureIcon direction={menu.orientation === 'vertical' ? 'end' : 'down'} />
          </span>
        )}
      </span>
    </PrimitiveTrigger>
  )
}
