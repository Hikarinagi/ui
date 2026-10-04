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

const names: Record<string, string> = { name: 'name', date: 'date modified', size: 'size' }

export default function Demo() {
  const [sort, setSort] = useState('name')

  return (
    <ContextMenu
      label="Sort"
      content={
        <>
          <ContextMenuLabel>Sort by</ContextMenuLabel>
          <ContextMenuRadioGroup value={sort} onValueChange={setSort}>
            <ContextMenuRadioItem value="name">Name</ContextMenuRadioItem>
            <ContextMenuRadioItem value="date">Date modified</ContextMenuRadioItem>
            <ContextMenuRadioItem value="size">Size</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </>
      }
    >
      <Center className="bg-inset h-32 w-96 rounded-lg border border-dashed select-none">
        <Text tone="muted" size="sm">
          {`Sorted by ${names[sort]}`}
        </Text>
      </Center>
    </ContextMenu>
  )
}
