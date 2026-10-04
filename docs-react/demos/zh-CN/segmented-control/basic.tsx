'use client'

import { useState } from 'react'
import { SegmentedControl, Stack, Text } from '@hina-ui/react'

const options = [
  { value: 'latest', label: '最新' },
  { value: 'popular', label: '最热' },
  { value: 'rating', label: '评分' },
]

export default function Demo() {
  const [sort, setSort] = useState<string | number>('latest')

  return (
    <Stack gap="sm" align="start">
      <SegmentedControl
        value={sort}
        onValueChange={setSort}
        options={options}
        aria-label="排序方式"
      />
      <Text tone="muted" size="sm">
        当前排序：{sort}
      </Text>
    </Stack>
  )
}
