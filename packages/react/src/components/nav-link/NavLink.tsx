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
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { Tooltip } from '../tooltip/Tooltip'
import { useInSidebar, useSidebar } from '../sidebar/context'
import { navLink, navLinkLabel } from './nav-link.variants'
import { resolveChild } from '../../lib/children'
import { Slot } from '../../primitives/utils/slot'

export interface NavLinkProps extends PrimitiveProps, AnchorHTMLAttributes<HTMLElement> {
  active?: boolean
  disabled?: boolean
  label?: string
  icon?: ReactNode
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

  const text = (content: ReactNode) => (
    <span
      aria-hidden={rail ? 'true' : undefined}
      inert={rail}
      data-collapsed={rail ? '' : undefined}
      data-hn-label=""
      className={navLinkLabel()}
    >
      {content}
    </span>
  )

  const child = asChild
    ? (Children.toArray(children)
        .map(resolveChild)
        .find(node => isValidElement(node)) as ReactElement<{ children?: ReactNode }> | undefined)
    : undefined

  const link = child ? (
    <Slot {...own}>{cloneElement(child, undefined, icon, text(child.props.children))}</Slot>
  ) : (
    <Primitive {...own} as={as}>
      {icon}
      {text(children)}
    </Primitive>
  )

  if (!sidebar) return link
  return (
    <Tooltip disabled={!rail || !label} content={label} side="right">
      {link}
    </Tooltip>
  )
}
