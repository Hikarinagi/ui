'use client'

import { useState } from 'react'
import { Card, FormField, Masonry, Stack, Switch, Text } from '@hina-ui/react'

const heights = [120, 200, 88, 148, 100, 168, 88, 112, 144].map((height, id) => ({ id, height }))

export default function Demo() {
  const [sequential, setSequential] = useState(false)

  return (
    <Stack className="w-full max-w-lg">
      <FormField label="按列轮流排列" orientation="horizontal">
        <Switch checked={sequential} onCheckedChange={setSequential} />
      </FormField>
      <Masonry
        items={heights}
        getKey={item => item.id}
        columns={3}
        sequential={sequential}
        label="排列顺序对比"
      >
        {({ item, index }) => (
          <Card
            className="bg-accent-soft flex items-center justify-center"
            style={{ height: item.height + 'px' }}
          >
            <Text tone="accent" weight="medium">
              {index + 1}
            </Text>
          </Card>
        )}
      </Masonry>
      <Text size="sm" tone="muted">
        关闭时优先填入最短的一列；开启后依次放入第 1、2、3 列。
      </Text>
    </Stack>
  )
}
