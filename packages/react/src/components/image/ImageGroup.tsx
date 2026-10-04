'use client'

import type { ReactNode } from 'react'
import { Lightbox } from '../lightbox/Lightbox'
import { useImageGroupState } from './hooks/useImageGroupState'
import { ImageGroupContextValue } from './context'

export interface ImageGroupProps {
  loop?: boolean
  children?: ReactNode
}

export function ImageGroup({ loop, children }: ImageGroupProps) {
  const { items, open, setOpen, index, setIndex, context } = useImageGroupState()

  return (
    <ImageGroupContextValue value={context}>
      {children}
      <Lightbox
        open={open}
        onOpenChange={setOpen}
        index={index}
        onIndexChange={setIndex}
        items={items}
        loop={loop}
      />
    </ImageGroupContextValue>
  )
}
