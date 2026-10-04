'use client'

import { useEffect, useId, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { useUiLocale } from '../../../locale'
import { rowId } from '../../../../../shared/src/lib/data-table/utils'
import type {
  DataTableColumn,
  DataTableEdit,
  DataTableEditorContext,
  DataTableKey,
  DataTableProps,
  DataTableRowContext,
} from '../types'
import type { DataTableController } from './useDataTable'
import { useLive, useStableCallback } from './useLive'

export interface DataTableEditSession {
  key: DataTableKey
  column?: string
  values: Record<string, unknown>
}

export interface DataTableEditingState {
  session: DataTableEditSession | undefined
  errors: Record<string, string>
  pending: boolean
  failure: string | undefined
}

export interface DataTableEditActions<T> {
  updateValue: (column: string, value: unknown) => void
  commit: () => Promise<void>
  cancel: () => void
}

export function isEditingRow(state: DataTableEditingState, key: DataTableKey, column?: string) {
  return (
    state.session?.key === key &&
    (!column || state.session.column === undefined || state.session.column === column)
  )
}

export function editorContext<T>(
  state: DataTableEditingState,
  editMode: 'cell' | 'row' | undefined,
  row: DataTableRowContext<T>,
  column: DataTableColumn<T>,
  actions: DataTableEditActions<T>,
): DataTableEditorContext<T> {
  return {
    ...row,
    column,
    value: state.session?.values[column.key],
    pending: state.pending,
    error: state.errors[column.key] ?? (editMode === 'cell' ? state.failure : undefined),
    updateValue: value => actions.updateValue(column.key, value),
    commit: actions.commit,
    cancel: actions.cancel,
  }
}

export function canEditCell<T>(blocked: boolean, row: T, column: DataTableColumn<T>) {
  return (
    !blocked && (typeof column.editable === 'function' ? column.editable(row) : !!column.editable)
  )
}

const IDLE: DataTableEditingState = {
  session: undefined,
  errors: {},
  pending: false,
  failure: undefined,
}

export function useTableEditing<T extends object>(
  props: DataTableProps<T>,
  ctl: DataTableController<T>,
  onEdit: (edit: DataTableEdit<T>) => void,
  onError: (error: unknown, edit: DataTableEdit<T>) => void,
  element: RefObject<HTMLTableElement | null>,
) {
  const t = useUiLocale()
  const errorId = useId()
  const store = useRef(IDLE)
  const [snapshot, setSnapshot] = useState(IDLE)
  const active = useRef(true)
  const focused = useRef<Element | null | undefined>(undefined)
  const handled = useRef<[DataTableKey | undefined, string | undefined]>([undefined, undefined])
  const live = useLive({ props, ctl, t })
  const update = (patch: Partial<DataTableEditingState>) => {
    const previous = store.current
    const next = { ...previous, ...patch }
    if (
      'session' in patch &&
      focused.current === undefined &&
      (previous.session?.key !== next.session?.key ||
        previous.session?.column !== next.session?.column)
    )
      focused.current = element.current?.ownerDocument.activeElement ?? null
    store.current = next
    setSnapshot(next)
  }
  const rowFailure =
    props.editMode === 'row' && snapshot.failure
      ? { key: snapshot.session?.key, message: snapshot.failure }
      : undefined
  useLayoutEffect(() => {
    const key = snapshot.session?.key
    const column = snapshot.session?.column
    const [previousKey, previousColumn] = handled.current
    if (key === previousKey && column === previousColumn) return
    handled.current = [key, column]
    const before = focused.current
    focused.current = undefined
    const table = element.current
    const findRow = (value: DataTableKey) =>
      table?.querySelector<HTMLElement>(`[data-hn-row="${CSS.escape(rowId(value))}"]`)
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
    } else if (previousKey !== undefined && before && !before.isConnected) {
      findRow(previousKey)
        ?.querySelector<HTMLElement>(
          previousColumn
            ? `[data-hn-cell="${CSS.escape(previousColumn)}"]`
            : '[data-hn-edit-trigger]',
        )
        ?.focus({ preventScroll: true })
    }
  })
  useEffect(() => {
    active.current = true
    return () => {
      active.current = false
    }
  }, [])
  const canEdit = useStableCallback((row: T, column: DataTableColumn<T>) =>
    canEditCell(live.current.ctl.blocked, row, column),
  )
  const coreRow = (key: DataTableKey) =>
    live.current.ctl.table.getCoreRowModel().rowsById[rowId(key)]?.original
  const startEdit = useStableCallback((key: DataTableKey, column?: string) => {
    const { props, ctl } = live.current
    if (!props.editMode || ctl.blocked || store.current.pending) return
    const row = coreRow(key)
    if (!row) return
    const editable = ctl.leaves.filter(
      item => canEdit(row, item) && (props.editMode === 'row' || item.key === column),
    )
    if (!editable.length) return
    const values: Record<string, unknown> = {}
    for (const item of editable) {
      const value = ctl.valueOf(row, item)
      try {
        values[item.key] = structuredClone(value)
      } catch {
        values[item.key] = value
      }
    }
    update({
      session: { key, column: props.editMode === 'cell' ? column : undefined, values },
      errors: {},
      failure: undefined,
    })
  })
  const cancel = useStableCallback(() => {
    if (store.current.pending) return
    update({ session: undefined, errors: {}, failure: undefined })
  })
  const commit = useStableCallback(async () => {
    const current = store.current.session
    if (!current || store.current.pending || live.current.ctl.blocked) return
    const row = coreRow(current.key)
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
    update({ pending: true, errors: {}, failure: undefined })
    try {
      for (const column of live.current.ctl.leaves) {
        if (!(column.key in edit.values)) continue
        if (!canEdit(row, column)) {
          delete edit.values[column.key]
          continue
        }
        if (column.parse) edit.values[column.key] = column.parse(edit.values[column.key], row)
        const error = await column.validate?.(edit.values[column.key], row)
        if (error) update({ errors: { ...store.current.errors, [column.key]: error } })
      }
      if (
        !active.current ||
        store.current.session !== current ||
        Object.keys(store.current.errors).length
      )
        return
      await live.current.props.onSave?.(edit)
      if (!active.current || store.current.session !== current) return
      onEdit(edit)
      update({ session: undefined })
    } catch (error) {
      if (active.current && store.current.session === current) {
        update({
          failure: error instanceof Error ? error.message : live.current.t.table.editFailed,
        })
        onError(error, edit)
      }
    } finally {
      if (active.current) update({ pending: false })
    }
  })
  const updateValue = useStableCallback((column: string, value: unknown) => {
    const session = store.current.session
    if (session && !store.current.pending)
      update({ session: { ...session, values: { ...session.values, [column]: value } } })
  })
  const [actions] = useState<DataTableEditActions<T>>(() => ({ updateValue, commit, cancel }))
  const isEditing = (key: DataTableKey, column?: string) => isEditingRow(snapshot, key, column)
  const context = (row: DataTableRowContext<T>, column: DataTableColumn<T>) =>
    editorContext(snapshot, props.editMode, row, column, actions)
  const rowError = useStableCallback((key: DataTableKey) =>
    rowFailure?.key === key ? rowFailure.message : undefined,
  )
  Object.assign(ctl.api, { startEdit, cancelEdit: cancel, commitEdit: commit })
  return {
    snapshot,
    actions,
    session: snapshot.session,
    pending: snapshot.pending,
    failure: snapshot.failure,
    rowFailure: rowFailure ? `${String(rowFailure.key)}:${rowFailure.message}` : undefined,
    errorId,
    rowError,
    canEdit,
    startEdit,
    isEditing,
    context,
    commit,
    cancel,
    hasErrors: Object.keys(snapshot.errors).length > 0,
  }
}

export type DataTableEditing<T extends object> = ReturnType<typeof useTableEditing<T>>
