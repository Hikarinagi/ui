import type { VirtualizeOptions } from '../../lib/virtual/types'
import type { CSSProperties } from 'vue'
import type { TableVariants } from '../table/table.variants'
import type {
  DataTableCellContext,
  DataTableColumn,
  DataTableEdit,
  DataTableEditorContext,
  DataTableGroupContext,
  DataTableHeaderCell,
  DataTableHeaderContext,
  DataTableKey,
  DataTableKeyField,
  DataTableRowContext,
  DataTableState,
} from '../../../../shared/src/types/data-table'

export * from '../../../../shared/src/types/data-table'

export interface DataTableProps<T> {
  rows: T[]
  columns: DataTableColumn<T>[]
  rowKey: DataTableKeyField<T> | ((row: T) => DataTableKey)
  rowLabel?: keyof T | ((row: T) => string)
  selectable?: boolean | ((row: T) => boolean)
  selectionMode?: 'single' | 'multiple'
  selectAll?: 'page' | 'filtered'
  selectChildren?: boolean
  expandable?: boolean | ((row: T) => boolean)
  getChildren?: (row: T) => T[] | undefined
  pagination?: boolean
  manual?: boolean
  total?: number
  hasNextPage?: boolean
  autoResetPage?: boolean
  multiSort?: boolean
  resizable?: boolean
  resizeMode?: 'fit' | 'expand'
  reorderColumns?: boolean
  reorderable?: boolean | ((row: T) => boolean)
  virtualize?: VirtualizeOptions
  editMode?: 'cell' | 'row'
  onSave?: (edit: DataTableEdit<T>) => void | Promise<void>
  loading?: boolean
  disabled?: boolean
  rowClickable?: boolean
  rowClass?: (row: T) => string | undefined
  variant?: TableVariants['variant']
  hover?: boolean
  stickyHeader?: boolean
  stickyFooter?: boolean
  height?: number | string
  maxHeight?: number | string
  fill?: boolean
  layout?: 'auto' | 'fixed'
  caption?: string
  label?: string
  emptyText?: string
  class?: string
  tableClass?: string
}
export type DataTableSlots<T> = {
  toolbar?(state: DataTableState<T>): unknown
  footer?(state: DataTableState<T>): unknown
  empty?(): unknown
  loading?(): unknown
  header?(context: DataTableHeaderContext<T>): unknown
  cell?(context: DataTableCellContext<T>): unknown
  editor?(context: DataTableEditorContext<T>): unknown
  expansion?(context: DataTableRowContext<T>): unknown
  group?(context: DataTableGroupContext<T>): unknown
  summary?(context: DataTableState<T>): unknown
} & { [K in `cell-${string}`]?: (context: DataTableCellContext<T>) => unknown } & {
  [K in `header-${string}`]?: (context: DataTableHeaderContext<T>) => unknown
} & { [K in `editor-${string}`]?: (context: DataTableEditorContext<T>) => unknown } & {
  [K in `footer-${string}`]?: (context: { column: DataTableColumn<T>; rows: T[] }) => unknown
}

export interface DataTableHeader<T> extends DataTableHeaderCell<T, CSSProperties> {}
