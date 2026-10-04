'use client'

import { useState } from 'react'
import { Bookmark } from 'lucide-react'
import { DataList, Image, Link, Stack, Text, Toggle, Tooltip } from '@hina-ui/react'
import { dataListDemo } from '../../data-list'

const items = dataListDemo('zh-CN')

export default function Demo() {
  const [saved, setSaved] = useState<Record<number, boolean>>({})

  return (
    <DataList
      items={items.slice(3, 6)}
      itemKey="id"
      itemDescription="subtitle"
      defaultLayout="grid"
      layoutToggle
      gridMin="10rem"
      label="自定义条目"
      className="max-w-2xl"
      renderHeader={() => (
        <Text size="sm" tone="muted">
          3 条作品
        </Text>
      )}
      renderTitle={({ item }) => (
        <Link href={item.url} target="_blank" rel="noopener noreferrer" tone="neutral">
          {item.title}
        </Link>
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
      renderActions={({ item }) => (
        <Toggle
          value={saved[item.id] ?? false}
          onValueChange={value => setSaved(current => ({ ...current, [item.id]: value }))}
          size="sm"
          label={`标记 ${item.title}`}
          tooltip={false}
          renderIcon={({ pressed }) => (
            <Bookmark className={pressed ? 'fill-current' : undefined} />
          )}
        >
          {saved[item.id] ? '已标记' : '标记'}
        </Toggle>
      )}
    />
  )
}
