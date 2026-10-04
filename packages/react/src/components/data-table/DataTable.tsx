'use client'

import { useId, useImperativeHandle, useMemo, useRef, type ReactNode } from 'react'
import clsx from 'clsx'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { lucide } from '../../lib/icon'
import { useScrollAreaViewport } from '../../lib/virtual/useScrollAreaViewport'
import { useUiLocale } from '../../locale'
import { Button } from '../button/Button'
import { LoadingOverlay } from '../loading-overlay/LoadingOverlay'
import { Pagination } from '../pagination/Pagination'
import { ScrollArea, type ScrollAreaHandle } from '../scroll-area/ScrollArea'
import { TableCell } from '../table/TableCell'
import { tableWrapper } from '../table/table.variants'
import { aggregate, cssSize } from '../../../../shared/src/lib/data-table/utils'
import { DataTableDragPreview } from './DataTableDragPreview'
import { DataTableHead } from './DataTableHead'
import { DataTableRow, type DataTableRowActions, type DataTableRowConfig } from './DataTableRow'
import { toDisplayString } from './display'
import { useDataTable, type DataTableModels } from './hooks/useDataTable'
import { useLive, useStableCallback } from './hooks/useLive'
import { useModel } from './hooks/useModel'
import { useTableColumns } from './hooks/useTableColumns'
import { useTableDrag } from './hooks/useTableDrag'
import { useTableEditing } from './hooks/useTableEditing'
import { useTableExport } from './hooks/useTableExport'
import { useTableVirtual } from './hooks/useTableVirtual'
import type { DataTableProps, DataTableReorder } from './types'

export type {
  DataTableAggregate,
  DataTableApi,
  DataTableCellContext,
  DataTableColumn,
  DataTableEdit,
  DataTableEditorContext,
  DataTableExportOptions,
  DataTableFilter,
  DataTableFilterMode,
  DataTableGroupContext,
  DataTableHandle,
  DataTableHeaderContext,
  DataTableKey,
  DataTableKeyField,
  DataTableProps,
  DataTableQuery,
  DataTableReorder,
  DataTableRowContext,
  DataTableScope,
  DataTableSlots,
  DataTableSort,
  DataTableState,
} from './types'

const ChevronLeftIcon = lucide(ChevronLeft)
const ChevronRightIcon = lucide(ChevronRight)

const empty = <V,>(): V[] => []

export function DataTable<T extends object>(props: DataTableProps<T>) {
  const {
    rows: _rows,
    columns: _columns,
    rowKey: _rowKey,
    rowLabel: _rowLabel,
    selectable,
    selectionMode,
    selectAll: _selectAll,
    selectChildren: _selectChildren,
    expandable,
    getChildren,
    pagination,
    manual: _manual,
    total: _total,
    hasNextPage: _hasNextPage,
    autoResetPage: _autoResetPage,
    multiSort: _multiSort,
    resizable: _resizable,
    resizeMode: _resizeMode,
    reorderColumns: _reorderColumns,
    reorderable,
    virtualize,
    editMode,
    onSave: _onSave,
    loading,
    disabled,
    rowClickable,
    rowClass,
    variant = 'primary',
    hover = true,
    stickyHeader,
    stickyFooter,
    height,
    maxHeight,
    fill,
    layout: _layout,
    caption,
    label,
    emptyText,
    className,
    tableClass,
    page,
    defaultPage,
    onPageChange,
    pageSize,
    defaultPageSize,
    onPageSizeChange,
    sorting,
    defaultSorting,
    onSortingChange,
    filter,
    defaultFilter,
    onFilterChange,
    columnFilters,
    defaultColumnFilters,
    onColumnFiltersChange,
    grouping,
    defaultGrouping,
    onGroupingChange,
    selected,
    defaultSelected,
    onSelectedChange,
    expanded,
    defaultExpanded,
    onExpandedChange,
    expandedGroups,
    defaultExpandedGroups,
    onExpandedGroupsChange,
    hiddenColumns,
    defaultHiddenColumns,
    onHiddenColumnsChange,
    columnOrder,
    defaultColumnOrder,
    onColumnOrderChange,
    columnWidths,
    defaultColumnWidths,
    onColumnWidthsChange,
    onChange: _onChange,
    onRowClick: _onRowClick,
    onRowReorder: _onRowReorder,
    onRowsChange: _onRowsChange,
    onEdit: _onEdit,
    onEditError: _onEditError,
    onRowContextmenu: _onRowContextmenu,
    renderToolbar,
    renderFooter,
    empty: emptyContent,
    loadingContent,
    renderHeader,
    renderCell,
    renderEditor,
    renderExpansion,
    renderGroup,
    renderSummary,
    renderColumnFooter,
    ref,
    style,
    ...attrs
  } = props
  const config: DataTableProps<T> = {
    ...props,
    variant,
    hover,
    autoResetPage: props.autoResetPage ?? true,
    selectChildren: props.selectChildren ?? true,
  }
  const models: DataTableModels = {
    page: useModel(page, defaultPage, () => 1, onPageChange),
    pageSize: useModel(pageSize, defaultPageSize, () => 10, onPageSizeChange),
    sorting: useModel(sorting, defaultSorting, empty, onSortingChange),
    filter: useModel(filter, defaultFilter, () => '', onFilterChange),
    columnFilters: useModel(columnFilters, defaultColumnFilters, empty, onColumnFiltersChange),
    grouping: useModel(grouping, defaultGrouping, empty, onGroupingChange),
    selected: useModel(selected, defaultSelected, empty, onSelectedChange),
    expanded: useModel(expanded, defaultExpanded, empty, onExpandedChange),
    expandedGroups: useModel(expandedGroups, defaultExpandedGroups, empty, onExpandedGroupsChange),
    hiddenColumns: useModel(hiddenColumns, defaultHiddenColumns, empty, onHiddenColumnsChange),
    columnOrder: useModel(columnOrder, defaultColumnOrder, empty, onColumnOrderChange),
    columnWidths: useModel(columnWidths, defaultColumnWidths, () => ({}), onColumnWidthsChange),
  }
  const events = useLive(props)
  const onChange = useStableCallback(
    (query: Parameters<NonNullable<DataTableProps<T>['onChange']>>[0]) =>
      events.current.onChange?.(query),
  )
  const onRowClick = useStableCallback((row: T, event: MouseEvent | KeyboardEvent) =>
    events.current.onRowClick?.(row, event),
  )
  const onRowContextmenu = useStableCallback((row: T, event: MouseEvent) =>
    events.current.onRowContextmenu?.(row, event),
  )
  const t = useUiLocale()
  const name = useId()
  const area = useRef<ScrollAreaHandle>(null)
  const element = useRef<HTMLTableElement>(null)
  const viewport = useScrollAreaViewport(area)
  const ctl = useDataTable(config, models, onChange, onRowClick)
  const hasDrag = !!reorderable
  const hasSelect = !!selectable
  const hasExpand = !!(expandable || getChildren)
  const controls = useMemo(
    () =>
      [hasDrag && 'drag', hasSelect && 'select', hasExpand && 'expand'].filter(
        (value): value is string => typeof value === 'string',
      ),
    [hasDrag, hasSelect, hasExpand],
  )
  const trailing = editMode === 'row' ? 1 : 0
  const layout = useTableColumns(config, models, ctl, element, viewport, controls.length, trailing)
  const editing = useTableEditing(
    config,
    ctl,
    edit => events.current.onEdit?.(edit),
    (error, edit) => events.current.onEditError?.(error, edit),
    element,
  )
  const drag = useTableDrag(
    config,
    models,
    ctl,
    element,
    viewport,
    (change: DataTableReorder<T>) => {
      if (!change.parent) events.current.onRowsChange?.(change.rows)
      events.current.onRowReorder?.(change)
    },
  )
  const virtual = useTableVirtual(
    config,
    ctl,
    element,
    viewport,
    !!renderExpansion,
    editing.rowError,
    editing.rowFailure,
  )
  useTableExport(ctl)
  const visible = ctl.visibleColumns
  const colspan = Math.max(1, visible.length + controls.length + trailing)
  const summaryRows = useMemo(
    () =>
      renderSummary || renderColumnFooter || visible.some(column => column.footer !== undefined)
        ? ctl.api.getRows('filtered')
        : [],
    [renderSummary, renderColumnFooter, visible, ctl.api, ctl.table.getPreExpandedRowModel()],
  )
  const footers: Record<string, ReactNode> = {}
  if (renderColumnFooter)
    for (const column of visible)
      footers[column.key] = renderColumnFooter({ column, rows: summaryRows })
  const hasSummary =
    !!renderSummary ||
    visible.some(column => column.footer !== undefined || footers[column.key] !== undefined)
  const rowConfig = useMemo<DataTableRowConfig<T>>(
    () => ({
      editMode,
      virtualize: !!virtualize,
      hover,
      selectable,
      rowClickable: !!rowClickable,
      rowClass,
      selectionMode,
      tree: !!getChildren,
      reorderable,
    }),
    [
      editMode,
      virtualize,
      hover,
      selectable,
      rowClickable,
      rowClass,
      selectionMode,
      getChildren,
      reorderable,
    ],
  )
  const rowActions = useMemo<DataTableRowActions<T>>(
    () => ({
      activate: ctl.activate,
      contextmenu: onRowContextmenu,
      measure: virtual.measure,
      dragStart: drag.start,
      rowKeydown: drag.rowKeydown,
      edit: editing.actions,
    }),
    [ctl.activate, onRowContextmenu, virtual.measure, drag.start, drag.rowKeydown, editing.actions],
  )
  const rowSlots = { renderCell, renderEditor, renderExpansion, renderGroup }
  const state = useLive(ctl.state)
  const exposed = useLive({ viewport })
  useImperativeHandle(
    ref,
    () => ({
      get viewport() {
        return exposed.current.viewport
      },
      get element() {
        return element.current ?? undefined
      },
      get state() {
        return state.current
      },
      api: ctl.api,
    }),
    [ctl.api, exposed, state],
  )
  const headerCount = layout.headerRows.length
  return (
    <div
      aria-busy={loading || undefined}
      {...attrs}
      style={{ height: cssSize(height), ...style }}
      className={cn(
        'flex min-h-0 min-w-0 w-full max-w-full flex-col gap-3',
        fill && 'h-full',
        className,
      )}
    >
      {renderToolbar?.(ctl.state)}
      <div className={clsx('relative min-h-0', (fill || height) && 'flex-1')}>
        <ScrollArea
          ref={area}
          direction={
            stickyHeader || maxHeight || height || fill || virtualize ? 'both' : 'horizontal'
          }
          style={{
            maxHeight: cssSize(maxHeight ?? (virtualize && !fill && !height ? 400 : undefined)),
          }}
          className={cn(
            tableWrapper({ variant, hover: false }),
            layout.constrained && '@container',
            (fill || height) && 'h-full',
            stickyHeader && '[&_thead_th]:sticky [&_thead_th]:z-[3]',
            stickyFooter &&
              '[&_tfoot_td]:sticky [&_tfoot_td]:bottom-0 [&_tfoot_td]:z-[2] [&_tfoot_td]:bg-(--hn-table-head-bg)',
            tableClass,
          )}
        >
          <table
            ref={element}
            className="hn-table"
            style={layout.tableStyle}
            aria-label={label}
            aria-rowcount={
              virtualize ? virtual.entries.length + headerCount + (hasSummary ? 1 : 0) : undefined
            }
            inert={ctl.blocked || undefined}
          >
            {caption ? (
              <caption>
                <span>{caption}</span>
              </caption>
            ) : null}
            <colgroup style={layout.columnStyles}>
              {controls.map(control => (
                <col key={control} style={{ width: '48px' }} />
              ))}
              {visible.map(column => (
                <col key={column.key} style={layout.columnStyle(column)} />
              ))}
              {trailing ? <col style={{ width: '72px' }} /> : null}
            </colgroup>
            <DataTableHead
              config={config}
              ctl={ctl}
              models={models}
              layout={layout}
              drag={drag}
              controls={controls}
              trailing={trailing}
              slots={{ renderHeader }}
            />
            <tbody>
              {!ctl.rows.length || (!visible.length && !controls.length) ? (
                <tr>
                  <TableCell colSpan={colspan}>
                    <div className="text-muted flex min-h-32 items-center justify-center px-3 py-6 text-sm">
                      {loading
                        ? t.table.loading
                        : !visible.length && !controls.length
                          ? t.table.noColumns
                          : hasContent(emptyContent)
                            ? emptyContent
                            : (emptyText ?? t.table.empty)}
                    </div>
                  </TableCell>
                </tr>
              ) : (
                <>
                  {virtual.before ? (
                    <tr aria-hidden="true">
                      <td
                        colSpan={colspan}
                        style={{ height: `${virtual.before}px`, padding: 0, border: 0 }}
                      />
                    </tr>
                  ) : null}
                  {virtual.visible.map(item => (
                    <DataTableRow<T>
                      key={item.id}
                      item={item}
                      config={rowConfig}
                      blocked={ctl.blocked}
                      movable={drag.movable}
                      columns={visible}
                      leaves={ctl.leaves}
                      headerCount={headerCount}
                      styles={layout.bodyStyles}
                      errorStyle={item.error ? layout.errorStyle : undefined}
                      controls={controls}
                      colspan={colspan}
                      name={name}
                      dragging={drag.key}
                      editing={editing.snapshot}
                      errorId={editing.errorId}
                      rowError={editing.rowError(item.entry.key)}
                      actions={rowActions}
                      slots={rowSlots}
                    />
                  ))}
                  {virtual.after ? (
                    <tr aria-hidden="true">
                      <td
                        colSpan={colspan}
                        style={{ height: `${virtual.after}px`, padding: 0, border: 0 }}
                      />
                    </tr>
                  ) : null}
                </>
              )}
            </tbody>
            {hasSummary ? (
              <tfoot>
                {renderSummary ? (
                  renderSummary(ctl.state)
                ) : (
                  <tr>
                    {controls.map((control, index) => (
                      <TableCell key={control} style={layout.controlStyle('start', index)} />
                    ))}
                    {visible.map(column => {
                      const custom = footers[column.key]
                      return (
                        <TableCell
                          key={column.key}
                          style={layout.cellStyle(column)}
                          align={column.align}
                          className="font-medium"
                        >
                          {custom !== undefined
                            ? custom
                            : toDisplayString(
                                typeof column.footer === 'function'
                                  ? column.footer(summaryRows)
                                  : column.footer === true
                                    ? aggregate(summaryRows, column, ctl.valueOf)
                                    : column.footer,
                              )}
                        </TableCell>
                      )
                    })}
                    {trailing ? <TableCell style={layout.controlStyle('end', 0)} /> : null}
                  </tr>
                )}
              </tfoot>
            ) : null}
          </table>
        </ScrollArea>
        <LoadingOverlay visible={!!loading} text={t.table.loading} className="rounded-lg">
          {loadingContent}
        </LoadingOverlay>
      </div>
      {renderFooter ? (
        renderFooter(ctl.state)
      ) : pagination && ctl.knownTotal ? (
        <Pagination
          value={ctl.page}
          pageSize={ctl.pageSize}
          total={ctl.total}
          itemCount={ctl.api.getRows().length}
          pending={loading}
          disabled={disabled}
          onValueChange={value => models.page.set(value)}
          onPageSizeChange={value => models.pageSize.set(value)}
        />
      ) : pagination ? (
        <nav className="flex items-center gap-2" aria-label={t.pagination.navLabel}>
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            disabled={ctl.blocked || ctl.page <= 1}
            aria-label={t.pagination.prev}
            onClick={() => models.page.set(models.page.value - 1)}
          >
            <ChevronLeftIcon className="rtl:rotate-180" />
          </Button>
          <span className="text-muted text-sm tabular-nums">{ctl.page}</span>
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            disabled={ctl.blocked || !ctl.canNext}
            aria-label={t.pagination.next}
            onClick={() => models.page.set(models.page.value + 1)}
          >
            <ChevronRightIcon className="rtl:rotate-180" />
          </Button>
        </nav>
      ) : null}
      <DataTableDragPreview dragging={drag.dragging} guide={layout.guide} />
    </div>
  )
}
