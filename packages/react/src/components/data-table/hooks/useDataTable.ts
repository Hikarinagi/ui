'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useTable, type ColumnDef } from '@tanstack/react-table'
import { useUiLocale } from '../../../locale'
import { features } from '../features'
import {
  aggregate,
  filterValue,
  flattenColumns,
  isRowAction,
  positiveInteger,
  rowId,
  type DataTableActionEvent,
} from '../../../../../shared/src/lib/data-table/utils'
import {
  ariaSort,
  canGoNext,
  clampedPage,
  compareValues,
  displayValue,
  engineColumnFilters,
  engineExpanded,
  engineGrouping,
  engineSelection,
  engineSorting,
  engineVisibility,
  keyOf as rowKeyOf,
  labelOf as rowLabelOf,
  modelSelection,
  modelSorting,
  nextColumnFilters,
  orderColumns,
  pageCount as countPages,
  selectionState,
  sortLabel,
  tableQuery,
  toggleKey,
  toggleSelection,
  totalRows,
  uniqueSelectable,
  valueOf,
} from '../../../../../shared/src/lib/data-table/state'
import type {
  DataTableApi,
  DataTableColumn,
  DataTableFilter,
  DataTableGroupContext,
  DataTableKey,
  DataTableProps,
  DataTableQuery,
  DataTableRowContext,
  DataTableScope,
  DataTableSort,
  DataTableState,
} from '../types'
import type { DataTableModel } from './useModel'
import { useLive, useStableCallback } from './useLive'

export interface DataTableModels {
  page: DataTableModel<number>
  pageSize: DataTableModel<number>
  sorting: DataTableModel<DataTableSort[]>
  filter: DataTableModel<string>
  columnFilters: DataTableModel<DataTableFilter[]>
  grouping: DataTableModel<string[]>
  selected: DataTableModel<DataTableKey[]>
  expanded: DataTableModel<DataTableKey[]>
  expandedGroups: DataTableModel<string[]>
  hiddenColumns: DataTableModel<string[]>
  columnOrder: DataTableModel<string[]>
  columnWidths: DataTableModel<Record<string, number>>
}

export interface DataTableRowEntry<T> extends DataTableRowContext<T> {
  id: string
  label: string
  group: DataTableGroupContext<T> | undefined
}

export interface DataTableRowEvent extends DataTableActionEvent {
  nativeEvent: MouseEvent | KeyboardEvent
  preventDefault: () => void
}

function cached<A extends unknown[], R>(compute: (...args: A) => R) {
  let previous: A | undefined
  let result: R
  return (...args: A) => {
    if (!previous || args.some((value, index) => !Object.is(value, previous![index]))) {
      previous = args
      result = compute(...args)
    }
    return result
  }
}

function changed(previous: readonly unknown[], next: readonly unknown[]) {
  return next.some((value, index) => !Object.is(value, previous[index]))
}

export function useDataTable<T extends object>(
  props: DataTableProps<T>,
  models: DataTableModels,
  onChange: (query: DataTableQuery) => void,
  onRowClick: (row: T, event: MouseEvent | KeyboardEvent) => void,
) {
  const t = useUiLocale()
  const [api] = useState(() => ({}) as DataTableApi<T>)
  const blocked = !!props.loading || !!props.disabled
  const pageSize = positiveInteger(models.pageSize.value, 10)
  const page = positiveInteger(models.page.value, 1)
  const leaves = useMemo(() => flattenColumns(props.columns), [props.columns])
  const tag = t.tag
  const collator = useMemo(
    () => new Intl.Collator(tag, { numeric: true, sensitivity: 'base' }),
    [tag],
  )
  const live = useLive({ props, blocked, page, pageSize, leaves, tag })
  const keyOf = useStableCallback((row: T) => rowKeyOf(row, live.current.props.rowKey))
  const labelOf = useStableCallback((row: T) => rowLabelOf(row, live.current.props.rowLabel, keyOf))
  const selectable = (row: T) =>
    typeof live.current.props.selectable === 'function'
      ? live.current.props.selectable(row)
      : !!live.current.props.selectable
  const expandable = (row: T) =>
    typeof live.current.props.expandable === 'function'
      ? live.current.props.expandable(row)
      : !!live.current.props.expandable
  const columns = useMemo<ColumnDef<typeof features, T>[]>(
    () =>
      leaves.map(column => ({
        id: column.key,
        accessorFn: row => valueOf(row, column) ?? undefined,
        enableSorting: !!column.sortable,
        enableGlobalFilter: column.filterable !== false,
        filterFn: (row, _id, value: unknown) =>
          column.filterValue
            ? column.filterValue(row.original, value)
            : filterValue(valueOf(row.original, column), value, column.filterMode, tag),
        sortDescFirst: false,
        sortUndefined: 'last',
        sortFn: (a, b, id) => {
          if (column.sort) return column.sort(a.original, b.original)
          return compareValues(a.getValue(id), b.getValue(id), collator)
        },
      })),
    [leaves, collator, tag],
  )
  const sorting = models.sorting.value
  const filter = models.filter.value
  const columnFilters = models.columnFilters.value
  const grouping = models.grouping.value
  const selected = models.selected.value
  const expanded = models.expanded.value
  const hiddenColumns = models.hiddenColumns.value
  const columnOrder = models.columnOrder.value
  const setupPage = useRef<number | undefined>(page)
  const [, settle] = useState(0)
  useLayoutEffect(() => {
    const initial = setupPage.current
    if (initial === undefined) return
    setupPage.current = undefined
    if (initial !== live.current.page) settle(count => count + 1)
  }, [live])
  const [engineState] = useState(() => {
    const sortingOf = cached(engineSorting)
    const filtersOf = cached(engineColumnFilters<T>)
    const groupingOf = cached(engineGrouping<T>)
    const expandedOf = cached(engineExpanded)
    const paginationOf = cached((pageIndex: number, pageSize: number) => ({ pageIndex, pageSize }))
    const selectionOf = cached(engineSelection)
    const visibilityOf = cached(engineVisibility)
    return {
      get sorting() {
        return sortingOf(models.sorting.value)
      },
      get globalFilter() {
        return models.filter.value.trim()
      },
      get columnFilters() {
        return filtersOf(live.current.leaves, models.columnFilters.value)
      },
      get grouping() {
        return groupingOf(live.current.leaves, models.grouping.value)
      },
      get expanded() {
        return expandedOf(models.expanded.value, models.expandedGroups.value)
      },
      get pagination() {
        return paginationOf(
          (setupPage.current ?? positiveInteger(models.page.value, 1)) - 1,
          positiveInteger(models.pageSize.value, 10),
        )
      },
      get rowSelection() {
        return selectionOf(models.selected.value)
      },
      get columnVisibility() {
        return visibilityOf(models.hiddenColumns.value)
      },
    }
  })
  const selectionRecord = engineState.rowSelection
  const expandedState = engineState.expanded
  const table = useTable<typeof features, T>({
    features,
    data: props.rows,
    columns,
    getRowId: row => rowId(keyOf(row)),
    getSubRows: row => live.current.props.getChildren?.(row),
    manualSorting: !!props.manual,
    manualFiltering: !!props.manual,
    manualGrouping: !!props.manual,
    manualPagination: !!props.manual || !props.pagination,
    groupedColumnMode: false,
    filterFromLeafRows: true,
    paginateExpandedRows: false,
    autoResetExpanded: false,
    getRowCanExpand: row =>
      row.getIsGrouped() || row.subRows.length > 0 || expandable(row.original),
    enableMultiSort: !!props.multiSort,
    enableMultiRowSelection: props.selectionMode !== 'single',
    enableRowSelection: row => !row.getIsGrouped() && selectable(row.original),
    enableSubRowSelection: props.selectChildren !== false && props.selectionMode !== 'single',
    autoResetPageIndex: false,
    getColumnCanGlobalFilter: () => true,
    globalFilterFn: (row, id, query: string) => {
      const column = live.current.leaves.find(column => column.key === id)!
      return column.filter
        ? column.filter(row.original, query)
        : filterValue(row.getValue(id), query, 'contains', live.current.tag)
    },
    state: engineState,
    onSortingChange: updater => {
      if (live.current.blocked) return
      const current = engineSorting(models.sorting.value)
      const next = typeof updater === 'function' ? updater(current) : updater
      models.sorting.set(modelSorting(next))
    },
    onRowSelectionChange: updater => {
      if (live.current.blocked) return
      const current = engineSelection(models.selected.value)
      const next = typeof updater === 'function' ? updater(current) : updater
      models.selected.set(modelSelection(next))
    },
  })
  const engine = useRef(table)
  engine.current = table
  const visibleColumns = useMemo(
    () => orderColumns(leaves, hiddenColumns, columnOrder),
    [leaves, hiddenColumns, columnOrder],
  )
  const knownTotal = !props.manual || props.total !== undefined
  const total = totalRows(
    props.manual,
    props.total,
    props.rows.length,
    () => table.getPreExpandedRowModel().rows.length,
  )
  const pageCount = countPages(total, pageSize)
  const canNext = canGoNext(
    knownTotal,
    page,
    pageCount,
    props.hasNextPage,
    props.rows.length,
    pageSize,
  )
  const toggleExpanded = useStableCallback((key: DataTableKey, value?: boolean) => {
    if (live.current.blocked) return
    const row = engine.current.getCoreRowModel().rowsById[rowId(key)]
    if (!row?.getCanExpand()) return
    const next = value ?? !models.expanded.value.includes(key)
    models.expanded.set(toggleKey(models.expanded.value, key, next))
  })
  const toggleSelected = useStableCallback((key: DataTableKey, value?: boolean) => {
    if (live.current.blocked) return
    const row = engine.current.getCoreRowModel().rowsById[rowId(key)]
    if (row?.getCanSelect()) row.toggleSelected(value ?? !row.getIsSelected())
  })
  const startEdit = useStableCallback((key: DataTableKey, column?: string) =>
    api.startEdit(key, column),
  )
  const toggleGroup = useStableCallback((id: string, value?: boolean) => {
    if (live.current.blocked) return
    const next = value ?? !models.expandedGroups.value.includes(id)
    models.expandedGroups.set(toggleKey(models.expandedGroups.value, id, next))
  })
  const rowModel = table.getRowModel()
  const rows = useMemo(
    () =>
      rowModel.rows.map(row => {
        const key = keyOf(row.original)
        const context: DataTableRowContext<T> = {
          row: row.original,
          key,
          index: row.index,
          depth: row.depth,
          selected: row.getIsSelected(),
          selectable: row.getCanSelect(),
          indeterminate: props.selectChildren !== false && row.getIsSomeSelected(),
          expanded: row.getIsExpanded(),
          expandable: row.getCanExpand(),
          toggleSelected: value => toggleSelected(key, value),
          toggleExpanded: value => toggleExpanded(key, value),
          startEdit: column => startEdit(key, column),
        }
        const group: DataTableGroupContext<T> | undefined = row.getIsGrouped()
          ? {
              key: row.id,
              column: leaves.find(column => column.key === row.groupingColumnId)!,
              value: row.groupingValue,
              rows: row
                .getLeafRows()
                .filter(leaf => !leaf.getIsGrouped())
                .map(leaf => leaf.original),
              depth: row.depth,
              expanded: row.getIsExpanded(),
              toggleExpanded: value => toggleGroup(row.id, value),
              aggregate: key => {
                const column = live.current.leaves.find(column => column.key === key)
                return column
                  ? aggregate(
                      row.getLeafRows().map(leaf => leaf.original),
                      column,
                      valueOf,
                    )
                  : undefined
              },
            }
          : undefined
        return { ...context, id: row.id, label: labelOf(row.original), group }
      }),
    [
      rowModel,
      selectionRecord,
      expandedState,
      leaves,
      props.selectChildren,
      props.selectable,
      props.selectionMode,
      props.expandable,
      props.rowKey,
      props.rowLabel,
      keyOf,
      labelOf,
      toggleSelected,
      toggleExpanded,
      startEdit,
      toggleGroup,
    ],
  )
  const filteredModel = props.selectAll === 'filtered' ? table.getFilteredRowModel() : undefined
  const selectionRows = useMemo(
    () =>
      uniqueSelectable(
        filteredModel
          ? filteredModel.flatRows
          : rowModel.rows.flatMap(row => (row.getIsGrouped() ? row.getLeafRows() : [row])),
      ),
    [filteredModel, rowModel, selectionRecord, props.selectable, props.selectionMode],
  )
  const pageSelection = useMemo(
    () => selectionState(selectionRows),
    [selectionRows, selectionRecord],
  )
  const selectionDisabled = blocked || !selectionRows.length
  const liveSelection = useLive(selectionRows)
  const togglePage = useStableCallback((value: boolean | 'indeterminate') => {
    if (live.current.blocked || live.current.props.selectionMode === 'single') return
    models.selected.set(
      toggleSelection(
        models.selected.value,
        liveSelection.current,
        value,
        live.current.props.selectChildren !== false,
        keyOf,
      ),
    )
  })
  const setFilter = useStableCallback((column: string, value: unknown) => {
    if (live.current.blocked) return
    models.columnFilters.set(nextColumnFilters(models.columnFilters.value, column, value))
  })
  const headerContext = (column: DataTableColumn<T>) => {
    const target = leaves.some(item => item.key === column.key)
      ? table.getColumn(column.key)
      : undefined
    const direction = target?.getIsSorted() ?? false
    const next = target?.getNextSortingOrder()
    return {
      column,
      sorting: direction,
      sortIndex: target?.getSortIndex() ?? -1,
      filterValue: columnFilters.find(filter => filter.key === column.key)?.value,
      setFilter: (value: unknown) => setFilter(column.key, value),
      nextLabel: sortLabel(next, t.table),
      ariaSort: ariaSort(direction),
      toggleSort: (multi = false) => {
        if (!live.current.blocked && column.sortable)
          engine.current
            .getColumn(column.key)
            ?.toggleSorting(undefined, !!live.current.props.multiSort && multi)
      },
    }
  }
  const getRows = useStableCallback((scope: DataTableScope = 'page') => {
    const current = engine.current
    const source =
      scope === 'page'
        ? current.getRowModel().rows
        : scope === 'filtered'
          ? current.getPreExpandedRowModel().flatRows
          : current.getCoreRowModel().flatRows
    return source
      .filter(row => !row.getIsGrouped() && (scope !== 'selected' || row.getIsSelected()))
      .map(row => row.original)
  })
  Object.assign(api, {
    getRows,
    toggleSelected,
    toggleExpanded,
    setFilter,
    setColumnHidden: (key: string, hidden: boolean) => {
      models.hiddenColumns.set(toggleKey(models.hiddenColumns.value, key, hidden))
    },
  })
  const pageRows = useMemo(
    () => rowModel.rows.filter(row => !row.getIsGrouped()).map(row => row.original),
    [rowModel],
  )
  const state = useMemo<DataTableState<T>>(
    () => ({
      page,
      pageSize,
      sorting,
      filter,
      columnFilters,
      grouping,
      total,
      rows: pageRows,
      selected,
      expanded,
      visibleColumns,
      api,
    }),
    [
      page,
      pageSize,
      sorting,
      filter,
      columnFilters,
      grouping,
      total,
      pageRows,
      selected,
      expanded,
      visibleColumns,
      api,
    ],
  )
  const query = [filter, columnFilters, sorting, grouping, pageSize] as const
  const [previousQuery, setPreviousQuery] = useState<readonly unknown[]>(query)
  let target: number | undefined
  if (changed(previousQuery, query)) {
    setPreviousQuery(query)
    if (props.autoResetPage !== false) target = 1
  }
  target ??= clampedPage(props.pagination, props.loading, knownTotal, page, pageCount)
  const adjusted = useRef<string>(undefined)
  if (target === undefined || target === page) adjusted.current = undefined
  else if (adjusted.current !== `${page}:${target}`) {
    adjusted.current = `${page}:${target}`
    models.page.adjust(target)
  }
  const reported = useRef<readonly unknown[]>(undefined)
  const scheduled = useRef(false)
  const current = useLive({ page, pageSize, onChange })
  useEffect(() => {
    const next = [page, pageSize, sorting, filter, columnFilters, grouping]
    const previous = reported.current
    reported.current = next
    if (!previous || !changed(previous, next)) return
    if (scheduled.current) return
    scheduled.current = true
    queueMicrotask(() => {
      scheduled.current = false
      current.current.onChange(
        tableQuery(current.current.page, current.current.pageSize, {
          sorting: models.sorting.value,
          filter: models.filter.value,
          columnFilters: models.columnFilters.value,
          grouping: models.grouping.value,
        }),
      )
    })
  })
  const activate = useStableCallback((row: T, event: DataTableRowEvent) => {
    if (!live.current.props.rowClickable || live.current.blocked || !isRowAction(event)) return
    if (event.type === 'keydown') event.preventDefault()
    onRowClick(row, event.nativeEvent)
  })
  return {
    api,
    table,
    blocked,
    page,
    pageSize,
    total,
    knownTotal,
    canNext,
    rows,
    leaves,
    visibleColumns,
    pageSelection,
    selectionDisabled,
    state,
    valueOf,
    displayValue,
    togglePage,
    activate,
    headerContext,
    keyOf,
    labelOf,
  }
}

export type DataTableController<T extends object> = ReturnType<typeof useDataTable<T>>
