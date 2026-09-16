import { computed, nextTick, onScopeDispose, shallowRef, type Ref, type CSSProperties } from 'vue'
import { rowId } from '../utils'
import type { DataTableKey, DataTableProps, DataTableReorder } from '../types'
import type { DataTableController, DataTableModels } from './useDataTable'

export function useTableDrag<T extends object>(
  props: DataTableProps<T>,
  models: DataTableModels,
  ctl: DataTableController<T>,
  element: Ref<HTMLTableElement | undefined>,
  viewport: Ref<HTMLElement | undefined>,
  onReorder: (change: DataTableReorder<T>) => void,
) {
  const dragging = shallowRef<{
    kind: 'row' | 'column'
    key: string
    target?: string
    before?: boolean
    width: number
    offsetX: number
    offsetY: number
    samples: string[]
    appearance: CSSProperties
    marker?: { x: number; y: number; width: number; height: number }
    label: string
    x: number
    y: number
  }>()
  const ordered = computed(
    () =>
      !models.sorting.value.length &&
      !models.grouping.value.length &&
      !models.filter.value &&
      !models.columnFilters.value.length,
  )
  const canMove = (row: T) =>
    !ctl.blocked.value &&
    ordered.value &&
    (typeof props.reorderable === 'function' ? props.reorderable(row) : !!props.reorderable)
  let cleanup: (() => void) | undefined
  let frame = 0
  let releaseClick: (() => void) | undefined
  let disposed = false
  function moveRow(key: DataTableKey, targetKey: DataTableKey, before?: boolean) {
    const all = ctl.table.getCoreRowModel().rowsById
    const row = all[rowId(key)],
      target = all[rowId(targetKey)]
    if (
      !row ||
      !target ||
      key === targetKey ||
      row.parentId !== target.parentId ||
      !canMove(row.original) ||
      !canMove(target.original)
    )
      return
    const parent = row.parentId ? all[row.parentId]?.original : undefined
    const source = parent ? props.getChildren?.(parent) : props.rows
    if (!source) return
    const from = source.findIndex(item => ctl.keyOf(item) === key),
      to = source.findIndex(item => ctl.keyOf(item) === targetKey)
    const position = before === undefined ? to : to + (before ? 0 : 1) - (from < to ? 1 : 0)
    if (position === from) return
    const rows = [...source]
    rows.splice(from, 1)
    rows.splice(position, 0, row.original)
    onReorder({ row: row.original, target: target.original, parent, from, to: position, rows })
  }
  function start(kind: 'row' | 'column', key: string, label: string, event: PointerEvent) {
    if (event.button !== 0 || ctl.blocked.value || (kind === 'row' && !ordered.value)) return
    const handle = event.currentTarget as HTMLElement
    const interactive = (event.target as HTMLElement).closest(
      'button, a, input, select, textarea, [contenteditable], [role="separator"]',
    )
    if (kind === 'column' && interactive && !interactive.hasAttribute('data-hn-table-heading'))
      return
    const column = ctl.visibleColumns.value.find(column => column.key === key)
    if (kind === 'column' && (!props.reorderColumns || column?.reorderable === false)) return
    cleanup?.()
    const document = handle.ownerDocument
    const originX = event.clientX,
      originY = event.clientY
    const rect = handle.getBoundingClientRect()
    const style = getComputedStyle(handle)
    const appearance: CSSProperties = {
      fontSize: style.fontSize,
      lineHeight: style.lineHeight,
      direction: style.direction as 'ltr' | 'rtl',
      '--hn-row-h': `${rect.height}px`,
      ...Object.fromEntries(
        ['--hn-surface', '--hn-table-head-bg', '--hn-border', '--hn-fg-default'].map(token => [
          token,
          style.getPropertyValue(token),
        ]),
      ),
    }
    const rtl = element.value && getComputedStyle(element.value).direction === 'rtl'
    let x = originX,
      y = originY
    let moved = false
    let pointerReleased = false
    const samples =
      kind === 'column'
        ? [...(element.value?.querySelectorAll<HTMLElement>('tbody [data-hn-cell]') ?? [])]
            .filter(cell => cell.dataset.hnCell === key)
            .slice(0, 3)
            .map(cell => cell.textContent?.trim() ?? '')
        : []
    const targetAtPoint = () => {
      const target = document
        .elementFromPoint(x, y)
        ?.closest<HTMLElement>(kind === 'row' ? '[data-hn-row]' : '[data-hn-column]')
      if (!target || !element.value?.contains(target)) return
      const targetId = (kind === 'row' ? target.dataset.hnRow : target.dataset.hnColumn)!
      if (targetId === key) return
      if (kind === 'column') {
        const destination = ctl.visibleColumns.value.find(column => column.key === targetId)
        if (!destination || destination.pin !== column?.pin || destination.reorderable === false)
          return
      } else {
        const all = ctl.table.getCoreRowModel().rowsById
        const row = all[key],
          destination = all[targetId]
        if (
          !row ||
          !destination ||
          row.parentId !== destination.parentId ||
          !canMove(destination.original)
        )
          return
      }
      const box = target.getBoundingClientRect()
      const area = viewport.value?.getBoundingClientRect() ?? element.value.getBoundingClientRect()
      const table = element.value.getBoundingClientRect()
      const before =
        kind === 'row'
          ? y < box.top + box.height / 2
          : rtl
            ? x > box.left + box.width / 2
            : x < box.left + box.width / 2
      const ids =
        kind === 'column'
          ? ctl.visibleColumns.value.map(column => column.key)
          : [...element.value.querySelectorAll<HTMLElement>('[data-hn-row]')].map(
              row => row.dataset.hnRow!,
            )
      const from = ids.indexOf(key),
        to = ids.indexOf(targetId)
      if (from >= 0 && to + (before ? 0 : 1) - (from < to ? 1 : 0) === from) return
      const left = Math.max(area.left, table.left),
        top = Math.max(area.top, table.top)
      return {
        target: targetId,
        before,
        marker:
          kind === 'column'
            ? {
                x: before !== !!rtl ? box.left : box.right,
                y: top,
                width: 2,
                height: Math.max(0, Math.min(area.bottom, table.bottom) - top),
              }
            : {
                x: left,
                y: before ? box.top : box.bottom,
                width: Math.max(0, Math.min(area.right, table.right) - left),
                height: 2,
              },
      }
    }
    const update = () => {
      if (!moved) return
      const area = viewport.value?.getBoundingClientRect()
      if (area && viewport.value) {
        if (kind === 'row')
          viewport.value.scrollTop += y < area.top + 28 ? -12 : y > area.bottom - 28 ? 12 : 0
        else viewport.value.scrollLeft += x < area.left + 28 ? -12 : x > area.right - 28 ? 12 : 0
      }
      const destination = targetAtPoint()
      dragging.value = {
        kind,
        key,
        label,
        x,
        y,
        width: rect.width,
        offsetX: originX - rect.left,
        offsetY: originY - rect.top,
        samples,
        appearance,
        ...destination,
      }
      frame = requestAnimationFrame(update)
    }
    const move = (next: PointerEvent) => {
      if (next.pointerId !== event.pointerId) return
      x = next.clientX
      y = next.clientY
      if (!moved && Math.hypot(x - originX, y - originY) >= 6) {
        moved = true
        handle.setPointerCapture?.(event.pointerId)
        document.documentElement.dataset.hnTableGesture = 'drag'
        update()
      }
      if (moved) next.preventDefault()
    }
    const stop = (apply: boolean) => {
      const destination = moved && targetAtPoint()
      cleanup?.()
      if (!apply || !destination) return
      if (kind === 'column') {
        const order = [
          ...new Set([...models.columnOrder.value, ...ctl.leaves.value.map(column => column.key)]),
        ]
        order.splice(order.indexOf(key), 1)
        order.splice(order.indexOf(destination.target) + (destination.before ? 0 : 1), 0, key)
        models.columnOrder.value = order
      } else {
        const all = ctl.table.getCoreRowModel().rowsById
        const row = all[key],
          target = all[destination.target]
        if (row && target)
          moveRow(ctl.keyOf(row.original), ctl.keyOf(target.original), destination.before)
      }
    }
    const up = (next: PointerEvent) => {
      if (next.pointerId !== event.pointerId) return
      x = next.clientX
      y = next.clientY
      pointerReleased = true
      stop(true)
    }
    const cancel = () => stop(false)
    const keydown = (next: KeyboardEvent) => {
      if (next.key === 'Escape') {
        next.preventDefault()
        next.stopPropagation()
        cancel()
      }
    }
    cleanup = () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', cancel)
      window.removeEventListener('keydown', keydown)
      window.removeEventListener('blur', cancel)
      if (handle.hasPointerCapture?.(event.pointerId)) handle.releasePointerCapture(event.pointerId)
      if (moved && !disposed) {
        releaseClick?.()
        let timer: ReturnType<typeof setTimeout> | undefined
        const clear = () => {
          clearTimeout(timer)
          document.removeEventListener('click', preventClick, true)
          document.removeEventListener('pointerdown', clear, true)
          document.removeEventListener('keydown', clear, true)
          document.removeEventListener('pointerup', afterUp, true)
          releaseClick = undefined
        }
        const preventClick = (click: MouseEvent) => {
          click.preventDefault()
          click.stopImmediatePropagation()
          clear()
        }
        const afterUp = () => {
          timer = setTimeout(clear, 0)
        }
        document.addEventListener('click', preventClick, true)
        document.addEventListener('pointerdown', clear, true)
        document.addEventListener('keydown', clear, true)
        document.addEventListener('pointerup', afterUp, true)
        if (pointerReleased) afterUp()
        releaseClick = clear
      }
      delete document.documentElement.dataset.hnTableGesture
      dragging.value = undefined
      cleanup = undefined
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', cancel)
    window.addEventListener('keydown', keydown)
    window.addEventListener('blur', cancel)
  }
  function rowKeydown(key: DataTableKey, event: KeyboardEvent) {
    if (!['ArrowUp', 'ArrowDown'].includes(event.key)) return
    event.preventDefault()
    event.stopPropagation()
    const row = ctl.table.getCoreRowModel().rowsById[rowId(key)]
    if (!row) return
    const parent = row.parentId
      ? ctl.table.getCoreRowModel().rowsById[row.parentId]?.original
      : undefined
    const source = parent ? (props.getChildren?.(parent) ?? []) : props.rows
    const eligible = source.filter(canMove),
      index = eligible.findIndex(item => ctl.keyOf(item) === key)
    const target = eligible[index + (event.key === 'ArrowDown' ? 1 : -1)]
    if (target) {
      moveRow(key, ctl.keyOf(target))
      const handle = event.currentTarget as HTMLElement
      void nextTick(() => {
        if (handle.isConnected) handle.focus({ preventScroll: true })
      })
    }
  }
  function columnKeydown(key: string, event: KeyboardEvent) {
    if (!event.altKey || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return
    event.preventDefault()
    event.stopPropagation()
    const column = ctl.visibleColumns.value.find(column => column.key === key)
    const columns = ctl.visibleColumns.value.filter(
      item => item.pin === column?.pin && item.reorderable !== false,
    )
    const direction = element.value && getComputedStyle(element.value).direction === 'rtl' ? -1 : 1
    const target =
      columns[
        columns.findIndex(item => item.key === key) +
          (event.key === 'ArrowRight' ? 1 : -1) * direction
      ]
    if (target) {
      ctl.api.moveColumn(key, target.key)
      const handle = event.currentTarget as HTMLElement
      void nextTick(() => {
        if (handle.isConnected) handle.focus({ preventScroll: true })
      })
    }
  }
  Object.assign(ctl.api, { moveRow })
  onScopeDispose(() => {
    disposed = true
    cleanup?.()
    releaseClick?.()
  })
  return {
    dragging,
    kind: computed(() => dragging.value?.kind),
    target: computed(() => dragging.value?.target),
    key: computed(() => dragging.value?.key),
    canMove,
    start,
    rowKeydown,
    columnKeydown,
  }
}
export type DataTableDrag<T extends object> = ReturnType<typeof useTableDrag<T>>
