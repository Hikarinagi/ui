'use client'

import { useState } from 'react'
import { ListFilter } from 'lucide-react'
import { Stack, Text, Toggle } from '@hina-ui/react'

export default function Demo() {
  const [onlyDone, setOnlyDone] = useState(false)

  return (
    <Stack gap="sm" align="start">
      <Toggle value={onlyDone} onValueChange={setOnlyDone} renderIcon={() => <ListFilter />}>
        Completed only
      </Toggle>
      <Text tone="muted" size="sm">
        {onlyDone ? 'Showing completed works' : 'Showing all works'}
      </Text>
    </Stack>
  )
}
