'use client'

import { useMemo, useState } from 'react'
import { VirtualList, Button, Switch, Empty, Inline, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [loading, setLoading] = useState(false)
  const [empty, setEmpty] = useState(false)
  const items = useMemo(
    () => (empty ? [] : Array.from({ length: 100 }, (_, id) => ({ id, label: `Item ${id + 1}` }))),
    [empty],
  )

  return (
    <Stack className="w-full">
      <Inline>
        <Switch checked={loading} onCheckedChange={setLoading}>
          Loading
        </Switch>
        <Button variant="outline" onClick={() => setEmpty(!empty)}>
          {empty ? 'Restore items' : 'Clear items'}
        </Button>
      </Inline>
      <VirtualList
        items={items}
        getKey={item => item.id}
        loading={loading}
        height={240}
        estimateSize={48}
        dynamic={false}
        label="List states"
        className="border-line rounded-lg border"
        empty={<Empty title="No items" description="There are no items to display." size="sm" />}
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
