'use client'

import { useState } from 'react'
import { Button, Inline, Stack, Tree, type TreeValue } from '@hina-ui/react'
import { nodes } from './data'

export default function Demo() {
  const [expanded, setExpanded] = useState<TreeValue[]>(['a'])
  const [checked, setChecked] = useState<TreeValue[]>(['a-2-1'])

  return (
    <Stack className="w-80 max-w-full">
      <Inline>
        <Button
          size="sm"
          variant="soft"
          tone="neutral"
          onClick={() => setExpanded(['a', 'a-2', 'b'])}
        >
          展开全部
        </Button>
        <Button size="sm" variant="ghost" tone="neutral" onClick={() => setExpanded([])}>
          收起全部
        </Button>
      </Inline>
      <Tree
        value={checked}
        onValueChange={value => setChecked(value as TreeValue[])}
        expanded={expanded}
        onExpandedChange={setExpanded}
        multiple
        items={nodes}
        aria-label="受控展开"
      />
    </Stack>
  )
}
