'use client'

import type { HTMLAttributes, Ref } from 'react'
import { useControllableState } from 'radix-ui/internal'
import { ContextMenuRadioGroup as PrimitiveContextMenuRadioGroup } from '../../primitives/context-menu'

export interface ContextMenuRadioGroupProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'defaultValue'
> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function ContextMenuRadioGroup({
  value: valueProp,
  defaultValue,
  onValueChange,
  ...attrs
}: ContextMenuRadioGroupProps) {
  const [value, setValue] = useControllableState<string | undefined>({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: next => {
      if (next !== undefined) onValueChange?.(next)
    },
    caller: 'ContextMenuRadioGroup',
  })
  return <PrimitiveContextMenuRadioGroup {...attrs} value={value} onValueChange={setValue} />
}
