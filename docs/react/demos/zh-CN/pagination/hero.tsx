'use client'

import { useState } from 'react'
import { Pagination } from '@hina-ui/react'

export default function Demo() {
  const [page, setPage] = useState(8)

  return <Pagination value={page} onValueChange={setPage} total={246} />
}
