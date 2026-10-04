'use client'

import { createContext, useContext } from 'react'
import type { AvatarVariants } from './avatar.variants'

export interface AvatarGroupContext {
  size: AvatarVariants['size']
}

export const AvatarGroupContextValue = createContext<AvatarGroupContext | null>(null)

export function useAvatarGroup(): AvatarGroupContext | null {
  return useContext(AvatarGroupContextValue)
}
