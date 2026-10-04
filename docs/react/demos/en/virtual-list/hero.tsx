'use client'

import { VirtualList, Tag, Inline, Text } from '@hina-ui/react'

const items = Array.from({ length: 10000 }, (_, id) => ({
  id,
  label: `Item ${String(id + 1).padStart(5, '0')}`,
}))

export default function Demo() {
  return (
    <VirtualList
      items={items}
      getKey={item => item.id}
      height={320}
      estimateSize={64}
      label="Items"
      className="border-line bg-surface rounded-lg border"
    >
      {({ item, index }) => (
        <Inline wrap={false} className="border-line h-16 border-b px-4">
          <Text
            as="span"
            size="xs"
            tone="muted"
            className="bg-inset flex size-9 shrink-0 items-center justify-center rounded-md tabular-nums"
          >
            {index + 1}
          </Text>
          <Text as="span" size="sm" truncate className="min-w-0 flex-1">
            {item.label}
          </Text>
          {index % 3 === 0 && <Tag size="sm">Tag</Tag>}
        </Inline>
      )}
    </VirtualList>
  )
}
