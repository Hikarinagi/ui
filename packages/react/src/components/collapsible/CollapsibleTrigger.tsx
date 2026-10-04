import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import {
  CollapsibleTrigger as CollapsibleTriggerPrimitive,
  type CollapsibleTriggerProps as CollapsibleTriggerPrimitiveProps,
} from '../../primitives/collapsible'
import { Button } from '../button/Button'
import { DisclosureIcon } from '../disclosure-icon/DisclosureIcon'

export interface CollapsibleTriggerProps extends Omit<CollapsibleTriggerPrimitiveProps, 'as'> {
  icon?: ReactNode
}

export function CollapsibleTrigger({
  asChild,
  icon = true,
  className,
  children,
  ...attrs
}: CollapsibleTriggerProps) {
  return (
    <CollapsibleTriggerPrimitive
      asChild
      {...attrs}
      className={cn('group/hn-disclosure', className)}
    >
      {asChild ? (
        children
      ) : (
        <Button
          variant="ghost"
          tone="neutral"
          trailing={
            icon ? (
              <DisclosureIcon>{hasContent(icon) ? icon : undefined}</DisclosureIcon>
            ) : undefined
          }
        >
          {children}
        </Button>
      )}
    </CollapsibleTriggerPrimitive>
  )
}
