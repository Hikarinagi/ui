'use client'

import { Download, RotateCw, Scan, Shrink, ZoomIn, ZoomOut } from 'lucide-react'
import { lucide } from '../../lib/icon'
import { useUiLocale } from '../../locale'
import { IconButton } from '../icon-button/IconButton'
import { LightboxThumbs } from './LightboxThumbs'
import type { LightboxItem } from './types'

const ZoomOutIcon = lucide(ZoomOut)
const ZoomInIcon = lucide(ZoomIn)
const ScanIcon = lucide(Scan)
const ShrinkIcon = lucide(Shrink)
const RotateCwIcon = lucide(RotateCw)
const DownloadIcon = lucide(Download)

export interface LightboxToolbarProps {
  items: LightboxItem[]
  index: number
  zoomed: boolean
  canZoomIn: boolean
  atOriginal: boolean
  onSelect?: (index: number) => void
  onZoomIn?: () => void
  onZoomOut?: () => void
  onReset?: () => void
  onOriginal?: () => void
  onRotate?: () => void
  onDownload?: () => void
}

export function LightboxToolbar(props: LightboxToolbarProps) {
  const t = useUiLocale()
  return (
    <div className="flex flex-col items-center gap-1 pb-[max(--spacing(3),env(safe-area-inset-bottom))]">
      {props.items.length > 1 && (
        <LightboxThumbs
          items={props.items}
          index={props.index}
          onSelect={index => props.onSelect?.(index)}
        />
      )}
      <div className="flex items-center gap-1">
        <IconButton
          label={t.lightbox.zoomOut}
          disabled={!props.zoomed}
          variant="soft"
          pill
          className="hidden pointer-fine:inline-flex"
          onClick={() => props.onZoomOut?.()}
        >
          <ZoomOutIcon />
        </IconButton>
        <IconButton
          label={t.lightbox.zoomIn}
          disabled={!props.canZoomIn}
          variant="soft"
          pill
          className="hidden pointer-fine:inline-flex"
          onClick={() => props.onZoomIn?.()}
        >
          <ZoomInIcon />
        </IconButton>
        <IconButton
          label={t.lightbox.actualSize}
          variant="soft"
          pill
          disabled={props.atOriginal}
          onClick={() => props.onOriginal?.()}
        >
          <ScanIcon />
        </IconButton>
        <IconButton
          label={t.lightbox.resetZoom}
          variant="soft"
          pill
          disabled={!props.zoomed}
          className="hidden pointer-fine:inline-flex"
          onClick={() => props.onReset?.()}
        >
          <ShrinkIcon />
        </IconButton>
        <IconButton
          label={t.lightbox.rotate}
          variant="soft"
          pill
          onClick={() => props.onRotate?.()}
        >
          <RotateCwIcon />
        </IconButton>
        <IconButton
          label={t.lightbox.download}
          variant="soft"
          pill
          onClick={() => props.onDownload?.()}
        >
          <DownloadIcon />
        </IconButton>
      </div>
    </div>
  )
}
