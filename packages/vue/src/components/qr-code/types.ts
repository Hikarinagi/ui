import type { QRCodeLevel } from '../../../../shared/src/lib/qr-code'
export type { QRCodeLevel }

export type QRCodeStatus = 'active' | 'loading' | 'expired' | 'scanned'
export type QRCodeState = QRCodeStatus | 'empty' | 'error'

export interface QRCodeProps {
  value: string
  label?: string
  size?: number
  level?: QRCodeLevel
  margin?: number
  color?: string
  background?: string
  bordered?: boolean
  logo?: string
  logoSize?: number
  logoMargin?: number
  status?: QRCodeStatus
  class?: string
}
export interface QRCodeStatusSlot {
  status: Exclude<QRCodeState, 'active'>
  error: Error | undefined
  refresh: () => void
}
export interface QRCodeExportOptions {
  type?: 'image/svg+xml' | 'image/png'
  scale?: number
}
export interface QRCodeExpose {
  element: HTMLElement | undefined
  svg: SVGSVGElement | undefined
  toBlob: (options?: QRCodeExportOptions) => Promise<Blob>
}
