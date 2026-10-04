'use client'

import { ToolbarButton as PrimitiveToolbarButton } from '../../primitives/toolbar'
import { ToolbarControl } from './ToolbarControl'
import { useToolbar } from './context'
import type { ToolbarControlProps } from './types'

export interface ToolbarButtonProps extends ToolbarControlProps {}

export function ToolbarButton({ tooltip = true, ripple = true, ...props }: ToolbarButtonProps) {
  const toolbar = useToolbar()
  const disabled = toolbar.disabled || props.disabled || props.loading
  return (
    <PrimitiveToolbarButton asChild as={props.as} disabled={disabled}>
      <ToolbarControl
        {...props}
        tooltip={tooltip}
        ripple={ripple}
        disabled={disabled}
        size={props.size ?? toolbar.size}
      />
    </PrimitiveToolbarButton>
  )
}
