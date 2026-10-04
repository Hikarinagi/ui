'use client'

import { useState } from 'react'
import { CopyButton, Inline, Text } from '@hina-ui/react'

export default function Demo() {
  const [count, setCount] = useState(0)
  return (
    <Inline align="center">
      <CopyButton text="hina@example.com" onCopied={() => setCount(count => count + 1)} />
      <Text tone="muted">已复制 {count} 次</Text>
    </Inline>
  )
}
