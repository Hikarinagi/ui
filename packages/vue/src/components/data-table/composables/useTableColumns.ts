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
import { columnSizingStyles } from '../column-sizing-styles'
import {
  canMoveColumn,
  cellStyle as layoutCellStyle,
  controlStyle as layoutControlStyle,
  headerRows as layoutHeaderRows,
  moveColumnOrder,
  pinStyle as layoutPinStyle,
  type DataTablePinLayout,
} from '../../../../../shared/src/lib/data-table/layout'
import { useTableResize } from './useTableResize'
import { useTableResizeHandles } from './useTableResizeHandles'
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
  const constrained = computed(
    () =>
      props.layout === 'fixed' ||
      props.resizable ||
      !!props.virtualize ||
      ctl.visibleColumns.value.some(column => column.truncate || column.maxWidth !== undefined) ||
      Object.keys(models.columnWidths.value).length > 0,
  )
  let observer: ResizeObserver | undefined
  let disposed = false
  let frame = 0
  watch(
    [element, viewport, ctl.visibleColumns, constrained, () => props.stickyHeader],
    async (_, __, onCleanup) => {
      let cancelled = false
      onCleanup(() => {
        cancelled = true
      })
      await nextTick()
      if (cancelled) return
      observer?.disconnect()
      cancelAnimationFrame(frame)
      frame = 0
      if (disposed || !element.value || typeof ResizeObserver === 'undefined') return
      const rows = props.stickyHeader ? [...element.value.querySelectorAll('thead tr')] : []
      const next = { ...measured.value }
      const sizes = [...heights.value]
      let areaWidth = available.value
      observer = new ResizeObserver(entries => {
        for (const entry of entries) {
          if (entry.target === viewport.value) areaWidth = viewport.value.clientWidth
          const key = (entry.target as HTMLElement).dataset.hnColumn
          if (key !== undefined)
            next[key] =
              entry.borderBoxSize[0]?.inlineSize ?? entry.target.getBoundingClientRect().width
          const index = rows.indexOf(entry.target as HTMLTableRowElement)
          if (index >= 0)
            sizes[index] =
              entry.borderBoxSize[0]?.blockSize ?? entry.target.getBoundingClientRect().height
        }
        // Publish cached sizes outside the observer delivery to avoid resize feedback loops.
        if (!frame)
          frame = requestAnimationFrame(() => {
            frame = 0
            available.value = areaWidth
            if (JSON.stringify(next) !== JSON.stringify(measured.value))
              measured.value = { ...next }
            if (JSON.stringify(sizes) !== JSON.stringify(heights.value)) heights.value = [...sizes]
          })
      })
      if (!constrained.value)
        element.value
          .querySelectorAll('thead [data-hn-column]')
          .forEach(cell => observer!.observe(cell, { box: 'border-box' }))
      rows.forEach(row => observer!.observe(row, { box: 'border-box' }))
      if (viewport.value) observer.observe(viewport.value)
      available.value = viewport.value?.clientWidth ?? 0
    },
    { flush: 'post' },
  )
  const availableColumnsWidth = computed(
    () => available.value - leading.value * 48 - trailing.value * 72,
  )
  const widths = computed(
    () =>
      active.value ??
      allocateWidths(
        ctl.visibleColumns.value,
        models.columnWidths.value,
        availableColumnsWidth.value,
      ),
  )
  const handles = useTableResizeHandles(
    element,
    viewport,
    ctl.visibleColumns,
    () => !!props.resizable,
  )
  const resizing = useTableResize(
    props,
    models,
    ctl,
    element,
    viewport,
    widths,
    active,
    availableColumnsWidth,
    handles.update,
  )
  const widthVariable = (column: DataTableColumn<T>) =>
    `var(--hn-table-column-${ctl.visibleColumns.value.findIndex(item => item.key === column.key)})`
  function width(column: DataTableColumn<T>) {
    return constrained.value
      ? widths.value[column.key]!
      : (measured.value[column.key] ?? pixelWidth(column.width, 160))
  }
  const fixedWidths = computed(() =>
    allocateWidths(ctl.visibleColumns.value, active.value ?? models.columnWidths.value, 0),
  )
  function columnStyle(column: DataTableColumn<T>): CSSProperties {
    return { width: cssSize(constrained.value ? widthVariable(column) : column.width) }
  }
  const pinLayout = (): DataTablePinLayout<T> => ({
    columns: ctl.visibleColumns.value,
    constrained: constrained.value,
    leading: leading.value,
    trailing: trailing.value,
    get fixedWidths() {
      return fixedWidths.value
    },
    width,
  })
  function pinStyle(column: DataTableColumn<T>, head = false): CSSProperties {
    return layoutPinStyle(pinLayout(), column, head)
  }
  function cellStyle(column: DataTableColumn<T>, head = false): CSSProperties {
    return layoutCellStyle(pinLayout(), column, head)
  }
  function controlStyle(side: 'start' | 'end', index: number, head = false): CSSProperties {
    return layoutControlStyle(ctl.visibleColumns.value, side, index, head)
  }
  const headerRows = computed<DataTableHeader<T>[][]>(() =>
    layoutHeaderRows(
      props.columns,
      ctl.visibleColumns.value,
      heights.value,
      props.stickyHeader,
      ctl.headerContext,
      (column, leaf) => (leaf ? cellStyle(column, true) : pinStyle(column, true)),
    ),
  )
  const sizing = computed<CSSProperties>(() =>
    constrained.value
      ? columnSizingStyles(
          ctl.visibleColumns.value,
          active.value ?? models.columnWidths.value,
          leading.value * 48 + trailing.value * 72,
        )
      : {},
  )
  const tableStyle = computed<CSSProperties>(() => ({
    tableLayout: constrained.value ? 'fixed' : 'auto',
    width: sizing.value.width,
  }))
  const columnStyles = computed<CSSProperties>(() => {
    const { width: _, ...styles } = sizing.value
    return styles
  })
  const errorStyle = computed<CSSProperties>(() => ({
    '--hn-table-viewport-width': available.value ? `${available.value}px` : undefined,
  }))
  function moveColumn(key: string, target: string) {
    if (ctl.blocked.value || !canMoveColumn(ctl.visibleColumns.value, key, target)) return
    models.columnOrder.value = moveColumnOrder(
      models.columnOrder.value,
      ctl.leaves.value,
      key,
      target,
    )
  }
  Object.assign(ctl.api, { setColumnWidth: resizing.setWidth, moveColumn })
  onScopeDispose(() => {
    disposed = true
    cancelAnimationFrame(frame)
    observer?.disconnect()
  })
  return {
    constrained,
    headerRows,
    tableStyle,
    columnStyles,
    columnStyle,
    errorStyle,
    cellStyle,
    controlStyle,
    ...resizing,
    ...handles,
    width,
  }
}

export type DataTableLayout<T extends object> = ReturnType<typeof useTableColumns<T>>
