'use client'

import { useRef, type ReactNode } from 'react'
import {
  MenubarContent,
  MenubarMenu as PrimitiveMenubarMenu,
  MenubarPortal,
  MenubarTrigger,
} from '../../primitives/menubar'
import { cn } from '../../lib/cn'
import { Card } from '../card/Card'
import { menubarContent, menubarTrigger } from './menubar.variants'

export interface MenubarMenuProps {
  label?: ReactNode
  value?: string
  disabled?: boolean
  className?: string
  children?: ReactNode
}

export function MenubarMenu({ label, value, disabled, className, children }: MenubarMenuProps) {
  const panel = useRef<HTMLElement | null>(null)

  function ignoreWhileClosing(event: Event) {
    if (panel.current?.dataset.state === 'closed') event.preventDefault()
  }

  return (
    <PrimitiveMenubarMenu value={value}>
      <MenubarTrigger disabled={disabled} className={menubarTrigger()}>
        {label}
      </MenubarTrigger>
      <MenubarPortal>
        <MenubarContent
          asChild
          align="start"
          sideOffset={4}
          onFocusOutside={ignoreWhileClosing}
          onInteractOutside={ignoreWhileClosing}
        >
          <Card ref={panel} padded={false} className={cn(menubarContent(), className)}>
            {children}
          </Card>
        </MenubarContent>
      </MenubarPortal>
    </PrimitiveMenubarMenu>
  )
}
