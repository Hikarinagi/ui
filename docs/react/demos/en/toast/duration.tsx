'use client'

import { Button, Inline, toast } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-3">
      <Button
        variant="outline"
        tone="neutral"
        onClick={() => toast('Gone in a second', { duration: 1000 })}
      >
        One second
      </Button>
      <Button
        variant="outline"
        tone="neutral"
        onClick={() => toast.info('Stays until dismissed', { id: 'sticky', duration: 0 })}
      >
        No auto close
      </Button>
      <Button variant="soft" tone="neutral" onClick={() => toast.dismiss('sticky')}>
        Dismiss that one
      </Button>
    </Inline>
  )
}
