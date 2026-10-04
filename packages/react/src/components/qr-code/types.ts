import type { HTMLAttributes, ReactNode, Ref } from 'react'
import type { QRCodeLevel } from '../../../../shared/src/lib/qr-code'
import type { QRCodeExportOptions } from '../../../../shared/src/lib/qr-code-export'
export type { QRCodeLevel, QRCodeExportOptions }

export type QRCodeStatus = 'active' | 'loading' | 'expired' | 'scanned'
export type QRCodeState = QRCodeStatus | 'empty' | 'error'

export interface QRCodeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onError'> {
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
  renderStatus?: (props: QRCodeStatusSlot) => ReactNode
  onRefresh?: () => void
  onError?: (error: Error) => void
  onLogoError?: (event: Event) => void
  ref?: Ref<QRCodeExpose>
  [attribute: `data-${string}`]: string | undefined
}
export interface QRCodeStatusSlot {
  status: Exclude<QRCodeState, 'active'>
  error: Error | undefined
  refresh: () => void
}
export interface QRCodeExpose {
  element: HTMLElement | undefined
  svg: SVGSVGElement | undefined
  toBlob: (options?: QRCodeExportOptions) => Promise<Blob>
}
