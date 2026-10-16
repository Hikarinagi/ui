import { createPicker } from './createPicker'

const month = createPicker('month')
const year = createPicker('year')

export type { PickerRootContext } from './createPicker'

export const MonthPickerRoot = month.Root
export const MonthPickerGrid = month.Grid
export const MonthPickerGridBody = month.GridBody
export const MonthPickerGridRow = month.GridRow
export const MonthPickerCell = month.Cell
export const MonthPickerCellTrigger = month.CellTrigger
export const MonthPickerNext = month.Next
export const MonthPickerPrev = month.Prev
export const injectMonthPickerRootContext = month.injectRootContext

export const YearPickerRoot = year.Root
export const YearPickerGrid = year.Grid
export const YearPickerGridBody = year.GridBody
export const YearPickerGridRow = year.GridRow
export const YearPickerCell = year.Cell
export const YearPickerCellTrigger = year.CellTrigger
export const YearPickerNext = year.Next
export const YearPickerPrev = year.Prev
export const injectYearPickerRootContext = year.injectRootContext
