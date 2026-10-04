'use client'

import { useState } from 'react'
import { DataTable, Pagination } from '@hina-ui/react'
import { tableDemo } from '../../data-table'

const { rows, columns } = tableDemo('en')

export default function Demo() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  return (
    <DataTable
      page={page}
      onPageChange={setPage}
      pageSize={pageSize}
      onPageSizeChange={setPageSize}
      rows={rows}
      columns={columns}
      rowKey="id"
      pagination
      label="Entries"
      renderFooter={({ total, rows: visible }) => (
        <Pagination
          value={page}
          onValueChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          total={total}
          itemCount={visible.length}
          pageSizeOptions={[5, 10, 20]}
          showInfo
          showJump
          align="between"
        />
      )}
    />
  )
}
