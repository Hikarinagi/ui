import { computed, nextTick, onScopeDispose, shallowRef, toRaw, watch, type Ref } from 'vue'
import { useUiLocale } from '../../../locale'
import { rowId } from '../utils'
import type {
  DataTableColumn,
  DataTableEdit,
  DataTableEditorContext,
  DataTableKey,
  DataTableProps,
  DataTableRowContext,
} from '../types'
import type { DataTableController } from './useDataTable'

export function useTableEditing<T extends object>(
  props: DataTableProps<T>,
  ctl: DataTableController<T>,
  onEdit: (edit: DataTableEdit<T>) => void,
  onError: (error: unknown, edit: DataTableEdit<T>) => void,
  element: Ref<HTMLTableElement | undefined>,
) {
  const t = useUiLocale()
  const session = shallowRef<{
    key: DataTableKey
    column?: string
    values: Record<string, unknown>
  }>()
  const errors = shallowRef<Record<string, string>>({})
  const pending = shallowRef(false)
  const failure = shallowRef<string>()
  let active = true
  watch(
    [() => session.value?.key, () => session.value?.column],
    async ([key, column], [previousKey, previousColumn]) => {
      const focused = element.value?.ownerDocument.activeElement
      await nextTick()
      if (!active) return
      const findRow = (value: DataTableKey) =>
        element.value?.querySelector<HTMLElement>(`[data-hn-row="${CSS.escape(rowId(value))}"]`)
      if (key !== undefined) {
        const row = findRow(key)
        const cell = column
          ? row?.querySelector<HTMLElement>(`[data-hn-cell="${CSS.escape(column)}"]`)
          : row
        cell
          ?.querySelector<HTMLElement>(
            'input:not(:disabled), textarea:not(:disabled), [contenteditable="true"], [tabindex="0"]',
          )
          ?.focus({ preventScroll: true })
      } else if (previousKey !== undefined && focused && !focused.isConnected) {
        findRow(previousKey)
          ?.querySelector<HTMLElement>(
            previousColumn
              ? `[data-hn-cell="${CSS.escape(previousColumn)}"]`
              : '[data-hn-edit-trigger]',
          )
          ?.focus({ preventScroll: true })
      }
    },
    { flush: 'pre' },
  )
  const canEdit = (row: T, column: DataTableColumn<T>) =>
    !ctl.blocked.value &&
    (typeof column.editable === 'function' ? column.editable(row) : !!column.editable)
  function startEdit(key: DataTableKey, column?: string) {
    if (!props.editMode || ctl.blocked.value || pending.value) return
    const row = ctl.table.getCoreRowModel().rowsById[rowId(key)]?.original
    if (!row) return
    const editable = ctl.leaves.value.filter(
      item => canEdit(row, item) && (props.editMode === 'row' || item.key === column),
    )
    if (!editable.length) return
    const values: Record<string, unknown> = {}
    for (const item of editable) {
      const value = ctl.valueOf(row, item)
      try {
        values[item.key] = structuredClone(toRaw(value))
      } catch {
        values[item.key] = value
      }
    }
    session.value = { key, column: props.editMode === 'cell' ? column : undefined, values }
    errors.value = {}
    failure.value = undefined
  }
  function cancel() {
    if (pending.value) return
    session.value = undefined
    errors.value = {}
    failure.value = undefined
  }
  async function commit() {
    const current = session.value
    if (!current || pending.value || ctl.blocked.value) return
    const row = ctl.table.getCoreRowModel().rowsById[rowId(current.key)]?.original
    if (!row) {
      cancel()
      return
    }
    const edit: DataTableEdit<T> = {
      key: current.key,
      row,
      column: current.column,
      values: { ...current.values },
    }
    pending.value = true
    errors.value = {}
    failure.value = undefined
    try {
      for (const column of ctl.leaves.value) {
        if (!(column.key in edit.values)) continue
        if (!canEdit(row, column)) {
          delete edit.values[column.key]
          continue
        }
        if (column.parse) edit.values[column.key] = column.parse(edit.values[column.key], row)
        const error = await column.validate?.(edit.values[column.key], row)
        if (error) errors.value = { ...errors.value, [column.key]: error }
      }
      if (!active || session.value !== current || Object.keys(errors.value).length) return
      await props.onSave?.(edit)
      if (!active || session.value !== current) return
      onEdit(edit)
      session.value = undefined
    } catch (error) {
      if (active && session.value === current) {
        failure.value = error instanceof Error ? error.message : t.value.table.editFailed
        onError(error, edit)
      }
    } finally {
      if (active) pending.value = false
    }
  }
  const isEditing = (key: DataTableKey, column?: string) =>
    session.value?.key === key &&
    (!column || session.value.column === undefined || session.value.column === column)
  function context(
    row: DataTableRowContext<T>,
    column: DataTableColumn<T>,
  ): DataTableEditorContext<T> {
    return {
      ...row,
      column,
      value: session.value?.values[column.key],
      pending: pending.value,
      error: errors.value[column.key] ?? failure.value,
      updateValue: value => {
        if (session.value && !pending.value)
          session.value = {
            ...session.value,
            values: { ...session.value.values, [column.key]: value },
          }
      },
      commit,
      cancel,
    }
  }
  Object.assign(ctl.api, { startEdit, cancelEdit: cancel, commitEdit: commit })
  onScopeDispose(() => {
    active = false
  })
  return {
    session,
    pending,
    failure,
    canEdit,
    startEdit,
    isEditing,
    context,
    commit,
    cancel,
    hasErrors: computed(() => Object.keys(errors.value).length > 0),
  }
}
export type DataTableEditing<T extends object> = ReturnType<typeof useTableEditing<T>>
