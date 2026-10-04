'use client'

import { Checkbox, DataTable, Select, Inline } from '@hina-ui/react'
import { useEditableTableDemo } from '../../data-table'

const modes = [
  { value: 'cell', label: '单元格' },
  { value: 'row', label: '整行' },
]

export default function Demo() {
  const { rows, columns, statusLabels, mode, setMode, fail, setFail, save } =
    useEditableTableDemo('zh-CN')
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
      label="条目列表"
      renderToolbar={() => (
        <Inline align="center" wrap>
          <Select
            size="sm"
            value={mode}
            onValueChange={value => setMode(value as 'cell' | 'row')}
            options={modes}
            aria-label="编辑模式"
            className="w-32"
          />
          <Checkbox checked={fail} onCheckedChange={value => setFail(value === true)}>
            模拟保存失败
          </Checkbox>
        </Inline>
      )}
      renderEditor={({ column, value, updateValue, pending }) =>
        column.key === 'status' ? (
          <Select
            value={value as string}
            options={options}
            disabled={pending}
            aria-label="状态"
            size="sm"
            onValueChange={updateValue}
          />
        ) : undefined
      }
    />
  )
}
