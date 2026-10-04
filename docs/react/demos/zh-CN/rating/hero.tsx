'use client'

import { useState } from 'react'
import { Rating, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [score, setScore] = useState(4)

  return (
    <Stack gap="sm" align="start">
      <Rating value={score} onValueChange={setScore} size="lg" aria-label="评分" />
      <Text tone="muted" size="sm">
        值：{score}
      </Text>
    </Stack>
  )
}
