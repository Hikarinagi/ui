'use client'

import type { HTMLAttributes, ReactNode, Ref } from 'react'
import { cn } from '../../lib/cn'
import { Transition } from '../../lib/transition/Transition'
import { RadioGroupItem, RadioGroupRoot } from '../../primitives/radio-group'
import { useFieldControl } from '../form-field/context'
import {
  checkbox,
  checkboxBox,
  checkboxControl,
  checkboxDescription,
  checkboxTitle,
  checkboxTitleText,
  type CheckboxVariants,
} from '../checkbox/checkbox.variants'
import {
  checkboxGroup,
  checkboxGroupItem,
  type CheckboxGroupVariants,
} from '../checkbox-group/checkbox-group.variants'
import type { SelectOption } from '../select/types'
import { radioDot } from './radio-group.variants'
import { useControllableState } from '../../primitives/utils/controllable-state'

export interface RadioGroupProps<T extends SelectOption = SelectOption> extends Omit<
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
  value?: string | number | null
  defaultValue?: string | number | null
  onValueChange?: (value: string | number | null | undefined) => void
  renderOption?: (props: { option: T }) => ReactNode
  dir?: 'ltr' | 'rtl'
  loop?: boolean
  name?: string
  required?: boolean
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function RadioGroup<T extends SelectOption = SelectOption>({
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
}: RadioGroupProps<T>) {
  const [model, setModel] = useControllableState<string | number | null | undefined>({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange,
    caller: 'RadioGroup',
  })
  const { labelledBy, invalid, disabled, describedBy } = useFieldControl(
    { invalid: invalidProp, disabled: disabledProp },
    attrs,
  )

  return (
    <RadioGroupRoot
      value={model}
      onValueChange={next => setModel(next as string | number | null | undefined)}
      disabled={disabled}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      data-hn-radio-group=""
      {...attrs}
      className={cn(checkboxGroup({ orientation, block }), className)}
    >
      {options.map(option => (
        <label
          key={option.value}
          data-hn-radio=""
          data-hn-state-group=""
          data-disabled={disabled || option.disabled ? '' : undefined}
          className={cn(
            checkbox({ size, controlPlacement, block }),
            checkboxGroupItem({ orientation, block }),
          )}
        >
          <RadioGroupItem
            value={option.value}
            disabled={option.disabled}
            aria-invalid={invalid || undefined}
            data-invalid={invalid ? '' : undefined}
            className={cn(
              checkboxBox({ shape: 'round', size }),
              checkboxControl({ controlPlacement }),
            )}
          >
            {({ checked }) => (
              <Transition
                show={checked}
                enterActiveClass="hn-transition-press"
                enterFromClass="scale-50 opacity-0"
                leaveActiveClass="hn-transition"
                leaveToClass="scale-50 opacity-0"
              >
                <span className={radioDot()} />
              </Transition>
            )}
          </RadioGroupItem>
          <span className={checkboxTitle({ controlPlacement })}>
            <span className={checkboxTitleText()}>
              {renderOption ? renderOption({ option }) : option.label}
            </span>
          </span>
          {option.description && (
            <span className={checkboxDescription({ size, controlPlacement })}>
              {option.description}
            </span>
          )}
        </label>
      ))}
    </RadioGroupRoot>
  )
}
