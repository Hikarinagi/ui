'use client'

import { useState } from 'react'
import { SegmentedControl, Stack, Text } from '@hina-ui/react'

const options = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'rating', label: 'Rating' },
]

export default function Demo() {
  const [sort, setSort] = useState<string | number>('latest')

  return (
    <Stack gap="sm" align="start">
      <SegmentedControl
        value={sort}
        onValueChange={setSort}
        options={options}
        aria-label="Sort by"
      />
      <Text tone="muted" size="sm">
        Sorted by: {sort}
      </Text>
    </Stack>
  )
}
