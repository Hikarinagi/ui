import { Inbox } from 'lucide-react'
import type { HTMLAttributes, ReactNode, Ref } from 'react'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { lucide } from '../../lib/icon'
import {
  empty,
  emptyActions,
  emptyDescription,
  emptyIcon,
  emptyText,
  emptyTitle,
  type EmptyVariants,
} from './empty.variants'

const InboxIcon = lucide(Inbox)

export interface EmptyProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: string
  description?: string
  icon?: ReactNode
  size?: EmptyVariants['size']
  actions?: ReactNode
  ref?: Ref<HTMLDivElement>
  [attribute: `data-${string}`]: string | undefined
}

export function Empty({
  title,
  description,
  icon = true,
  size = 'md',
  actions,
  className,
  children,
  ...attrs
}: EmptyProps) {
  const customIcon = hasContent(icon)
  return (
    <div data-hn-empty="" {...attrs} className={cn(empty({ size }), className)}>
      {customIcon ? (
        <span aria-hidden="true" className="flex shrink-0 justify-center">
          {icon}
        </span>
      ) : icon ? (
        <span aria-hidden="true" className={emptyIcon({ size })}>
          <InboxIcon />
        </span>
      ) : null}
      {title || description ? (
        <div className={emptyText()}>
          {title ? <p className={emptyTitle({ size })}>{title}</p> : null}
          {description ? <p className={emptyDescription({ size })}>{description}</p> : null}
        </div>
      ) : null}
      {children}
      {hasContent(actions) ? <div className={emptyActions()}>{actions}</div> : null}
    </div>
  )
}
