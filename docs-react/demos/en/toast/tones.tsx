'use client'

import { Button, Inline, toast } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-3">
      <Button variant="outline" tone="neutral" onClick={() => toast.success('Added to your shelf')}>
        success
      </Button>
      <Button
        variant="outline"
        tone="neutral"
        onClick={() => toast.danger('The connection dropped')}
      >
        danger
      </Button>
      <Button
        variant="outline"
        tone="neutral"
        onClick={() => toast.warning('You have unsaved changes')}
      >
        warning
      </Button>
      <Button
        variant="outline"
        tone="neutral"
        onClick={() => toast.info('A new version is available')}
      >
        info
      </Button>
      <Button variant="outline" tone="neutral" onClick={() => toast.loading('Syncing')}>
        loading
      </Button>
    </Inline>
  )
}
