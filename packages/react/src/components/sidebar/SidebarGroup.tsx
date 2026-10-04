'use client'

import { useState, type HTMLAttributes, type Ref } from 'react'
import { cn } from '../../lib/cn'
import { Button } from '../button/Button'
import { DisclosureIcon } from '../disclosure-icon/DisclosureIcon'
import { Collapsible } from '../collapsible/Collapsible'
import { CollapsibleTrigger } from '../collapsible/CollapsibleTrigger'
import { CollapsibleContent } from '../collapsible/CollapsibleContent'
import { useSidebar } from './context'

export interface SidebarGroupProps extends HTMLAttributes<HTMLElement> {
  label: string
  defaultOpen?: boolean
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function SidebarGroup({
  label,
  defaultOpen = true,
  className,
  children,
  ...attrs
}: SidebarGroupProps) {
  const sidebar = useSidebar()
  const rail = sidebar?.state === 'rail'
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Collapsible
      open={rail || open}
      onOpenChange={value => {
        if (!rail) setOpen(value)
      }}
      {...attrs}
      className={cn(className)}
    >
      <div className="relative h-(--hn-control-h-sm)">
        <div
          className="hn-sidebar-label"
          data-collapsed={rail ? '' : undefined}
          aria-hidden={rail ? 'true' : undefined}
          inert={rail}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              tone="neutral"
              size="sm"
              block
              tabIndex={rail ? -1 : undefined}
              className="text-muted justify-between font-medium"
              trailing={<DisclosureIcon direction="end" />}
            >
              {label}
            </Button>
          </CollapsibleTrigger>
        </div>
        <div
          aria-hidden="true"
          className="hn-sidebar-label border-line pointer-events-none absolute inset-x-2 top-1/2 border-t"
          data-collapsed={rail ? undefined : ''}
        />
      </div>
      <CollapsibleContent>
        <div className="flex flex-col gap-0.5 pt-1">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  )
}
