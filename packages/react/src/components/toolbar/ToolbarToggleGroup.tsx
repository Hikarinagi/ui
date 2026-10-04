'use client'

import { useState, type HTMLAttributes, type ReactNode, type Ref } from 'react'
import { ToolbarToggleGroup as PrimitiveToolbarToggleGroup } from '../../primitives/toolbar'
import type { ToggleGroupValue } from '../../primitives/toggle-group'
import { cn } from '../../lib/cn'
import { ToolbarGroupContext, useToolbar } from './context'
import { toolbarGroup } from './toolbar.variants'

export interface ToolbarToggleGroupProps<
  T extends string | string[] = string | string[],
> extends Omit<HTMLAttributes<HTMLElement>, 'defaultValue' | 'onChange' | 'dir'> {
  type?: 'single' | 'multiple'
  value?: T
  defaultValue?: T
  onValueChange?: (value: T) => void
  label?: string
  disabled?: boolean
  className?: string
  children?: ReactNode
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function ToolbarToggleGroup<T extends string | string[] = string | string[]>(
  props: ToolbarToggleGroupProps<T>,
) {
  const {
    type = 'single',
    value,
    defaultValue,
    onValueChange,
    label,
    disabled: disabledProp,
    className,
    ...attrs
  } = props
  const bound = 'value' in props
  const [local, setLocal] = useState<T | undefined>(value)
  const model = bound ? value : local
  const toolbar = useToolbar()
  const disabled = toolbar.disabled || !!disabledProp

  function update(next: ToggleGroupValue) {
    if (Object.is(next, model)) return
    if (!bound) setLocal(next as T)
    onValueChange?.(next as T)
  }

  return (
    <ToolbarGroupContext value={disabled}>
      <PrimitiveToolbarToggleGroup
        value={model}
        defaultValue={defaultValue}
        type={type}
        disabled={disabled}
        orientation={toolbar.orientation}
        aria-label={label}
        className={cn(toolbarGroup({ orientation: toolbar.orientation }), className)}
        onValueChange={update}
        {...attrs}
      />
    </ToolbarGroupContext>
  )
}
