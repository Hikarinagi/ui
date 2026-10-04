'use client'

import { X } from 'lucide-react'
import { cn } from '../../lib/cn'
import { lucide } from '../../lib/icon'
import { useUiLocale } from '../../locale'
import { IconButton, type IconButtonProps } from '../icon-button/IconButton'
import type { ButtonVariants } from '../button/button.variants'

const XIcon = lucide(X)

export interface CloseButtonProps extends Omit<
  IconButtonProps,
  'label' | 'size' | 'disabled' | 'tooltip' | 'children'
> {
  label?: string
  size?: 'xs' | ButtonVariants['size']
  disabled?: boolean
  tooltip?: boolean
}

export function CloseButton({
  label,
  size = 'sm',
  disabled,
  tooltip = false,
  className,
  ...attrs
}: CloseButtonProps) {
  const t = useUiLocale()
  return (
    <IconButton
      {...attrs}
      label={label ?? t.common.close}
      tooltip={tooltip}
      size={size === 'xs' ? 'sm' : size}
      pill
      disabled={disabled}
      variant="ghost"
      tone="neutral"
      className={cn(size === 'xs' && 'size-5 [&_svg]:size-3', className)}
    >
      <XIcon />
    </IconButton>
  )
}
