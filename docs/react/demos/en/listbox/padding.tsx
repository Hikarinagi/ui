'use client'

import { useState } from 'react'
import { Card, Listbox, Stack, Switch, type ListboxValue } from '@hina-ui/react'

const options = [
  { value: 'a', label: 'Option A' },
  { label: 'Group', options: [{ value: 'b', label: 'Option B' }] },
]

export default function Demo() {
  const [padded, setPadded] = useState(false)
  const [selected, setSelected] = useState<ListboxValue>('a')

  return (
    <Stack className="w-64">
      <Switch checked={padded} onCheckedChange={setPadded} controlPlacement="end" block>
        List padding
      </Switch>
      <Card padded={false}>
        <Listbox
          value={selected}
          onValueChange={setSelected}
          options={options}
          variant="bare"
          padded={padded}
          aria-label="List padding"
        />
      </Card>
    </Stack>
  )
}
