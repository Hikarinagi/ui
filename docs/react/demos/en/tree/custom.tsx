'use client'

import { useState } from 'react'
import { File, Folder, FolderOpen } from 'lucide-react'
import { Inline, Tag, Text, Tree, type TreeValue } from '@hina-ui/react'
import { nodes } from './data'

export default function Demo() {
  const [checked, setChecked] = useState<TreeValue[]>(['a-2-1'])

  return (
    <Tree
      value={checked}
      onValueChange={value => setChecked(value as TreeValue[])}
      multiple
      items={nodes}
      defaultExpanded={['a', 'a-2', 'b']}
      aria-label="Custom nodes"
      className="w-96 max-w-full"
      renderNode={({ node, expanded }) => (
        <Inline as="span" wrap={false} gap="sm">
          {node.children?.length && expanded ? (
            <FolderOpen className="text-muted size-4 shrink-0" aria-hidden="true" />
          ) : node.children?.length ? (
            <Folder className="text-muted size-4 shrink-0" aria-hidden="true" />
          ) : (
            <File className="text-muted size-4 shrink-0" aria-hidden="true" />
          )}
          <Text as="span" size="sm">
            {node.label}
          </Text>
        </Inline>
      )}
      renderTrailing={({ selected, indeterminate }) =>
        indeterminate ? (
          <Tag size="sm" tone="neutral">
            Partial
          </Tag>
        ) : selected ? (
          <Tag size="sm">Checked</Tag>
        ) : null
      }
    />
  )
}
