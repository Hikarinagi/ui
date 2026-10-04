'use client'

import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import {
  ContextMenuPortal,
  ContextMenuSub as PrimitiveContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from '../../primitives/context-menu'
import { lucide } from '../../lib/icon'
import { Card } from '../card/Card'
import { cn } from '../../lib/cn'
import { dropdownItem } from '../dropdown-menu/dropdown-menu.variants'
import { useControllableState } from '../../primitives/utils/controllable-state'

const ChevronRightIcon = lucide(ChevronRight)

export interface ContextMenuSubProps {
  label?: ReactNode
  disabled?: boolean
  textValue?: string
  className?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  icon?: ReactNode
  children?: ReactNode
}

export function ContextMenuSub({
  label,
  disabled,
  textValue,
  className,
  open: openProp,
  defaultOpen,
  onOpenChange,
  icon,
  children,
}: ContextMenuSubProps) {
  const [open, setOpen] = useControllableState<boolean | undefined>({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: value => {
      if (value !== undefined) onOpenChange?.(value)
    },
    caller: 'ContextMenuSub',
  })
  return (
    <PrimitiveContextMenuSub open={open ?? false} onOpenChange={setOpen}>
      <ContextMenuSubTrigger
        disabled={disabled}
        textValue={textValue ?? (typeof label === 'string' ? label : undefined)}
        className={dropdownItem()}
      >
        {icon}
        <span className="min-w-0 flex-1">{label}</span>
        <ChevronRightIcon className="text-muted" />
      </ContextMenuSubTrigger>
      <ContextMenuPortal>
        <ContextMenuSubContent asChild sideOffset={4}>
          <Card
            padded={false}
            className={cn(
              'hn-anim-pop z-(--hn-z-overlay) flex min-w-40 flex-col gap-0.5 p-1 shadow-md outline-none',
              className,
            )}
          >
            {children}
          </Card>
        </ContextMenuSubContent>
      </ContextMenuPortal>
    </PrimitiveContextMenuSub>
  )
}
