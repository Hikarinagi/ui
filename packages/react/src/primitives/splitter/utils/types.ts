export type Direction = 'horizontal' | 'vertical'
export type SizeUnit = '%' | 'px'

export interface PanelConstraints {
  collapsedSize?: number
  collapsible?: boolean
  defaultSize?: number
  maxSize?: number
  minSize?: number
  sizeUnit?: SizeUnit
}

export interface PanelCallbacks {
  onCollapse?: () => void
  onExpand?: () => void
  onResize?: (size: number, prevSize: number | undefined) => void
}

export interface PanelData {
  callbacks: PanelCallbacks
  constraints: PanelConstraints
  id: string
  idIsFromProps: boolean
  order: number | undefined
}

export interface DragState {
  dragHandleId: string
  dragHandleRect: DOMRect
  initialCursorPosition: number
  initialLayout: number[]
}

export type ResizeEvent = KeyboardEvent | MouseEvent | TouchEvent
export type ResizeHandler = (event: ResizeEvent) => void
export type ResizeHandlerAction = 'down' | 'move' | 'up'
export type ResizeHandlerState = 'drag' | 'hover' | 'inactive'
export type SetResizeHandlerState = (
  action: ResizeHandlerAction,
  isActive: boolean,
  event: ResizeEvent,
) => void
export type PointerHitAreaMargins = { coarse: number; fine: number }

export interface PanelGroupStorage {
  getItem: (name: string) => string | null
  setItem: (name: string, value: string) => void
}
