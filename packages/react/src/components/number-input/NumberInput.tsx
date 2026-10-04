'use client'

import type { InputHTMLAttributes, Ref } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '../../lib/cn'
import { lucide } from '../../lib/icon'
import { useUiLocale } from '../../locale'
import {
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldRoot,
} from '../../primitives/number-field'
import { useFieldControl } from '../form-field/context'
import { useInputGroup } from '../input-group/context'
import {
  inputControl,
  inputEmbedded,
  textInputHost,
  type TextInputVariants,
} from '../input/input.variants'
import { numberInputStep, numberInputStepper } from './number-input.variants'

const ChevronUpIcon = lucide(ChevronUp)
const ChevronDownIcon = lucide(ChevronDown)

export interface NumberInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'value' | 'defaultValue' | 'disabled' | 'readOnly' | 'min' | 'max' | 'step'
> {
  value?: number | null
  defaultValue?: number
  onValueChange?: (value: number | undefined) => void
  min?: number
  max?: number
  step?: number
  stepSnapping?: boolean
  formatOptions?: Intl.NumberFormatOptions
  locale?: string
  controls?: boolean
  variant?: TextInputVariants['variant']
  size?: TextInputVariants['size']
  disabled?: boolean
  readonly?: boolean
  invalid?: boolean
  ref?: Ref<HTMLInputElement>
  [attribute: `data-${string}`]: string | undefined
}

export function NumberInput({
  value,
  defaultValue,
  onValueChange,
  min,
  max,
  step = 1,
  stepSnapping = true,
  formatOptions,
  locale,
  controls = true,
  variant,
  size: sizeProp,
  disabled: disabledProp,
  readonly,
  invalid: invalidProp,
  className,
  ...attrs
}: NumberInputProps) {
  const t = useUiLocale()
  const group = useInputGroup()
  const divided = (group ? group.variant : variant) !== 'bare'
  const size = group ? group.size : sizeProp
  const {
    id: fieldId,
    invalid,
    disabled,
    describedBy,
  } = useFieldControl(
    {
      invalid: invalidProp || !!group?.invalid,
      disabled: disabledProp || !!group?.disabled,
    },
    attrs,
  )

  return (
    <NumberFieldRoot
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      min={min}
      max={max}
      step={step}
      stepSnapping={stepSnapping}
      formatOptions={formatOptions}
      readonly={readonly}
      locale={locale ?? t.tag}
      disabled={disabled}
      data-hn-number-input=""
      data-invalid={invalid ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      className={cn(
        group ? inputEmbedded() : textInputHost({ variant, size: sizeProp }),
        className,
      )}
    >
      <NumberFieldInput
        {...attrs}
        id={fieldId}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className={cn(inputControl(), 'tabular-nums')}
      />
      {controls && (
        <div className={numberInputStepper({ size, divided })}>
          <NumberFieldIncrement aria-label={t.numberInput.increase} className={numberInputStep()}>
            <ChevronUpIcon />
          </NumberFieldIncrement>
          <NumberFieldDecrement
            aria-label={t.numberInput.decrease}
            className={numberInputStep({ divided })}
          >
            <ChevronDownIcon />
          </NumberFieldDecrement>
        </div>
      )}
    </NumberFieldRoot>
  )
}
