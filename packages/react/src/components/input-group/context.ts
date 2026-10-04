'use client'

import { createContext, createElement, useContext, type ReactNode } from 'react'
import type { InputVariants, TextInputVariants } from '../input/input.variants'

export interface InputGroupContext {
  variant?: TextInputVariants['variant']
  size: InputVariants['size']
  disabled: boolean
  invalid: boolean
}

const InputGroupReactContext = createContext<InputGroupContext | null>(null)

export function InputGroupProvider({
  value,
  children,
}: {
  value: InputGroupContext
  children?: ReactNode
}) {
  return createElement(InputGroupReactContext, { value }, children)
}

export function useInputGroup() {
  return useContext(InputGroupReactContext)
}
