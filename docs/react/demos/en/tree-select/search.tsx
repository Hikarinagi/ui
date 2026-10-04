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
        searchPlaceholder="Search nodes"
        aria-label="Region"
      />
      <Text tone="muted">Value: {region ?? 'None'}</Text>
      <Text tone="muted">Search: {search || 'None'}</Text>
    </Stack>
  )
}
