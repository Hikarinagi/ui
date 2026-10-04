export type DataTableKey = string | number
export type DataTableKeyField<T> = {
  [K in keyof T]-?: T[K] extends DataTableKey ? K : never
}[keyof T] &
  string
export type DataTableAggregate = 'sum' | 'min' | 'max' | 'mean' | 'count' | 'uniqueCount'
export type DataTableScope = 'page' | 'filtered' | 'selected' | 'all'
export type DataTableFilterMode = 'contains' | 'equals' | 'in' | 'range'

export interface DataTableColumn<T> {
  key: string
  label: string
  children?: DataTableColumn<T>[]
  field?: keyof T
  accessor?: (row: T) => unknown
  sortable?: boolean
  sort?: (a: T, b: T) => number
  filterable?: boolean
  filter?: (row: T, query: string) => boolean
  filterValue?: (row: T, value: unknown) => boolean
  filterMode?: DataTableFilterMode
  format?: (value: unknown, row: T) => string | number
  align?: 'start' | 'center' | 'end'
  width?: number | string
  minWidth?: number | string
  maxWidth?: number | string
  pin?: 'start' | 'end'
  truncate?: boolean
  resizable?: boolean
  reorderable?: boolean
  aggregate?: DataTableAggregate | ((rows: T[]) => unknown)
  footer?: boolean | string | ((rows: T[]) => string | number)
  editable?: boolean | ((row: T) => boolean)
  parse?: (value: unknown, row: T) => unknown
  validate?: (value: unknown, row: T) => string | undefined | Promise<string | undefined>
  exportable?: boolean
  exportValue?: (row: T) => unknown
  headerClass?: string
  cellClass?: string | ((row: T) => string | undefined)
}
export interface DataTableSort {
  key: string
  desc: boolean
}
export interface DataTableFilter {
  key: string
  value: unknown
}
export interface DataTableQuery {
  page: number
  pageSize: number
  sorting: DataTableSort[]
  filter: string
  columnFilters: DataTableFilter[]
  grouping: string[]
}
export interface DataTableEdit<T> {
  key: DataTableKey
  row: T
  values: Record<string, unknown>
  column?: string
}
export interface DataTableReorder<T> {
  row: T
  target: T
  parent?: T
  from: number
  to: number
  rows: T[]
}
export interface DataTableExportOptions {
  scope?: DataTableScope
  columns?: string[]
  formatted?: boolean
  delimiter?: ',' | ';' | '\t'
  bom?: boolean
  filename?: string
}
export interface DataTableRowContext<T> {
  row: T
  key: DataTableKey
  index: number
  depth: number
  selected: boolean
  indeterminate: boolean
  selectable: boolean
  expanded: boolean
  expandable: boolean
  toggleSelected: (selected?: boolean) => void
  toggleExpanded: (expanded?: boolean) => void
  startEdit: (column?: string) => void
}
export interface DataTableCellContext<T> extends DataTableRowContext<T> {
  column: DataTableColumn<T>
  value: unknown
}
export interface DataTableHeaderContext<T> {
  column: DataTableColumn<T>
  sorting: 'asc' | 'desc' | false
  sortIndex: number
  filterValue: unknown
  toggleSort: (multi?: boolean) => void
  setFilter: (value: unknown) => void
}
export interface DataTableGroupContext<T> {
  key: string
  column: DataTableColumn<T>
  value: unknown
  rows: T[]
  depth: number
  expanded: boolean
  toggleExpanded: (expanded?: boolean) => void
  aggregate: (column: string) => unknown
}
export interface DataTableEditorContext<T> extends DataTableCellContext<T> {
  value: unknown
  pending: boolean
  error?: string
  updateValue: (value: unknown) => void
  commit: () => Promise<void>
  cancel: () => void
}
export interface DataTableApi<T> {
  getRows: (scope?: DataTableScope) => T[]
  toggleSelected: (key: DataTableKey, selected?: boolean) => void
  toggleExpanded: (key: DataTableKey, expanded?: boolean) => void
  setFilter: (column: string, value: unknown) => void
  setColumnHidden: (column: string, hidden: boolean) => void
  setColumnWidth: (column: string, width: number) => void
  moveColumn: (column: string, target: string) => void
  moveRow: (key: DataTableKey, target: DataTableKey) => void
  startEdit: (key: DataTableKey, column?: string) => void
  cancelEdit: () => void
  commitEdit: () => Promise<void>
  scrollToRow: (key: DataTableKey) => void
  toCsv: (options?: DataTableExportOptions) => string
  exportCsv: (options?: DataTableExportOptions) => void
}
export interface DataTableState<T> extends DataTableQuery {
  total: number
  rows: T[]
  selected: DataTableKey[]
  expanded: DataTableKey[]
  visibleColumns: DataTableColumn<T>[]
  api: DataTableApi<T>
}
export type DataTableCellStyle = {
  position?: 'sticky'
  insetInlineStart?: string
  insetInlineEnd?: string
  zIndex?: number
  backgroundColor?: string
  boxShadow?: string
  width?: string
  minWidth?: string
  maxWidth?: string
  paddingInline?: string
  textAlign?: 'center'
  top?: string | number
}
export interface DataTableHeaderCell<T, S = DataTableCellStyle> extends DataTableHeaderContext<T> {
  id: string
  colspan: number
  rowspan: number
  leaf: boolean
  top: number
  style: S
  ariaSort?: 'ascending' | 'descending'
  nextLabel: string
}
