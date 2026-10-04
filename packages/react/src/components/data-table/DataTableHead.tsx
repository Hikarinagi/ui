'use client'

import {
  createElement,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import { cn } from '../../lib/cn'
import { lucide } from '../../lib/icon'
import { useUiLocale } from '../../locale'
import { Checkbox } from '../checkbox/Checkbox'
import { TooltipTarget } from '../float-button/TooltipTarget'
import { TableHead } from '../table/TableHead'
import type { DataTableColumn, DataTableHeader, DataTableProps, DataTableSlots } from './types'
import type { DataTableController, DataTableModels } from './hooks/useDataTable'
import type { DataTableLayout } from './hooks/useTableColumns'
import type { DataTableDrag } from './hooks/useTableDrag'

const ArrowUpIcon = lucide(ArrowUp)
const ArrowDownIcon = lucide(ArrowDown)
const ChevronsUpDownIcon = lucide(ChevronsUpDown)

export interface DataTableHeadProps<T extends object> {
  config: DataTableProps<T>
  ctl: DataTableController<T>
  models: DataTableModels
  layout: DataTableLayout<T>
  drag: DataTableDrag<T>
  controls: string[]
  trailing: number
  slots: DataTableSlots<T>
}

interface ResizeHandleProps<T extends object> {
  column: DataTableColumn<T>
  layout: DataTableLayout<T>
}

function ResizeHandle<T extends object>({ column, layout }: ResizeHandleProps<T>) {
  const t = useUiLocale()
  const [element, setElement] = useState<HTMLDivElement | null>(null)
  const visible = layout.handleVisible(column)
  const label = `${t.table.resizeColumn}: ${layout.resizeLabel(column)}`
  const bounds = layout.bounds(column)
  return (
    <>
      <div
        ref={setElement}
        role="separator"
        aria-orientation="vertical"
        tabIndex={visible ? 0 : -1}
        style={layout.handleStyle(column)}
        aria-label={label}
        aria-valuenow={Math.round(layout.width(column))}
        aria-valuetext={layout.resizeValueText(column)}
        aria-valuemin={Math.round(bounds.min)}
        aria-valuemax={Math.round(bounds.max)}
        data-side={layout.boundary(column)?.side}
        className="hn-table-resize hn-focus-ring"
        data-resizing={layout.resizing === column.key ? '' : undefined}
        onClick={event => event.stopPropagation()}
        onPointerDown={event => {
          layout.resize(column, event.nativeEvent, event.currentTarget)
          if (event.nativeEvent.cancelBubble) event.stopPropagation()
        }}
        onKeyDown={event => {
          layout.resizeKey(column, event.nativeEvent)
          if (event.nativeEvent.cancelBubble) event.stopPropagation()
        }}
      />
      <TooltipTarget
        target={element}
        options={{ content: !layout.resizing && visible ? label : '' }}
      />
    </>
  )
}

function Heading<T extends object>({
  header,
  config,
  ctl,
  models,
  drag,
}: {
  header: DataTableHeader<T>
  config: DataTableProps<T>
  ctl: DataTableController<T>
  models: DataTableModels
  drag: DataTableDrag<T>
}) {
  const t = useUiLocale()
  const column = header.column
  const reorder = config.reorderColumns && column.reorderable !== false
  const tag = header.leaf && (column.sortable || reorder) ? 'button' : 'span'
  const element = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    if (tag === 'span') element.current?.setAttribute('disabled', String(ctl.blocked))
  }, [tag, ctl.blocked])
  return createElement(
    tag,
    {
      ref: element,
      'data-hn-table-heading': '',
      className: 'hn-table-heading hn-focus-ring',
      type: header.leaf && (column.sortable || config.reorderColumns) ? 'button' : undefined,
      disabled: ctl.blocked,
      'data-sorted': header.sorting || undefined,
      'aria-label': column.sortable ? `${column.label}: ${header.nextLabel}` : undefined,
      'aria-description': reorder ? `${t.table.moveColumn}: Alt + ← / →` : undefined,
      'aria-keyshortcuts': reorder ? 'Alt+ArrowLeft Alt+ArrowRight' : undefined,
      onClick: (event: MouseEvent) => {
        if (header.leaf && column.sortable) header.toggleSort(event.shiftKey)
      },
      onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
        if (header.leaf && reorder) {
          drag.columnKeydown(column.key, event.nativeEvent, event.currentTarget)
          if (event.nativeEvent.cancelBubble) event.stopPropagation()
        }
      },
    },
    <span className={cn('min-w-0', (column.truncate || config.resizable) && 'truncate')}>
      {column.label}
    </span>,
    header.leaf && column.sortable ? (
      <span className="hn-table-sort" aria-hidden="true">
        {header.sorting === 'asc' ? (
          <ArrowUpIcon />
        ) : header.sorting === 'desc' ? (
          <ArrowDownIcon />
        ) : (
          <ChevronsUpDownIcon />
        )}
        {config.multiSort && models.sorting.value.length > 1 && header.sortIndex >= 0 ? (
          <span className="text-xs">{header.sortIndex + 1}</span>
        ) : null}
      </span>
    ) : null,
  )
}

export function DataTableHead<T extends object>({
  config,
  ctl,
  models,
  layout,
  drag,
  controls,
  trailing,
  slots,
}: DataTableHeadProps<T>) {
  const t = useUiLocale()
  const rows = layout.headerRows
  return (
    <thead>
      {rows.map((headers, level) => (
        <tr key={level}>
          {level === 0 &&
            controls.map((control, index) => (
              <TableHead
                key={control}
                rowSpan={rows.length}
                style={{ ...layout.controlStyle('start', index, true), top: 0 }}
              >
                {control === 'select' && config.selectionMode !== 'single' ? (
                  <Checkbox
                    className="mx-auto"
                    checked={ctl.pageSelection}
                    disabled={ctl.selectionDisabled}
                    aria-label={
                      config.selectAll === 'filtered' ? t.table.selectFiltered : t.table.selectPage
                    }
                    onCheckedChange={ctl.togglePage}
                  />
                ) : (
                  <span className="sr-only">
                    {control === 'select'
                      ? t.table.selectRow
                      : control === 'drag'
                        ? t.table.moveRow
                        : t.table.expand}
                  </span>
                )}
              </TableHead>
            ))}
          {headers.map(header => {
            const custom = slots.renderHeader?.(header)
            return (
              <TableHead
                key={header.id}
                data-hn-column={header.leaf ? header.column.key : undefined}
                scope={header.leaf ? 'col' : 'colgroup'}
                colSpan={header.colspan}
                rowSpan={header.rowspan}
                align={header.column.align}
                aria-sort={header.ariaSort}
                style={header.style}
                className={cn(
                  'hn-table-header relative p-0',
                  header.column.headerClass,
                  drag.kind === 'column' && drag.key === header.column.key && 'opacity-40',
                )}
                data-reorderable={
                  header.leaf &&
                  config.reorderColumns &&
                  header.column.reorderable !== false &&
                  !ctl.blocked
                    ? ''
                    : undefined
                }
                data-align={header.column.align}
                onPointerDown={event => {
                  if (header.leaf)
                    drag.start(
                      'column',
                      header.column.key,
                      header.column.label,
                      event.nativeEvent,
                      event.currentTarget,
                    )
                }}
              >
                {custom !== undefined ? (
                  custom
                ) : (
                  <Heading header={header} config={config} ctl={ctl} models={models} drag={drag} />
                )}
                {header.leaf && layout.canResize(header.column) && !ctl.blocked ? (
                  <ResizeHandle column={header.column} layout={layout} />
                ) : null}
              </TableHead>
            )
          })}
          {level === 0 && trailing ? (
            <TableHead
              rowSpan={rows.length}
              style={{ ...layout.controlStyle('end', 0, true), top: 0 }}
            >
              <span className="sr-only">{t.table.edit}</span>
            </TableHead>
          ) : null}
        </tr>
      ))}
    </thead>
  )
}
