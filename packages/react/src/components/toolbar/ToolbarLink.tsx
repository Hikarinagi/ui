'use client'

import type { AnchorHTMLAttributes, KeyboardEvent } from 'react'
import { composeEventHandlers } from 'radix-ui/internal'
import { ToolbarButton as PrimitiveToolbarButton } from '../../primitives/toolbar'
import { ToolbarControl } from './ToolbarControl'
import { useToolbar } from './context'
import type { ToolbarControlProps } from './types'

export interface ToolbarLinkProps
  extends ToolbarControlProps, Pick<AnchorHTMLAttributes<HTMLElement>, 'href' | 'target' | 'rel'> {}

export function ToolbarLink({
  as = 'a',
  tooltip = true,
  ripple = true,
  onKeyDown,
  ...props
}: ToolbarLinkProps) {
  const toolbar = useToolbar()
  const disabled = toolbar.disabled || props.disabled || props.loading

  function activate(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== ' ') return
    event.preventDefault()
    if (!disabled) event.currentTarget.click()
  }

  return (
    <PrimitiveToolbarButton asChild as={as} disabled={disabled}>
      <ToolbarControl
        {...props}
        as={as}
        tooltip={tooltip}
        ripple={ripple}
        disabled={disabled}
        size={props.size ?? toolbar.size}
        onKeyDown={composeEventHandlers(onKeyDown, activate, { checkForDefaultPrevented: false })}
      />
    </PrimitiveToolbarButton>
  )
}
