'use client'

import { useState } from 'react'
import { Combobox, Stack, Text, type ComboboxValue } from '@hina-ui/react'

const options = Array.from({ length: 10000 }, (_, index) => ({
  value: index,
  label: `条目 ${String(index + 1).padStart(5, '0')}`,
  disabled: index % 97 === 0,
}))

export default function Demo() {
  const [selected, setSelected] = useState<ComboboxValue>(7890)

  return (
    <Stack gap="sm" className="w-64 max-w-full">
      <Combobox
        value={selected}
        onValueChange={setSelected}
        options={options}
        virtualize={{ estimateSize: 36, overscan: 6 }}
        aria-label="一万项"
      />
      <Text size="sm" tone="muted">
        已选: {selected}
      </Text>
    </Stack>
  )
}
