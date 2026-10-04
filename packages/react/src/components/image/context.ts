'use client'

import { createContext, useContext } from 'react'
import type { LightboxItem } from '../lightbox/types'

export interface ImageGroupContext {
  register: (id: string, item: () => LightboxItem) => void
  unregister: (id: string) => void
  open: (id: string) => void
}

export const ImageGroupContextValue = createContext<ImageGroupContext | null>(null)

export function useImageGroup(): ImageGroupContext | null {
  return useContext(ImageGroupContextValue)
}
