import type { HTMLAttributes, ReactNode, Ref } from 'react'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { Heading } from '../heading/Heading'
import { Text } from '../text/Text'

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  eyebrow?: string
  title?: string
  description?: string
  actions?: ReactNode
  ref?: Ref<HTMLElement>
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
  children,
  ...attrs
}: PageHeaderProps) {
  return (
    <header {...attrs} className={cn('flex flex-col gap-2', className)}>
      <div className="flex flex-col items-start gap-3 md:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {eyebrow ? (
            <Text as="span" size="sm" weight="medium" tone="accent">
              {eyebrow}
            </Text>
          ) : null}
          {title ? <Heading level={1}>{title}</Heading> : null}
          {description ? <Text tone="muted">{description}</Text> : null}
        </div>
        {hasContent(actions) ? (
          <div className="flex w-full flex-wrap items-center gap-2 md:w-auto md:shrink-0">
            {actions}
          </div>
        ) : null}
      </div>
      {children}
    </header>
  )
}
