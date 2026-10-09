'use client'

import { createContext, useContext } from 'react'
import {
  DEFAULT_PROGRESS_MAX,
  defaultProgressLabel,
  isNumber,
  isValidProgressMax,
  isValidProgressValue,
  progressState,
} from '../../../../shared/src/primitives/progress'
import { Primitive, type PrimitiveElementProps } from '../../lib/primitive'

interface ProgressContextValue {
  value: number | null
  max: number
}

const ProgressContext = createContext<ProgressContextValue>({
  value: null,
  max: DEFAULT_PROGRESS_MAX,
})

export interface ProgressRootProps extends PrimitiveElementProps {
  value?: number | null
  max?: number
  getValueLabel?: (value: number | null, max: number) => string | undefined
  getValueText?: (value: number | null, max: number) => string | undefined
}

export function ProgressRoot({
  value: valueProp = null,
  max: maxProp,
  getValueLabel = defaultProgressLabel,
  getValueText,
  ...props
}: ProgressRootProps) {
  const max = isValidProgressMax(maxProp) ? maxProp : DEFAULT_PROGRESS_MAX
  const value = isValidProgressValue(valueProp, max) ? (valueProp ?? null) : null
  return (
    <ProgressContext value={{ value, max }}>
      <Primitive
        aria-valuemax={max}
        aria-valuemin={0}
        aria-valuenow={isNumber(value) ? value : undefined}
        aria-valuetext={getValueText?.(value, max)}
        aria-label={getValueLabel(value, max)}
        role="progressbar"
        data-state={progressState(value, max)}
        data-value={value ?? undefined}
        data-max={max}
        {...props}
      />
    </ProgressContext>
  )
}

export function ProgressIndicator(props: PrimitiveElementProps) {
  const { value, max } = useContext(ProgressContext)
  return (
    <Primitive
      data-state={progressState(value, max)}
      data-value={value ?? undefined}
      data-max={max}
      {...props}
    />
  )
}
