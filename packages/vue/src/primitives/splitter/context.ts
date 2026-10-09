import type { Ref } from 'vue'
import type {
  Direction,
  DragState,
  PanelConstraints,
  PanelData,
  ResizeEvent,
  ResizeHandler,
} from '../../../../shared/src/primitives/splitter/types'
import { createContext } from '../utils/createContext'

export interface PanelGroupContext {
  direction: Ref<Direction>
  dragState: DragState | null
  groupId: string
  reevaluatePanelConstraints: (panelData: PanelData, prevConstraints: PanelConstraints) => void
  registerPanel: (panelData: PanelData) => void
  registerResizeHandle: (dragHandleId: string) => ResizeHandler
  resizePanel: (panelData: PanelData, size: number) => void
  startDragging: (dragHandleId: string, event: ResizeEvent) => void
  stopDragging: () => void
  unregisterPanel: (panelData: PanelData) => void
  panelGroupElement: Ref<ParentNode | null | undefined>
  collapsePanel: (panelData: PanelData) => void
  expandPanel: (panelData: PanelData) => void
  isPanelCollapsed: (panelData: PanelData) => boolean
  isPanelExpanded: (panelData: PanelData) => boolean
  getPanelSize: (panelData: PanelData) => number
  getPanelStyle: (panelData: PanelData, defaultSize: number | undefined) => Record<string, unknown>
}

export const [injectPanelGroupContext, providePanelGroupContext] =
  createContext<PanelGroupContext>('PanelGroup')
