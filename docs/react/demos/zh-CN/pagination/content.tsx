'use client'

import { useState } from 'react'
import { Pagination, Text } from '@hina-ui/react'

const numerals = ['I', 'II', 'III', 'IV', 'V']

export default function Demo() {
  const [page, setPage] = useState(2)

  return (
    <Pagination
      value={page}
      onValueChange={setPage}
      total={50}
      renderPage={({ page: number, selected }) => (
        <Text as="span" weight={selected ? 'semibold' : 'normal'} className="text-inherit">
          {numerals[number - 1]}
        </Text>
      )}
    />
  )
}
