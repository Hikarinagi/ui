'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button, IconButton, Inline, Input, Stack, Tag } from '@hina-ui/react'

export default function Demo() {
  const [compact, setCompact] = useState(false)

  return (
    <Stack align="center">
      <Button variant="outline" tone="neutral" size="sm" onClick={() => setCompact(!compact)}>
        {compact ? '切换回默认密度' : '切换到紧凑密度'}
      </Button>

      <Inline data-density={compact ? 'compact' : undefined} align="center">
        <Input placeholder="搜索" />
        <Button>提交</Button>
        <Button variant="outline" tone="neutral">
          重置
        </Button>
        <IconButton label="搜索" variant="outline">
          <Search />
        </IconButton>
        <Tag>草稿</Tag>
      </Inline>
    </Stack>
  )
}
