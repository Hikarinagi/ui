'use client'

import type { HTMLAttributes, Ref } from 'react'
import { useControllableState } from 'radix-ui/internal'
import { MenubarRoot } from '../../primitives/menubar'
import { cn } from '../../lib/cn'
import { menubarRoot } from './menubar.variants'

export interface MenubarProps extends Omit<HTMLAttributes<HTMLElement>, 'defaultValue' | 'dir'> {
  label?: string
  loop?: boolean
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function Menubar({
  label,
  loop = true,
  value: valueProp,
  defaultValue,
  onValueChange,
  className,
  ...attrs
}: MenubarProps) {
  const [value, setValue] = useControllableState<string | undefined>({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: next => {
      if (next !== undefined) onValueChange?.(next)
    },
    caller: 'Menubar',
  })
  return (
    <MenubarRoot
      value={value ?? ''}
      onValueChange={setValue}
      loop={loop}
      aria-label={label}
      {...attrs}
      className={cn(menubarRoot(), className)}
    />
  )
}
