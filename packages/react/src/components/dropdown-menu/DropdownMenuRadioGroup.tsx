'use client'

import type { HTMLAttributes, Ref } from 'react'
import { DropdownMenuRadioGroup as PrimitiveDropdownMenuRadioGroup } from '../../primitives/dropdown-menu'
import { useControllableState } from '../../primitives/utils/controllable-state'

export interface DropdownMenuRadioGroupProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'defaultValue'
> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function DropdownMenuRadioGroup({
  value: valueProp,
  defaultValue,
  onValueChange,
  ...attrs
}: DropdownMenuRadioGroupProps) {
  const [value, setValue] = useControllableState<string | undefined>({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: next => {
      if (next !== undefined) onValueChange?.(next)
    },
    caller: 'DropdownMenuRadioGroup',
  })
  return <PrimitiveDropdownMenuRadioGroup {...attrs} value={value} onValueChange={setValue} />
}
