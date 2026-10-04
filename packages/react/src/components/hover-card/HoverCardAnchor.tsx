'use client'

import type { ReactNode } from 'react'
import type {
  OverlayAnchor,
  OverlayPositionStrategy,
  OverlayReference,
} from '../../lib/overlay-anchor'
import { useHoverCardAnchor } from './hooks/useHoverCardAnchor'

export interface HoverCardAnchorSlotProps {
  reference: OverlayReference | undefined
  contentRef: (element: HTMLElement | null) => void
  present: boolean
}

export interface HoverCardAnchorProps {
  anchor?: OverlayAnchor | null
  updatePositionStrategy: OverlayPositionStrategy
  external: boolean
  closeDelay: number
  positionerClass?: string
  children: (props: HoverCardAnchorSlotProps) => ReactNode
}

export function HoverCardAnchor({ children, ...props }: HoverCardAnchorProps) {
  const { reference, contentRef, present } = useHoverCardAnchor(props)
  return children({ reference, contentRef, present })
}
