import type { AnchorHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { Primitive, type PrimitiveElementProps } from '../../lib/primitive'

export interface BreadcrumbItemProps
  extends
    PrimitiveElementProps,
    Omit<AnchorHTMLAttributes<HTMLElement>, keyof PrimitiveElementProps> {
  current?: boolean
}

export function BreadcrumbItem({
  as = 'a',
  asChild,
  current = false,
  className,
  children,
  ...attrs
}: BreadcrumbItemProps) {
  return (
    <li className="flex items-center">
      {current ? (
        <span {...attrs} aria-current="page" className={cn('text-fg font-medium', className)}>
          {children}
        </span>
      ) : (
        <Primitive
          {...attrs}
          as={as}
          asChild={asChild}
          className={cn('hn-link [--hn-link-color:var(--hn-fg-muted)]', className)}
        >
          {children}
        </Primitive>
      )}
    </li>
  )
}
