'use client'

import { useState } from 'react'
import { Editable, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [title, setTitle] = useState('Untitled document')

  return (
    <Stack className="w-full max-w-sm">
      <Editable value={title} onValueChange={setTitle} aria-label="Document name" />
      <Text size="sm" tone="muted">
        Saved: {title || '—'}
      </Text>
    </Stack>
  )
}
