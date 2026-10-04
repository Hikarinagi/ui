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
  newest: 'Newest',
  popular: 'Most saved',
  rating: 'Highest rated',
}

export default function Demo() {
  const [sort, setSort] = useState('newest')

  return (
    <DropdownMenu
      label="Sort by"
      content={
        <>
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
            <DropdownMenuRadioItem value="newest">Newest</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="popular">Most saved</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="rating">Highest rated</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </>
      }
    >
      <Button variant="outline" tone="neutral">
        Sort: {labels[sort]}
      </Button>
    </DropdownMenu>
  )
}
