'use client'

import { useState } from 'react'
import { Button, MeterGroup, Stack, type MeterItem } from '@hina-ui/react'

const labels = ['Documents', 'Photos', 'Videos', 'Other']
const sets = [
  [42, 27, 13, 8],
  [12, 36, 31, 6],
  [25, 8, 48, 14],
]

export default function Demo() {
  const [index, setIndex] = useState(0)

  const items: MeterItem[] = labels.map((label, i) => ({ label, value: sets[index]![i]! }))

  return (
    <Stack gap="md" align="start" className="w-96">
      <MeterGroup label="Storage" items={items} className="w-full" />
      <Button
        size="sm"
        variant="soft"
        tone="neutral"
        onClick={() => setIndex((index + 1) % sets.length)}
      >
        Next data set
      </Button>
    </Stack>
  )
}
