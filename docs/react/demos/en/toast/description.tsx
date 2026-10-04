'use client'

import { Button, toast } from '@hina-ui/react'

export default function Demo() {
  return (
    <Button
      variant="outline"
      tone="neutral"
      onClick={() =>
        toast.success('Import finished', {
          description: '128 books imported, 3 skipped for an unsupported format.',
        })
      }
    >
      With a description
    </Button>
  )
}
