'use client'

import { useState } from 'react'
import { RadioGroup, Stack, Text } from '@hina-ui/react'

const options = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'Follow system' },
]

export default function Demo() {
  const [theme, setTheme] = useState<string | number | null | undefined>('system')

  return (
    <Stack gap="sm">
      <RadioGroup value={theme} onValueChange={setTheme} options={options} aria-label="Theme" />
      <Text size="sm" tone="muted">
        Value: {theme}
      </Text>
    </Stack>
  )
}
