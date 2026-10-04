'use client'

import { useState } from 'react'
import {
  Center,
  ContextMenu,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  Text,
} from '@hina-ui/react'

const names: Record<string, string> = { name: '名称', date: '修改日期', size: '大小' }

export default function Demo() {
  const [sort, setSort] = useState('name')

  return (
    <ContextMenu
      label="排序"
      content={
        <>
          <ContextMenuLabel>排序方式</ContextMenuLabel>
          <ContextMenuRadioGroup value={sort} onValueChange={setSort}>
            <ContextMenuRadioItem value="name">名称</ContextMenuRadioItem>
            <ContextMenuRadioItem value="date">修改日期</ContextMenuRadioItem>
            <ContextMenuRadioItem value="size">大小</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </>
      }
    >
      <Center className="bg-inset h-32 w-96 rounded-lg border border-dashed select-none">
        <Text tone="muted" size="sm">
          {`按${names[sort]}排序`}
        </Text>
      </Center>
    </ContextMenu>
  )
}
