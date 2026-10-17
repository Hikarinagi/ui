'use client'

import { useState } from 'react'
import { Button, Image, Stack } from '@hina-ui/react'

export default function Demo() {
  const [round, setRound] = useState(0)
  return (
    <Stack align="start" className="w-full max-w-md">
      <Image
        key={round}
        src={`/sample.webp?round=${round}`}
        thumbhash="YMcJJIIhukWZenmwmHWb9Pc5nw=="
        alt="A slope on a summer afternoon"
        ratio={16 / 9}
        className="rounded-md"
      />
      <Button size="sm" variant="soft" tone="neutral" onClick={() => setRound(round + 1)}>
        Reload
      </Button>
    </Stack>
  )
}
