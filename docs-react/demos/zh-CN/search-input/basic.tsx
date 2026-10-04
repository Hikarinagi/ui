'use client'

import { useState } from 'react'
import { SearchInput, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [query, setQuery] = useState('')
  const [submitted, setSubmitted] = useState('')
  return (
    <Stack className="w-72">
      <SearchInput
        value={query}
        onValueChange={setQuery}
        aria-label="搜索"
        placeholder="搜索作品"
        onSearch={setSubmitted}
      />
      <Text tone="muted">上次提交：{submitted || '无'}</Text>
    </Stack>
  )
}
