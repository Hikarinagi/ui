'use client'

import { useId, type KeyboardEvent } from 'react'
import { Check, X } from 'lucide-react'
import { lucide } from '../../lib/icon'
import { useUiLocale } from '../../locale'
import { Input } from '../input/Input'
import { InputGroup } from '../input-group/InputGroup'
import { DataTableAction } from './DataTableAction'
import type { DataTableEditorContext, DataTableSlots } from './types'

const CheckIcon = lucide(Check)
const XIcon = lucide(X)

export interface DataTableEditorProps<T> {
  context: DataTableEditorContext<T>
  renderEditor: DataTableSlots<T>['renderEditor']
  cell: boolean
}

export function DataTableEditor<T>({ context, renderEditor, cell }: DataTableEditorProps<T>) {
  const t = useUiLocale()
  const errorId = useId()
  const custom = renderEditor?.(context)
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      void context.commit()
    } else if (event.key === 'Escape' || event.key === 'Esc') {
      event.preventDefault()
      context.cancel()
    }
  }
  return (
    <div
      className="hn-table-editor"
      onClick={event => event.stopPropagation()}
      onKeyDown={event => event.stopPropagation()}
    >
      <div className="hn-table-editor-control">
        <InputGroup
          variant="bare"
          size="sm"
          disabled={context.pending}
          invalid={!!context.error}
          className="hn-table-editor-field"
          role="group"
          aria-label={`${t.table.edit}: ${context.column.label}`}
          aria-describedby={context.error ? errorId : undefined}
        >
          {custom !== undefined ? (
            custom
          ) : (
            <Input
              value={String(context.value ?? '')}
              aria-label={`${t.table.edit}: ${context.column.label}`}
              aria-describedby={context.error ? errorId : undefined}
              onValueChange={context.updateValue}
              onKeyDown={onKeyDown}
            />
          )}
        </InputGroup>
        {cell && (
          <>
            <DataTableAction
              loading={context.pending}
              aria-label={t.table.save}
              onClick={() => void context.commit()}
            >
              <CheckIcon />
            </DataTableAction>
            <DataTableAction
              disabled={context.pending}
              aria-label={t.table.cancel}
              onClick={() => context.cancel()}
            >
              <XIcon />
            </DataTableAction>
          </>
        )}
      </div>
      {context.error && (
        <p id={errorId} role="alert" className="hn-table-field-error">
          {context.error}
        </p>
      )}
    </div>
  )
}
