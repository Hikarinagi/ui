'use client'

import { useState } from 'react'
import { Inline, Text, TreeSelect, type TreeSelectNode, type TreeSelectValue } from '@hina-ui/react'

const departments: TreeSelectNode[] = [
  {
    value: 'product',
    label: 'Product',
    description: '12 people',
    children: [
      { value: 'design', label: 'Design', description: '5 people' },
      { value: 'research', label: 'Research', description: '3 people' },
    ],
  },
  {
    value: 'engineering',
    label: 'Engineering',
    description: '28 people',
    children: [
      { value: 'web', label: 'Web', description: '9 people' },
      { value: 'api', label: 'API', description: '11 people' },
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
      placeholder="Choose a department"
      aria-label="Department"
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
