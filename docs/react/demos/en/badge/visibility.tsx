'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'
import { Badge, Button, IconButton, Inline } from '@hina-ui/react'

export default function Demo() {
  const [count, setCount] = useState(2)

  return (
    <Inline align="center" className="gap-6">
      <Badge content={count} label={`${count} unread`}>
        <IconButton label="Notifications" variant="soft">
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
          Fewer
        </Button>
        <Button variant="outline" tone="neutral" size="sm" onClick={() => setCount(count + 1)}>
          More
        </Button>
      </Inline>
    </Inline>
  )
}
