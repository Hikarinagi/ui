'use client'

import { useState } from 'react'
import { ScrollArea, Tree, type TreeNode, type TreeValue } from '@hina-ui/react'

const items: TreeNode[] = [
  {
    value: 'root',
    label: '分组',
    children: Array.from({ length: 40 }, (_, index) => ({
      value: index,
      label: `节点 ${index + 1}`,
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
        aria-label="可滚动树"
      />
    </ScrollArea>
  )
}
