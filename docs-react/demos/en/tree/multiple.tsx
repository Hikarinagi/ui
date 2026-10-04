'use client'

import { useState } from 'react'
import { Button, Inline, Stack, Text, Tree, type TreeValue } from '@hina-ui/react'
import { nodes } from './data'

export default function Demo() {
  const [checked, setChecked] = useState<TreeValue[]>(['a-2-1'])

  return (
    <Stack className="w-96 max-w-full">
      <Tree
        value={checked}
        onValueChange={value => setChecked(value as TreeValue[])}
        multiple
        items={nodes}
        defaultExpanded={['a', 'a-2', 'b']}
        aria-label="Cascading checks"
      />
      <Inline>
        <Button
          size="sm"
          variant="soft"
          tone="neutral"
          onClick={() => setChecked(nodes.map(node => node.value))}
        >
          Check all
        </Button>
        <Button size="sm" variant="ghost" tone="neutral" onClick={() => setChecked([])}>
          Clear
        </Button>
      </Inline>
      <Text size="sm" tone="muted" className="break-all">
        Bound values：{checked.join(', ') || '—'}
      </Text>
    </Stack>
  )
}
