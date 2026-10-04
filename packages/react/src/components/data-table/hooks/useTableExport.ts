import { downloadCsv, tableCsv } from '../../../../../shared/src/lib/data-table/csv'
import type { DataTableExportOptions } from '../types'
import type { DataTableController } from './useDataTable'

export function useTableExport<T extends object>(ctl: DataTableController<T>) {
  const visible = ctl.visibleColumns
  function toCsv(options: DataTableExportOptions = {}) {
    return tableCsv(
      visible,
      ctl.api.getRows(options.scope ?? 'filtered'),
      options,
      ctl.valueOf,
      ctl.displayValue,
    )
  }
  function exportCsv(options: DataTableExportOptions = {}) {
    if (typeof document === 'undefined') return
    downloadCsv(toCsv(options), options.filename)
  }
  Object.assign(ctl.api, { toCsv, exportCsv })
}
