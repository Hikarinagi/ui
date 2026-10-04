'use client'

import { Check, CircleAlert, QrCode, RefreshCw } from 'lucide-react'
import {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type SyntheticEvent,
} from 'react'
import { qrCodeGeometry, qrCodeSize, type QRCodeGeometry } from '../../../../shared/src/lib/qr-code'
import { exportQRCode } from '../../../../shared/src/lib/qr-code-export'
import { cn } from '../../lib/cn'
import { lucide } from '../../lib/icon'
import { useUiLocale } from '../../locale'
import { Button } from '../button/Button'
import { Spinner } from '../spinner/Spinner'
import { qrCode, qrCodeSvg, qrCodeStatus } from './qr-code.variants'
import type { QRCodeExportOptions, QRCodeProps, QRCodeState } from './types'

const CheckIcon = lucide(Check)
const CircleAlertIcon = lucide(CircleAlert)
const QrCodeIcon = lucide(QrCode)
const RefreshCwIcon = lucide(RefreshCw)

interface QRCodeResult {
  geometry?: QRCodeGeometry
  error?: Error
}

export function QRCode({
  value,
  label,
  size: requestedSize = 192,
  level,
  margin = 4,
  color,
  background,
  bordered = true,
  logo,
  logoSize = 32,
  logoMargin = 2,
  status = 'active',
  renderStatus,
  onRefresh,
  onError,
  onLogoError,
  className,
  style,
  ref,
  ...attrs
}: QRCodeProps) {
  const t = useUiLocale()
  const element = useRef<HTMLDivElement>(null)
  const svg = useRef<SVGSVGElement>(null)
  const [logoState, setLogoState] = useState({ logo, failed: false })
  let logoFailed = logoState.failed
  if (logoState.logo !== logo) {
    setLogoState({ logo, failed: false })
    logoFailed = false
  }

  const size = qrCodeSize(requestedSize)
  const result = useMemo<QRCodeResult>(() => {
    if (!value) return {}
    try {
      return { geometry: qrCodeGeometry(value, level ?? (logo ? 'H' : 'M'), margin) }
    } catch (error) {
      return { error: error instanceof Error ? error : new Error(String(error)) }
    }
  }, [value, level, level ?? logo, margin])

  const state: QRCodeState =
    status !== 'active' ? status : result.error ? 'error' : result.geometry ? 'active' : 'empty'
  const inactive = state === 'active' ? 'empty' : state

  const callbacks = useRef({ onRefresh, onError, onLogoError })
  callbacks.current = { onRefresh, onError, onLogoError }
  const latest = useRef({ state, size })
  latest.current = { state, size }

  useEffect(() => {
    if (result.error) callbacks.current.onError?.(result.error)
  }, [result.error])

  const refresh = () => callbacks.current.onRefresh?.()

  function handleLogoError(event: SyntheticEvent<SVGImageElement>) {
    setLogoState(current => ({ ...current, failed: true }))
    callbacks.current.onLogoError?.(event.nativeEvent)
  }

  let box: { side: number; gap: number; start: number } | undefined
  if (logo && !logoFailed && result.geometry) {
    const dimension = result.geometry.size
    const pixels = Number.isFinite(logoSize) ? Math.max(0, logoSize) : 32
    if (pixels) {
      const padding = Number.isFinite(logoMargin) ? Math.max(0, logoMargin) : 2
      const side = Math.min((pixels / size) * dimension, dimension / 4)
      const gap = Math.min((padding / size) * dimension, dimension / 32)
      box = { side, gap, start: (dimension - side) / 2 }
    }
  }

  useImperativeHandle(
    ref,
    () => ({
      get element() {
        return element.current ?? undefined
      },
      get svg() {
        return svg.current ?? undefined
      },
      async toBlob(options?: QRCodeExportOptions) {
        if (latest.current.state !== 'active' || !svg.current)
          throw new Error('No active QR code to export')
        return exportQRCode(svg.current, latest.current.size, options)
      },
    }),
    [],
  )

  return (
    <div
      ref={element}
      data-hn-qr-code=""
      data-state={state}
      aria-busy={state === 'loading' || undefined}
      {...attrs}
      className={cn(qrCode({ bordered }), className)}
      style={
        {
          '--hn-qr-size': `${size}px`,
          '--hn-qr-foreground': color,
          '--hn-qr-background': background,
          ...style,
        } as CSSProperties
      }
    >
      {state === 'active' && result.geometry ? (
        <svg
          ref={svg}
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox={`0 0 ${result.geometry.size} ${result.geometry.size}`}
          role="img"
          aria-label={label ?? t.qrCode.label}
          className={qrCodeSvg()}
          shapeRendering="crispEdges"
        >
          <rect width="100%" height="100%" fill="var(--hn-qr-background)" />
          <path d={result.geometry.path} fill="var(--hn-qr-foreground)" />
          {box ? (
            <>
              <rect
                x={box.start - box.gap}
                y={box.start - box.gap}
                width={box.side + box.gap * 2}
                height={box.side + box.gap * 2}
                fill="var(--hn-qr-background)"
              />
              <image
                href={logo}
                x={box.start}
                y={box.start}
                width={box.side}
                height={box.side}
                preserveAspectRatio="xMidYMid meet"
                aria-hidden="true"
                onError={handleLogoError}
              />
            </>
          ) : null}
        </svg>
      ) : (
        <div className={qrCodeStatus()} role="status" aria-live="polite">
          {renderStatus ? (
            renderStatus({ status: inactive, error: result.error, refresh })
          ) : (
            <>
              {state === 'loading' ? (
                <Spinner size="sm" aria-hidden="true" />
              ) : state === 'scanned' ? (
                <CheckIcon className="text-success size-6" aria-hidden="true" />
              ) : state === 'error' ? (
                <CircleAlertIcon className="size-6" aria-hidden="true" />
              ) : (
                <QrCodeIcon className="size-6" aria-hidden="true" />
              )}
              <span>{inactive === 'loading' ? t.common.loading : t.qrCode[inactive]}</span>
              {state === 'expired' ? (
                <Button
                  size="sm"
                  variant="outline"
                  tone="neutral"
                  icon={<RefreshCwIcon />}
                  onClick={refresh}
                >
                  {t.qrCode.refresh}
                </Button>
              ) : null}
            </>
          )}
        </div>
      )}
    </div>
  )
}
