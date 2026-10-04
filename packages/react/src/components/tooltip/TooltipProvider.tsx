import type { ReactNode } from 'react'
import { TooltipProvider as PrimitiveTooltipProvider } from '../../primitives/tooltip'
import { TooltipProviderPresence } from './context'

export interface TooltipProviderProps {
  delayDuration?: number
  skipDelayDuration?: number
  children?: ReactNode
}

export function TooltipProvider({
  delayDuration = 150,
  skipDelayDuration = 300,
  children,
}: TooltipProviderProps) {
  return (
    <PrimitiveTooltipProvider delayDuration={delayDuration} skipDelayDuration={skipDelayDuration}>
      <TooltipProviderPresence value>{children}</TooltipProviderPresence>
    </PrimitiveTooltipProvider>
  )
}
