'use client'

import { useState } from 'react'
import { ListFilter } from 'lucide-react'
import { Stack, Text, Toggle } from '@hina-ui/react'

export default function Demo() {
  const [onlyDone, setOnlyDone] = useState(false)

  return (
    <Stack gap="sm" align="start">
      <Toggle value={onlyDone} onValueChange={setOnlyDone} renderIcon={() => <ListFilter />}>
        仅看已完结
      </Toggle>
      <Text tone="muted" size="sm">
        {onlyDone ? '只显示已完结的作品' : '显示全部作品'}
      </Text>
    </Stack>
  )
}
