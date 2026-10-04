'use client'

import { useState } from 'react'
import { Select, Stack, Text, type SelectValue } from '@hina-ui/react'

const statuses = [
  { value: 'wish', label: '想看' },
  { value: 'doing', label: '在看' },
  { value: 'done', label: '看过' },
  { value: 'dropped', label: '抛弃' },
]

export default function Demo() {
  const [status, setStatus] = useState<SelectValue>(null)

  return (
    <Stack className="w-56">
      <Select
        value={status}
        onValueChange={setStatus}
        options={statuses}
        placeholder="选择收藏状态"
        aria-label="收藏状态"
      />
      <Text tone="muted">当前值：{status ?? '无'}</Text>
    </Stack>
  )
}
