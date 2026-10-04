'use client'

import { useState } from 'react'
import { Combobox, Stack, Text, type ComboboxValue } from '@hina-ui/react'

const studios = [
  { value: 'key', label: 'Key' },
  { value: 'type-moon', label: 'TYPE-MOON' },
  { value: 'august', label: 'August' },
  { value: 'saga-planets', label: 'SAGA PLANETS' },
  { value: 'yuzusoft', label: 'ゆずソフト' },
]

export default function Demo() {
  const [studio, setStudio] = useState<ComboboxValue>('key')

  return (
    <Stack className="w-64">
      <Combobox value={studio} onValueChange={setStudio} options={studios} aria-label="制作商" />
      <Text tone="muted">当前值：{studio ?? '无'}</Text>
    </Stack>
  )
}
