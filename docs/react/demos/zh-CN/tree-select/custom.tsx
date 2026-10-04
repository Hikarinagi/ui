'use client'

import { useState } from 'react'
import { Inline, Text, TreeSelect, type TreeSelectNode, type TreeSelectValue } from '@hina-ui/react'

const departments: TreeSelectNode[] = [
  {
    value: 'product',
    label: '产品部',
    description: '12 人',
    children: [
      { value: 'design', label: '设计组', description: '5 人' },
      { value: 'research', label: '用研组', description: '3 人' },
    ],
  },
  {
    value: 'engineering',
    label: '工程部',
    description: '28 人',
    children: [
      { value: 'web', label: '前端组', description: '9 人' },
      { value: 'api', label: '后端组', description: '11 人' },
    ],
  },
]

export default function Demo() {
  const [dept, setDept] = useState<TreeSelectValue>(null)

  return (
    <TreeSelect
      value={dept}
      onValueChange={setDept}
      items={departments}
      placeholder="选择部门"
      aria-label="部门"
      className="w-72"
      renderNode={({ node }) => (
        <Inline as="span" gap="sm" wrap={false} justify="between">
          <Text as="span">{node.label}</Text>
          <Text as="span" size="xs" tone="muted">
            {node.description}
          </Text>
        </Inline>
      )}
    />
  )
}
