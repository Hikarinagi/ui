'use client'

import { useState } from 'react'
import { Stack, Text, TreeSelect, type TreeSelectValue } from '@hina-ui/react'
import { regions } from './data'

export default function Demo() {
  const [region, setRegion] = useState<TreeSelectValue>(null)
  const [search, setSearch] = useState('')

  return (
    <Stack className="w-64">
      <TreeSelect
        value={region}
        onValueChange={setRegion}
        search={search}
        onSearchChange={setSearch}
        items={regions}
        searchable
        searchPlaceholder="搜索节点"
        aria-label="地区"
      />
      <Text tone="muted">当前值：{region ?? '无'}</Text>
      <Text tone="muted">搜索：{search || '无'}</Text>
    </Stack>
  )
}
