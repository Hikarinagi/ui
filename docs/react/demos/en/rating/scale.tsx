'use client'

import { useState } from 'react'
import { Inline, Rating, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [score, setScore] = useState(7)

  return (
    <Stack gap="md" align="start">
      <Inline gap="sm">
        <Rating
          value={score}
          onValueChange={setScore}
          max={10}
          stars={5}
          step={0.5}
          aria-label="Rating"
        />
        <Text tone="muted" size="sm">
          {score} / 10
        </Text>
      </Inline>
      <Inline gap="sm">
        <Rating value={8.6} max={10} stars={5} readonly />
        <Text tone="muted" size="sm">
          8.6 / 10 · Read only
        </Text>
      </Inline>
    </Stack>
  )
}
