'use client'

import type { HTMLAttributes, Ref } from 'react'
import { useControllableState } from 'radix-ui/internal'
import { MenubarRadioGroup as PrimitiveMenubarRadioGroup } from '../../primitives/menubar'

export interface MenubarRadioGroupProps extends Omit<HTMLAttributes<HTMLElement>, 'defaultValue'> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function MenubarRadioGroup({
  value: valueProp,
  defaultValue,
  onValueChange,
  ...attrs
}: MenubarRadioGroupProps) {
  const [value, setValue] = useControllableState<string | undefined>({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: next => {
      if (next !== undefined) onValueChange?.(next)
    },
    caller: 'MenubarRadioGroup',
  })
  return <PrimitiveMenubarRadioGroup {...attrs} value={value} onValueChange={setValue} />
}
