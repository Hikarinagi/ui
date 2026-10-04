'use client'

import { useState } from 'react'
import { Rating, Stack } from '@hina-ui/react'

export default function Demo() {
  const [fixed, setFixed] = useState(3)

  return (
    <Stack align="start">
      <Rating value={3} disabled aria-label="已禁用" />
      <Rating value={fixed} onValueChange={setFixed} clearable={false} aria-label="不可清零" />
    </Stack>
  )
}
