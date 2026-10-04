'use client'

import { useState } from 'react'
import { MultiSelect, Stack, Text } from '@hina-ui/react'

const options = [
  { value: 'windows', label: 'Windows' },
  { value: 'switch', label: 'Switch' },
  { value: 'ps5', label: 'PS5' },
  { value: 'android', label: 'Android' },
  { value: 'ios', label: 'iOS' },
]

export default function Demo() {
  const [platforms, setPlatforms] = useState<Array<string | number>>([])

  return (
    <Stack className="w-72">
      <MultiSelect
        value={platforms}
        onValueChange={setPlatforms}
        options={options}
        placeholder="Choose platforms"
        aria-label="Platforms"
      />
      <Text tone="muted">Current value: {platforms.length ? platforms.join(', ') : 'none'}</Text>
    </Stack>
  )
}
