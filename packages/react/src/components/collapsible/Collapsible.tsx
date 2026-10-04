'use client'

import { cn } from '../../lib/cn'
import { CollapsibleRoot, type CollapsibleRootProps } from '../../primitives/collapsible'

export interface CollapsibleProps extends Omit<
  CollapsibleRootProps,
  'as' | 'asChild' | 'unmountOnHide'
> {}

export function Collapsible({
  open,
  defaultOpen,
  onOpenChange,
  disabled,
  className,
  ...attrs
}: CollapsibleProps) {
  return (
    <CollapsibleRoot
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      disabled={disabled}
      {...attrs}
      className={cn(className)}
    />
  )
}
