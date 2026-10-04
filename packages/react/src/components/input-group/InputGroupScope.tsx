'use client'

import { useMemo, type ReactNode } from 'react'
import type { InputVariants } from '../input/input.variants'
import { InputGroupProvider, type InputGroupContext } from './context'

export interface InputGroupScopeProps {
  size?: InputVariants['size']
  disabled?: boolean
  invalid?: boolean
  children?: ReactNode
}

export function InputGroupScope({ size, disabled, invalid, children }: InputGroupScopeProps) {
  const value = useMemo<InputGroupContext>(
    () => ({ size, disabled: !!disabled, invalid: !!invalid }),
    [size, disabled, invalid],
  )
  return <InputGroupProvider value={value}>{children}</InputGroupProvider>
}
