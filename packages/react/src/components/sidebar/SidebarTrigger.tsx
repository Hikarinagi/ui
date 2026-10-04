'use client'

import type { MouseEvent } from 'react'
import { PanelLeft } from 'lucide-react'
import { lucide } from '../../lib/icon'
import { useUiLocale } from '../../locale'
import { Button, type ButtonProps } from '../button/Button'
import { useSidebar } from './context'

const PanelLeftIcon = lucide(PanelLeft)

export interface SidebarTriggerProps extends Omit<ButtonProps, 'children' | 'icon' | 'trailing'> {}

export function SidebarTrigger({ className, onClick, ...attrs }: SidebarTriggerProps) {
  const t = useUiLocale()
  const sidebar = useSidebar()
  if (!sidebar) return null
  return (
    <Button
      iconOnly
      variant="ghost"
      tone="neutral"
      aria-label={t.sidebar.toggleLabel}
      {...attrs}
      className={className}
      onClick={(event: MouseEvent<HTMLElement>) => {
        sidebar.toggle()
        onClick?.(event)
      }}
    >
      <PanelLeftIcon />
    </Button>
  )
}
