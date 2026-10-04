'use client'

import { useEffect, useState } from 'react'
import { Combobox, Stack, Text, type ComboboxValue } from '@hina-ui/react'

interface TagPage {
  data: { items: Array<{ id: number; name: string; nameEn: string }> }
}

const selectedOption = { value: 31, label: '轻小说' }

export default function Demo() {
  const [selected, setSelected] = useState<ComboboxValue>(selectedOption.value)
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
      .filter(tag => tag.name.toLocaleLowerCase().includes(keyword.trim().toLocaleLowerCase()))
      .slice(0, 10)
      .map(tag => ({ value: tag.id, label: tag.name })) ?? []

  return (
    <Stack className="w-64">
      <Combobox
        value={selected}
        onValueChange={setSelected}
        search={search}
        onSearchChange={setSearch}
        options={options}
        selectedOption={selectedOption}
        loading={fetching}
        ignoreFilter
        clearable
        placeholder="搜索标签"
        aria-label="标签"
      />
      <Text tone="muted">
        候选：{options.length} · 选中值：{selected ?? '无'}
      </Text>
    </Stack>
  )
}
