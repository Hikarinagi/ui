'use client'

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type HTMLAttributes,
  type Ref,
} from 'react'
import type { OverlayScrollbars } from 'overlayscrollbars'
import { cn } from '../../lib/cn'
import { useBodyPointerLock } from '../../lib/body-pointer-lock'
import { useUiLocale } from '../../locale'
import {
  blockWhenInert,
  redirectWheel,
  scrollAreaOptions,
  scrollEdges,
  type ScrollDirection,
  type ScrollEdges,
} from '../../../../shared/src/lib/scroll-area'
import { useOverlayScrollbars } from './hooks/useOverlayScrollbars'

export interface ScrollAreaHandle {
  viewport: HTMLElement | undefined
  instance: OverlayScrollbars | undefined
}

export interface ScrollAreaProps extends Omit<HTMLAttributes<HTMLDivElement>, 'dir'> {
  direction?: ScrollDirection
  dir?: 'ltr' | 'rtl' | 'auto'
  autoHide?: 'never' | 'scroll' | 'leave' | 'move'
  scrollbar?: boolean
  wheelRedirect?: boolean
  shadow?: boolean
  focusable?: boolean
  label?: string
  ref?: Ref<ScrollAreaHandle>
}

const NO_EDGES: ScrollEdges = { xStart: false, xEnd: false, yStart: false, yEnd: false }

function focusAttributes(enabled: boolean, focusable: boolean, label: string) {
  const on = enabled && focusable
  return {
    tabIndex: on ? 0 : undefined,
    role: on ? 'region' : undefined,
    'aria-label': on ? label : undefined,
  }
}

export function ScrollArea({
  direction = 'vertical',
  dir,
  autoHide = 'leave',
  scrollbar = true,
  wheelRedirect = true,
  shadow = true,
  focusable = false,
  label,
  className,
  children,
  ref,
  ...attrs
}: ScrollAreaProps) {
  const t = useUiLocale()
  const host = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState(NO_EDGES)
  const hostWasFocused = useRef(false)
  const regionLabel = label ?? t.scroll.regionLabel
  const settings = { direction, autoHide, scrollbar }
  const latest = useRef({ direction, shadow, wheelRedirect, focusable })
  latest.current = { direction, shadow, wheelRedirect, focusable }

  const viewportRef = useRef<HTMLElement | undefined>(undefined)
  const updateEdges = useCallback(() => {
    const next = scrollEdges(viewportRef.current, latest.current.direction, latest.current.shadow)
    setEdges(previous =>
      previous.xStart === next.xStart &&
      previous.xEnd === next.xEnd &&
      previous.yStart === next.yStart &&
      previous.yEnd === next.yEnd
        ? previous
        : next,
    )
  }, [])

  const {
    instance,
    viewport,
    instanceRef,
    viewportRef: handleViewport,
  } = useOverlayScrollbars(
    host,
    content,
    () => scrollAreaOptions(settings),
    { scroll: updateEdges, updated: updateEdges },
    () => {
      const target = host.current
      hostWasFocused.current = !!target && target.ownerDocument.activeElement === target
    },
    target => {
      const onWheel = (event: WheelEvent) => {
        if (event.defaultPrevented) return
        if (latest.current.direction !== 'horizontal' || !latest.current.wheelRedirect) return
        redirectWheel(target, event)
      }
      target.addEventListener('wheel', onWheel, { passive: false })
      return () => target.removeEventListener('wheel', onWheel)
    },
  )
  viewportRef.current = viewport

  useEffect(() => {
    updateEdges()
  }, [viewport, updateEdges])

  useEffect(() => {
    instance?.options(scrollAreaOptions(settings))
  }, [instance, direction, autoHide, scrollbar])

  useEffect(() => {
    const target = host.current
    if (!viewport || !target || !latest.current.focusable || !hostWasFocused.current) return
    hostWasFocused.current = false
    const active = target.ownerDocument.activeElement
    if (viewport.isConnected && (active === target || active === target.ownerDocument.body))
      viewport.focus({ preventScroll: true })
  }, [viewport])

  const locked = useBodyPointerLock()
  useEffect(() => {
    if (!viewport || !locked) return
    return blockWhenInert(viewport)
  }, [viewport, locked])

  useImperativeHandle(
    ref,
    () => ({
      get viewport() {
        return handleViewport.current
      },
      get instance() {
        return instanceRef.current
      },
    }),
    [handleViewport, instanceRef],
  )

  return (
    <div
      dir={dir}
      className={cn(
        'hn-scroll-area relative grid grid-cols-1 grid-rows-1 overflow-hidden',
        className,
      )}
    >
      <div
        ref={host}
        {...attrs}
        {...focusAttributes(!viewport, focusable, regionLabel)}
        data-overlayscrollbars-initialize=""
        className="min-h-0 w-full"
      >
        <div
          ref={content}
          {...focusAttributes(!!viewport, focusable, regionLabel)}
          data-overlayscrollbars-contents=""
        >
          {children}
        </div>
      </div>
      {shadow && (
        <>
          {direction !== 'vertical' && (
            <div
              className="hn-scroll-shadow"
              data-side="x-start"
              data-visible={edges.xStart ? '' : undefined}
              aria-hidden="true"
            />
          )}
          {direction !== 'vertical' && (
            <div
              className="hn-scroll-shadow"
              data-side="x-end"
              data-visible={edges.xEnd ? '' : undefined}
              aria-hidden="true"
            />
          )}
          {direction !== 'horizontal' && (
            <div
              className="hn-scroll-shadow"
              data-side="y-start"
              data-visible={edges.yStart ? '' : undefined}
              aria-hidden="true"
            />
          )}
          {direction !== 'horizontal' && (
            <div
              className="hn-scroll-shadow"
              data-side="y-end"
              data-visible={edges.yEnd ? '' : undefined}
              aria-hidden="true"
            />
          )}
        </>
      )}
    </div>
  )
}
