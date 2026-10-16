'use client'

import { useState } from 'react'
import { Button, Inline, Tour, type TourStep } from '@hina-ui/react'

const steps: TourStep[] = [
  {
    target: '#tour-plain-filter',
    title: 'Filter',
    description: 'The page stays usable during the tour.',
  },
  {
    target: '#tour-plain-sort',
    title: 'Sort',
    description: 'Click to switch between ascending and descending.',
  },
]

export default function Demo() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Inline gap="sm" align="center" wrap>
        <Button id="tour-plain-filter" variant="outline" tone="neutral">
          Filter
        </Button>
        <Button id="tour-plain-sort" variant="outline" tone="neutral">
          Sort
        </Button>
        <Button variant="ghost" tone="neutral" onClick={() => setOpen(true)}>
          Start tour
        </Button>
      </Inline>
      <Tour steps={steps} open={open} onOpenChange={setOpen} mask={false} />
    </>
  )
}
