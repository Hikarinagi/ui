import { ChevronRight } from 'lucide-react'
import type { LiHTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { lucide } from '../../lib/icon'

const ChevronRightIcon = lucide(ChevronRight)

export interface BreadcrumbSeparatorProps extends LiHTMLAttributes<HTMLLIElement> {
  ref?: Ref<HTMLLIElement>
  [attribute: `data-${string}`]: string | undefined
}

export function BreadcrumbSeparator({ className, children, ...attrs }: BreadcrumbSeparatorProps) {
  return (
    <li aria-hidden="true" {...attrs} className={cn('text-faint flex items-center', className)}>
      {hasContent(children) ? children : <ChevronRightIcon className="size-3.5" />}
    </li>
  )
}
