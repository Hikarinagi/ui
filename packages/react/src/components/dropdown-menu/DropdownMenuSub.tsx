'use client'

import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import {
  DropdownMenuPortal,
  DropdownMenuSub as PrimitiveDropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '../../primitives/dropdown-menu'
import { lucide } from '../../lib/icon'
import { Card } from '../card/Card'
import { cn } from '../../lib/cn'
import { dropdownItem } from './dropdown-menu.variants'
import { useControllableState } from '../../primitives/utils/controllable-state'

const ChevronRightIcon = lucide(ChevronRight)

export interface DropdownMenuSubProps {
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

export function DropdownMenuSub({
  label,
  disabled,
  textValue,
  className,
  open: openProp,
  defaultOpen,
  onOpenChange,
  icon,
  children,
}: DropdownMenuSubProps) {
  const [open, setOpen] = useControllableState<boolean | undefined>({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: value => {
      if (value !== undefined) onOpenChange?.(value)
    },
    caller: 'DropdownMenuSub',
  })
  return (
    <PrimitiveDropdownMenuSub open={open ?? false} onOpenChange={setOpen}>
      <DropdownMenuSubTrigger
        disabled={disabled}
        textValue={textValue ?? (typeof label === 'string' ? label : undefined)}
        className={dropdownItem()}
      >
        {icon}
        <span className="min-w-0 flex-1">{label}</span>
        <ChevronRightIcon className="text-muted" />
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent asChild sideOffset={4}>
          <Card
            padded={false}
            className={cn(
              'hn-anim-pop z-(--hn-z-overlay) flex min-w-40 flex-col gap-0.5 p-1 shadow-md outline-none',
              className,
            )}
          >
            {children}
          </Card>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </PrimitiveDropdownMenuSub>
  )
}
