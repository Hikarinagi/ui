'use client'

import { Checkbox, DataTable, Select, Inline } from '@hina-ui/react'
import { useEditableTableDemo } from '../../data-table'

const modes = [
  { value: 'cell', label: 'Cell' },
  { value: 'row', label: 'Row' },
]

export default function Demo() {
  const { rows, columns, statusLabels, mode, setMode, fail, setFail, save } =
    useEditableTableDemo('en')
  const options = Object.entries(statusLabels).map(([value, label]) => ({ value, label }))

  return (
    <DataTable
      rows={rows}
      columns={columns}
      rowKey="id"
      rowLabel="name"
      editMode={mode}
      onSave={save}
      layout="fixed"
      label="Entries"
      renderToolbar={() => (
        <Inline align="center" wrap>
          <Select
            size="sm"
            value={mode}
            onValueChange={value => setMode(value as 'cell' | 'row')}
            options={modes}
            aria-label="Edit mode"
            className="w-32"
          />
          <Checkbox checked={fail} onCheckedChange={value => setFail(value === true)}>
            Simulate save failure
          </Checkbox>
        </Inline>
      )}
      renderEditor={({ column, value, updateValue, pending }) =>
        column.key === 'status' ? (
          <Select
            value={value as string}
            options={options}
            disabled={pending}
            aria-label="Status"
            size="sm"
            onValueChange={updateValue}
          />
        ) : undefined
      }
    />
  )
}
