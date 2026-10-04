'use client'

import { useState } from 'react'
import { Stack, Text, TreeSelect, type TreeSelectValue } from '@hina-ui/react'

const options = Array.from({ length: 10000 }, (_, index) => ({
  value: index,
  label: `条目 ${String(index + 1).padStart(5, '0')}`,
  disabled: index % 97 === 0,
}))
const items = [{ value: 'root', label: '全部节点', children: options }]

export default function Demo() {
  const [selected, setSelected] = useState<TreeSelectValue>(7890)

  return (
    <Stack gap="sm" className="w-64 max-w-full">
      <TreeSelect
        value={selected}
        onValueChange={setSelected}
        items={items}
        defaultExpanded={['root']}
        virtualize={{ estimateSize: 36, overscan: 6 }}
        searchable
        aria-label="一万项"
      />
      <Text size="sm" tone="muted">
        已选: {selected}
      </Text>
    </Stack>
  )
}
