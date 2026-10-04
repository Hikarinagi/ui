'use client'

import { ToolbarToggleItem as PrimitiveToolbarToggleItem } from '../../primitives/toolbar'
import { cn } from '../../lib/cn'
import { ToolbarControl } from './ToolbarControl'
import { useToolbar, useToolbarGroup } from './context'
import type { ToolbarControlProps } from './types'

export interface ToolbarToggleItemProps extends ToolbarControlProps {
  value: string
}

export function ToolbarToggleItem({
  value,
  tooltip = true,
  ripple = true,
  className,
  ...props
}: ToolbarToggleItemProps) {
  const toolbar = useToolbar()
  const groupDisabled = useToolbarGroup()
  const disabled = toolbar.disabled || groupDisabled || props.disabled || props.loading
  return (
    <PrimitiveToolbarToggleItem asChild value={value} disabled={!!disabled}>
      <ToolbarControl
        {...props}
        {...({ value } as object)}
        tooltip={tooltip}
        ripple={ripple}
        disabled={!!disabled}
        size={props.size ?? toolbar.size}
        className={cn('aria-pressed:text-accent-text', className)}
      />
    </PrimitiveToolbarToggleItem>
  )
}
