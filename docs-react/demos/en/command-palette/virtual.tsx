'use client'

import { useState } from 'react'
import { CommandPalette, Stack, Text } from '@hina-ui/react'

const items = Array.from({ length: 10000 }, (_, index) => ({
  id: String(index),
  label: `Item ${String(index + 1).padStart(5, '0')}`,
  keywords: [`id-${index}`],
}))

export default function Demo() {
  const [selected, setSelected] = useState('—')

  return (
    <Stack gap="sm" className="w-96 max-w-full">
      <CommandPalette
        items={items}
        virtualize={{ estimateSize: 36, overscan: 6 }}
        inline
        aria-label="Ten thousand items"
        onSelect={item => setSelected(item.label)}
      />
      <Text size="sm" tone="muted">
        Selected: {selected}
      </Text>
    </Stack>
  )
}
