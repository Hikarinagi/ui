'use client'

import { useState } from 'react'
import { Card, FormField, Masonry, Stack, Switch, Text } from '@hina-ui/react'

const heights = [120, 200, 88, 148, 100, 168, 88, 112, 144].map((height, id) => ({ id, height }))

export default function Demo() {
  const [sequential, setSequential] = useState(false)

  return (
    <Stack className="w-full max-w-lg">
      <FormField label="Place in sequential columns" orientation="horizontal">
        <Switch checked={sequential} onCheckedChange={setSequential} />
      </FormField>
      <Masonry
        items={heights}
        getKey={item => item.id}
        columns={3}
        sequential={sequential}
        label="Placement comparison"
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
        By default, each card fills the shortest column. Sequential placement cycles through columns
        1, 2 and 3.
      </Text>
    </Stack>
  )
}
