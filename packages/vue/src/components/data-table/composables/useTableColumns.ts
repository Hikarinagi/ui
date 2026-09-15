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
import { allocateWidths, pixelWidth } from '../column-sizing'
import { useTableResize } from './useTableResize'
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
  const available = shallowRef(0)
  const active = shallowRef<Record<string, number>>()
  let observer: ResizeObserver | undefined
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
  const widths = computed(
    () =>
      active.value ??
      allocateWidths(
        ctl.visibleColumns.value,
        models.columnWidths.value,
        available.value - leading.value * 48 - trailing.value * 72,
      ),
  )
  const resizing = useTableResize(props, models, ctl, element, viewport, widths, active)
  const widthVariable = (column: DataTableColumn<T>) =>
    `var(--hn-table-column-${ctl.visibleColumns.value.findIndex(item => item.key === column.key)})`
  function width(column: DataTableColumn<T>) {
    return constrained.value
      ? widths.value[column.key]!
      : (measured.value[column.key] ?? pixelWidth(column.width, 160))
  }
  function specifiedWidth(column: DataTableColumn<T>) {
    return constrained.value ? widthVariable(column) : column.width
  }
  function pinStyle(column: DataTableColumn<T>, head = false): CSSProperties {
    if (!column.pin) return {}
    const siblings = ctl.visibleColumns.value.filter(item => item.pin === column.pin)
    const index = siblings.findIndex(item => item.key === column.key)
    const preceding = column.pin === 'start' ? siblings.slice(0, index) : siblings.slice(index + 1)
    const controls = column.pin === 'start' ? leading.value * 48 : trailing.value * 72
    const offset = constrained.value
      ? `calc(${controls}px${preceding.map(column => ` + ${widthVariable(column)}`).join('')})`
      : `${preceding.reduce((sum, column) => sum + width(column), controls)}px`
    return {
      position: 'sticky',
      [column.pin === 'start' ? 'insetInlineStart' : 'insetInlineEnd']: offset,
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
          ...Object.fromEntries(
            ctl.visibleColumns.value.map((column, index) => [
              `--hn-table-column-${index}`,
              `${widths.value[column.key]}px`,
            ]),
          ),
          width: `${ctl.visibleColumns.value.reduce((sum, column) => sum + width(column), leading.value * 48 + trailing.value * 72)}px`,
        }
      : {}),
  }))
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
  Object.assign(ctl.api, { setColumnWidth: resizing.setWidth, moveColumn })
  onScopeDispose(() => {
    disposed = true
    observer?.disconnect()
  })
  return {
    headerRows,
    tableStyle,
    cellStyle,
    controlStyle,
    ...resizing,
    width,
  }
}

export type DataTableLayout<T extends object> = ReturnType<typeof useTableColumns<T>>
