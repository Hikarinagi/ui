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
        aria-label="Search"
        placeholder="Search works"
        onSearch={setSubmitted}
      />
      <Text tone="muted">Last submitted: {submitted || 'none'}</Text>
    </Stack>
  )
}
