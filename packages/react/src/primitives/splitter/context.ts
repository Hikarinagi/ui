'use client'

import { createContext, useContext, type RefObject } from 'react'
import type {
  Direction,
  DragState,
  PanelConstraints,
  PanelData,
  ResizeEvent,
  ResizeHandler,
} from '../../../../shared/src/primitives/splitter/types'

export interface PanelGroupApi {
  getPanelStyle: (
    panelData: PanelData,
    defaultSize: number | undefined,
  ) => {
    flexBasis: number
    flexGrow: string
    flexShrink: number
    overflow: 'hidden'
    pointerEvents: 'none' | undefined
  }
  isPanelCollapsed: (panelData: PanelData) => boolean
  reevaluatePanelConstraints: (panelData: PanelData, prevConstraints: PanelConstraints) => void
  registerPanel: (panelData: PanelData) => void
  registerResizeHandle: (dragHandleId: string) => ResizeHandler
  resizePanel: (panelData: PanelData, size: number) => void
  startDragging: (dragHandleId: string, event: ResizeEvent) => void
  stopDragging: () => void
  unregisterPanel: (panelData: PanelData) => void
}

export interface PanelGroupContextValue {
  api: PanelGroupApi
  direction: Direction
  dragState: DragState | null
  groupId: string
  layout: number[]
  panelGroupElement: RefObject<HTMLElement | null>
  version: number
}

export const PanelGroupContext = createContext<PanelGroupContextValue | null>(null)

export function usePanelGroupContext(consumer: string) {
  const context = useContext(PanelGroupContext)
  if (context === null)
    throw new Error(`${consumer} components must be rendered within a SplitterGroup container`)
  return context
}
