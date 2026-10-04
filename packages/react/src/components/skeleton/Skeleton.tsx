import type { ElementType, HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'
import type { AnchorAttributes } from '../../lib/primitive'

export interface SkeletonProps extends HTMLAttributes<HTMLElement>, AnchorAttributes {
  loading?: boolean
  as?: string
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function Skeleton({
  loading = true,
  as = 'span',
  className,
  children,
  ...attrs
}: SkeletonProps) {
  if (!loading) return <>{children}</>
  const Tag = as as ElementType
  return (
    <Tag
      aria-hidden="true"
      inert
      tabIndex={-1}
      {...attrs}
      className={cn('hn-skeleton block', className)}
    >
      {children}
    </Tag>
  )
}
