import { computed, nextTick, onScopeDispose, shallowRef, type Ref } from 'vue'
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
  function moveRow(key: DataTableKey, targetKey: DataTableKey) {
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
    const rows = [...source]
    rows.splice(from, 1)
    rows.splice(to, 0, row.original)
    onReorder({ row: row.original, target: target.original, parent, from, to, rows })
  }
  function start(kind: 'row' | 'column', key: string, label: string, event: PointerEvent) {
    if (event.button !== 0 || ctl.blocked.value) return
    if (kind === 'row' && !ordered.value) return
    event.preventDefault()
    event.stopPropagation()
    cleanup?.()
    const originX = event.clientX,
      originY = event.clientY
    let moved = false
    dragging.value = { kind, key, label, x: originX, y: originY }
    const targetAtPoint = (state: { x: number; y: number }) => {
      const target = element.value?.ownerDocument
        .elementFromPoint(state.x, state.y)
        ?.closest<HTMLElement>(kind === 'row' ? '[data-hn-row]' : '[data-hn-column]')
      return target && element.value?.contains(target)
        ? kind === 'row'
          ? target.dataset.hnRow
          : target.dataset.hnColumn
        : undefined
    }
    const update = () => {
      const state = dragging.value
      if (!state) return
      const area = viewport.value?.getBoundingClientRect()
      if (area && viewport.value && moved) {
        if (kind === 'row')
          viewport.value.scrollTop +=
            state.y < area.top + 28 ? -12 : state.y > area.bottom - 28 ? 12 : 0
        else
          viewport.value.scrollLeft +=
            state.x < area.left + 28 ? -12 : state.x > area.right - 28 ? 12 : 0
      }
      const target = targetAtPoint(state)
      if (state.target !== target) dragging.value = { ...state, target }
      frame = requestAnimationFrame(update)
    }
    const move = (next: PointerEvent) => {
      if (!dragging.value) return
      moved ||= Math.abs(next.clientX - originX) + Math.abs(next.clientY - originY) > 5
      dragging.value = { ...dragging.value, x: next.clientX, y: next.clientY }
    }
    const stop = (apply: boolean) => {
      const state = dragging.value
      const targetId = state && targetAtPoint(state)
      cleanup?.()
      if (!apply || !moved || !targetId) return
      if (kind === 'column') ctl.api.moveColumn(key, targetId)
      else {
        const all = ctl.table.getCoreRowModel().rowsById
        const row = all[key],
          target = all[targetId]
        if (row && target) moveRow(ctl.keyOf(row.original), ctl.keyOf(target.original))
      }
    }
    const up = () => stop(true),
      cancel = () => stop(false)
    const keydown = (next: KeyboardEvent) => {
      if (next.key === 'Escape') {
        next.preventDefault()
        cancel()
      }
    }
    cleanup = () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', cancel)
      window.removeEventListener('keydown', keydown)
      dragging.value = undefined
      cleanup = undefined
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', cancel)
    window.addEventListener('keydown', keydown)
    frame = requestAnimationFrame(update)
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
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return
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
  onScopeDispose(() => cleanup?.())
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
