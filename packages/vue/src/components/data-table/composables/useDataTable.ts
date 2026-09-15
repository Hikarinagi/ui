import { computed, watch, type Ref } from 'vue'
import { useTable, type ColumnDef } from '@tanstack/vue-table'
import { useUiLocale } from '../../../locale'
import { features } from '../features'
import {
  aggregate,
  filterValue,
  flattenColumns,
  isRowAction,
  positiveInteger,
  rowId,
  rowKey,
} from '../utils'
import type {
  DataTableApi,
  DataTableColumn,
  DataTableFilter,
  DataTableGroupContext,
  DataTableKey,
  DataTableProps,
  DataTableQuery,
  DataTableRowContext,
  DataTableSort,
  DataTableState,
} from '../types'

export interface DataTableModels {
  page: Ref<number>
  pageSize: Ref<number>
  sorting: Ref<DataTableSort[]>
  filter: Ref<string>
  columnFilters: Ref<DataTableFilter[]>
  grouping: Ref<string[]>
  selected: Ref<DataTableKey[]>
  expanded: Ref<DataTableKey[]>
  expandedGroups: Ref<string[]>
  hiddenColumns: Ref<string[]>
  columnOrder: Ref<string[]>
  columnWidths: Ref<Record<string, number>>
}
export function useDataTable<T extends object>(
  props: DataTableProps<T>,
  models: DataTableModels,
  onChange: (query: DataTableQuery) => void,
  onRowClick: (row: T, event: MouseEvent | KeyboardEvent) => void,
) {
  const t = useUiLocale()
  const api = {} as DataTableApi<T>
  const blocked = computed(() => !!props.loading || !!props.disabled)
  const pageSize = computed(() => positiveInteger(models.pageSize.value, 10))
  const page = computed(() => positiveInteger(models.page.value, 1))
  const leaves = computed(() => flattenColumns(props.columns))
  const collator = computed(
    () => new Intl.Collator(t.value.tag, { numeric: true, sensitivity: 'base' }),
  )
  const keyOf = (row: T) =>
    typeof props.rowKey === 'function' ? props.rowKey(row) : (row[props.rowKey] as DataTableKey)
  const labelOf = (row: T) =>
    String(
      typeof props.rowLabel === 'function'
        ? props.rowLabel(row)
        : props.rowLabel === undefined
          ? keyOf(row)
          : row[props.rowLabel],
    )
  const valueOf = (row: T, column: DataTableColumn<T>) =>
    column.accessor ? column.accessor(row) : row[column.field ?? (column.key as keyof T)]
  const selectable = (row: T) =>
    typeof props.selectable === 'function' ? props.selectable(row) : !!props.selectable
  const expandable = (row: T) =>
    typeof props.expandable === 'function' ? props.expandable(row) : !!props.expandable
  const columns = computed<ColumnDef<typeof features, T>[]>(() => {
    const compare = collator.value
    return leaves.value.map(column => ({
      id: column.key,
      accessorFn: row => valueOf(row, column) ?? undefined,
      enableSorting: !!column.sortable,
      enableGlobalFilter: column.filterable !== false,
      filterFn: (row, _id, value: unknown) =>
        column.filterValue
          ? column.filterValue(row.original, value)
          : filterValue(valueOf(row.original, column), value, column.filterMode, t.value.tag),
      sortDescFirst: false,
      sortUndefined: 'last',
      sortFn: (a, b, id) => {
        if (column.sort) return column.sort(a.original, b.original)
        const left = a.getValue(id),
          right = b.getValue(id)
        if (typeof left === 'number' && typeof right === 'number') return left - right
        if (left instanceof Date && right instanceof Date) return left.getTime() - right.getTime()
        return compare.compare(String(left), String(right))
      },
    }))
  })
  const table = useTable<typeof features, T>({
    features,
    data: computed(() => props.rows),
    columns,
    getRowId: row => rowId(keyOf(row)),
    getSubRows: row => props.getChildren?.(row),
    manualSorting: computed(() => !!props.manual),
    manualFiltering: computed(() => !!props.manual),
    manualGrouping: computed(() => !!props.manual),
    manualPagination: computed(() => !!props.manual || !props.pagination),
    groupedColumnMode: false,
    filterFromLeafRows: true,
    paginateExpandedRows: false,
    autoResetExpanded: false,
    getRowCanExpand: row =>
      row.getIsGrouped() || row.subRows.length > 0 || expandable(row.original),
    enableMultiSort: computed(() => !!props.multiSort),
    enableMultiRowSelection: computed(() => props.selectionMode !== 'single'),
    enableRowSelection: row => !row.getIsGrouped() && selectable(row.original),
    enableSubRowSelection: computed(
      () => props.selectChildren !== false && props.selectionMode !== 'single',
    ),
    autoResetPageIndex: false,
    getColumnCanGlobalFilter: () => true,
    globalFilterFn: (row, id, query: string) => {
      const column = leaves.value.find(column => column.key === id)!
      return column.filter
        ? column.filter(row.original, query)
        : filterValue(row.getValue(id), query, 'contains', t.value.tag)
    },
    state: computed(() => ({
      sorting: models.sorting.value.map(sort => ({ id: sort.key, desc: sort.desc })),
      globalFilter: models.filter.value.trim(),
      columnFilters: models.columnFilters.value
        .filter(filter => leaves.value.some(column => column.key === filter.key))
        .map(filter => ({ id: filter.key, value: filter.value })),
      grouping: models.grouping.value.filter(key =>
        leaves.value.some(column => column.key === key),
      ),
      expanded: Object.fromEntries(
        [...models.expanded.value.map(rowId), ...models.expandedGroups.value].map(key => [
          key,
          true,
        ]),
      ),
      pagination: { pageIndex: page.value - 1, pageSize: pageSize.value },
      rowSelection: Object.fromEntries(
        models.selected.value.map(key => [rowId(key), true as const]),
      ),
      columnVisibility: Object.fromEntries(models.hiddenColumns.value.map(key => [key, false])),
    })),
    onSortingChange: updater => {
      if (blocked.value) return
      const current = models.sorting.value.map(sort => ({ id: sort.key, desc: sort.desc }))
      const next = typeof updater === 'function' ? updater(current) : updater
      models.sorting.value = next.map(sort => ({ key: sort.id, desc: sort.desc }))
    },
    onRowSelectionChange: updater => {
      if (blocked.value) return
      const current = Object.fromEntries(
        models.selected.value.map(key => [rowId(key), true as const]),
      )
      const next = typeof updater === 'function' ? updater(current) : updater
      models.selected.value = Object.keys(next)
        .filter(key => next[key])
        .map(rowKey)
    },
  })
  const visibleColumns = computed(() => {
    const visible = leaves.value.filter(column => !models.hiddenColumns.value.includes(column.key))
    const order = [...new Set([...models.columnOrder.value, ...visible.map(column => column.key)])]
    return visible.sort((a, b) => {
      const rank = (column: DataTableColumn<T>) =>
        column.pin === 'start' ? 0 : column.pin === 'end' ? 2 : 1
      return rank(a) - rank(b) || order.indexOf(a.key) - order.indexOf(b.key)
    })
  })
  const knownTotal = computed(() => !props.manual || props.total !== undefined)
  const total = computed(() =>
    props.manual
      ? Math.max(0, Math.floor(Number.isFinite(props.total) ? props.total! : props.rows.length))
      : table.getPreExpandedRowModel().rows.length,
  )
  const pageCount = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
  const canNext = computed(() =>
    knownTotal.value
      ? page.value < pageCount.value
      : (props.hasNextPage ?? props.rows.length >= pageSize.value),
  )
  function toggleExpanded(key: DataTableKey, value?: boolean) {
    if (blocked.value) return
    const row = table.getCoreRowModel().rowsById[rowId(key)]
    if (!row?.getCanExpand()) return
    const next = value ?? !models.expanded.value.includes(key)
    models.expanded.value = next
      ? [...new Set([...models.expanded.value, key])]
      : models.expanded.value.filter(item => item !== key)
  }
  function toggleSelected(key: DataTableKey, value?: boolean) {
    if (blocked.value) return
    const row = table.getCoreRowModel().rowsById[rowId(key)]
    if (row?.getCanSelect()) row.toggleSelected(value ?? !row.getIsSelected())
  }
  const rows = computed(() =>
    table.getRowModel().rows.map(row => {
      const context: DataTableRowContext<T> = {
        row: row.original,
        key: keyOf(row.original),
        index: row.index,
        depth: row.depth,
        selected: row.getIsSelected(),
        selectable: row.getCanSelect(),
        indeterminate: props.selectChildren !== false && row.getIsSomeSelected(),
        expanded: row.getIsExpanded(),
        expandable: row.getCanExpand(),
        toggleSelected: value => toggleSelected(keyOf(row.original), value),
        toggleExpanded: value => toggleExpanded(keyOf(row.original), value),
        startEdit: column => api.startEdit(keyOf(row.original), column),
      }
      const group: DataTableGroupContext<T> | undefined = row.getIsGrouped()
        ? {
            key: row.id,
            column: leaves.value.find(column => column.key === row.groupingColumnId)!,
            value: row.groupingValue,
            rows: row
              .getLeafRows()
              .filter(leaf => !leaf.getIsGrouped())
              .map(leaf => leaf.original),
            depth: row.depth,
            expanded: row.getIsExpanded(),
            toggleExpanded: value => {
              if (blocked.value) return
              const next = value ?? !models.expandedGroups.value.includes(row.id)
              models.expandedGroups.value = next
                ? [...new Set([...models.expandedGroups.value, row.id])]
                : models.expandedGroups.value.filter(key => key !== row.id)
            },
            aggregate: key => {
              const column = leaves.value.find(column => column.key === key)
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
  )
  const selectionRows = computed(() => {
    const source =
      props.selectAll === 'filtered'
        ? table.getFilteredRowModel().flatRows
        : table.getRowModel().rows.flatMap(row => (row.getIsGrouped() ? row.getLeafRows() : [row]))
    return [...new Map(source.filter(row => row.getCanSelect()).map(row => [row.id, row])).values()]
  })
  const pageSelection = computed(() => {
    const eligible = selectionRows.value
    if (!eligible.length) return false
    const count = eligible.filter(row => row.getIsSelected()).length
    return count === eligible.length
      ? true
      : count || eligible.some(row => row.getIsSomeSelected())
        ? 'indeterminate'
        : false
  })
  const selectionDisabled = computed(() => blocked.value || !selectionRows.value.length)
  function togglePage(selected: boolean | 'indeterminate') {
    if (blocked.value || props.selectionMode === 'single') return
    const keys = new Set(models.selected.value)
    for (const row of selectionRows.value) {
      const descendants = props.selectChildren === false ? [row] : [row, ...row.getLeafRows()]
      for (const item of descendants)
        if (item.getCanSelect()) {
          if (selected === true) keys.add(keyOf(item.original))
          else keys.delete(keyOf(item.original))
        }
    }
    models.selected.value = [...keys]
  }
  function setFilter(column: string, value: unknown) {
    if (blocked.value) return
    const next = models.columnFilters.value.filter(filter => filter.key !== column)
    if (value != null && value !== '' && !(Array.isArray(value) && !value.length))
      next.push({ key: column, value })
    models.columnFilters.value = next
  }
  function headerContext(column: DataTableColumn<T>) {
    const engine = leaves.value.some(item => item.key === column.key)
      ? table.getColumn(column.key)
      : undefined
    const sorting = engine?.getIsSorted() ?? false
    const next = engine?.getNextSortingOrder()
    return {
      column,
      sorting,
      sortIndex: engine?.getSortIndex() ?? -1,
      filterValue: models.columnFilters.value.find(filter => filter.key === column.key)?.value,
      setFilter: (value: unknown) => setFilter(column.key, value),
      nextLabel:
        next === 'asc'
          ? t.value.table.sortAsc
          : next === 'desc'
            ? t.value.table.sortDesc
            : t.value.table.sortNone,
      ariaSort: sorting
        ? sorting === 'asc'
          ? ('ascending' as const)
          : ('descending' as const)
        : undefined,
      toggleSort: (multi = false) => {
        if (!blocked.value && column.sortable)
          engine?.toggleSorting(undefined, !!props.multiSort && multi)
      },
    }
  }
  function getRows(scope = 'page' as Parameters<DataTableApi<T>['getRows']>[0]) {
    const source =
      scope === 'page'
        ? table.getRowModel().rows
        : scope === 'filtered'
          ? table.getPreExpandedRowModel().flatRows
          : table.getCoreRowModel().flatRows
    return source
      .filter(row => !row.getIsGrouped() && (scope !== 'selected' || row.getIsSelected()))
      .map(row => row.original)
  }
  Object.assign(api, {
    getRows,
    toggleSelected,
    toggleExpanded,
    setFilter,
    setColumnHidden: (key: string, hidden: boolean) => {
      models.hiddenColumns.value = hidden
        ? [...new Set([...models.hiddenColumns.value, key])]
        : models.hiddenColumns.value.filter(value => value !== key)
    },
  })
  const state = computed<DataTableState<T>>(() => ({
    page: page.value,
    pageSize: pageSize.value,
    sorting: models.sorting.value,
    filter: models.filter.value,
    columnFilters: models.columnFilters.value,
    grouping: models.grouping.value,
    total: total.value,
    rows: getRows(),
    selected: models.selected.value,
    expanded: models.expanded.value,
    visibleColumns: visibleColumns.value,
    api,
  }))
  watch(
    () => [
      models.filter.value,
      models.columnFilters.value,
      models.sorting.value,
      models.grouping.value,
      pageSize.value,
    ],
    () => {
      if (props.autoResetPage !== false) models.page.value = 1
    },
    { deep: true },
  )
  watch(
    [pageCount, page, () => props.loading, () => props.pagination, knownTotal],
    () => {
      if (props.pagination && !props.loading && knownTotal.value && page.value > pageCount.value)
        models.page.value = pageCount.value
    },
    { immediate: true },
  )
  watch(
    () => [
      page.value,
      pageSize.value,
      models.sorting.value,
      models.filter.value,
      models.columnFilters.value,
      models.grouping.value,
    ],
    () => {
      onChange({
        page: page.value,
        pageSize: pageSize.value,
        sorting: models.sorting.value.map(sort => ({ ...sort })),
        filter: models.filter.value,
        columnFilters: models.columnFilters.value.map(filter => ({ ...filter })),
        grouping: [...models.grouping.value],
      })
    },
    { deep: true, flush: 'post' },
  )
  function activate(row: T, event: MouseEvent | KeyboardEvent) {
    if (!props.rowClickable || blocked.value || !isRowAction(event)) return
    if (event.type === 'keydown') event.preventDefault()
    onRowClick(row, event)
  }
  function displayValue(row: T, column: DataTableColumn<T>) {
    const value = valueOf(row, column)
    return column.format ? column.format(value, row) : value == null ? '—' : String(value)
  }
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
