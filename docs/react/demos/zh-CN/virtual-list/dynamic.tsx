'use client'

import { useState } from 'react'
import {
  VirtualList,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  Text,
} from '@hina-ui/react'

const items = Array.from({ length: 500 }, (_, id) => ({
  id,
  title: `条目 ${id + 1}`,
  description: '内容自然换行，每项高度由实际内容决定。'.repeat((id % 3) + 1),
}))

export default function Demo() {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})

  return (
    <VirtualList
      items={items}
      getKey={item => item.id}
      estimateSize={140}
      height={360}
      label="动态高度列表"
      className="border-line rounded-lg border"
    >
      {({ item }) => (
        <Collapsible
          open={!!expanded[item.id]}
          onOpenChange={open => setExpanded(current => ({ ...current, [item.id]: open }))}
          className="border-line border-b p-4"
        >
          <Text size="sm" weight="medium">
            {item.title}
          </Text>
          <Text size="sm" tone="muted" className="mt-1">
            {item.description}
          </Text>
          <CollapsibleTrigger className="mt-2">
            {expanded[item.id] ? '收起' : '展开'}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Text size="sm" tone="muted" className="pt-2">
              {'展开后增加的内容会自动参与高度计算。'.repeat(5)}
            </Text>
          </CollapsibleContent>
        </Collapsible>
      )}
    </VirtualList>
  )
}
