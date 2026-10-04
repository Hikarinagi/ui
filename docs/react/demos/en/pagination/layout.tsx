'use client'

import { useState } from 'react'
import {
  Inline,
  Pagination,
  PaginationContent,
  PaginationInfo,
  PaginationJump,
  PaginationSize,
} from '@hina-ui/react'

export default function Demo() {
  const [page, setPage] = useState(4)
  const [pageSize, setPageSize] = useState(10)

  return (
    <Pagination
      value={page}
      onValueChange={setPage}
      pageSize={pageSize}
      onPageSizeChange={setPageSize}
      total={180}
      pageSizeOptions={[10, 20, 50]}
      align="between"
    >
      <PaginationInfo>
        {({ page: current, pageCount }) => `${current} / ${pageCount}`}
      </PaginationInfo>
      <Inline gap="sm">
        <PaginationContent />
        <PaginationSize />
        <PaginationJump />
      </Inline>
    </Pagination>
  )
}
