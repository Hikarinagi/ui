'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'
import { Badge, Button, IconButton, Inline } from '@hina-ui/react'

export default function Demo() {
  const [count, setCount] = useState(2)

  return (
    <Inline align="center" className="gap-6">
      <Badge content={count} label={`${count} 条未读`}>
        <IconButton label="通知" variant="soft">
          <Bell />
        </IconButton>
      </Badge>
      <Inline align="center">
        <Button
          variant="outline"
          tone="neutral"
          size="sm"
          onClick={() => setCount(Math.max(0, count - 1))}
        >
          减少
        </Button>
        <Button variant="outline" tone="neutral" size="sm" onClick={() => setCount(count + 1)}>
          增加
        </Button>
      </Inline>
    </Inline>
  )
}
