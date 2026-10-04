'use client'

import type { ReactNode } from 'react'
import { Button, type ButtonProps } from '../button/Button'
import { Tooltip } from '../tooltip/Tooltip'
import { useTooltipProviderPresence } from '../tooltip/context'

export interface IconButtonProps extends Omit<
  ButtonProps,
  'iconOnly' | 'icon' | 'trailing' | 'block' | 'ripple'
> {
  label: string
  tooltip?: boolean
  side?: 'top' | 'right' | 'bottom' | 'left'
  children?: ReactNode
}

export function IconButton({
  as = 'button',
  label,
  tooltip = true,
  side = 'top',
  variant = 'ghost',
  tone = 'neutral',
  type = 'button',
  ...props
}: IconButtonProps) {
  const provided = useTooltipProviderPresence()
  const button = (
    <Button
      {...props}
      iconOnly
      as={as}
      variant={variant}
      tone={tone}
      type={type}
      aria-label={label}
    />
  )
  if (!provided) return button
  return (
    <Tooltip disabled={!tooltip} content={label} side={side}>
      {button}
    </Tooltip>
  )
}
