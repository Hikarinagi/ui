'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, Pagination, Stack, Text, type PaginationChange } from '@hina-ui/react'

export default function Demo() {
  const [page, setPage] = useState(1)
  const [displayedPage, setDisplayedPage] = useState(1)
  const [pending, setPending] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  function change(value: PaginationChange) {
    setPending(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setDisplayedPage(value.page)
      setPending(false)
    }, 1000)
  }

  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <Pagination
      value={page}
      onValueChange={setPage}
      total={96}
      pageSize={5}
      pending={pending}
      showInfo
      onChange={change}
      renderList={() => (
        <Stack gap="xs">
          {[1, 2, 3, 4, 5].map(index => (
            <Card key={index}>
              <Text size="sm">{(displayedPage - 1) * 5 + index}</Text>
            </Card>
          ))}
        </Stack>
      )}
    />
  )
}
