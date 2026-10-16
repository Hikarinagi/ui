'use client'

import {
  Children,
  cloneElement,
  isValidElement,
  type AnchorHTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { Tooltip } from '../tooltip/Tooltip'
import { useInSidebar, useSidebar } from '../sidebar/context'
import { navLink, navLinkLabel, navLinkTrailing } from './nav-link.variants'
import { resolveChild } from '../../lib/children'
import { Slot } from '../../primitives/utils/slot'

export interface NavLinkProps extends PrimitiveProps, AnchorHTMLAttributes<HTMLElement> {
  active?: boolean
  disabled?: boolean
  label?: string
  icon?: ReactNode
  trailing?: ReactNode
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function NavLink({
  as = 'a',
  asChild,
  active = false,
  disabled = false,
  label,
  icon,
  trailing,
  className,
  children,
  ...attrs
}: NavLinkProps) {
  const context = useSidebar()
  const sidebar = useInSidebar() ? context : null
  const rail = sidebar?.state === 'rail'

  const own = {
    ...attrs,
    'aria-current': active ? ('page' as const) : undefined,
    'data-state': active ? 'selected' : undefined,
    'aria-disabled': disabled ? ('true' as const) : undefined,
    'data-disabled': disabled ? '' : undefined,
    tabIndex: disabled ? -1 : undefined,
    'aria-label': rail ? label : undefined,
    className: cn(navLink({ active }), className),
  }

  const collapsed = {
    'aria-hidden': rail ? ('true' as const) : undefined,
    inert: rail,
    'data-collapsed': rail ? '' : undefined,
  }

  const text = (content: ReactNode) => (
    <span {...collapsed} data-hn-label="" className={navLinkLabel()}>
      {content}
    </span>
  )

  const end = hasContent(trailing) ? (
    <span {...collapsed} className={navLinkTrailing()}>
      {trailing}
    </span>
  ) : null

  const child = asChild
    ? (Children.toArray(children)
        .map(resolveChild)
        .find(node => isValidElement(node)) as ReactElement<{ children?: ReactNode }> | undefined)
    : undefined

  const link = child ? (
    <Slot {...own}>{cloneElement(child, undefined, icon, text(child.props.children), end)}</Slot>
  ) : (
    <Primitive {...own} as={as}>
      {icon}
      {text(children)}
      {end}
    </Primitive>
  )

  if (!sidebar) return link
  return (
    <Tooltip disabled={!rail || !label} content={label} side="right">
      {link}
    </Tooltip>
  )
}
