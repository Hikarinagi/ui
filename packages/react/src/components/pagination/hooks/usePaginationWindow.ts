'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { flushSync } from 'react-dom'
import { useRenderTick } from '../../../lib/virtual/useRenderTick'
import type { ScrollAreaHandle } from '../../scroll-area/ScrollArea'
import type { PaginationEllipsisController } from './usePaginationEllipsis'

export function usePaginationWindow(controller: PaginationEllipsisController, present: boolean) {
  const scroll = useRef<ScrollAreaHandle>(null)
  const [rowsHost, setRowsHost] = useState<HTMLElement | null>(null)
  const [viewport, setViewport] = useState<HTMLElement>()
  const [top, setTop] = useState(0)
  const [height, setHeight] = useState(224)
  const [rowHeight, setRowHeight] = useState(36)
  const [rowGap, setRowGap] = useState(0)
  const rowStep = rowHeight + rowGap
  const [activePage, setActivePage] = useState(1)
  const range = controller.displayRange
  const count = range ? range.to - range.from + 1 : 0
  const extent = Math.max(0, count * rowStep - rowGap)
  const tick = useRenderTick()
  const rows = useMemo(() => {
    if (!range) return []
    const start = Math.max(0, Math.floor(top / rowStep) - 3)
    const end = Math.min(count, start + Math.ceil(height / rowStep) + 7)
    const values = Array.from(
      { length: Math.max(0, end - start) },
      (_, i) => start + i + range.from,
    )
    if (activePage >= range.from && activePage <= range.to && !values.includes(activePage))
      values.push(activePage)
    return values.map(page => ({ page, top: (page - range.from) * rowStep }))
  }, [range, top, rowStep, count, height, activePage])

  const latest = useRef({
    controller,
    range,
    viewport,
    rowsHost,
    rowStep,
    rowHeight,
    activePage,
    height,
  })
  latest.current = { controller, range, viewport, rowsHost, rowStep, rowHeight, activePage, height }

  useEffect(() => {
    if (!present) return
    let frame = requestAnimationFrame(function check() {
      const element = scroll.current?.viewport
      if (element) flushSync(() => setViewport(element))
      else frame = requestAnimationFrame(check)
    })
    return () => {
      cancelAnimationFrame(frame)
      setViewport(undefined)
    }
  }, [present])

  function measure() {
    const { viewport, rowsHost } = latest.current
    if (viewport) setHeight(viewport.clientHeight || 224)
    const button = rowsHost?.querySelector<HTMLElement>('[data-hn-pagination-choice]')
    if (button) {
      setRowHeight(button.offsetHeight)
      setRowGap(Number.parseFloat(getComputedStyle(rowsHost!).rowGap) || 0)
    }
  }

  async function focusPage(page: number) {
    const { controller, range, viewport, rowStep, rowHeight } = latest.current
    if (!range || !controller.open) return
    const next = Math.min(range.to, Math.max(range.from, page))
    setActivePage(next)
    latest.current.activePage = next
    if (viewport) {
      const offset = (next - range.from) * rowStep
      if (offset < viewport.scrollTop) viewport.scrollTop = offset
      else if (offset + rowHeight > viewport.scrollTop + viewport.clientHeight)
        viewport.scrollTop = offset + rowHeight - viewport.clientHeight
      setTop(viewport.scrollTop)
    }
    await tick()
    latest.current.rowsHost
      ?.querySelector<HTMLElement>('[data-hn-pagination-choice="' + next + '"]')
      ?.focus({ preventScroll: true })
  }

  function keydown(event: KeyboardEvent) {
    const { range, activePage, height, rowStep } = latest.current
    if (!range) return
    const step = Math.max(1, Math.floor(height / rowStep))
    const targets: Record<string, number> = {
      ArrowDown: activePage + 1,
      ArrowUp: activePage - 1,
      Home: range.from,
      End: range.to,
      PageDown: activePage + step,
      PageUp: activePage - step,
    }
    const target = targets[event.key]
    if (target === undefined) return
    event.preventDefault()
    event.stopPropagation()
    void focusPage(target)
  }

  const open = controller.open
  useLayoutEffect(() => {
    if (!open || !range) return
    setActivePage(range.from)
    latest.current.activePage = range.from
    setTop(0)
    if (latest.current.viewport) latest.current.viewport.scrollTop = 0
  }, [range, open])

  const request = controller.focusRequest
  useEffect(() => {
    if (!request || !viewport || !latest.current.range) return
    void (async () => {
      await tick()
      measure()
      const { range } = latest.current
      if (range) await focusPage(request.edge === 'first' ? range.from : range.to)
      latest.current.controller.clearFocusRequest()
    })()
  }, [request, viewport])

  useEffect(() => {
    const button = rowsHost?.querySelector<HTMLElement>('[data-hn-pagination-choice]')
    const targets = [button, rowsHost, viewport].filter(
      (element): element is HTMLElement => !!element,
    )
    if (!targets.length) return
    const observer = new ResizeObserver(measure)
    for (const element of targets) observer.observe(element)
    return () => observer.disconnect()
  }, [rowsHost, viewport])

  useEffect(() => {
    if (!viewport) return
    const onScroll = () => setTop(viewport.scrollTop)
    viewport.addEventListener('scroll', onScroll, { passive: true })
    return () => viewport.removeEventListener('scroll', onScroll)
  }, [viewport])

  return { scroll, setRowsHost, activePage, setActivePage, extent, rows, keydown }
}
