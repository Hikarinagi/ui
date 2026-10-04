'use client'

import { createContext, useContext } from 'react'
import { Primitive, type PrimitiveElementProps } from '../../lib/primitive'

const DEFAULT_MAX = 100

interface ProgressContextValue {
  value: number | null
  max: number
}

const ProgressContext = createContext<ProgressContextValue>({ value: null, max: DEFAULT_MAX })

function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}

function validMax(max: unknown): max is number {
  return isNumber(max) && !Number.isNaN(max) && max > 0
}

function validValue(value: unknown, max: number): value is number {
  return isNumber(value) && !Number.isNaN(value) && value <= max && value >= 0
}

function progressState(value: number | null, max: number) {
  return value == null ? 'indeterminate' : value === max ? 'complete' : 'loading'
}

export interface ProgressRootProps extends PrimitiveElementProps {
  value?: number | null
  max?: number
  getValueLabel?: (value: number, max: number) => string
}

export function ProgressRoot({
  value: valueProp = null,
  max: maxProp,
  getValueLabel = (value, max) => `${Math.round((value / max) * 100)}%`,
  ...props
}: ProgressRootProps) {
  const max = validMax(maxProp) ? maxProp : DEFAULT_MAX
  const value = validValue(valueProp, max) ? valueProp : null
  return (
    <ProgressContext value={{ value, max }}>
      <Primitive
        aria-valuemax={max}
        aria-valuemin={0}
        aria-valuenow={isNumber(value) ? value : undefined}
        aria-valuetext={isNumber(value) ? getValueLabel(value, max) : undefined}
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
