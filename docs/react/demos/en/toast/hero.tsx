'use client'

import { Button, Inline, toast } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-3">
      <Button variant="outline" tone="neutral" onClick={() => toast('Draft saved')}>
        Default
      </Button>
      <Button variant="outline" tone="neutral" onClick={() => toast.success('Article published')}>
        Success
      </Button>
      <Button
        variant="outline"
        tone="neutral"
        onClick={() =>
          toast.danger('Upload failed', { description: 'The file is larger than 20 MB.' })
        }
      >
        Failure
      </Button>
    </Inline>
  )
}
