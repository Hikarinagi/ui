'use client'

import type { ReactNode } from 'react'
import {
  ContextMenuContent,
  ContextMenuPortal,
  ContextMenuRoot,
  ContextMenuTrigger,
} from '../../primitives/context-menu'
import { cn } from '../../lib/cn'
import { Card } from '../card/Card'

export interface ContextMenuProps {
  label?: string
  disabled?: boolean
  className?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  content?: ReactNode
  children?: ReactNode
}

export function ContextMenu({
  label,
  disabled,
  className,
  onOpenChange,
  content,
  children,
}: ContextMenuProps) {
  return (
    <ContextMenuRoot onOpenChange={onOpenChange} modal>
      <ContextMenuTrigger asChild disabled={disabled}>
        {children}
      </ContextMenuTrigger>
      <ContextMenuPortal>
        <ContextMenuContent asChild aria-label={label}>
          <Card
            padded={false}
            className={cn(
              'hn-anim-pop z-(--hn-z-overlay) flex min-w-40 flex-col gap-0.5 p-1 shadow-md outline-none',
              className,
            )}
          >
            {content}
          </Card>
        </ContextMenuContent>
      </ContextMenuPortal>
    </ContextMenuRoot>
  )
}
