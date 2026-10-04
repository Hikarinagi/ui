'use client'

import { useState } from 'react'
import { DataList, Image, SegmentedControl, Stack, Text } from '@hina-ui/react'
import { dataListDemo } from '../../data-list'

const items = dataListDemo('zh-CN')
const options = [
  { value: 'initial', label: '首次加载' },
  { value: 'ready', label: '内容' },
  { value: 'refresh', label: '刷新' },
  { value: 'empty', label: '空态' },
]

export default function Demo() {
  const [state, setState] = useState<string | number>('initial')
  const rows = state === 'initial' || state === 'empty' ? [] : items.slice(0, 2)

  return (
    <Stack className="w-full max-w-2xl">
      <SegmentedControl
        value={state}
        onValueChange={setState}
        options={options}
        size="sm"
        aria-label="列表状态"
      />
      <DataList
        items={rows}
        itemKey="id"
        itemTitle="title"
        itemDescription="subtitle"
        loading={state === 'initial' || state === 'refresh'}
        placeholderCount={2}
        mediaRatio={3 / 4}
        height={280}
        label="条目"
        renderMedia={({ item }) => (
          <Image src={item.cover.src} alt="" fit="cover" className="size-full" />
        )}
        renderMeta={({ item }) => (
          <Text size="xs" tone="muted">
            {item.released}
          </Text>
        )}
      />
    </Stack>
  )
}
