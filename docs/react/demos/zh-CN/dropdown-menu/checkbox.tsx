'use client'

import { useState } from 'react'
import { Button, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuLabel } from '@hina-ui/react'

export default function Demo() {
  const [showCover, setShowCover] = useState(true)
  const [showSummary, setShowSummary] = useState(false)
  const [showTags, setShowTags] = useState(true)

  return (
    <DropdownMenu
      label="显示项"
      content={
        <>
          <DropdownMenuLabel>列表中显示</DropdownMenuLabel>
          <DropdownMenuCheckboxItem checked={showCover} onCheckedChange={setShowCover}>
            封面
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={showSummary} onCheckedChange={setShowSummary}>
            简介
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={showTags} onCheckedChange={setShowTags}>
            标签
          </DropdownMenuCheckboxItem>
        </>
      }
    >
      <Button variant="outline" tone="neutral">
        显示项
      </Button>
    </DropdownMenu>
  )
}
