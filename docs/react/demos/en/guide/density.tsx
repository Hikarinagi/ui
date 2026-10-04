'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button, IconButton, Inline, Input, Stack, Tag } from '@hina-ui/react'

export default function Demo() {
  const [compact, setCompact] = useState(false)

  return (
    <Stack align="center">
      <Button variant="outline" tone="neutral" size="sm" onClick={() => setCompact(!compact)}>
        {compact ? 'Back to default density' : 'Switch to compact'}
      </Button>

      <Inline data-density={compact ? 'compact' : undefined} align="center">
        <Input placeholder="Search" />
        <Button>Submit</Button>
        <Button variant="outline" tone="neutral">
          Reset
        </Button>
        <IconButton label="Search" variant="outline">
          <Search />
        </IconButton>
        <Tag>Draft</Tag>
      </Inline>
    </Stack>
  )
}
