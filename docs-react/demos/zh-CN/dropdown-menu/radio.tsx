'use client'

import { useState } from 'react'
import {
  Button,
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@hina-ui/react'

const labels: Record<string, string> = {
  newest: '最新发布',
  popular: '最多收藏',
  rating: '评分最高',
}

export default function Demo() {
  const [sort, setSort] = useState('newest')

  return (
    <DropdownMenu
      label="排序方式"
      content={
        <>
          <DropdownMenuLabel>排序方式</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
            <DropdownMenuRadioItem value="newest">最新发布</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="popular">最多收藏</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="rating">评分最高</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </>
      }
    >
      <Button variant="outline" tone="neutral">
        排序：{labels[sort]}
      </Button>
    </DropdownMenu>
  )
}
