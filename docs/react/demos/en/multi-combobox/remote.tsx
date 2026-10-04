'use client'

import { useEffect, useState } from 'react'
import { Inline, MultiCombobox, Stack, Text } from '@hina-ui/react'

interface TagPage {
  data: { items: Array<{ id: number; name: string; nameEn: string }> }
}

const selectedTags = [
  { value: 31, label: 'Light novels' },
  { value: 32, label: 'Tappei Nagatsuki' },
  { value: 33, label: 'Time travel' },
]

export default function Demo() {
  const [selected, setSelected] = useState<Array<string | number>>(
    selectedTags.map(tag => tag.value),
  )
  const [search, setSearch] = useState('')
  const [keyword, setKeyword] = useState('')
  const [data, setData] = useState<TagPage>()
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setKeyword(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    const controller = new AbortController()
    setFetching(true)
    fetch(`/demo/tags.json?${new URLSearchParams({ search: keyword })}`, {
      signal: controller.signal,
    })
      .then(response => response.json() as Promise<TagPage>)
      .then(page => setData(page))
      .catch(() => {})
      .finally(() => {
        if (!controller.signal.aborted) setFetching(false)
      })
    return () => controller.abort()
  }, [keyword])

  const options =
    data?.data.items
      .filter(tag => tag.nameEn.toLocaleLowerCase().includes(keyword.trim().toLocaleLowerCase()))
      .slice(0, 10)
      .map(tag => ({ value: tag.id, label: tag.nameEn })) ?? []

  return (
    <Stack className="w-80">
      <MultiCombobox
        value={selected}
        onValueChange={setSelected}
        search={search}
        onSearchChange={setSearch}
        options={options}
        selectedOptions={selectedTags}
        loading={fetching}
        ignoreFilter
        placeholder="Search tags"
        aria-label="Tags"
        renderOption={({ option }) => (
          <Inline gap="sm" align="center" wrap={false} className="min-w-0">
            <Text as="span" className="truncate">
              {option.label}
            </Text>
            <Text as="span" tone="muted" size="xs" className="ms-auto shrink-0 font-mono">
              #{option.value}
            </Text>
          </Inline>
        )}
      />
      <Text tone="muted">
        Selected: {selected.length} · Results: {options.length}
      </Text>
    </Stack>
  )
}
