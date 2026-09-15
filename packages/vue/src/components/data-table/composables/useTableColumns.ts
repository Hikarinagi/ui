import {
  computed,
  nextTick,
  onScopeDispose,
  shallowRef,
  watch,
  type Ref,
  type CSSProperties,
} from 'vue'
import { cssSize } from '../utils'
import type { DataTableColumn, DataTableHeader, DataTableProps } from '../types'
import type { DataTableController, DataTableModels } from './useDataTable'

export function useTableColumns<T extends object>(
  props: DataTableProps<T>,
  models: DataTableModels,
  ctl: DataTableController<T>,
  element: Ref<HTMLTableElement | undefined>,
  viewport: Ref<HTMLElement | undefined>,
  leading: Ref<number>,
  trailing: Ref<number>,
) {
  const measured = shallowRef<Record<string, number>>({})
  const heights = shallowRef<number[]>([])
  const resizing = shallowRef<string>()
  const available = shallowRef(0)
  const guide = shallowRef<{ x: number; y: number; height: number }>()
  let observer: ResizeObserver | undefined
  let release: (() => void) | undefined
  let frame = 0
  let disposed = false
  watch(
    [element, viewport, ctl.visibleColumns],
    async () => {
      await nextTick()
      observer?.disconnect()
      if (disposed || !element.value || typeof ResizeObserver === 'undefined') return
      const update = () => {
        available.value = viewport.value?.clientWidth ?? 0
        const next: Record<string, number> = {}
        element.value?.querySelectorAll<HTMLElement>('thead [data-hn-column]').forEach(cell => {
          next[cell.dataset.hnColumn!] = cell.getBoundingClientRect().width
        })
        if (JSON.stringify(next) !== JSON.stringify(measured.value)) measured.value = next
        const rows = [...(element.value?.querySelectorAll('thead tr') ?? [])].map(
          row => row.getBoundingClientRect().height,
        )
        if (JSON.stringify(rows) !== JSON.stringify(heights.value)) heights.value = rows
      }
      observer = new ResizeObserver(update)
      element.value.querySelectorAll('thead th, thead tr').forEach(cell => observer!.observe(cell))
      if (viewport.value) observer.observe(viewport.value)
      update()
    },
    { flush: 'post' },
  )
  const constrained = computed(
    () =>
      props.layout === 'fixed' ||
      props.resizable ||
      !!props.virtualize ||
      ctl.visibleColumns.value.some(column => column.truncate || column.maxWidth !== undefined) ||
      Object.keys(models.columnWidths.value).length > 0,
  )
  function numeric(value: number | string | undefined, fallback: number) {
    return typeof value === 'number' && Number.isFinite(value)
      ? value
      : typeof value === 'string' && /^\d+(\.\d+)?px$/.test(value)
        ? parseFloat(value)
        : fallback
  }
  const widths = computed(() => {
    const columns = ctl.visibleColumns.value
    const result = Object.fromEntries(
      columns.map(column => [
        column.key,
        clamp(column, numeric(models.columnWidths.value[column.key] ?? column.width, 160)),
      ]),
    )
    if (!Object.keys(models.columnWidths.value).length) {
      let remaining =
        available.value -
        leading.value * 48 -
        trailing.value * 72 -
        Object.values(result).reduce((sum, value) => sum + value, 0)
      let flexible = columns.filter(column => !column.pin)
      while (remaining > 0.5 && flexible.length) {
        const share = remaining / flexible.length
        for (const column of flexible) {
          const extra = Math.max(
            0,
            Math.min(share, numeric(column.maxWidth, Infinity) - result[column.key]!),
          )
          result[column.key]! += extra
          remaining -= extra
        }
        flexible = flexible.filter(
          column => result[column.key]! < numeric(column.maxWidth, Infinity),
        )
      }
    }
    return result
  })
  function clamp(column: DataTableColumn<T>, value: number) {
    return Math.max(numeric(column.minWidth, 48), Math.min(numeric(column.maxWidth, 1600), value))
  }
  function width(column: DataTableColumn<T>) {
    return constrained.value
      ? widths.value[column.key]!
      : (measured.value[column.key] ?? numeric(column.width, 160))
  }
  function specifiedWidth(column: DataTableColumn<T>) {
    return constrained.value ? width(column) : column.width
  }
  function pinStyle(column: DataTableColumn<T>, head = false): CSSProperties {
    if (!column.pin) return {}
    const siblings = ctl.visibleColumns.value.filter(item => item.pin === column.pin)
    const index = siblings.findIndex(item => item.key === column.key)
    const offset =
      column.pin === 'start'
        ? leading.value * 48 + siblings.slice(0, index).reduce((sum, item) => sum + width(item), 0)
        : trailing.value * 72 +
          siblings.slice(index + 1).reduce((sum, item) => sum + width(item), 0)
    return {
      position: 'sticky',
      [column.pin === 'start' ? 'insetInlineStart' : 'insetInlineEnd']: `${offset}px`,
      zIndex: head ? 5 : 1,
      background: head ? 'var(--hn-table-head-bg)' : 'var(--hn-table-bg)',
      boxShadow: `${column.pin === 'start' ? '1px' : '-1px'} 0 0 var(--hn-border)`,
    }
  }
  function cellStyle(column: DataTableColumn<T>, head = false): CSSProperties {
    return {
      width: cssSize(specifiedWidth(column)),
      minWidth: cssSize(column.minWidth ?? specifiedWidth(column)),
      maxWidth: cssSize(column.maxWidth),
      ...pinStyle(column, head),
    }
  }
  function controlStyle(side: 'start' | 'end', index: number, head = false): CSSProperties {
    return {
      width: side === 'end' ? '72px' : '48px',
      minWidth: side === 'end' ? '72px' : '48px',
      paddingInline: '8px',
      textAlign: 'center',
      ...(ctl.visibleColumns.value.some(column => column.pin === side)
        ? {
            position: 'sticky',
            [side === 'start' ? 'insetInlineStart' : 'insetInlineEnd']: `${index * 48}px`,
            zIndex: head ? 5 : 1,
            background: head ? 'var(--hn-table-head-bg)' : 'var(--hn-table-bg)',
          }
        : {}),
    }
  }
  const headerRows = computed<DataTableHeader<T>[][]>(() => {
    const paths = new Map<string, DataTableColumn<T>[]>()
    function visit(columns: DataTableColumn<T>[], parent: DataTableColumn<T>[] = []) {
      for (const column of columns) {
        const path = [...parent, column]
        if (column.children?.length) visit(column.children, path)
        else paths.set(column.key, path)
      }
    }
    visit(props.columns)
    const visible = ctl.visibleColumns.value
    const depth = Math.max(1, ...visible.map(column => paths.get(column.key)!.length))
    return Array.from({ length: depth }, (_, level) => {
      const result: DataTableHeader<T>[] = []
      for (let index = 0; index < visible.length;) {
        const first = visible[index]!
        const path = paths.get(first.key)!
        const column = path[level]
        if (!column) {
          index++
          continue
        }
        const leaf = level === path.length - 1
        let end = index + 1
        if (!leaf)
          while (
            end < visible.length &&
            paths.get(visible[end]!.key)?.[level]?.key === column.key &&
            visible[end]!.pin === first.pin
          )
            end++
        const top = Array.from({ length: level }, (_, i) => heights.value[i] ?? 44).reduce(
          (a, b) => a + b,
          0,
        )
        result.push({
          ...ctl.headerContext(column),
          id: leaf ? `leaf:${column.key}` : `${level}:${column.key}:${first.key}`,
          leaf,
          colspan: end - index,
          rowspan: leaf ? depth - level : 1,
          top,
          style: {
            ...(leaf
              ? cellStyle(column, true)
              : pinStyle(first.pin === 'end' ? visible[end - 1]! : first, true)),
            ...(props.stickyHeader ? { top: `${top}px` } : {}),
          },
        })
        index = end
      }
      return result
    })
  })
  const tableStyle = computed<CSSProperties>(() => ({
    tableLayout: constrained.value ? 'fixed' : 'auto',
    ...(constrained.value
      ? {
          width: `${ctl.visibleColumns.value.reduce((sum, column) => sum + width(column), leading.value * 48 + trailing.value * 72)}px`,
        }
      : {}),
  }))
  function neighbor(column: DataTableColumn<T>) {
    const columns = ctl.visibleColumns.value
    return columns[columns.findIndex(item => item.key === column.key) + 1]
  }
  function canResize(column: DataTableColumn<T>) {
    return (
      props.resizable &&
      column.resizable !== false &&
      (props.resizeMode === 'expand' ||
        (neighbor(column)?.resizable !== false && !!neighbor(column)))
    )
  }
  function snapshot() {
    return Object.fromEntries(ctl.visibleColumns.value.map(column => [column.key, width(column)]))
  }
  function resized(column: DataTableColumn<T>, value: number, initial: Record<string, number>) {
    const next = props.resizeMode === 'expand' ? undefined : neighbor(column)
    let delta = clamp(column, value) - initial[column.key]!
    if (next && next.resizable !== false) {
      delta = initial[next.key]! - clamp(next, initial[next.key]! - delta)
      delta = clamp(column, initial[column.key]! + delta) - initial[column.key]!
    }
    return {
      ...models.columnWidths.value,
      ...initial,
      [column.key]: initial[column.key]! + delta,
      ...(next && next.resizable !== false ? { [next.key]: initial[next.key]! - delta } : {}),
    }
  }
  function setWidth(key: string, value: number) {
    if (ctl.blocked.value || !Number.isFinite(value)) return
    const column = ctl.leaves.value.find(column => column.key === key)
    if (column)
      models.columnWidths.value = ctl.visibleColumns.value.includes(column)
        ? resized(column, value, snapshot())
        : { ...models.columnWidths.value, [key]: clamp(column, value) }
  }
  function resize(column: DataTableColumn<T>, event: PointerEvent) {
    if (event.button !== 0 || ctl.blocked.value || !canResize(column)) return
    event.preventDefault()
    event.stopPropagation()
    release?.()
    const handle = event.currentTarget as HTMLElement
    const document = handle.ownerDocument
    const previous = models.columnWidths.value
    const initial = snapshot()
    const start = event.clientX
    const direction = getComputedStyle(element.value!).direction === 'rtl' ? -1 : 1
    const cell = handle.closest('th')!
    const cursor = document.documentElement.style.cursor
    const selection = document.documentElement.style.userSelect
    document.documentElement.dataset.hnTableGesture = 'resize'
    document.documentElement.style.cursor = 'col-resize'
    document.documentElement.style.userSelect = 'none'
    handle.setPointerCapture?.(event.pointerId)
    resizing.value = column.key
    let latest = initial[column.key]!
    const apply = () => {
      if (disposed) return
      models.columnWidths.value = resized(column, latest, initial)
      void nextTick(() => {
        if (resizing.value !== column.key) return
        const rect = cell.getBoundingClientRect()
        const area = viewport.value?.getBoundingClientRect()
        const table = element.value?.getBoundingClientRect()
        if (area && table)
          guide.value = {
            x: direction === 1 ? rect.right : rect.left,
            y: Math.max(rect.top, area.top),
            height: Math.max(0, Math.min(table.bottom, area.bottom) - Math.max(rect.top, area.top)),
          }
      })
    }
    const move = (next: PointerEvent) => {
      if (next.pointerId !== event.pointerId) return
      latest = initial[column.key]! + (next.clientX - start) * direction
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(apply)
    }
    const stop = (cancel = false) => {
      cancelAnimationFrame(frame)
      if (cancel) models.columnWidths.value = previous
      else apply()
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', cancelDrag)
      window.removeEventListener('keydown', keydown)
      window.removeEventListener('blur', cancelDrag)
      if (handle.hasPointerCapture?.(event.pointerId)) handle.releasePointerCapture(event.pointerId)
      delete document.documentElement.dataset.hnTableGesture
      document.documentElement.style.cursor = cursor
      document.documentElement.style.userSelect = selection
      resizing.value = undefined
      guide.value = undefined
      release = undefined
    }
    const up = (next: PointerEvent) => {
      if (next.pointerId !== event.pointerId) return
      latest = initial[column.key]! + (next.clientX - start) * direction
      stop()
    }
    const cancelDrag = () => stop(true)
    const keydown = (next: KeyboardEvent) => {
      if (next.key === 'Escape') {
        next.preventDefault()
        next.stopPropagation()
        stop(true)
      }
    }
    release = cancelDrag
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', cancelDrag)
    window.addEventListener('keydown', keydown)
    window.addEventListener('blur', cancelDrag)
    apply()
  }
  function resizeKey(column: DataTableColumn<T>, event: KeyboardEvent) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    event.stopPropagation()
    const direction = element.value && getComputedStyle(element.value).direction === 'rtl' ? -1 : 1
    setWidth(
      column.key,
      event.key === 'Home'
        ? numeric(column.minWidth, 48)
        : event.key === 'End'
          ? numeric(column.maxWidth, 1600)
          : width(column) +
            (event.key === 'ArrowRight' ? 1 : -1) * direction * (event.shiftKey ? 10 : 1),
    )
  }
  function moveColumn(key: string, target: string) {
    if (ctl.blocked.value || key === target) return
    const columns = ctl.visibleColumns.value
    const source = columns.find(column => column.key === key),
      destination = columns.find(column => column.key === target)
    if (
      !source ||
      !destination ||
      source.pin !== destination.pin ||
      source.reorderable === false ||
      destination.reorderable === false
    )
      return
    const order = [
      ...new Set([...models.columnOrder.value, ...ctl.leaves.value.map(column => column.key)]),
    ]
    const from = order.indexOf(key),
      to = order.indexOf(target)
    order.splice(from, 1)
    order.splice(to, 0, key)
    models.columnOrder.value = order
  }
  Object.assign(ctl.api, { setColumnWidth: setWidth, moveColumn })
  onScopeDispose(() => {
    disposed = true
    observer?.disconnect()
    release?.()
    if (frame) cancelAnimationFrame(frame)
  })
  return {
    headerRows,
    tableStyle,
    cellStyle,
    controlStyle,
    resizing,
    guide,
    canResize,
    resize,
    resizeKey,
    width,
  }
}

export type DataTableLayout<T extends object> = ReturnType<typeof useTableColumns<T>>
