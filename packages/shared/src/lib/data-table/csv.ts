import type { DataTableColumn, DataTableExportOptions } from '../../types/data-table'

export function exportColumns<T>(columns: DataTableColumn<T>[], options: DataTableExportOptions) {
  return columns.filter(
    column =>
      column.exportable !== false && (!options.columns || options.columns.includes(column.key)),
  )
}

export function tableCsv<T>(
  visible: DataTableColumn<T>[],
  rows: T[],
  options: DataTableExportOptions,
  valueOf: (row: T, column: DataTableColumn<T>) => unknown,
  displayValue: (row: T, column: DataTableColumn<T>) => unknown,
) {
  const delimiter = options.delimiter ?? ','
  const columns = exportColumns(visible, options)
  const escape = (value: unknown) => {
    let text = value == null ? '' : String(value)
    if (typeof value === 'string' && /^[\s]*[=+@-]/.test(text)) text = "'" + text
    return '"' + text.replaceAll('"', '""') + '"'
  }
  const lines = [columns.map(column => escape(column.label)).join(delimiter)]
  for (const row of rows) {
    lines.push(
      columns
        .map(column =>
          escape(
            column.exportValue
              ? column.exportValue(row)
              : options.formatted
                ? displayValue(row, column)
                : valueOf(row, column),
          ),
        )
        .join(delimiter),
    )
  }
  return (options.bom === false ? '' : '﻿') + lines.join('\r\n')
}

export function downloadCsv(text: string, filename = 'data.csv') {
  if (typeof document === 'undefined') return
  const url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
