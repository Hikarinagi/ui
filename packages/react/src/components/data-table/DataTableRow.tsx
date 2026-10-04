'use client'

import { memo, useCallback, type CSSProperties, type ReactNode, type SyntheticEvent } from 'react'
import clsx from 'clsx'
import { Check, ChevronRight, CircleAlert, GripVertical, Pencil, X } from 'lucide-react'
import { cn } from '../../lib/cn'
import { lucide } from '../../lib/icon'
import { useUiLocale } from '../../locale'
import { TableCell } from '../table/TableCell'
import { DataTableAction } from './DataTableAction'
import { DataTableEditor } from './DataTableEditor'
import { DataTableSelection } from './DataTableSelection'
import { DataTableText } from './DataTableText'
import { toDisplayString } from './display'
import { cssSize } from '../../../../shared/src/lib/data-table/utils'
import { displayValue, valueOf } from '../../../../shared/src/lib/data-table/state'
import { isRowAction } from '../../../../shared/src/lib/data-table/utils'
import type { DataTableColumn, DataTableKey, DataTableProps, DataTableSlots } from './types'
import type { DataTableRowEvent } from './hooks/useDataTable'
import type { DataTableRenderEntry } from './hooks/useTableVirtual'
import { canMoveRow } from './hooks/useTableDrag'
import {
  canEditCell,
  editorContext,
  isEditingRow,
  type DataTableEditActions,
  type DataTableEditingState,
} from './hooks/useTableEditing'

const CheckIcon = lucide(Check)
const ChevronRightIcon = lucide(ChevronRight)
const CircleAlertIcon = lucide(CircleAlert)
const GripVerticalIcon = lucide(GripVertical)
const PencilIcon = lucide(Pencil)
const XIcon = lucide(X)

export interface DataTableRowConfig<T> {
  editMode: DataTableProps<T>['editMode']
  virtualize: boolean
  hover: boolean
  selectable: DataTableProps<T>['selectable']
  rowClickable: boolean
  rowClass: DataTableProps<T>['rowClass']
  selectionMode: DataTableProps<T>['selectionMode']
  tree: boolean
  reorderable: DataTableProps<T>['reorderable']
}

export interface DataTableBodyStyles {
  cells: Record<string, CSSProperties>
  start: CSSProperties[]
  end: CSSProperties
}

export interface DataTableRowActions<T> {
  activate: (row: T, event: DataTableRowEvent) => void
  contextmenu: (row: T, event: MouseEvent) => void
  measure: (element: unknown) => void
  dragStart: (
    kind: 'row' | 'column',
    key: string,
    label: string,
    event: PointerEvent,
    handle: HTMLElement,
  ) => void
  rowKeydown: (key: DataTableKey, event: KeyboardEvent, handle: HTMLElement) => void
  edit: DataTableEditActions<T>
}

export interface DataTableRowProps<T> {
  item: DataTableRenderEntry<T>
  config: DataTableRowConfig<T>
  blocked: boolean
  movable: boolean
  columns: DataTableColumn<T>[]
  leaves: DataTableColumn<T>[]
  headerCount: number
  styles: DataTableBodyStyles
  errorStyle: CSSProperties | undefined
  controls: string[]
  colspan: number
  name: string
  dragging: string | undefined
  editing: DataTableEditingState
  errorId: string
  rowError: string | undefined
  actions: DataTableRowActions<T>
  slots: Pick<DataTableSlots<T>, 'renderCell' | 'renderEditor' | 'renderExpansion' | 'renderGroup'>
}

function rowEvent(
  event: SyntheticEvent<HTMLElement, MouseEvent | KeyboardEvent>,
): DataTableRowEvent {
  return {
    target: event.target,
    currentTarget: event.currentTarget,
    type: event.type,
    defaultPrevented: event.defaultPrevented || event.nativeEvent.defaultPrevented,
    nativeEvent: event.nativeEvent,
    preventDefault: () => event.preventDefault(),
  }
}

function DataTableRowView<T>({
  item,
  config,
  blocked,
  movable,
  columns,
  leaves,
  headerCount,
  styles,
  errorStyle,
  controls,
  colspan,
  name,
  dragging,
  editing,
  errorId,
  rowError,
  actions,
  slots,
}: DataTableRowProps<T>) {
  const t = useUiLocale()
  const entry = item.entry
  const measure = actions.measure
  const ref = useCallback((element: HTMLTableRowElement | null) => measure(element), [measure])
  const state = !item.detail && entry.selected ? 'selected' : undefined
  const canEdit = (column: DataTableColumn<T>) => canEditCell(blocked, entry.row, column)
  const editingRow = isEditingRow(editing, entry.key)
  let content: ReactNode
  if (item.detail)
    content = (
      <TableCell data-state={state} colSpan={colspan}>
        {item.error ? (
          <p id={errorId} style={errorStyle} role="alert" className="hn-table-edit-message">
            <CircleAlertIcon aria-hidden="true" />
            {` ${item.error}`}
          </p>
        ) : (
          <div className="p-3">{slots.renderExpansion?.(entry)}</div>
        )}
      </TableCell>
    )
  else if (entry.group) {
    const group = entry.group
    content = slots.renderGroup ? (
      <TableCell data-state={state} colSpan={colspan}>
        {slots.renderGroup(group)}
      </TableCell>
    ) : (
      <>
        {controls.map((control, index) => (
          <TableCell key={control} data-state={state} style={styles.start[index]} />
        ))}
        {columns.map((column, index) => (
          <TableCell
            key={column.key}
            data-state={state}
            align={column.align}
            style={styles.cells[column.key]}
          >
            {index === 0 ? (
              <button
                type="button"
                className="hn-table-group hn-focus-ring"
                disabled={blocked}
                aria-expanded={group.expanded}
                style={{ marginInlineStart: `${entry.depth * 16}px` }}
                onClick={() => group.toggleExpanded()}
              >
                <ChevronRightIcon
                  aria-hidden="true"
                  className={clsx(
                    'hn-transition-transform rtl:rotate-180',
                    group.expanded && 'rotate-90 rtl:rotate-90',
                  )}
                />
                {` ${toDisplayString(group.column.label)}: ${toDisplayString(group.value)} `}
                <span className="text-muted">({group.rows.length})</span>
              </button>
            ) : (
              toDisplayString(group.aggregate(column.key) ?? '—')
            )}
          </TableCell>
        ))}
        {config.editMode === 'row' ? <TableCell data-state={state} style={styles.end} /> : null}
      </>
    )
  } else
    content = (
      <>
        {controls.map((control, index) => (
          <TableCell key={control} data-state={state} style={styles.start[index]}>
            {control === 'drag' ? (
              <DataTableAction
                data-hn-row-drag=""
                className="touch-none cursor-grab"
                disabled={!canMoveRow(movable, config.reorderable, entry.row)}
                aria-label={`${t.table.moveRow}: ${entry.label}`}
                onPointerDown={event =>
                  actions.dragStart(
                    'row',
                    entry.id,
                    entry.label,
                    event.nativeEvent,
                    event.currentTarget,
                  )
                }
                onKeyDown={event => {
                  actions.rowKeydown(entry.key, event.nativeEvent, event.currentTarget)
                  if (event.nativeEvent.cancelBubble) event.stopPropagation()
                }}
              >
                <GripVerticalIcon />
              </DataTableAction>
            ) : control === 'select' ? (
              <DataTableSelection
                single={config.selectionMode === 'single'}
                checked={entry.indeterminate ? 'indeterminate' : entry.selected}
                disabled={blocked || !entry.selectable}
                label={`${t.table.selectRow}: ${entry.label}`}
                name={name}
                onChange={entry.toggleSelected}
              />
            ) : control === 'expand' && entry.expandable ? (
              <DataTableAction
                disabled={blocked}
                aria-label={`${entry.expanded ? t.table.collapse : t.table.expand}: ${entry.label}`}
                aria-expanded={entry.expanded}
                onClick={() => entry.toggleExpanded()}
              >
                <ChevronRightIcon
                  aria-hidden="true"
                  className={clsx(
                    'hn-transition-transform rtl:rotate-180',
                    entry.expanded && 'rotate-90 rtl:rotate-90',
                  )}
                />
              </DataTableAction>
            ) : null}
          </TableCell>
        ))}
        {columns.map((column, index) => {
          const editable = canEdit(column)
          const editingCell = isEditingRow(editing, entry.key, column.key) && editable
          const cellMode = config.editMode === 'cell'
          const context = { ...entry, column, value: valueOf(entry.row, column) }
          const custom = editingCell ? undefined : slots.renderCell?.(context)
          return (
            <TableCell
              key={column.key}
              data-state={state}
              data-hn-cell={column.key}
              data-editing={editingCell ? config.editMode : undefined}
              align={column.align}
              style={styles.cells[column.key]}
              tabIndex={cellMode && editable ? 0 : undefined}
              className={cn(
                typeof column.cellClass === 'function'
                  ? column.cellClass(entry.row)
                  : column.cellClass,
                cellMode && editable && 'hn-focus-ring',
              )}
              onDoubleClick={event => {
                if (cellMode && isRowAction(rowEvent(event))) entry.startEdit(column.key)
              }}
              onKeyDown={event => {
                if (event.key === 'Enter' && cellMode && isRowAction(rowEvent(event)))
                  entry.startEdit(column.key)
              }}
            >
              <div
                className={column.truncate ? 'min-w-0 overflow-hidden' : undefined}
                style={{
                  maxWidth: cssSize(column.maxWidth),
                  paddingInlineStart:
                    index === 0 && config.tree ? `${entry.depth * 16}px` : undefined,
                }}
              >
                {editingCell ? (
                  <DataTableEditor
                    context={editorContext(editing, config.editMode, entry, column, actions.edit)}
                    renderEditor={slots.renderEditor}
                    cell={cellMode}
                  />
                ) : custom !== undefined ? (
                  custom
                ) : (
                  <DataTableText
                    value={displayValue(entry.row, column)}
                    truncate={column.truncate}
                  />
                )}
              </div>
            </TableCell>
          )
        })}
        {config.editMode === 'row' ? (
          <TableCell data-state={state} className="hn-table-edit-actions" style={styles.end}>
            {editingRow ? (
              <div className="hn-table-editor-control justify-center">
                <DataTableAction
                  loading={editing.pending}
                  aria-describedby={rowError ? errorId : undefined}
                  aria-label={t.table.save}
                  onClick={() => void actions.edit.commit()}
                >
                  <CheckIcon />
                </DataTableAction>
                <DataTableAction
                  disabled={editing.pending}
                  aria-label={t.table.cancel}
                  onClick={() => actions.edit.cancel()}
                >
                  <XIcon />
                </DataTableAction>
              </div>
            ) : (
              <DataTableAction
                disabled={blocked || !leaves.some(column => canEdit(column))}
                className="hn-table-edit-trigger"
                data-hn-edit-trigger=""
                aria-label={`${t.table.edit}: ${entry.label}`}
                onClick={() => entry.startEdit()}
              >
                <PencilIcon />
              </DataTableAction>
            )}
          </TableCell>
        ) : null}
      </>
    )
  return (
    <tr
      ref={ref}
      data-index={item.index}
      data-editing={!item.detail && !entry.group && editingRow ? config.editMode : undefined}
      data-edit-error={item.error ? '' : undefined}
      data-hn-row={item.detail ? undefined : entry.id}
      aria-rowindex={config.virtualize ? item.index + headerCount + 1 : undefined}
      data-state={entry.selected ? 'selected' : undefined}
      data-hn-state-group={!item.detail && config.hover ? '' : undefined}
      tabIndex={!item.detail && !entry.group && config.rowClickable && !blocked ? 0 : undefined}
      className={cn(
        !item.detail && (config.hover || config.selectable) && '[&>td]:hn-state-layer',
        !item.detail && !entry.group && config.rowClickable && 'hn-focus-ring cursor-pointer',
        !entry.group && config.rowClass?.(entry.row),
        dragging === entry.id && 'opacity-50',
      )}
      onContextMenu={event => {
        if (!item.detail && !entry.group) actions.contextmenu(entry.row, event.nativeEvent)
      }}
      onClick={event => {
        if (!item.detail && !entry.group) actions.activate(entry.row, rowEvent(event))
      }}
      onKeyDown={event => {
        if ((event.key === 'Enter' || event.key === ' ') && !item.detail && !entry.group)
          actions.activate(entry.row, rowEvent(event))
      }}
    >
      {content}
    </tr>
  )
}

function sameItem<T>(a: DataTableRenderEntry<T>, b: DataTableRenderEntry<T>) {
  return (
    a.id === b.id &&
    a.index === b.index &&
    a.detail === b.detail &&
    a.error === b.error &&
    a.entry === b.entry
  )
}

export const DataTableRow = memo(DataTableRowView, (previous, next) => {
  for (const key of Object.keys(next) as (keyof DataTableRowProps<unknown>)[]) {
    if (key === 'item') {
      if (!sameItem(previous.item, next.item)) return false
    } else if (key === 'slots') {
      const a = previous.slots,
        b = next.slots
      if (
        a.renderCell !== b.renderCell ||
        a.renderEditor !== b.renderEditor ||
        a.renderExpansion !== b.renderExpansion ||
        a.renderGroup !== b.renderGroup
      )
        return false
    } else if (!Object.is(previous[key], next[key])) return false
  }
  return true
}) as <T>(props: DataTableRowProps<T>) => ReactNode
