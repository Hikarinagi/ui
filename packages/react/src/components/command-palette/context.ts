'use client'

import { createContext, useContext } from 'react'

export interface CommandPaletteContextValue {
  search: string
  setSearch: (search: string) => void
  label: string
  placeholder: string
  autoFocus: boolean | undefined
  setInput: (input: HTMLInputElement | null) => void
}

export const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null)

export function useCommandPaletteContext() {
  const context = useContext(CommandPaletteContext)
  if (!context) throw new Error('CommandPaletteInput must be used inside CommandPalette')
  return context
}
