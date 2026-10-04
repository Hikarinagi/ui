'use client'

import { DataTable } from '@hina-ui/react'
import { useRemoteTableDemo } from '../../data-table'

export default function Demo() {
  const { rows, columns, loading, total, lastQuery, load } = useRemoteTableDemo('en')
  const hasNextPage = lastQuery.page * lastQuery.pageSize < total

  return (
    <DataTable
      rows={rows}
      columns={columns}
      rowKey="id"
      manual
      pagination
      defaultPageSize={5}
      hasNextPage={hasNextPage}
      loading={loading}
      label="Entries"
      onChange={load}
    />
  )
}
