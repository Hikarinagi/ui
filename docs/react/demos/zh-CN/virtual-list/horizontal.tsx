'use client'

import { VirtualList, Stack, Text } from '@hina-ui/react'

const items = Array.from({ length: 200 }, (_, id) => ({ id, label: `条目 ${id + 1}` }))

export default function Demo() {
  return (
    <Stack className="w-full">
      {(['ltr', 'rtl'] as const).map(dir => (
        <Stack key={dir} gap="sm">
          <Text size="xs" tone="muted" className="uppercase">
            {dir}
          </Text>
          <VirtualList
            items={items}
            getKey={item => item.id}
            orientation="horizontal"
            dir={dir}
            height={144}
            estimateSize={160}
            dynamic={false}
            gap={12}
            label={`${dir} 横向列表`}
          >
            {({ item, index }) => (
              <Stack
                justify="between"
                gap="sm"
                className="border-line bg-surface h-full rounded-lg border p-4"
              >
                <Text size="2xl" tone="muted" className="tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                </Text>
                <Text size="sm">{item.label}</Text>
              </Stack>
            )}
          </VirtualList>
        </Stack>
      ))}
    </Stack>
  )
}
