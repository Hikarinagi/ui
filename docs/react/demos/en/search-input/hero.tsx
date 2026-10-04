'use client'

import { useState } from 'react'
import { SearchInput } from '@hina-ui/react'

export default function Demo() {
  const [query, setQuery] = useState('Spice and Wolf')
  return (
    <SearchInput
      value={query}
      onValueChange={setQuery}
      aria-label="Search"
      placeholder="Search works"
      className="w-72"
    />
  )
}
