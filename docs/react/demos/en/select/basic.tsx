'use client'

import { useState } from 'react'
import { Select, Stack, Text, type SelectValue } from '@hina-ui/react'

const statuses = [
  { value: 'wish', label: 'Want to read' },
  { value: 'doing', label: 'Reading' },
  { value: 'done', label: 'Finished' },
  { value: 'dropped', label: 'Dropped' },
]

export default function Demo() {
  const [status, setStatus] = useState<SelectValue>(null)

  return (
    <Stack className="w-56">
      <Select
        value={status}
        onValueChange={setStatus}
        options={statuses}
        placeholder="Choose a status"
        aria-label="Collection status"
      />
      <Text tone="muted">Current value: {status ?? 'none'}</Text>
    </Stack>
  )
}
