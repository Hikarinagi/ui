'use client'

import { createContext, useContext } from 'react'
import type { PaginationState } from './types'

export interface PaginationContext {
  state: PaginationState
  blocked: boolean
  size: 'sm' | 'md' | 'lg'
  direction: 'ltr' | 'rtl'
  siblingCount: number
  showFirstLast: boolean
  options: Array<{ value: number; label: string }>
  update: (page: number) => void
  resize: (pageSize: number) => void
}

export const PaginationContext = createContext<PaginationContext | null>(null)

export function usePaginationContext() {
  const context = useContext(PaginationContext)
  if (!context) throw new Error('Pagination parts require a Pagination parent')
  return context
}
