'use client'

import { useLayoutEffect, useMemo, useState, type CSSProperties, type RefObject } from 'react'
import { cssSize } from '../../../../../shared/src/lib/data-table/utils'
import { allocateWidths, pixelWidth } from '../../../../../shared/src/lib/data-table/column-sizing'
import { columnSizingStyles } from '../../../../../shared/src/lib/data-table/column-sizing-styles'
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
import { useLive, useStableCallback, useStableValue } from './useLive'

export function useTableColumns<T extends object>(
  props: DataTableProps<T>,
  models: DataTableModels,
  ctl: DataTableController<T>,
  element: RefObject<HTMLTableElement | null>,
  viewport: HTMLElement | undefined,
  leading: number,
  trailing: number,
) {
  const [measured, setMeasured] = useState<Record<string, number>>({})
  const [heights, setHeights] = useState<number[]>([])
  const [available, setAvailable] = useState(0)
  const [active, setActive] = useState<Record<string, number>>()
  const columnWidths = models.columnWidths.value
  const visible = ctl.visibleColumns
  const constrained =
    props.layout === 'fixed' ||
    !!props.resizable ||
    !!props.virtualize ||
    visible.some(column => column.truncate || column.maxWidth !== undefined) ||
    Object.keys(columnWidths).length > 0
  const sizes = useLive({ measured, heights, available })
  useLayoutEffect(() => {
    let cancelled = false
    let dispose: (() => void) | undefined
    queueMicrotask(() => {
      if (!cancelled) dispose = observe()
    })
    return () => {
      cancelled = true
      dispose?.()
    }
  }, [element, viewport, visible, constrained, props.stickyHeader, sizes])
  function observe() {
    const table = element.current
    if (!table || typeof ResizeObserver === 'undefined') return
    const rows = props.stickyHeader ? [...table.querySelectorAll('thead tr')] : []
    const next = { ...sizes.current.measured }
    const current = [...sizes.current.heights]
    let areaWidth = sizes.current.available
    let frame = 0
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.target === viewport) areaWidth = viewport.clientWidth
        const key = (entry.target as HTMLElement).dataset.hnColumn
        if (key !== undefined)
          next[key] =
            entry.borderBoxSize[0]?.inlineSize ?? entry.target.getBoundingClientRect().width
        const index = rows.indexOf(entry.target as HTMLTableRowElement)
        if (index >= 0)
          current[index] =
            entry.borderBoxSize[0]?.blockSize ?? entry.target.getBoundingClientRect().height
      }
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0
          setAvailable(areaWidth)
          setMeasured(previous =>
            JSON.stringify(next) !== JSON.stringify(previous) ? { ...next } : previous,
          )
          setHeights(previous =>
            JSON.stringify(current) !== JSON.stringify(previous) ? [...current] : previous,
          )
        })
    })
    if (!constrained)
      table
        .querySelectorAll('thead [data-hn-column]')
        .forEach(cell => observer.observe(cell, { box: 'border-box' }))
    rows.forEach(row => observer.observe(row, { box: 'border-box' }))
    if (viewport) observer.observe(viewport)
    setAvailable(viewport?.clientWidth ?? 0)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }
  const availableColumnsWidth = available - leading * 48 - trailing * 72
  const allocated = useMemo(
    () => allocateWidths(visible, columnWidths, availableColumnsWidth),
    [visible, columnWidths, availableColumnsWidth],
  )
  const widths = active ?? allocated
  const handles = useTableResizeHandles(element, viewport, visible, !!props.resizable)
  const resizing = useTableResize(
    props,
    models,
    ctl,
    element,
    viewport,
    widths,
    setActive,
    availableColumnsWidth,
    handles.update,
  )
  const widthVariable = (column: DataTableColumn<T>) =>
    `var(--hn-table-column-${visible.findIndex(item => item.key === column.key)})`
  const width = (column: DataTableColumn<T>) =>
    constrained ? widths[column.key]! : (measured[column.key] ?? pixelWidth(column.width, 160))
  const fixedWidths = useMemo(
    () => allocateWidths(visible, active ?? columnWidths, 0),
    [visible, active, columnWidths],
  )
  const pinLayout: DataTablePinLayout<T> = {
    columns: visible,
    constrained,
    leading,
    trailing,
    fixedWidths,
    width,
  }
  const columnStyle = (column: DataTableColumn<T>): CSSProperties => ({
    width: cssSize(constrained ? widthVariable(column) : column.width),
  })
  const pinStyle = (column: DataTableColumn<T>, head = false): CSSProperties =>
    layoutPinStyle(pinLayout, column, head)
  const cellStyle = (column: DataTableColumn<T>, head = false): CSSProperties =>
    layoutCellStyle(pinLayout, column, head)
  const controlStyle = (side: 'start' | 'end', index: number, head = false): CSSProperties =>
    layoutControlStyle(visible, side, index, head)
  const headerRows: DataTableHeader<T>[][] = layoutHeaderRows(
    props.columns,
    visible,
    heights,
    props.stickyHeader,
    ctl.headerContext,
    (column, leaf): CSSProperties => (leaf ? cellStyle(column, true) : pinStyle(column, true)),
  )
  const sizing = useMemo<Record<string, string>>(
    () =>
      constrained
        ? columnSizingStyles(visible, active ?? columnWidths, leading * 48 + trailing * 72)
        : {},
    [constrained, visible, active, columnWidths, leading, trailing],
  )
  const tableStyle = useMemo<CSSProperties>(
    () => ({ tableLayout: constrained ? 'fixed' : 'auto', width: sizing.width }),
    [constrained, sizing],
  )
  const columnStyles = useMemo(() => {
    const { width: _, ...styles } = sizing
    return styles as CSSProperties
  }, [sizing])
  const errorStyle = useMemo(
    () =>
      ({
        '--hn-table-viewport-width': available ? `${available}px` : undefined,
      }) as CSSProperties,
    [available],
  )
  const bodyStyles = useStableValue({
    cells: Object.fromEntries(visible.map(column => [column.key, cellStyle(column)])),
    start: Array.from({ length: leading }, (_, index) => controlStyle('start', index)),
    end: controlStyle('end', 0),
  })
  const live = useLive({ blocked: ctl.blocked, visible, leaves: ctl.leaves })
  const moveColumn = useStableCallback((key: string, target: string) => {
    if (live.current.blocked || !canMoveColumn(live.current.visible, key, target)) return
    models.columnOrder.set(
      moveColumnOrder(models.columnOrder.value, live.current.leaves, key, target),
    )
  })
  Object.assign(ctl.api, { setColumnWidth: resizing.setWidth, moveColumn })
  return {
    constrained,
    headerRows,
    tableStyle,
    columnStyles,
    columnStyle,
    errorStyle,
    cellStyle,
    controlStyle,
    bodyStyles,
    ...resizing,
    ...handles,
    width,
  }
}

export type DataTableLayout<T extends object> = ReturnType<typeof useTableColumns<T>>
