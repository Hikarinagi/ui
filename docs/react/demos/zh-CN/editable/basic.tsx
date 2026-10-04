'use client'

import { useState } from 'react'
import { Editable, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [title, setTitle] = useState('未命名文档')

  return (
    <Stack className="w-full max-w-sm">
      <Editable value={title} onValueChange={setTitle} aria-label="文档名称" />
      <Text size="sm" tone="muted">
        已保存：{title || '—'}
      </Text>
    </Stack>
  )
}
