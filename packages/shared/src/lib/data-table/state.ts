import type { UiMessages } from '../../locale/types'
import type {
  DataTableColumn,
  DataTableFilter,
  DataTableKey,
  DataTableSort,
} from '../../types/data-table'
import { rowId, rowKey } from './utils'

export interface DataTableEngineModels {
  sorting: DataTableSort[]
  filter: string
  columnFilters: DataTableFilter[]
  grouping: string[]
  selected: DataTableKey[]
  expanded: DataTableKey[]
  expandedGroups: string[]
  hiddenColumns: string[]
}

export interface DataTableSelectionRow<T> {
  id: string
  original: T
  getCanSelect: () => boolean
  getIsSelected: () => boolean
  getIsSomeSelected: () => boolean
  getLeafRows: () => DataTableSelectionRow<T>[]
}

export function keyOf<T>(row: T, field: keyof T | ((row: T) => DataTableKey)): DataTableKey {
  return typeof field === 'function' ? field(row) : (row[field] as DataTableKey)
}

export function labelOf<T>(
  row: T,
  label: keyof T | ((row: T) => string) | undefined,
  key: (row: T) => DataTableKey,
) {
  return String(
    typeof label === 'function' ? label(row) : label === undefined ? key(row) : row[label],
  )
}

export function valueOf<T>(row: T, column: DataTableColumn<T>) {
  return column.accessor ? column.accessor(row) : row[column.field ?? (column.key as keyof T)]
}

export function displayValue<T>(row: T, column: DataTableColumn<T>) {
  const value = valueOf(row, column)
  return column.format ? column.format(value, row) : value == null ? '—' : String(value)
}

export function compareValues(left: unknown, right: unknown, collator: Intl.Collator) {
  if (typeof left === 'number' && typeof right === 'number') return left - right
  if (left instanceof Date && right instanceof Date) return left.getTime() - right.getTime()
  return collator.compare(String(left), String(right))
}

export function engineSorting(sorting: DataTableSort[]) {
  return sorting.map(sort => ({ id: sort.key, desc: sort.desc }))
}

export function modelSorting(sorting: { id: string; desc: boolean }[]): DataTableSort[] {
  return sorting.map(sort => ({ key: sort.id, desc: sort.desc }))
}

export function engineSelection(selected: DataTableKey[]) {
  return Object.fromEntries(selected.map(key => [rowId(key), true as const]))
}

export function modelSelection(selection: Record<string, boolean>) {
  return Object.keys(selection)
    .filter(key => selection[key])
    .map(rowKey)
}

export function engineColumnFilters<T>(leaves: DataTableColumn<T>[], filters: DataTableFilter[]) {
  return filters
    .filter(filter => leaves.some(column => column.key === filter.key))
    .map(filter => ({ id: filter.key, value: filter.value }))
}

export function engineGrouping<T>(leaves: DataTableColumn<T>[], grouping: string[]) {
  return grouping.filter(key => leaves.some(column => column.key === key))
}

export function engineExpanded(expanded: DataTableKey[], groups: string[]) {
  return Object.fromEntries([...expanded.map(rowId), ...groups].map(key => [key, true]))
}

export function engineVisibility(hidden: string[]) {
  return Object.fromEntries(hidden.map(key => [key, false]))
}

export function engineState<T>(
  leaves: DataTableColumn<T>[],
  models: DataTableEngineModels,
  page: number,
  pageSize: number,
) {
  return {
    sorting: engineSorting(models.sorting),
    globalFilter: models.filter.trim(),
    columnFilters: engineColumnFilters(leaves, models.columnFilters),
    grouping: engineGrouping(leaves, models.grouping),
    expanded: engineExpanded(models.expanded, models.expandedGroups),
    pagination: { pageIndex: page - 1, pageSize },
    rowSelection: engineSelection(models.selected),
    columnVisibility: engineVisibility(models.hiddenColumns),
  }
}

export function orderColumns<T>(leaves: DataTableColumn<T>[], hidden: string[], order: string[]) {
  const visible = leaves.filter(column => !hidden.includes(column.key))
  const ranking = [...new Set([...order, ...visible.map(column => column.key)])]
  return visible.sort((a, b) => {
    const rank = (column: DataTableColumn<T>) =>
      column.pin === 'start' ? 0 : column.pin === 'end' ? 2 : 1
    return rank(a) - rank(b) || ranking.indexOf(a.key) - ranking.indexOf(b.key)
  })
}

export function toggleKey<K>(list: K[], key: K, next: boolean) {
  return next ? [...new Set([...list, key])] : list.filter(item => item !== key)
}

export function nextColumnFilters(filters: DataTableFilter[], column: string, value: unknown) {
  const next = filters.filter(filter => filter.key !== column)
  if (value != null && value !== '' && !(Array.isArray(value) && !value.length))
    next.push({ key: column, value })
  return next
}

export function totalRows(
  manual: boolean | undefined,
  total: number | undefined,
  supplied: number,
  processed: () => number,
) {
  return manual ? Math.max(0, Math.floor(Number.isFinite(total) ? total! : supplied)) : processed()
}

export function pageCount(total: number, pageSize: number) {
  return Math.max(1, Math.ceil(total / pageSize))
}

export function canGoNext(
  knownTotal: boolean,
  page: number,
  count: number,
  hasNextPage: boolean | undefined,
  rows: number,
  pageSize: number,
) {
  return knownTotal ? page < count : (hasNextPage ?? rows >= pageSize)
}

export function clampedPage(
  pagination: boolean | undefined,
  loading: boolean | undefined,
  knownTotal: boolean,
  page: number,
  count: number,
) {
  return pagination && !loading && knownTotal && page > count ? count : undefined
}

export function uniqueSelectable<R extends { id: string; getCanSelect: () => boolean }>(rows: R[]) {
  return [...new Map(rows.filter(row => row.getCanSelect()).map(row => [row.id, row])).values()]
}

export function selectionState<R extends DataTableSelectionRow<unknown>>(eligible: R[]) {
  if (!eligible.length) return false
  const count = eligible.filter(row => row.getIsSelected()).length
  return count === eligible.length
    ? true
    : count || eligible.some(row => row.getIsSomeSelected())
      ? ('indeterminate' as const)
      : false
}

export function toggleSelection<T>(
  selected: DataTableKey[],
  rows: DataTableSelectionRow<T>[],
  value: boolean | 'indeterminate',
  cascade: boolean,
  key: (row: T) => DataTableKey,
) {
  const keys = new Set(selected)
  for (const row of rows) {
    const descendants = cascade ? [row, ...row.getLeafRows()] : [row]
    for (const item of descendants)
      if (item.getCanSelect()) {
        if (value === true) keys.add(key(item.original))
        else keys.delete(key(item.original))
      }
  }
  return [...keys]
}

export function sortLabel(next: string | false | undefined, messages: UiMessages['table']) {
  return next === 'asc' ? messages.sortAsc : next === 'desc' ? messages.sortDesc : messages.sortNone
}

export function ariaSort(sorting: 'asc' | 'desc' | false) {
  return sorting
    ? sorting === 'asc'
      ? ('ascending' as const)
      : ('descending' as const)
    : undefined
}

export function tableQuery(
  page: number,
  pageSize: number,
  models: Pick<DataTableEngineModels, 'sorting' | 'filter' | 'columnFilters' | 'grouping'>,
) {
  return {
    page,
    pageSize,
    sorting: models.sorting.map(sort => ({ ...sort })),
    filter: models.filter,
    columnFilters: models.columnFilters.map(filter => ({ ...filter })),
    grouping: [...models.grouping],
  }
}
