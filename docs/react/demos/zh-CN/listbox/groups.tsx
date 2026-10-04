'use client'

import { useState } from 'react'
import { Listbox, type ListboxValue } from '@hina-ui/react'

const sorts = [
  { value: 'latest', label: '最近更新' },
  {
    label: '按评分',
    options: [
      { value: 'rating-desc', label: '评分从高到低' },
      { value: 'rating-asc', label: '评分从低到高' },
    ],
  },
  {
    label: '按发售',
    options: [
      { value: 'release-desc', label: '最新发售' },
      { value: 'release-asc', label: '最早发售' },
    ],
  },
]

export default function Demo() {
  const [sort, setSort] = useState<ListboxValue>('latest')

  return (
    <Listbox
      value={sort}
      onValueChange={setSort}
      options={sorts}
      aria-label="排序"
      className="w-56"
    />
  )
}
