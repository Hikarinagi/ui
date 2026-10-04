'use client'

import { useState } from 'react'
import { Select, type SelectValue } from '@hina-ui/react'

const types = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: '轻小说' },
  { value: 'manga', label: '漫画' },
  { value: 'anime', label: '动画' },
]

export default function Demo() {
  const [type, setType] = useState<SelectValue>('gal')

  return (
    <Select
      value={type}
      onValueChange={setType}
      options={types}
      aria-label="作品类型"
      className="w-64"
    />
  )
}
