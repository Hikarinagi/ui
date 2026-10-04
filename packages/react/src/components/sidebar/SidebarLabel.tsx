'use client'

import type { ElementType, HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'
import { useSidebar } from './context'
import { sidebarLabel } from './sidebar.variants'
import type { AnchorAttributes } from '../../lib/primitive'

export interface SidebarLabelProps extends HTMLAttributes<HTMLElement>, AnchorAttributes {
  as?: ElementType
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function SidebarLabel({ as: Tag = 'span', className, ...attrs }: SidebarLabelProps) {
  const sidebar = useSidebar()
  const collapsed = sidebar?.state === 'rail'
  return (
    <Tag
      data-collapsed={collapsed ? '' : undefined}
      aria-hidden={collapsed ? 'true' : undefined}
      inert={collapsed}
      {...attrs}
      className={cn(sidebarLabel(), className)}
    />
  )
}
