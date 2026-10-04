'use client'

import { VirtualList, Inline, Text } from '@hina-ui/react'

const items = Array.from({ length: 1000 }, (_, id) => ({ id, label: `Item ${id + 1}` }))

export default function Demo() {
  return (
    <VirtualList
      items={items}
      getKey={item => item.id}
      height={240}
      estimateSize={48}
      dynamic={false}
      label="Fixed-size list"
      className="border-line rounded-lg border"
    >
      {({ item, index }) => (
        <Inline
          justify="between"
          gap="sm"
          wrap={false}
          className="border-line h-full border-b px-4"
        >
          <Text as="span" size="sm">
            {item.label}
          </Text>
          <Text as="span" size="sm" tone="muted" className="tabular-nums">
            {index + 1} / {items.length}
          </Text>
        </Inline>
      )}
    </VirtualList>
  )
}
