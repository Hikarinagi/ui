'use client'

import { useState } from 'react'
import { Rating, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [score, setScore] = useState(0)

  return (
    <Stack gap="sm" align="start">
      <Rating value={score} onValueChange={setScore} aria-label="Rating" />
      <Text tone="muted" size="sm">
        Value: {score}
      </Text>
    </Stack>
  )
}
