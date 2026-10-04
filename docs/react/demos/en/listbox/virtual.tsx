'use client'

import { useState } from 'react'
import { Listbox, Stack, Text, type ListboxValue } from '@hina-ui/react'

const options = Array.from({ length: 10000 }, (_, index) => ({
  value: index,
  label: `Item ${String(index + 1).padStart(5, '0')}`,
  disabled: index % 97 === 0,
}))

export default function Demo() {
  const [selected, setSelected] = useState<ListboxValue>(7890)

  return (
    <Stack gap="sm" className="w-56 max-w-full">
      <Listbox
        value={selected}
        onValueChange={setSelected}
        options={options}
        virtualize={{ estimateSize: 36, overscan: 6 }}
        aria-label="Ten thousand items"
      />
      <Text size="sm" tone="muted">
        Selected: {selected}
      </Text>
    </Stack>
  )
}
