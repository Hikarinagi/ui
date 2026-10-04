'use client'

import { useState } from 'react'
import { Pagination } from '@hina-ui/react'

export default function Demo() {
  const [page, setPage] = useState(100000)

  return <Pagination value={page} onValueChange={setPage} total={2000000} size="sm" />
}
