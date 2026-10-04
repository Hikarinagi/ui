import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react'
import type { VirtualizeOptions } from '../../lib/virtual/types'
import type { TableVariants } from '../table/table.variants'
import type {
  DataTableApi,
  DataTableCellContext,
  DataTableColumn,
  DataTableEdit,
  DataTableEditorContext,
  DataTableFilter,
  DataTableGroupContext,
  DataTableHeaderCell,
  DataTableHeaderContext,
  DataTableKey,
  DataTableKeyField,
  DataTableQuery,
  DataTableReorder,
  DataTableRowContext,
  DataTableSort,
  DataTableState,
} from '../../../../shared/src/types/data-table'

export type * from '../../../../shared/src/types/data-table'

export interface DataTableSlots<T> {
  renderToolbar?: (state: DataTableState<T>) => ReactNode
  renderFooter?: (state: DataTableState<T>) => ReactNode
  empty?: ReactNode
  loadingContent?: ReactNode
  renderHeader?: (context: DataTableHeaderContext<T>) => ReactNode
  renderCell?: (context: DataTableCellContext<T>) => ReactNode
  renderEditor?: (context: DataTableEditorContext<T>) => ReactNode
  renderExpansion?: (context: DataTableRowContext<T>) => ReactNode
  renderGroup?: (context: DataTableGroupContext<T>) => ReactNode
  renderSummary?: (state: DataTableState<T>) => ReactNode
  renderColumnFooter?: (context: { column: DataTableColumn<T>; rows: T[] }) => ReactNode
}

export interface DataTableHandle<T> {
  readonly viewport: HTMLElement | undefined
  readonly element: HTMLTableElement | undefined
  readonly state: DataTableState<T>
  readonly api: DataTableApi<T>
}

export interface DataTableProps<T>
  extends
    DataTableSlots<T>,
    Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'children' | 'rows'> {
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
  className?: string
  tableClass?: string
  page?: number
  defaultPage?: number
  onPageChange?: (page: number) => void
  pageSize?: number
  defaultPageSize?: number
  onPageSizeChange?: (pageSize: number) => void
  sorting?: DataTableSort[]
  defaultSorting?: DataTableSort[]
  onSortingChange?: (sorting: DataTableSort[]) => void
  filter?: string
  defaultFilter?: string
  onFilterChange?: (filter: string) => void
  columnFilters?: DataTableFilter[]
  defaultColumnFilters?: DataTableFilter[]
  onColumnFiltersChange?: (columnFilters: DataTableFilter[]) => void
  grouping?: string[]
  defaultGrouping?: string[]
  onGroupingChange?: (grouping: string[]) => void
  selected?: DataTableKey[]
  defaultSelected?: DataTableKey[]
  onSelectedChange?: (selected: DataTableKey[]) => void
  expanded?: DataTableKey[]
  defaultExpanded?: DataTableKey[]
  onExpandedChange?: (expanded: DataTableKey[]) => void
  expandedGroups?: string[]
  defaultExpandedGroups?: string[]
  onExpandedGroupsChange?: (expandedGroups: string[]) => void
  hiddenColumns?: string[]
  defaultHiddenColumns?: string[]
  onHiddenColumnsChange?: (hiddenColumns: string[]) => void
  columnOrder?: string[]
  defaultColumnOrder?: string[]
  onColumnOrderChange?: (columnOrder: string[]) => void
  columnWidths?: Record<string, number>
  defaultColumnWidths?: Record<string, number>
  onColumnWidthsChange?: (columnWidths: Record<string, number>) => void
  onChange?: (query: DataTableQuery) => void
  onRowClick?: (row: T, event: MouseEvent | KeyboardEvent) => void
  onRowReorder?: (change: DataTableReorder<T>) => void
  onRowsChange?: (rows: T[]) => void
  onEdit?: (edit: DataTableEdit<T>) => void
  onEditError?: (error: unknown, edit: DataTableEdit<T>) => void
  onRowContextmenu?: (row: T, event: MouseEvent) => void
  ref?: Ref<DataTableHandle<T>>
}

export interface DataTableHeader<T> extends DataTableHeaderCell<T, CSSProperties> {}
