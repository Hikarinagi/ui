'use client'

import { useState } from 'react'
import { Stack, Text, Tree, type TreeValue } from '@hina-ui/react'

const options = Array.from({ length: 10000 }, (_, index) => ({
  value: index,
  label: `Item ${String(index + 1).padStart(5, '0')}`,
  disabled: index % 97 === 0,
}))
const items = [{ value: 'root', label: 'All nodes', children: options }]

export default function Demo() {
  const [selected, setSelected] = useState<TreeValue[]>([7890])

  return (
    <Stack gap="sm" className="w-80 max-w-full">
      <Tree
        value={selected}
        onValueChange={value => setSelected(value as TreeValue[])}
        items={items}
        defaultExpanded={['root']}
        virtualize={{ estimateSize: 36, overscan: 6 }}
        multiple
        maxHeight={320}
        aria-label="Ten thousand items"
      />
      <Text size="sm" tone="muted">
        Selected: {selected.length}
      </Text>
    </Stack>
  )
}
