'use client'

import { useState } from 'react'
import { DataList, Image, SegmentedControl, Stack, Text } from '@hina-ui/react'
import { dataListDemo } from '../../../../docs/app/demos/data-list'

const items = dataListDemo('en')
const options = [
  { value: 'initial', label: 'Initial' },
  { value: 'ready', label: 'Ready' },
  { value: 'refresh', label: 'Refresh' },
  { value: 'empty', label: 'Empty' },
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
        aria-label="List state"
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
        label="Items"
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
