'use client'

import { useState } from 'react'
import { DataList, Image, Text, type DataListLayout } from '@hina-ui/react'
import { dataListVirtualDemo } from '../../data-list-virtual'

const items = dataListVirtualDemo('zh-CN')

export default function Demo() {
  const [layout, setLayout] = useState<DataListLayout>('list')
  const [range, setRange] = useState({ startIndex: -1, endIndex: -1 })

  return (
    <DataList
      layout={layout}
      onLayoutChange={setLayout}
      items={items}
      itemKey="id"
      itemTitle="title"
      itemDescription="subtitle"
      layoutToggle
      mediaRatio={layout === 'grid' ? 16 / 10 : 3 / 4}
      gridMin="12rem"
      height={400}
      virtualize={{ estimateSize: layout === 'grid' ? 280 : 128, overscan: 1 }}
      bodyClass="border-line rounded-lg border"
      contentClass="p-4"
      label="虚拟条目"
      className="max-w-2xl"
      onRangeChange={setRange}
      renderMedia={({ item }) => (
        <Image src={item.cover.src} alt="" fit="cover" className="size-full" />
      )}
      renderMeta={({ item }) => (
        <Text size="xs" tone="muted">
          {item.released}
        </Text>
      )}
      renderFooter={() => (
        <Text size="xs" tone="muted">
          可见范围：{range.startIndex + 1}–{range.endIndex + 1} / {items.length}
        </Text>
      )}
    />
  )
}
