'use client'

import { useState } from 'react'
import { Slider, Stack, Text } from '@hina-ui/react'

const marks = [0, 25, 50, 75, 100].map(value => ({ value, label: String(value) }))

export default function Demo() {
  const [value, setValue] = useState<number | undefined>(25)

  return (
    <Stack gap="lg" className="w-72 max-w-full">
      {(['ltr', 'rtl'] as const).map(dir => (
        <Stack key={dir} gap="xs">
          <Text size="sm" tone="muted">
            {dir.toUpperCase()}
          </Text>
          <Slider
            value={value}
            onValueChange={setValue}
            dir={dir}
            marks={marks}
            step={5}
            aria-label={'Value (' + dir.toUpperCase() + ')'}
          />
        </Stack>
      ))}
    </Stack>
  )
}
