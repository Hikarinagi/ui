'use client'

import { useId, type HTMLAttributes, type ReactNode, type Ref } from 'react'
import { useControllableState } from 'radix-ui/internal'
import { cn } from '../../lib/cn'
import {
  ToggleGroupItem,
  ToggleGroupRoot,
  type ToggleGroupValue,
} from '../../primitives/toggle-group'
import { useFieldControl } from '../form-field/context'
import { Highlight } from '../highlight/Highlight'
import { Ripple } from '../ripple/Ripple'
import type { SelectOption } from '../select/types'
import {
  segmentedControl,
  segmentedItem,
  segmentedThumb,
  type SegmentedControlVariants,
  type SegmentedItemVariants,
} from './segmented-control.variants'

export interface SegmentedControlProps<T extends SelectOption = SelectOption> extends Omit<
  HTMLAttributes<HTMLElement>,
  'defaultValue' | 'onChange' | 'children' | 'dir'
> {
  options: T[]
  size?: SegmentedItemVariants['size']
  orientation?: SegmentedControlVariants['orientation']
  block?: boolean
  disabled?: boolean
  value?: string | number
  defaultValue?: string | number
  onValueChange?: (value: string | number) => void
  renderOption?: (props: { option: T }) => ReactNode
  dir?: 'ltr' | 'rtl'
  loop?: boolean
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function SegmentedControl<T extends SelectOption = SelectOption>({
  options,
  size,
  orientation = 'horizontal',
  block = false,
  disabled: disabledProp,
  value,
  defaultValue,
  onValueChange,
  renderOption,
  className,
  ...attrs
}: SegmentedControlProps<T>) {
  const [model, setModel] = useControllableState<string | number | undefined>({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange as ((value: string | number | undefined) => void) | undefined,
    caller: 'SegmentedControl',
  })
  const { labelledBy, disabled, describedBy } = useFieldControl({ disabled: disabledProp }, attrs)
  const highlightId = useId()
  const current = model ?? options.find(option => !option.disabled)?.value

  function select(next: ToggleGroupValue) {
    if (typeof next === 'string' || typeof next === 'number') setModel(next)
  }

  return (
    <ToggleGroupRoot
      type="single"
      value={current}
      disabled={disabled}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      orientation={orientation}
      data-hn-segmented-control=""
      data-disabled={disabled ? '' : undefined}
      onValueChange={select}
      {...attrs}
      className={cn(segmentedControl({ orientation, block }), className)}
    >
      {options.map(option => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          aria-label={renderOption ? option.label : undefined}
          className={segmentedItem({ size, block })}
        >
          {option.value === current && (
            <Highlight
              id={highlightId}
              axis={orientation === 'vertical' ? 'y' : 'x'}
              className={segmentedThumb()}
            />
          )}
          <Ripple />
          {renderOption ? renderOption({ option }) : option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroupRoot>
  )
}
