'use client'

import type { HTMLAttributes, Ref } from 'react'
import { Separator } from 'radix-ui'
import { cn } from '../../lib/cn'
import { useToolbar } from './context'
import { toolbarSeparator } from './toolbar.variants'

export interface ToolbarSeparatorProps extends HTMLAttributes<HTMLDivElement> {
  decorative?: boolean
  ref?: Ref<HTMLDivElement>
  [attribute: `data-${string}`]: string | undefined
}

export function ToolbarSeparator({
  decorative = true,
  className,
  ...attrs
}: ToolbarSeparatorProps) {
  const toolbar = useToolbar()
  return (
    <Separator.Root
      orientation={toolbar.orientation === 'horizontal' ? 'vertical' : 'horizontal'}
      decorative={decorative}
      {...attrs}
      className={cn(toolbarSeparator({ orientation: toolbar.orientation }), className)}
    />
  )
}
