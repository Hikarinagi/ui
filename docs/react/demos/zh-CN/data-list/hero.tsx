'use client'

import { DataList, Image, Stack, Text, Tooltip } from '@hina-ui/react'
import { dataListDemo } from '../../data-list'

const items = dataListDemo('zh-CN')

export default function Demo() {
  return (
    <DataList
      items={items.slice(0, 3)}
      itemKey="id"
      itemTitle="title"
      itemDescription="subtitle"
      mediaRatio={3 / 4}
      layoutToggle
      gridMin="10rem"
      label="作品"
      className="max-w-2xl"
      renderHeader={() => (
        <Text size="sm" tone="muted">
          3 条作品
        </Text>
      )}
      renderMedia={({ item }) => (
        <Image src={item.cover.src} alt="" fit="cover" className="size-full" />
      )}
      renderMeta={({ item }) => (
        <Stack gap="xs" className="min-w-0 w-full">
          <Tooltip content={item.developer}>
            <Text size="xs" tone="muted" truncate className="w-fit max-w-full">
              {item.developer}
            </Text>
          </Tooltip>
          <Text as="time" dateTime={item.released} size="xs" tone="muted">
            {item.released}
          </Text>
        </Stack>
      )}
    />
  )
}
