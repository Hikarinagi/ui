'use client'

import { useState } from 'react'
import { SearchInput } from '@hina-ui/react'

export default function Demo() {
  const [query, setQuery] = useState('狼と香辛料')
  return (
    <SearchInput
      value={query}
      onValueChange={setQuery}
      aria-label="搜索"
      placeholder="搜索作品"
      className="w-72"
    />
  )
}
