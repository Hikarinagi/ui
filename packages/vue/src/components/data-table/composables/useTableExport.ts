import type { DataTableExportOptions } from '../types'
import type { DataTableController } from './useDataTable'

export function useTableExport<T extends object>(ctl: DataTableController<T>) {
  function toCsv(options: DataTableExportOptions = {}) {
    const delimiter = options.delimiter ?? ','
    const columns = ctl.visibleColumns.value.filter(
      column =>
        column.exportable !== false && (!options.columns || options.columns.includes(column.key)),
    )
    const escape = (value: unknown) => {
      let text = value == null ? '' : String(value)
      if (typeof value === 'string' && /^[\s]*[=+@-]/.test(text)) text = "'" + text
      return '"' + text.replaceAll('"', '""') + '"'
    }
    const lines = [columns.map(column => escape(column.label)).join(delimiter)]
    for (const row of ctl.api.getRows(options.scope ?? 'filtered')) {
      lines.push(
        columns
          .map(column =>
            escape(
              column.exportValue
                ? column.exportValue(row)
                : options.formatted
                  ? ctl.displayValue(row, column)
                  : ctl.valueOf(row, column),
            ),
          )
          .join(delimiter),
      )
    }
    return (options.bom === false ? '' : '\uFEFF') + lines.join('\r\n')
  }
  function exportCsv(options: DataTableExportOptions = {}) {
    if (typeof document === 'undefined') return
    const url = URL.createObjectURL(new Blob([toCsv(options)], { type: 'text/csv;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = options.filename ?? 'data.csv'
    anchor.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  Object.assign(ctl.api, { toCsv, exportCsv })
}
