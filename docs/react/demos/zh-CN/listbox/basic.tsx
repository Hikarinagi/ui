'use client'

import { useState } from 'react'
import { Listbox, Stack, Text, type ListboxValue } from '@hina-ui/react'

const types = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: '轻小说' },
  { value: 'manga', label: '漫画' },
  { value: 'anime', label: '动画' },
]

export default function Demo() {
  const [type, setType] = useState<ListboxValue>(null)

  return (
    <Stack className="w-56">
      <Listbox value={type} onValueChange={setType} options={types} aria-label="作品类型" />
      <Text tone="muted">当前值：{type ?? '无'}</Text>
    </Stack>
  )
}
