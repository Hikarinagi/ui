'use client'

import { Button } from '../button/Button'
import { Tooltip } from '../tooltip/Tooltip'
import { useTooltipProviderPresence } from '../tooltip/context'
import type { ToolbarControlProps } from './types'

export function ToolbarControl({
  as = 'button',
  asChild,
  label,
  tooltip = true,
  side = 'top',
  variant = 'ghost',
  tone = 'neutral',
  size,
  disabled,
  loading,
  ripple = true,
  className,
  ...attrs
}: ToolbarControlProps) {
  const provided = useTooltipProviderPresence()
  const button = (
    <Button
      {...(attrs as object)}
      as={as}
      asChild={asChild}
      aria-label={label}
      iconOnly={!!label}
      size={size}
      variant={variant}
      tone={tone}
      disabled={disabled}
      loading={loading}
      ripple={ripple}
      className={className}
    />
  )
  if (!provided) return button
  return (
    <Tooltip disabled={!tooltip || !label} content={label ?? ''} side={side}>
      {button}
    </Tooltip>
  )
}
