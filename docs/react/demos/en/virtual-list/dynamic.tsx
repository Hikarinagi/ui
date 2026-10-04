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
  title: `Item ${id + 1}`,
  description: 'Text wraps naturally and determines the height of each item. '.repeat((id % 3) + 1),
}))

export default function Demo() {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})

  return (
    <VirtualList
      items={items}
      getKey={item => item.id}
      estimateSize={140}
      height={360}
      label="Dynamic-size list"
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
            {expanded[item.id] ? 'Collapse' : 'Expand'}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Text size="sm" tone="muted" className="pt-2">
              {'Expanded content is measured automatically. '.repeat(5)}
            </Text>
          </CollapsibleContent>
        </Collapsible>
      )}
    </VirtualList>
  )
}
