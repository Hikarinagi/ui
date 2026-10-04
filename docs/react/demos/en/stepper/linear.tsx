'use client'

import { useState } from 'react'
import { Stepper, Stack, Switch } from '@hina-ui/react'

const items = [
  { title: 'Step A', description: 'The first description' },
  { title: 'Step B', description: 'A longer description that wraps naturally across lines' },
  { title: 'Step C', description: 'The final description' },
]

export default function Demo() {
  const [linear, setLinear] = useState(true)
  return (
    <Stack className="w-full" gap="lg">
      <Switch checked={linear} onCheckedChange={setLinear}>
        Linear navigation
      </Switch>
      <Stepper items={items} linear={linear} />
    </Stack>
  )
}
