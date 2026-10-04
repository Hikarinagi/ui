'use client'

import { useState } from 'react'
import { Stack, Text, Tree, type TreeValue } from '@hina-ui/react'
import { nodes } from './data'

export default function Demo() {
  const [selected, setSelected] = useState<TreeValue | null>(null)

  return (
    <Stack className="w-80 max-w-full">
      <Tree
        value={selected}
        onValueChange={value => setSelected(value as TreeValue | null)}
        items={nodes}
        defaultExpanded={['a']}
        aria-label="Single selection tree"
      />
      <Text size="sm" tone="muted">
        Selected value：{selected ?? '—'}
      </Text>
    </Stack>
  )
}
