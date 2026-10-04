'use client'

import { useState } from 'react'
import { Stepper, Stack, Switch } from '@hina-ui/react'

const items = [
  { title: 'Completed', completed: true },
  { title: 'Needs attention', description: 'This step has an error', error: true },
  { title: 'Disabled', disabled: true },
]

export default function Demo() {
  const [disabled, setDisabled] = useState(false)
  return (
    <Stack className="w-full" gap="lg">
      <Switch checked={disabled} onCheckedChange={setDisabled}>
        Disable all steps
      </Switch>
      <Stepper items={items} defaultValue={2} linear={false} disabled={disabled} />
    </Stack>
  )
}
