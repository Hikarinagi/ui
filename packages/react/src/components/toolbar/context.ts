'use client'

import { createContext, useContext } from 'react'
import type { ToolbarOrientation, ToolbarSize } from './types'

interface ToolbarContextValue {
  orientation: ToolbarOrientation
  size: ToolbarSize
  disabled: boolean
}

export const ToolbarContext = createContext<ToolbarContextValue | null>(null)
export const ToolbarGroupContext = createContext<boolean | null>(null)

export function useToolbar() {
  const context = useContext(ToolbarContext)
  if (!context) throw new Error('[Hina UI] Toolbar controls must be inside Toolbar.')
  return context
}

export function useToolbarGroup() {
  return useContext(ToolbarGroupContext)
}
