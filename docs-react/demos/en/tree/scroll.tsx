'use client'

import { useState } from 'react'
import { ScrollArea, Tree, type TreeNode, type TreeValue } from '@hina-ui/react'

const items: TreeNode[] = [
  {
    value: 'root',
    label: 'Group',
    children: Array.from({ length: 40 }, (_, index) => ({
      value: index,
      label: `Node ${index + 1}`,
    })),
  },
]

export default function Demo() {
  const [checked, setChecked] = useState<TreeValue[]>([])

  return (
    <ScrollArea className="h-64 w-80 max-w-full">
      <Tree
        value={checked}
        onValueChange={value => setChecked(value as TreeValue[])}
        multiple
        items={items}
        defaultExpanded={['root']}
        aria-label="Scrollable tree"
      />
    </ScrollArea>
  )
}
