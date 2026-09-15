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
  leading: Ref<number>,
  trailing: Ref<number>,
) {
  const measured = shallowRef<Record<string, number>>({})
  const heights = shallowRef<number[]>([])
  const resizing = shallowRef<string>()
  let observer: ResizeObserver | undefined
  let release: (() => void) | undefined
  let frame = 0
  let disposed = false
  watch(
    [element, ctl.visibleColumns],
    async () => {
      await nextTick()
      observer?.disconnect()
      if (disposed || !element.value || typeof ResizeObserver === 'undefined') return
      const update = () => {
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
  function width(column: DataTableColumn<T>) {
    return (
      models.columnWidths.value[column.key] ??
      measured.value[column.key] ??
      numeric(column.width, 160)
    )
  }
  function specifiedWidth(column: DataTableColumn<T>) {
    return (
      models.columnWidths.value[column.key] ??
      column.width ??
      (constrained.value
        ? Math.min(numeric(column.maxWidth, Infinity), Math.max(numeric(column.minWidth, 48), 160))
        : undefined)
    )
  }
  function pinStyle(column: DataTableColumn<T>, head = false): CSSProperties {
    if (!column.pin) return {}
    const siblings = ctl.visibleColumns.value.filter(item => item.pin === column.pin)
    const index = siblings.findIndex(item => item.key === column.key)
    const offset =
      column.pin === 'start'
        ? leading.value * 48 + siblings.slice(0, index).reduce((sum, item) => sum + width(item), 0)
        : trailing.value * 88 +
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
      width: side === 'end' ? '88px' : '48px',
      minWidth: side === 'end' ? '88px' : '48px',
      paddingInline: '8px',
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
          width: `max(100%, ${ctl.visibleColumns.value.reduce((sum, column) => sum + numeric(specifiedWidth(column), 160), leading.value * 48 + trailing.value * 88)}px)`,
        }
      : {}),
  }))
  function setWidth(key: string, value: number) {
    if (ctl.blocked.value || !Number.isFinite(value)) return
    const column = ctl.leaves.value.find(column => column.key === key)
    if (!column) return
    models.columnWidths.value = {
      ...models.columnWidths.value,
      [key]: Math.max(
        numeric(column.minWidth, 48),
        Math.min(numeric(column.maxWidth, 1600), value),
      ),
    }
  }
  function resize(column: DataTableColumn<T>, event: PointerEvent) {
    if (event.button !== 0 || ctl.blocked.value) return
    event.preventDefault()
    event.stopPropagation()
    release?.()
    const widths = Object.fromEntries(ctl.visibleColumns.value.map(item => [item.key, width(item)]))
    models.columnWidths.value = { ...models.columnWidths.value, ...widths }
    const start = event.clientX,
      initial = width(column)
    const direction = element.value && getComputedStyle(element.value).direction === 'rtl' ? -1 : 1
    resizing.value = column.key
    let latest = initial
    const move = (next: PointerEvent) => {
      latest = initial + (next.clientX - start) * direction
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setWidth(column.key, latest))
    }
    const stop = () => {
      cancelAnimationFrame(frame)
      if (!disposed) setWidth(column.key, latest)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
      resizing.value = undefined
      release = undefined
    }
    release = stop
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
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
  return { headerRows, tableStyle, cellStyle, controlStyle, resizing, resize, resizeKey, width }
}

export type DataTableLayout<T extends object> = ReturnType<typeof useTableColumns<T>>
