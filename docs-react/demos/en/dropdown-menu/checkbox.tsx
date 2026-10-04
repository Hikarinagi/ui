'use client'

import { useState } from 'react'
import { Button, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuLabel } from '@hina-ui/react'

export default function Demo() {
  const [showCover, setShowCover] = useState(true)
  const [showSummary, setShowSummary] = useState(false)
  const [showTags, setShowTags] = useState(true)

  return (
    <DropdownMenu
      label="Columns"
      content={
        <>
          <DropdownMenuLabel>Show in list</DropdownMenuLabel>
          <DropdownMenuCheckboxItem checked={showCover} onCheckedChange={setShowCover}>
            Cover
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={showSummary} onCheckedChange={setShowSummary}>
            Summary
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={showTags} onCheckedChange={setShowTags}>
            Tags
          </DropdownMenuCheckboxItem>
        </>
      }
    >
      <Button variant="outline" tone="neutral">
        Columns
      </Button>
    </DropdownMenu>
  )
}
