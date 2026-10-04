'use client'

import { useState } from 'react'
import { Card, Listbox, Stack, Switch, type ListboxValue } from '@hina-ui/react'

const options = [
  { value: 'a', label: '选项 A' },
  { label: '分组', options: [{ value: 'b', label: '选项 B' }] },
]

export default function Demo() {
  const [padded, setPadded] = useState(false)
  const [selected, setSelected] = useState<ListboxValue>('a')

  return (
    <Stack className="w-64">
      <Switch checked={padded} onCheckedChange={setPadded} controlPlacement="end" block>
        列表外围留白
      </Switch>
      <Card padded={false}>
        <Listbox
          value={selected}
          onValueChange={setSelected}
          options={options}
          variant="bare"
          padded={padded}
          aria-label="列表外围留白"
        />
      </Card>
    </Stack>
  )
}
