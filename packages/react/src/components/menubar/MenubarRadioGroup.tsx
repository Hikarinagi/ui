'use client'

import type { HTMLAttributes, Ref } from 'react'
import { MenubarRadioGroup as PrimitiveMenubarRadioGroup } from '../../primitives/menubar'
import { useControllableState } from '../../primitives/utils/controllable-state'

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
