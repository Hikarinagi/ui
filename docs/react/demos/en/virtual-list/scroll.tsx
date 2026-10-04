'use client'

import { useRef, useState } from 'react'
import {
  VirtualList,
  NumberInput,
  Button,
  Inline,
  Stack,
  Text,
  type VirtualListExpose,
  type VirtualListRange,
} from '@hina-ui/react'

const items = Array.from({ length: 10000 }, (_, id) => ({ id, label: `Item ${id + 1}` }))

export default function Demo() {
  const list = useRef<VirtualListExpose>(null)
  const [target, setTarget] = useState<number | null>(5000)
  const [range, setRange] = useState<VirtualListRange>({ startIndex: 0, endIndex: 0 })

  return (
    <Stack className="w-full">
      <Inline gap="sm">
        <NumberInput
          value={target}
          onValueChange={value => setTarget(value ?? null)}
          min={1}
          max={items.length}
          aria-label="Item number"
          className="w-36"
        />
        <Button onClick={() => list.current?.scrollToIndex((target ?? 1) - 1, { align: 'center' })}>
          Scroll to item
        </Button>
        <Button variant="outline" onClick={() => list.current?.scrollToOffset(0)}>
          Back to top
        </Button>
        <Text as="span" size="sm" tone="muted" className="tabular-nums">
          Visible {range.startIndex + 1}–{range.endIndex + 1}
        </Text>
      </Inline>
      <VirtualList
        ref={list}
        items={items}
        getKey={item => item.id}
        dynamic={false}
        estimateSize={48}
        height={288}
        label="Scrollable list"
        className="border-line rounded-lg border"
        onRangeChange={setRange}
      >
        {({ item }) => (
          <Inline gap="none" className="border-line h-full border-b px-4">
            <Text size="sm">{item.label}</Text>
          </Inline>
        )}
      </VirtualList>
    </Stack>
  )
}
