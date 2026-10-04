'use client'

import { Button, Inline, toast } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-3">
      <Button
        variant="outline"
        tone="neutral"
        onClick={() =>
          toast('Moved to the bin', {
            action: { label: 'Undo', onClick: () => toast.success('Restored') },
          })
        }
      >
        With an action
      </Button>
      <Button
        variant="outline"
        tone="neutral"
        onClick={() =>
          toast.warning('Empty the bin?', {
            duration: 0,
            action: { label: 'Empty', onClick: () => toast.success('The bin is empty') },
            cancel: { label: 'Cancel' },
          })
        }
      >
        Two buttons
      </Button>
    </Inline>
  )
}
