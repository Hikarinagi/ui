'use client'

import { useState } from 'react'
import { Button, Spoiler, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [hidden, setHidden] = useState(true)

  return (
    <Stack className="max-w-lg">
      <Text>
        How it ends:{' '}
        <Spoiler hidden={hidden} onHiddenChange={setHidden}>
          the deal turns over at the last moment
        </Spoiler>
      </Text>
      <Button variant="outline" tone="neutral" size="sm" onClick={() => setHidden(!hidden)}>
        {hidden ? 'Reveal all' : 'Hide all'}
      </Button>
    </Stack>
  )
}
