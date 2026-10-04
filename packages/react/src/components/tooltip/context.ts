'use client'

import { createContext, useContext } from 'react'

export const TooltipProviderPresence = createContext(false)

export function useTooltipProviderPresence() {
  return useContext(TooltipProviderPresence)
}
