'use client'

import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { useControllableState } from 'radix-ui/internal'
import {
  MenubarPortal,
  MenubarSub as PrimitiveMenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
} from '../../primitives/menubar'
import { lucide } from '../../lib/icon'
import { Card } from '../card/Card'
import { cn } from '../../lib/cn'
import { dropdownItem } from '../dropdown-menu/dropdown-menu.variants'
import { menubarContent } from './menubar.variants'

const ChevronRightIcon = lucide(ChevronRight)

export interface MenubarSubProps {
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

export function MenubarSub({
  label,
  disabled,
  textValue,
  className,
  open: openProp,
  defaultOpen,
  onOpenChange,
  icon,
  children,
}: MenubarSubProps) {
  const [open, setOpen] = useControllableState<boolean | undefined>({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: value => {
      if (value !== undefined) onOpenChange?.(value)
    },
    caller: 'MenubarSub',
  })
  return (
    <PrimitiveMenubarSub open={open ?? false} onOpenChange={setOpen}>
      <MenubarSubTrigger
        disabled={disabled}
        textValue={textValue ?? (typeof label === 'string' ? label : undefined)}
        className={dropdownItem()}
      >
        {icon}
        <span className="min-w-0 flex-1">{label}</span>
        <ChevronRightIcon className="text-muted" />
      </MenubarSubTrigger>
      <MenubarPortal>
        <MenubarSubContent asChild sideOffset={4}>
          <Card padded={false} className={cn(menubarContent(), className)}>
            {children}
          </Card>
        </MenubarSubContent>
      </MenubarPortal>
    </PrimitiveMenubarSub>
  )
}
