'use client'

import { useMemo, useState } from 'react'
import { Button, DataList, Empty, SearchInput, Select, Text } from '@hina-ui/react'
import { dataListDemo } from '../../../../docs/app/demos/data-list'

const items = dataListDemo('en')
const options = [
  { value: 'release', label: 'Newest first' },
  { value: 'title', label: 'Title' },
]

export default function Demo() {
  const [query, setQuery] = useState('')
  const [order, setOrder] = useState<string | number | null | undefined>('release')
  const [page, setPage] = useState(1)
  const filtered = useMemo(
    () =>
      items
        .filter(item =>
          `${item.title} ${item.originalTitle} ${item.developer}`
            .toLocaleLowerCase()
            .includes(query.trim().toLocaleLowerCase()),
        )
        .toSorted((a, b) =>
          order === 'release'
            ? b.released.localeCompare(a.released)
            : a.title.localeCompare(b.title),
        ),
    [query, order],
  )

  return (
    <DataList
      page={page}
      onPageChange={setPage}
      items={filtered}
      itemKey="id"
      itemTitle="title"
      itemDescription="subtitle"
      pagination
      pageSize={10}
      label="Search results"
      className="max-w-2xl"
      renderHeader={() => (
        <>
          <SearchInput
            value={query}
            onValueChange={value => {
              setQuery(value)
              setPage(1)
            }}
            placeholder="Title or developer"
            aria-label="Search"
            className="w-full @lg/hn-data-list:min-w-0 @lg/hn-data-list:flex-1"
          />
          <Select
            value={order}
            onValueChange={value => {
              setOrder(value)
              setPage(1)
            }}
            options={options}
            aria-label="Sort order"
            className="w-full @lg/hn-data-list:w-44"
          />
        </>
      )}
      renderMeta={({ item }) => (
        <Text size="xs" tone="muted">
          {item.released}
        </Text>
      )}
      renderEmpty={() => (
        <Empty
          title="No matching works"
          size="sm"
          icon={false}
          actions={
            <Button
              variant="outline"
              tone="neutral"
              size="sm"
              onClick={() => {
                setQuery('')
                setPage(1)
              }}
            >
              Clear search
            </Button>
          }
        />
      )}
      renderFooter={({ total }) => (
        <Text size="xs" tone="muted">
          {total} results
        </Text>
      )}
    />
  )
}
