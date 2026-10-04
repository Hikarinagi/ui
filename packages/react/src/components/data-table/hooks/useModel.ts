'use client'

import { useLayoutEffect, useRef, useState } from 'react'

export interface DataTableModel<V> {
  readonly value: V
  readonly controlled: boolean
  set: (value: V) => void
  adjust: (value: V) => void
}

export function useModel<V>(
  prop: V | undefined,
  initial: V | undefined,
  fallback: () => V,
  onChange: ((value: V) => void) | undefined,
): DataTableModel<V> {
  const controlled = prop !== undefined
  const [local, setLocal] = useState<V>(() => (initial === undefined ? fallback() : initial))
  const current = controlled ? prop : local
  const state = useRef({ value: current, controlled, onChange, pending: [] as V[] })
  state.current.value = current
  state.current.controlled = controlled
  state.current.onChange = onChange

  useLayoutEffect(() => {
    const pending = state.current.pending.splice(0)
    for (const value of pending) state.current.onChange?.(value)
  })

  const [model] = useState<DataTableModel<V>>(() => ({
    get value() {
      return state.current.value
    },
    get controlled() {
      return state.current.controlled
    },
    set(value: V) {
      if (Object.is(value, state.current.value)) return
      if (!state.current.controlled) {
        state.current.value = value
        setLocal(() => value)
      }
      state.current.onChange?.(value)
    },
    adjust(value: V) {
      if (Object.is(value, state.current.value)) return
      if (!state.current.controlled) {
        state.current.value = value
        setLocal(() => value)
      }
      state.current.pending.push(value)
    },
  }))
  return model
}
