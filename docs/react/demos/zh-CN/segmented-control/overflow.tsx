'use client'

import { useState } from 'react'
import { SegmentedControl } from '@hina-ui/react'

const options = [
  { value: 'relevance', label: '综合' },
  { value: 'updated', label: '最近更新' },
  { value: 'favorites', label: '收藏最多' },
  { value: 'comments', label: '评论最多' },
  { value: 'words', label: '字数最多' },
  { value: 'rating', label: '评分最高' },
]

export default function Demo() {
  const [sort, setSort] = useState<string | number>('relevance')

  return (
    <SegmentedControl
      value={sort}
      onValueChange={setSort}
      options={options}
      className="max-w-xs"
      aria-label="排序"
    />
  )
}
