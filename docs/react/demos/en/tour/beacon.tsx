'use client'

import { useState } from 'react'
import { Button, Inline, Tour, type TourStep } from '@hina-ui/react'

const steps: TourStep[] = [
  { target: '#tour-beacon-export', title: 'Export', description: 'You can now export to PDF.' },
  { target: '#tour-beacon-history', title: 'History', description: 'Every save keeps a version.' },
]

export default function Demo() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Inline gap="lg" align="center" wrap>
        <Button id="tour-beacon-export" variant="outline" tone="neutral">
          Export
        </Button>
        <Button id="tour-beacon-history" variant="outline" tone="neutral">
          History
        </Button>
        <Button variant="ghost" tone="neutral" onClick={() => setOpen(value => !value)}>
          {open ? 'Hide hints' : 'Show what is new'}
        </Button>
      </Inline>
      <Tour steps={steps} open={open} onOpenChange={setOpen} beacon />
    </>
  )
}
