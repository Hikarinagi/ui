'use client'

import type { HTMLAttributes, ReactNode, Ref } from 'react'
import { useControllableState } from 'radix-ui/internal'
import { cn } from '../../lib/cn'
import { CheckboxGroupRoot } from '../../primitives/checkbox'
import { FormFieldShield, useFieldControl } from '../form-field/context'
import { Checkbox } from '../checkbox/Checkbox'
import type { CheckboxVariants } from '../checkbox/checkbox.variants'
import type { SelectOption } from '../select/types'
import {
  checkboxGroup,
  checkboxGroupItem,
  type CheckboxGroupVariants,
} from './checkbox-group.variants'

export interface CheckboxGroupProps<T extends SelectOption = SelectOption> extends Omit<
  HTMLAttributes<HTMLElement>,
  'defaultValue' | 'onChange' | 'children' | 'dir'
> {
  options: T[]
  orientation?: CheckboxGroupVariants['orientation']
  size?: CheckboxVariants['size']
  controlPlacement?: CheckboxVariants['controlPlacement']
  block?: boolean
  disabled?: boolean
  invalid?: boolean
  value?: Array<string | number>
  defaultValue?: Array<string | number>
  onValueChange?: (value: Array<string | number>) => void
  renderOption?: (props: { option: T }) => ReactNode
  dir?: 'ltr' | 'rtl'
  name?: string
  required?: boolean
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function CheckboxGroup<T extends SelectOption = SelectOption>({
  options,
  orientation,
  size,
  controlPlacement,
  block,
  disabled: disabledProp,
  invalid: invalidProp,
  value,
  defaultValue,
  onValueChange,
  renderOption,
  className,
  ...attrs
}: CheckboxGroupProps<T>) {
  const [model = [], setModel] = useControllableState<Array<string | number>>({
    prop: value,
    defaultProp: defaultValue ?? [],
    onChange: onValueChange,
    caller: 'CheckboxGroup',
  })
  const { labelledBy, invalid, disabled, describedBy } = useFieldControl(
    { invalid: invalidProp, disabled: disabledProp },
    attrs,
  )

  return (
    <CheckboxGroupRoot
      value={model}
      onValueChange={next => setModel(next as Array<string | number>)}
      disabled={disabled}
      rovingFocus={false}
      role="group"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      data-hn-checkbox-group=""
      data-orientation={orientation ?? 'vertical'}
      data-disabled={disabled ? '' : undefined}
      {...attrs}
      className={cn(checkboxGroup({ orientation, block }), className)}
    >
      <FormFieldShield>
        {options.map(option => (
          <Checkbox
            key={option.value}
            value={option.value}
            size={size}
            controlPlacement={controlPlacement}
            block={block}
            className={checkboxGroupItem({ orientation, block })}
            disabled={disabled || option.disabled}
            invalid={invalid}
            description={option.description}
          >
            {renderOption ? renderOption({ option }) : option.label}
          </Checkbox>
        ))}
      </FormFieldShield>
    </CheckboxGroupRoot>
  )
}
