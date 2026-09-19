import { nextTick, onScopeDispose, shallowRef, watch, type Ref } from 'vue'
import { clampWidth, resizeBoundary, resizeBounds, resizeWidths } from '../column-sizing'
import type { DataTableColumn, DataTableProps } from '../types'
import type { DataTableController, DataTableModels } from './useDataTable'

export function useTableResize<T extends object>(
  props: DataTableProps<T>,
  models: DataTableModels,
  ctl: DataTableController<T>,
  element: Ref<HTMLTableElement | undefined>,
  viewport: Ref<HTMLElement | undefined>,
  widths: Ref<Record<string, number>>,
  active: Ref<Record<string, number> | undefined>,
  available: Ref<number>,
  updateHandles: () => void,
) {
  const resizing = shallowRef<string>()
  const guide = shallowRef<{
    x: number
    y: number
    height: number
    columns: { key: string; label: string; width: number }[]
    labelX: number
  }>()
  let release: (() => void) | undefined
  const boundary = (column: DataTableColumn<T>) =>
    resizeBoundary(ctl.visibleColumns.value, column, props.resizeMode ?? 'fit')
  const affectedColumns = (column: DataTableColumn<T>) => {
    const edge = boundary(column)
    return edge?.neighbor
      ? edge.side === 'start'
        ? [edge.neighbor, column]
        : [column, edge.neighbor]
      : [column]
  }
  const resizeLabel = (column: DataTableColumn<T>) =>
    affectedColumns(column)
      .map(item => item.label)
      .join(' / ')
  const resizeValueText = (column: DataTableColumn<T>) =>
    affectedColumns(column)
      .map(item => `${item.label}: ${Math.round(widths.value[item.key]!)}px`)
      .join(' / ')
  const minimumTotalWidth = () => (props.resizeMode === 'expand' ? Math.max(0, available.value) : 0)
  const maximumWidth = (column: DataTableColumn<T>, source: Record<string, number>) => {
    if (!column.pin || boundary(column)?.neighbor?.pin) return Infinity
    const columns = ctl.visibleColumns.value
    const otherPinned = columns.reduce(
      (sum, item) => sum + (item.pin && item.key !== column.key ? source[item.key]! : 0),
      0,
    )
    const center = columns.some(item => !item.pin) ? 48 : 0
    return Math.max(source[column.key]!, available.value - otherPinned - center)
  }
  const bounds = (column: DataTableColumn<T>) =>
    resizeBounds(
      column,
      boundary(column)?.neighbor,
      widths.value,
      minimumTotalWidth(),
      maximumWidth(column, widths.value),
    )
  const canResize = (column: DataTableColumn<T>) => {
    if (!props.resizable || !boundary(column)) return false
    const range = bounds(column)
    return range.max - range.min > 0.01
  }
  function setWidth(key: string, value: number) {
    if (ctl.blocked.value || !Number.isFinite(value)) return
    const column = ctl.leaves.value.find(column => column.key === key)
    if (column)
      models.columnWidths.value = { ...models.columnWidths.value, [key]: clampWidth(column, value) }
  }
  function resize(column: DataTableColumn<T>, event: PointerEvent) {
    const edge = boundary(column)
    if (event.button !== 0 || ctl.blocked.value || !edge || !canResize(column)) return
    event.preventDefault()
    event.stopPropagation()
    release?.()
    const handle = event.currentTarget as HTMLElement
    const document = handle.ownerDocument
    const window = document.defaultView!
    const table = element.value!
    const cell = handle.closest('th')!
    const ratio =
      table.getBoundingClientRect().width / parseFloat(window.getComputedStyle(table).width) || 1
    const initial = { ...widths.value }
    table.querySelectorAll<HTMLElement>('thead [data-hn-column]').forEach(cell => {
      initial[cell.dataset.hnColumn!] = cell.getBoundingClientRect().width / ratio
    })
    active.value = initial
    const previous = models.columnWidths.value
    const direction = window.getComputedStyle(table).direction === 'rtl' ? -1 : 1
    const sign = direction * (edge.side === 'start' ? -1 : 1)
    const coordinate = (rect: DOMRect) => (sign === 1 ? rect.right : rect.left)
    const areaAnchor = () => {
      const box = viewport.value?.getBoundingClientRect()
      return box ? (direction === 1 ? box.left : box.right) : 0
    }
    const anchor = areaAnchor()
    let lastScroll = viewport.value?.scrollLeft ?? 0
    let scrollDelta = 0
    const trackScroll = () => {
      const area = viewport.value
      if (!area) return
      const range = Math.max(0, area.scrollWidth - area.clientWidth)
      const previous = Math.max(
        direction === 1 ? 0 : -range,
        Math.min(direction === 1 ? range : 0, lastScroll),
      )
      scrollDelta += area.scrollLeft - previous
      lastScroll = area.scrollLeft
    }
    const gesture = document.documentElement.dataset.hnTableGesture
    document.documentElement.dataset.hnTableGesture = 'resize'
    handle.setPointerCapture?.(event.pointerId)
    resizing.value = column.key
    let pointerX = event.clientX
    let changed = false
    let moved = false
    let frame = 0
    let stopped = false
    const updateGuide = async () => {
      if (stopped) return
      updateHandles()
      await nextTick()
      if (stopped) return
      const rect = cell.getBoundingClientRect()
      const area = viewport.value?.getBoundingClientRect()
      const box = table.getBoundingClientRect()
      if (!area) return
      const x = coordinate(handle.getBoundingClientRect())
      guide.value =
        x >= area.left - 1 && x <= area.right + 1
          ? {
              x,
              columns: affectedColumns(column).map(item => ({
                key: item.key,
                label: item.label,
                width: Math.round(widths.value[item.key]!),
              })),
              labelX: Math.max(8, Math.min(x - 90, window.innerWidth - 188)),
              y: Math.max(rect.top, area.top),
              height: Math.max(0, Math.min(box.bottom, area.bottom) - Math.max(rect.top, area.top)),
            }
          : undefined
    }
    const apply = () => {
      if (stopped) return
      if (moved) {
        trackScroll()
        const delta =
          pointerX - event.clientX + anchor - areaAnchor() + (column.pin ? 0 : scrollDelta)
        const desired = initial[column.key]! + (delta * sign) / ratio
        const changes = resizeWidths(
          column,
          edge.neighbor,
          initial,
          desired,
          minimumTotalWidth(),
          maximumWidth(column, initial),
        )
        if (
          Object.entries(changes).some(
            ([key, width]) => Math.abs(width - widths.value[key]!) > 0.01,
          )
        ) {
          changed = true
          active.value = { ...initial, ...changes }
          models.columnWidths.value =
            props.resizeMode === 'expand'
              ? { ...previous, ...active.value }
              : { ...previous, ...changes }
        }
      }
      void nextTick(updateGuide)
    }
    const schedule = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(apply)
    }
    const move = (next: PointerEvent) => {
      if (next.pointerId !== event.pointerId) return
      moved ||= Math.abs(next.clientX - event.clientX) > 0.5
      pointerX = next.clientX
      schedule()
    }
    const stop = (cancel = false) => {
      window.cancelAnimationFrame(frame)
      if (!cancel) apply()
      stopped = true
      if (cancel && changed) models.columnWidths.value = previous
      active.value = undefined
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', cancelPointer)
      window.removeEventListener('blur', cancelDrag)
      document.removeEventListener('keydown', keydown, true)
      document.removeEventListener('scroll', schedule, true)
      window.removeEventListener('resize', schedule)
      if (handle.hasPointerCapture?.(event.pointerId)) handle.releasePointerCapture(event.pointerId)
      if (gesture === undefined) delete document.documentElement.dataset.hnTableGesture
      else document.documentElement.dataset.hnTableGesture = gesture
      resizing.value = undefined
      guide.value = undefined
      release = undefined
    }
    const up = (next: PointerEvent) => {
      if (next.pointerId !== event.pointerId) return
      pointerX = next.clientX
      moved ||= Math.abs(next.clientX - event.clientX) > 0.5
      stop()
    }
    const cancelDrag = () => stop(true)
    const cancelPointer = (next: PointerEvent) => {
      if (next.pointerId === event.pointerId) cancelDrag()
    }
    const keydown = (next: KeyboardEvent) => {
      if (next.key === 'Escape') {
        next.preventDefault()
        next.stopPropagation()
        cancelDrag()
      }
    }
    release = cancelDrag
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', cancelPointer)
    window.addEventListener('blur', cancelDrag)
    document.addEventListener('keydown', keydown, true)
    document.addEventListener('scroll', schedule, true)
    window.addEventListener('resize', schedule)
    updateGuide()
  }
  function resizeKey(column: DataTableColumn<T>, event: KeyboardEvent) {
    if (
      ctl.blocked.value ||
      !canResize(column) ||
      !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)
    )
      return
    event.preventDefault()
    event.stopPropagation()
    const edge = boundary(column)!
    const direction = element.value && getComputedStyle(element.value).direction === 'rtl' ? -1 : 1
    const sign = direction * (edge.side === 'start' ? -1 : 1)
    const range = bounds(column)
    const value =
      event.key === 'Home'
        ? range.min
        : event.key === 'End'
          ? range.max
          : widths.value[column.key]! +
            (event.key === 'ArrowRight' ? 1 : -1) * sign * (event.shiftKey ? 10 : 1)
    const initial = widths.value
    const changes = resizeWidths(
      column,
      edge.neighbor,
      initial,
      value,
      minimumTotalWidth(),
      maximumWidth(column, initial),
    )
    if (Object.entries(changes).every(([key, width]) => Math.abs(width - initial[key]!) < 0.01))
      return
    models.columnWidths.value = {
      ...models.columnWidths.value,
      ...(props.resizeMode === 'expand' ? initial : {}),
      ...changes,
    }
  }
  watch(
    () => [
      ctl.blocked.value,
      props.resizeMode,
      ctl.visibleColumns.value
        .map(column =>
          [column.key, column.pin, column.minWidth, column.maxWidth, column.resizable].join(':'),
        )
        .join('|'),
    ],
    () => release?.(),
  )
  onScopeDispose(() => release?.())
  return {
    resizing,
    guide,
    boundary,
    bounds,
    canResize,
    resizeLabel,
    resizeValueText,
    resize,
    resizeKey,
    setWidth,
  }
}
