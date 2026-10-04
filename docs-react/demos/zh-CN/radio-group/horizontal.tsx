'use client'

import { useState } from 'react'
import { RadioGroup } from '@hina-ui/react'

const options = [
  { value: 'updated', label: '最近更新' },
  { value: 'rating', label: '评分' },
  { value: 'title', label: '标题' },
]

export default function Demo() {
  const [sort, setSort] = useState<string | number | null | undefined>('updated')

  return (
    <RadioGroup
      value={sort}
      onValueChange={setSort}
      options={options}
      orientation="horizontal"
      aria-label="排序方式"
    />
  )
}
