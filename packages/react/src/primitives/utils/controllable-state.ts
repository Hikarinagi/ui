'use client'

import { useCallback, useEffect, useInsertionEffect, useRef, useState } from 'react'
import { devWarn } from '../../lib/dev'

type SetStateFn<T> = (previous: T) => T

export interface ControllableStateOptions<T> {
  prop?: T
  defaultProp: T
  onChange?: (value: T) => void
  caller?: string
}

function isFunction<T>(value: T | SetStateFn<T>): value is SetStateFn<T> {
  return typeof value === 'function'
}

function useUncontrolledState<T>({
  defaultProp,
  onChange,
}: Pick<ControllableStateOptions<T>, 'defaultProp' | 'onChange'>) {
  const [value, setValue] = useState(defaultProp)
  const previous = useRef(value)
  const onChangeRef = useRef(onChange)
  useInsertionEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])
  useEffect(() => {
    if (previous.current !== value) {
      onChangeRef.current?.(value)
      previous.current = value
    }
  }, [value])
  return [value, setValue, onChangeRef] as const
}

export function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
  caller,
}: ControllableStateOptions<T>) {
  const [uncontrolled, setUncontrolled, onChangeRef] = useUncontrolledState({
    defaultProp,
    onChange,
  })
  const controlled = prop !== undefined
  const value = controlled ? prop : uncontrolled
  const wasControlled = useRef(controlled)
  useEffect(() => {
    if (wasControlled.current !== controlled)
      devWarn(
        caller ?? 'useControllableState',
        `switched from ${wasControlled.current ? 'controlled' : 'uncontrolled'} to ${controlled ? 'controlled' : 'uncontrolled'}. Decide between a controlled and an uncontrolled value for the lifetime of the component.`,
      )
    wasControlled.current = controlled
  }, [controlled, caller])
  const setValue = useCallback(
    (next: T | SetStateFn<T>) => {
      if (controlled) {
        const resolved = isFunction(next) ? next(prop as T) : next
        if (resolved !== prop) onChangeRef.current?.(resolved)
      } else setUncontrolled(next)
    },
    [controlled, prop, setUncontrolled, onChangeRef],
  )
  return [value, setValue] as const
}
